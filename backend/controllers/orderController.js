const Order = require('../models/Order');
const Setting = require('../models/Setting');
const Coupon = require('../models/Coupon');
const fs = require('fs');
const path = require('path');
const { cloudinary, getCloudinaryConfig } = require('../config/cloudinary');

// Helper to trigger FormSubmit.co email notification to Dipu
const sendFormSubmitNotification = async (orderData, targetEmail) => {
  try {
    const recipient = targetEmail || process.env.FORMSUBMIT_EMAIL || 'dipusah7481@gmail.com';
    const formSubmitUrl = `https://formsubmit.co/ajax/${recipient}`;
    
    const res = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://dipueditx.in',
        'Referer': 'https://dipueditx.in/order',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        _subject: `🔥 New Order #${orderData.orderId} - ${orderData.clientName} (₹${orderData.amount})`,
        _captcha: 'false',
        _template: 'table',
        OrderID: orderData.orderId,
        InvoiceNo: orderData.invoiceNumber,
        ClientName: orderData.clientName,
        WhatsApp: orderData.clientPhone,
        Email: orderData.clientEmail,
        Service: orderData.serviceTitle,
        AspectRatio: orderData.aspectRatio,
        DeliverySpeed: orderData.deliverySpeed || 'Standard 24h',
        Addons: orderData.addons && orderData.addons.length > 0 ? orderData.addons.join(', ') : 'None',
        UTR_Number: orderData.utrNumber,
        Discount: orderData.discountAmount ? `₹${orderData.discountAmount} (Code: ${orderData.couponCode})` : 'None',
        FinalAmount: `₹${orderData.amount}`,
        ScriptOrNotes: orderData.scriptNotes || 'N/A',
        RawFilesDriveLink: orderData.rawFilesLink || 'N/A',
        PaymentScreenshot: orderData.paymentScreenshot || 'None',
        Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log(`[FormSubmit Response]:`, result);
    if (result.success === 'true' || result.success === true) {
      console.log(`[FormSubmit Notification Sent]: Order #${orderData.orderId} to ${recipient}`);
    } else {
      console.warn(`[FormSubmit Notice]: ${result.message || 'Check email for activation link'}`);
    }
  } catch (err) {
    console.error(`[FormSubmit Notification Error]: ${err.message}`);
  }
};

// Strict UPI UTR Format Validator (12 numeric digits, anti-dummy/anti-sequence)
const validateUtrFormat = (val) => {
  if (!val || typeof val !== 'string') {
    return { valid: false, message: '12-digit UPI UTR number is required.' };
  }
  const clean = val.trim();
  if (!/^\d+$/.test(clean)) {
    return { valid: false, message: 'UTR must contain only numbers (0-9). Letters or symbols are not allowed.' };
  }
  if (clean.length !== 12) {
    return { valid: false, message: `UTR must be exactly 12 numeric digits (received ${clean.length} digits).` };
  }

  // Common dummy / test number blacklist
  const blacklist = [
    '123456789123',
    '123456789012',
    '987654321098',
    '012345678901',
    '123456123456',
    '987654987654',
    '112233445566',
    '121212121212',
    '123123123123',
    '123412341234',
  ];
  if (blacklist.includes(clean)) {
    return { valid: false, message: 'Demo / fake UTR (jaise 123456789123) allowed nahi hai. Kripya real payment UTR enter karein.' };
  }

  // Reject identical repeating digits (e.g. 000000000000, 111111111111, 999999999999)
  if (/^(\d)\1{11}$/.test(clean)) {
    return { valid: false, message: 'Fake / dummy UTR (identical repeating digits) is not allowed.' };
  }

  // Check consecutive sequential runs (e.g. 123456..., 987654...)
  let ascRun = 1;
  let descRun = 1;
  for (let i = 1; i < clean.length; i++) {
    const prev = parseInt(clean[i - 1], 10);
    const curr = parseInt(clean[i], 10);
    if (curr === (prev + 1) % 10) {
      ascRun++;
      if (ascRun >= 5) return { valid: false, message: 'Counting / sequence dummy UTR is not allowed.' };
    } else {
      ascRun = 1;
    }
    if (curr === (prev - 1 + 10) % 10) {
      descRun++;
      if (descRun >= 5) return { valid: false, message: 'Sequence dummy UTR is not allowed.' };
    } else {
      descRun = 1;
    }
  }

  // Reject repeating patterns (e.g. 121212121212, 123123123123, 123412341234)
  if (
    clean.slice(0, 2).repeat(6) === clean ||
    clean.slice(0, 3).repeat(4) === clean ||
    clean.slice(0, 4).repeat(3) === clean ||
    clean.slice(0, 6).repeat(2) === clean
  ) {
    return { valid: false, message: 'Repeating pattern dummy UTR is not allowed.' };
  }

  // Entropy check: Real bank UTR has at least 4 distinct digits
  const uniqueCount = new Set(clean.split('')).size;
  if (uniqueCount < 4) {
    return { valid: false, message: 'Invalid / dummy UTR number. Please enter a genuine 12-digit bank UTR.' };
  }

  return { valid: true, message: '' };
};

// @desc    Create new order / lead with payment UTR
// @route   POST /api/orders
// @access  Public / Client
const createOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceTitle,
      serviceCategory,
      aspectRatio,
      deliverySpeed,
      addons,
      scriptNotes,
      rawFilesLink,
      baseAmount,
      discountAmount,
      couponCode,
      amount,
      utrNumber,
    } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !serviceTitle || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Name, Email, Phone, Service, and UTR number',
      });
    }

    // Validate UTR format and authenticity
    const cleanUtr = String(utrNumber).trim();
    const utrCheck = validateUtrFormat(cleanUtr);
    if (!utrCheck.valid) {
      return res.status(400).json({
        success: false,
        message: utrCheck.message,
      });
    }

    // Duplicate UTR check (Cannot reuse an existing payment UTR)
    const existingOrderWithUtr = await Order.findOne({ utrNumber: cleanUtr });
    if (existingOrderWithUtr) {
      return res.status(400).json({
        success: false,
        message: 'Yeh UTR number pehle se ek doosre order me submit kiya ja chuka hai. Kripya apna new payment UTR enter karein.',
      });
    }

    // Generate readable Order ID & Invoice: DPX-XXXXX, INV-DPX-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DPX-${randomSuffix}`;
    const invoiceNumber = `INV-DPX-${randomSuffix}`;

    let paymentScreenshot = '';
    if (req.file) {
      try {
        const config = await getCloudinaryConfig();
        if (config.configured) {
          const uploadRes = await config.cloudinary.uploader.upload(req.file.path, {
            folder: 'dipueditx_screenshots',
            resource_type: 'image',
            overwrite: true,
          });
          paymentScreenshot = uploadRes.secure_url;
          if (fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
          }
          console.log(`[Order Screenshot]: Saved to Cloudinary: ${paymentScreenshot}`);
        } else {
          paymentScreenshot = `/uploads/${req.file.filename}`;
        }
      } catch (cErr) {
        console.error('[Cloudinary Screenshot Upload Error]:', cErr.message);
        paymentScreenshot = `/uploads/${req.file.filename}`;
      }
    } else if (req.body.paymentScreenshotUrl) {
      paymentScreenshot = req.body.paymentScreenshotUrl;
    }

    // If coupon was used, increment its count
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.trim().toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    const parsedAddons = Array.isArray(addons)
      ? addons
      : typeof addons === 'string'
      ? addons.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    const order = await Order.create({
      orderId,
      invoiceNumber,
      user: req.user ? req.user._id : undefined,
      clientName,
      clientEmail: clientEmail.toLowerCase(),
      clientPhone,
      serviceTitle,
      serviceCategory: serviceCategory || 'AI & Video Editing',
      aspectRatio: aspectRatio || '9:16 (Shorts/Reels)',
      deliverySpeed: deliverySpeed || 'Standard 24h',
      addons: parsedAddons,
      scriptNotes: scriptNotes || '',
      rawFilesLink: rawFilesLink || '',
      baseAmount: baseAmount ? Number(baseAmount) : Number(amount) || 100,
      discountAmount: discountAmount ? Number(discountAmount) : 0,
      couponCode: couponCode || '',
      amount: amount ? Number(amount) : 100,
      utrNumber: utrNumber.trim(),
      paymentScreenshot,
      status: 'Pending Verification',
    });

    // Fetch admin email from settings or default
    const setting = await Setting.findOne();
    const targetEmail = setting?.formSubmitEmail || 'dipusah7481@gmail.com';

    // Dispatch background email notification
    sendFormSubmitNotification(order, targetEmail);

    res.status(201).json({
      success: true,
      message: 'Order created successfully and lead dispatched to admin!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only, with filters)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { status, search, limit = 100, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { utrNumber: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in client's orders
// @route   GET /api/orders/my-orders
// @access  Private (Client)
const getMyOrders = async (req, res) => {
  try {
    const query = {
      $or: [{ user: req.user._id }, { clientEmail: req.user.email.toLowerCase() }],
    };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Public order tracking by Order ID or UTR
// @route   GET /api/orders/track/:identifier
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const order = await Order.findOne({
      $or: [
        { orderId: identifier.toUpperCase() },
        { utrNumber: identifier },
        { invoiceNumber: identifier.toUpperCase() },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found with provided ID or UTR' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status & delivery details (Admin)
// @route   PATCH /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryLink, adminNotes, revisionStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) order.status = status;
    if (deliveryLink !== undefined) order.deliveryLink = deliveryLink;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (revisionStatus !== undefined) order.revisionStatus = revisionStatus;

    await order.save();
    res.json({ success: true, message: 'Order updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deliver finished order (Video via Cloudinary OR External Link)
// @route   POST /api/orders/:id/deliver
// @access  Private/Admin
const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryType = 'link', deliveryLink, adminNotes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (deliveryType === 'video_upload') {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please select and upload a video file for Cloudinary delivery.' });
      }

      const cloudConfig = await getCloudinaryConfig();
      if (!cloudConfig.configured) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: cloudConfig.error || 'Cloudinary credentials are not configured in Admin Settings. Please configure them in Settings or deliver using External Link.',
        });
      }

      try {
        console.log(`[Cloudinary Delivery] Uploading video for Order #${order.orderId} (${req.file.size} bytes)...`);
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'video',
          folder: 'dipueditx_deliveries',
          public_id: `delivery_${order.orderId}_${Date.now()}`,
          overwrite: true,
        });

        // Clean up temporary local upload file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        order.deliveryLink = uploadResult.secure_url;
        order.deliveryType = 'video_upload';
      } catch (uploadErr) {
        if (fs.existsSync(req.file.path)) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        console.error('[Cloudinary Upload Error]:', uploadErr);

        let userFriendlyMsg = uploadErr.message || 'Unknown upload error';
        if (userFriendlyMsg.includes('Invalid Signature')) {
          userFriendlyMsg = 'Cloudinary "Invalid Signature" error: Aapka Cloudinary API Secret galat hai ya match nahi ho raha. Kripya /admin/settings me jakar Cloudinary Console se sahi API Secret copy karke dalein aur "Test Connection" dabakar verify karein.';
        } else if (userFriendlyMsg.includes('Invalid API Key') || userFriendlyMsg.includes('Unknown API key')) {
          userFriendlyMsg = 'Cloudinary "Invalid API Key" error: Aapki API Key sahi nahi hai. Kripya /admin/settings me check karein.';
        }

        return res.status(500).json({
          success: false,
          message: `Cloudinary upload failed: ${userFriendlyMsg}`,
        });
      }
    } else {
      // External Link (Google Drive, Dropbox, Mega, etc.)
      if (!deliveryLink || !deliveryLink.trim()) {
        return res.status(400).json({ success: false, message: 'Delivery Link (e.g. Google Drive, Mega) is required.' });
      }
      order.deliveryLink = deliveryLink.trim();
      order.deliveryType = 'link';
    }

    order.status = 'Completed';
    order.deliveredAt = new Date();
    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    console.log(`[Order Delivered]: Order #${order.orderId} delivered successfully via ${order.deliveryType}. URL: ${order.deliveryLink}`);

    res.json({
      success: true,
      message: `Order #${order.orderId} delivered successfully to client!`,
      data: order,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit revision request by client
// @route   POST /api/orders/:id/revision
// @access  Private (Client)
const requestRevision = async (req, res) => {
  try {
    const { revisionNotes } = req.body;
    if (!revisionNotes) {
      return res.status(400).json({ success: false, message: 'Please provide revision instructions' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.revisionNotes = revisionNotes;
    order.revisionStatus = 'Requested';
    order.status = 'Revision Requested';
    await order.save();

    res.json({
      success: true,
      message: 'Revision request submitted! Dipu Sah has been notified.',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/orders/export-csv
// @access  Private/Admin
const exportOrdersCsv = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const headers = [
      'Order ID',
      'Invoice No',
      'Client Name',
      'Client Phone',
      'Client Email',
      'Service',
      'Aspect Ratio',
      'Delivery Speed',
      'Amount',
      'UTR Number',
      'Status',
      'Delivery Link',
      'Date',
    ];

    const rows = orders.map((o) => [
      `"${o.orderId}"`,
      `"${o.invoiceNumber || ''}"`,
      `"${o.clientName.replace(/"/g, '""')}"`,
      `"${o.clientPhone}"`,
      `"${o.clientEmail}"`,
      `"${o.serviceTitle.replace(/"/g, '""')}"`,
      `"${o.aspectRatio}"`,
      `"${o.deliverySpeed || 'Standard'}"`,
      o.amount,
      `"${o.utrNumber}"`,
      `"${o.status}"`,
      `"${o.deliveryLink || ''}"`,
      `"${new Date(o.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=dipueditx-leads-${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics (Admin)
// @route   GET /api/orders/metrics
// @access  Private/Admin
const getMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending Verification' });
    const inProductionOrders = await Order.countDocuments({ status: 'In Production' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const revisionOrders = await Order.countDocuments({ status: 'Revision Requested' });

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['Payment Verified', 'In Production', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        inProductionOrders,
        completedOrders,
        revisionOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
  deliverOrder,
  requestRevision,
  exportOrdersCsv,
  deleteOrder,
  getMetrics,
};
