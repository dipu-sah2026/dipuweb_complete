const Order = require('../models/Order');
const Setting = require('../models/Setting');
const Coupon = require('../models/Coupon');

// Helper to trigger FormSubmit.co email notification to Dipu
const sendFormSubmitNotification = async (orderData, targetEmail) => {
  try {
    const recipient = targetEmail || process.env.FORMSUBMIT_EMAIL || 'dipusah7481@gmail.com';
    const formSubmitUrl = `https://formsubmit.co/ajax/${recipient}`;
    
    await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `🔥 New Order #${orderData.orderId} - ${orderData.clientName} (₹${orderData.amount})`,
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
    console.log(`[FormSubmit Notification Sent]: Order #${orderData.orderId} to ${recipient}`);
  } catch (err) {
    console.error(`[FormSubmit Notification Error]: ${err.message}`);
  }
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

    // Generate readable Order ID & Invoice: DPX-XXXXX, INV-DPX-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DPX-${randomSuffix}`;
    const invoiceNumber = `INV-DPX-${randomSuffix}`;

    let paymentScreenshot = '';
    if (req.file) {
      paymentScreenshot = `/uploads/${req.file.filename}`;
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
  requestRevision,
  exportOrdersCsv,
  deleteOrder,
  getMetrics,
};
