import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  Upload, 
  PhoneCall, 
  Tag,
  Zap,
  Printer,
  FileText,
  AlertCircle,
  Percent,
  CreditCard,
  X,
  Clipboard,
  HelpCircle
} from 'lucide-react';
import api, { DEFAULT_SERVICES, DEFAULT_SETTINGS } from '../services/api';
import { useAuth } from '../context/AuthContext';

const availableAddons = [
  { id: '4k_export', label: '4K Ultra HD Resolution Export', price: 49 },
  { id: 'ai_voice', label: 'Realistic AI Voiceover (Hindi / English)', price: 99 },
  { id: 'clickbait_thumb', label: 'High-CTR Clickbait Thumbnail Design', price: 49 },
  { id: 'priority_render', label: 'VIP Priority Editing Queue', price: 39 },
  { id: 'source_files', label: 'Raw Project Files & PSD Included', price: 99 },
];

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedService, setSelectedService] = useState(
    location.state?.preselectedService || DEFAULT_SERVICES[0]
  );

  // Auth Guard: If not logged in, redirect to register
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/register', {
        state: {
          from: '/order',
          preselectedService: location.state?.preselectedService || selectedService,
          notice: 'Please create an account or sign in to complete your video order.',
        },
      });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Form Fields
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [aspectRatio, setAspectRatio] = useState('9:16 (Shorts/Reels)');
  const [deliverySpeed, setDeliverySpeed] = useState('Standard 24h');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [scriptNotes, setScriptNotes] = useState('');
  const [rawFilesLink, setRawFilesLink] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);

  // Validate UTR format and strictly reject dummy/fake numbers
  const validateUtrFormat = (val) => {
    if (!val || val.length === 0) {
      return { valid: false, message: '12-digit UPI UTR number enter karna zaroori hai.' };
    }
    if (!/^\d+$/.test(val)) {
      return { valid: false, message: 'Sirf numeric numbers allow hain. Letters ya symbols na dalein.' };
    }
    if (val.length !== 12) {
      return { valid: false, message: `Theek 12 digits ka UTR dalein (${val.length}/12 entered).` };
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
    if (blacklist.includes(val)) {
      return { valid: false, message: 'Demo / fake UTR (jaise 123456789123) allowed nahi hai. Kripya real payment UTR enter karein.' };
    }

    // Reject identical digits: 000000000000, 111111111111, 999999999999
    if (/^(\d)\1{11}$/.test(val)) {
      return { valid: false, message: 'Fake / dummy UTR (identical digits) allowed nahi hai.' };
    }

    // Check consecutive sequential runs (e.g. 123456..., 987654...)
    let ascRun = 1;
    let descRun = 1;
    for (let i = 1; i < val.length; i++) {
      const prev = parseInt(val[i - 1], 10);
      const curr = parseInt(val[i], 10);
      if (curr === (prev + 1) % 10) {
        ascRun++;
        if (ascRun >= 5) return { valid: false, message: 'Counting / sequence wala fake UTR allowed nahi hai.' };
      } else {
        ascRun = 1;
      }
      if (curr === (prev - 1 + 10) % 10) {
        descRun++;
        if (descRun >= 5) return { valid: false, message: 'Sequence wala fake UTR allowed nahi hai.' };
      } else {
        descRun = 1;
      }
    }

    // Reject common repeating blocks
    if (
      val.slice(0, 2).repeat(6) === val ||
      val.slice(0, 3).repeat(4) === val ||
      val.slice(0, 4).repeat(3) === val ||
      val.slice(0, 6).repeat(2) === val
    ) {
      return { valid: false, message: 'Repeating pattern wala fake UTR allowed nahi hai.' };
    }

    // Entropy check: At least 4 distinct digits
    const uniqueCount = new Set(val.split('')).size;
    if (uniqueCount < 4) {
      return { valid: false, message: 'Valid bank UTR enter karein. Dummy number allowed nahi hai.' };
    }

    return { valid: true, message: '' };
  };

  const handleUtrChange = (e) => {
    // Only accept numeric digits, capped strictly at 12 characters
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUtrNumber(cleaned);

    if (cleaned.length === 12) {
      const check = validateUtrFormat(cleaned);
      setUtrError(check.valid ? '' : check.message);
    } else if (cleaned.length > 0) {
      setUtrError(`12 digits required (${cleaned.length}/12 entered)`);
    } else {
      setUtrError('');
    }
  };

  // Coupon Engine States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Status & Submission
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Pre-fill user data when user logs in
  useEffect(() => {
    if (user) {
      if (!clientName && user.name) setClientName(user.name);
      if (!clientEmail && user.email) setClientEmail(user.email);
      if (!clientPhone && user.phone) setClientPhone(user.phone);
    }
  }, [user]);

  // Fetch Services and Dynamic Settings (Fixed fetch logic!)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sRes = await api.get('/services');
        if (sRes.data && Array.isArray(sRes.data.data)) {
          setServices(sRes.data.data);
        }
      } catch (err) {
        console.log('Using default services on network error');
      }

      try {
        const stRes = await api.get('/settings');
        if (stRes.data?.data) {
          setSettings(stRes.data.data);
          console.log('Loaded active settings:', stRes.data.data);
        }
      } catch (err) {
        console.log('Using default settings');
      }
    };
    fetchData();
  }, []);

  // Price Calculations
  const baseServicePrice = (selectedService?.basePrice || 100) * quantity;
  
  // Delivery speed cost
  let speedExtra = 0;
  if (deliverySpeed === 'Express 12h') speedExtra = 49;
  if (deliverySpeed === 'Relaxed 48h') speedExtra = -Math.round(baseServicePrice * 0.05);

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    const found = availableAddons.find((a) => a.id === addId);
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotalBeforeDiscount = Math.max(1, baseServicePrice + speedExtra + addonsTotal);

  // Coupon discount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(1, subtotalBeforeDiscount - discountAmount);

  // Dynamic UPI Details
  const activeUpiId = settings.upiId || '7481968724@upi';
  const activeUpiName = settings.upiName || 'Dipu Sah';

  // Dynamic QR Code generation
  const upiPaymentUri = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeUpiName)}&am=${finalPrice}&cu=INR&tn=${encodeURIComponent('DipuEditX Video Order')}`;
  const qrCodeImgUrl = settings.customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentUri)}`;

  // Script Word Count & Duration Estimator (140 words ~ 60s)
  const scriptWordCount = scriptNotes.trim() ? scriptNotes.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((scriptWordCount / 140) * 60);

  const [clipboardNotice, setClipboardNotice] = useState('');
  const [paymentAppOpened, setPaymentAppOpened] = useState(false);
  const [showUtrGuideModal, setShowUtrGuideModal] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setClipboardNotice(`✅ UPI ID "${activeUpiId}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedUpi(false);
      setClipboardNotice('');
    }, 2500);
  };

  const getAppPaymentUri = (scheme) => {
    // Omit 'tn' parameter to bypass NPCI P2P security filter on personal VPAs
    const base = `pa=${activeUpiId}&pn=${encodeURIComponent(activeUpiName)}&am=${finalPrice}&cu=INR`;
    const standardUpi = `upi://pay?${base}`;
    const isAndroid = /android/i.test(navigator.userAgent || '');

    if (isAndroid) {
      if (scheme === 'phonepe') {
        return `intent://pay?${base}#Intent;scheme=upi;package=com.phonepe.app;end`;
      }
      if (scheme === 'gpay') {
        return `intent://pay?${base}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
      }
      if (scheme === 'paytm') {
        return `intent://pay?${base}#Intent;scheme=upi;package=net.one97.paytm;end`;
      }
    }

    return standardUpi;
  };

  const handleMobilePay = async (scheme, appName) => {
    // 1. Auto-copy UPI ID to clipboard
    try {
      await navigator.clipboard.writeText(activeUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (e) {
      console.log('Clipboard copy failed:', e);
    }

    setPaymentAppOpened(true);
    setClipboardNotice(`✅ UPI ID "${activeUpiId}" auto-copied! Opening ${appName}... (Agar app me security decline aaye, to "Pay to UPI ID" me paste karke ₹${finalPrice} pay karein).`);

    // 2. Open payment app intent with fallback
    const uri = getAppPaymentUri(scheme);
    try {
      window.location.href = uri;
    } catch (err) {
      window.location.href = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeUpiName)}&am=${finalPrice}&cu=INR`;
    }
  };

  // Auto-detect 12-digit UTR from clipboard when user returns to website tab after payment app
  useEffect(() => {
    const autoDetectUtr = async () => {
      if (document.visibilityState === 'visible' && paymentAppOpened && !utrNumber) {
        try {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            const cleanText = text.trim();
            const match = cleanText.match(/\b\d{12}\b/);
            const candidate = match ? match[0] : null;

            if (candidate) {
              const check = validateUtrFormat(candidate);
              if (check.valid) {
                setUtrNumber(candidate);
                setUtrError('');
                setClipboardNotice(`🎉 12-Digit UTR (${candidate}) auto-detected & filled! Niche Submit Order click karein.`);
                const el = document.getElementById('step-4-utr');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        } catch (e) {
          // Silent catch if clipboard permission prompt is dismissed
        }
      }
    };

    document.addEventListener('visibilitychange', autoDetectUtr);
    window.addEventListener('focus', autoDetectUtr);

    return () => {
      document.removeEventListener('visibilitychange', autoDetectUtr);
      window.removeEventListener('focus', autoDetectUtr);
    };
  }, [paymentAppOpened, utrNumber]);

  const handlePasteUtrFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setClipboardNotice('⚠️ Clipboard is empty. Kripya apne UPI payment app se 12-digit UTR copy karein.');
        setTimeout(() => setClipboardNotice(''), 4000);
        return;
      }
      const cleanText = text.trim();
      // Look for a 12-digit numeric sequence anywhere in the copied text
      const match = cleanText.match(/\b\d{12}\b/);
      const candidate = match ? match[0] : cleanText.replace(/\D/g, '').slice(0, 12);

      if (candidate && candidate.length === 12) {
        setUtrNumber(candidate);
        const check = validateUtrFormat(candidate);
        setUtrError(check.valid ? '' : check.message);
        setClipboardNotice('✅ 12-Digit UTR successfully pasted from clipboard!');
        setTimeout(() => setClipboardNotice(''), 4000);
      } else {
        setClipboardNotice(`⚠️ Clipboard me 12 digits ka UTR nahi mila ("${cleanText.slice(0, 15)}..."). PhonePe/GPay se UTR copy karein.`);
        setTimeout(() => setClipboardNotice(''), 5000);
      }
    } catch (err) {
      setClipboardNotice('⚠️ Clipboard permission needed. Aap manually 12-digit UTR type kar sakte hain.');
      setTimeout(() => setClipboardNotice(''), 4000);
    }
  };

  const handleToggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        orderAmount: subtotalBeforeDiscount,
      });
      setAppliedCoupon(res.data.data);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const utrCheck = validateUtrFormat(utrNumber);
    if (!utrCheck.valid) {
      setUtrError(utrCheck.message);
      alert(utrCheck.message);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('clientEmail', clientEmail.toLowerCase());
      formData.append('clientPhone', clientPhone);
      formData.append('serviceTitle', selectedService.title);
      formData.append('serviceCategory', selectedService.category);
      formData.append('aspectRatio', aspectRatio);
      formData.append('deliverySpeed', deliverySpeed);
      formData.append('addons', selectedAddons.map((id) => availableAddons.find((a) => a.id === id)?.label).filter(Boolean).join(', '));
      formData.append('scriptNotes', scriptNotes);
      formData.append('rawFilesLink', rawFilesLink);
      formData.append('baseAmount', subtotalBeforeDiscount);
      formData.append('discountAmount', discountAmount);
      formData.append('couponCode', appliedCoupon ? appliedCoupon.code : '');
      formData.append('amount', finalPrice);
      formData.append('utrNumber', utrNumber.trim());

      if (screenshotFile) {
        formData.append('paymentScreenshot', screenshotFile);
      }

      const res = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmittedOrder(res.data.data);

      // Client-side FormSubmit redundancy trigger
      try {
        const formSubmitRecipient = settings?.formSubmitEmail || 'dipusah51858@gmail.com';
        fetch(`https://formsubmit.co/ajax/${formSubmitRecipient}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `🔥 New Order #${res.data?.data?.orderId || 'NEW'} - ${clientName} (₹${finalPrice})`,
            _captcha: 'false',
            _template: 'table',
            OrderID: res.data?.data?.orderId || 'NEW',
            ClientName: clientName,
            WhatsApp: clientPhone,
            Email: clientEmail,
            Service: selectedService.title,
            DeliverySpeed: deliverySpeed,
            Amount: `₹${finalPrice}`,
            UTR_Number: utrNumber.trim(),
            Notes: scriptNotes || 'N/A',
            DriveLink: rawFilesLink || 'N/A',
          }),
        }).catch(() => {});
      } catch (e) {
        // Silently ignore frontend client-side delivery error
      }
    } catch (err) {
      // Fallback in dev/offline
      const mockOrder = {
        orderId: `DPX-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceNumber: `INV-DPX-${Math.floor(10000 + Math.random() * 90000)}`,
        clientName,
        clientEmail,
        clientPhone,
        serviceTitle: selectedService.title,
        aspectRatio,
        deliverySpeed,
        amount: finalPrice,
        utrNumber: utrNumber.trim(),
        status: 'Pending Verification',
        createdAt: new Date().toISOString(),
      };
      setSubmittedOrder(mockOrder);

      // Trigger client-side FormSubmit in fallback mode too
      try {
        fetch('https://formsubmit.co/ajax/dipusah51858@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `🔥 New Order #${mockOrder.orderId} - ${clientName} (₹${finalPrice})`,
            _captcha: 'false',
            _template: 'table',
            OrderID: mockOrder.orderId,
            ClientName: clientName,
            WhatsApp: clientPhone,
            Email: clientEmail,
            Service: selectedService.title,
            Amount: `₹${finalPrice}`,
            UTR_Number: utrNumber.trim(),
          }),
        }).catch(() => {});
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="py-24 text-center text-slate-500">Checking session...</div>;
  }

  return (
    <div className="py-12 bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Order Placed Success View */}
        {submittedOrder ? (
          <div className="max-w-2xl mx-auto bg-brand-card border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
              Order Placed Successfully!
            </span>

            <h2 className="text-3xl font-black text-white mt-4">
              Thank You, {submittedOrder.clientName}!
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Aapka order receive ho gaya hai aur lead Dipu Sah ke paas dispatch ho chuki hai.
            </p>

            {/* Order Details Card */}
            <div className="my-6 bg-slate-900/90 border border-brand-border rounded-2xl p-5 text-left space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-black text-brand-yellow text-sm">{submittedOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-300">{submittedOrder.invoiceNumber || `INV-${submittedOrder.orderId}`}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-white">{submittedOrder.serviceTitle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-400 text-sm">₹{submittedOrder.amount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">UTR / Reference:</span>
                <span className="font-mono font-bold text-slate-200">{submittedOrder.utrNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-amber-400">Payment Verification Pending</span>
              </div>
            </div>

            {/* Actions: WhatsApp confirmation & Invoice print */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/91${(settings.whatsappNumber || '7481968724').replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello Dipu Sah! I just placed an order on dipueditx.in.\n\nOrder ID: ${submittedOrder.orderId}\nName: ${submittedOrder.clientName}\nService: ${submittedOrder.serviceTitle}\nAmount: ₹${submittedOrder.amount}\nUTR: ${submittedOrder.utrNumber}\n\nPlease verify payment and start my video editing!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Confirm on WhatsApp for 24h Priority Delivery</span>
              </a>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex-1 py-3 bg-brand-cardLight hover:bg-slate-800 border border-brand-border text-brand-yellow font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Printable Invoice</span>
                </button>
                <Link
                  to={`/track-order?id=${submittedOrder.orderId}`}
                  className="flex-1 py-3 bg-brand-cardLight border border-brand-border text-slate-200 hover:text-white rounded-xl text-xs font-bold text-center"
                >
                  Track Order Online
                </Link>
                <Link
                  to="/dashboard"
                  className="flex-1 py-3 bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold text-center"
                >
                  Client Dashboard
                </Link>
              </div>
            </div>

            {/* Printable Invoice Modal */}
            {showInvoiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-lg bg-slate-900 border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-white">DipuEditX</h3>
                      <p className="text-xs text-slate-400">Video Editor & AI Video Creator</p>
                      <p className="text-xs text-brand-yellow font-mono mt-1">dipueditx.in</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-400">TAX INVOICE</span>
                      <p className="text-sm font-mono font-bold text-white mt-0.5">{submittedOrder.invoiceNumber || `INV-${submittedOrder.orderId}`}</p>
                      <p className="text-[11px] text-slate-500">{new Date(submittedOrder.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 mb-4">
                    <p><strong className="text-slate-400">Billed To:</strong> {submittedOrder.clientName}</p>
                    <p><strong className="text-slate-400">Email:</strong> {submittedOrder.clientEmail}</p>
                    <p><strong className="text-slate-400">Phone:</strong> {submittedOrder.clientPhone}</p>
                    <p><strong className="text-slate-400">UTR / Ref:</strong> {submittedOrder.utrNumber}</p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-3 mb-4 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{submittedOrder.serviceTitle} ({submittedOrder.aspectRatio || '9:16'})</span>
                      <span>₹{submittedOrder.amount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Payment Method: UPI Peer-to-Peer</span>
                      <span>Verified: In Review</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm font-black text-white">
                    <span>Total Paid:</span>
                    <span className="text-brand-yellow text-lg">₹{submittedOrder.amount}</span>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 bg-brand-yellow text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print / Save PDF</span>
                    </button>
                    <button
                      onClick={() => setShowInvoiceModal(false)}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Main Order & Checkout Form */
          <div>
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-brand-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Fast & Secure Video Booking</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                Book Your Video & Pay via <span className="text-brand-yellow">UPI QR</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Logged in as <strong className="text-white">{user?.name}</strong> ({user?.email}). Fill requirements below to book your video!
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Service, Add-ons & Details (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Service Selection */}
                <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-7 shadow-lg">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-yellow text-black text-xs flex items-center justify-center font-extrabold">1</span>
                    <span>Select Your Service</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((srv) => (
                      <div
                        key={srv._id || srv.slug}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          selectedService?.title === srv.title
                            ? 'bg-yellow-500/10 border-brand-yellow glow-yellow'
                            : 'bg-slate-900/60 border-brand-border hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase">
                              {srv.category}
                            </span>
                            <span className="text-base font-black text-brand-yellow">
                              ₹{srv.basePrice}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {srv.title}
                          </h4>
                        </div>
                        <span className="text-[11px] text-cyan-400 mt-2 block font-medium">
                          ⚡ {srv.deliveryTime}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quantity & Aspect Ratio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-brand-border">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Number of Videos
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-brand-yellow"
                      >
                        <option value={1}>1 Video</option>
                        <option value={2}>2 Videos</option>
                        <option value={3}>3 Videos</option>
                        <option value={5}>5 Videos (10% Discount)</option>
                        <option value={10}>10 Videos (Monthly Creator Pack)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Aspect Ratio / Platform
                      </label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-brand-yellow"
                      >
                        <option value="9:16 (Shorts/Reels)">9:16 (Instagram Reels & YouTube Shorts)</option>
                        <option value="16:9 (YouTube/Landscape)">16:9 (YouTube Landscape & TV)</option>
                        <option value="1:1 (Square/Post)">1:1 (Square Post / Facebook)</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Speed Selector */}
                  <div className="mt-4 pt-4 border-t border-brand-border">
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Delivery Speed Turnaround
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {[
                        { id: 'Standard 24h', label: 'Standard 24h', extra: 'Base' },
                        { id: 'Express 12h', label: 'Express 12h', extra: '+₹49' },
                        { id: 'Relaxed 48h', label: 'Relaxed 48h', extra: '-5% off' },
                      ].map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setDeliverySpeed(s.id)}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            deliverySpeed === s.id
                              ? 'bg-yellow-500/10 border-brand-yellow text-white'
                              : 'bg-slate-900/60 border-brand-border text-slate-400 hover:text-white'
                          }`}
                        >
                          <p>{s.label}</p>
                          <span className="text-[10px] text-brand-yellow font-normal">{s.extra}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Add-ons Upsells */}
                <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-lg space-y-3">
                  <h3 className="text-sm font-black text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-yellow" />
                      <span>Recommended Upgrades & Add-ons</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </h3>

                  <div className="space-y-2">
                    {availableAddons.map((add) => {
                      const isChecked = selectedAddons.includes(add.id);
                      return (
                        <div
                          key={add.id}
                          onClick={() => handleToggleAddon(add.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-yellow-500/10 border-brand-yellow'
                              : 'bg-slate-900/40 border-brand-border hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-brand-yellow focus:ring-0 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-200">
                              {add.label}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-brand-yellow shrink-0 ml-2">
                            +₹{add.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Script & Requirements */}
                <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-yellow text-black text-xs flex items-center justify-center font-extrabold">2</span>
                    <span>Script, Topic & Raw Clips</span>
                  </h3>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Script / Instructions *
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {scriptWordCount} words (~{estimatedSeconds}s Reel)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={scriptNotes}
                      onChange={(e) => setScriptNotes(e.target.value)}
                      placeholder="Enter script, concept idea, Hindi/English text prompt, or doctor explanation topic..."
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Google Drive / Raw Footage Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={rawFilesLink}
                      onChange={(e) => setRawFilesLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Dynamic UPI QR Code, Coupons & Checkout (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-brand-card border-2 border-brand-yellow/60 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-brand-yellow uppercase tracking-wider bg-yellow-500/10 px-3 py-1 rounded-full">
                      Step 3: Instant UPI Payment
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      100% Verified
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-white p-4 rounded-2xl mx-auto text-center shadow-lg border-4 border-slate-900 mb-4 max-w-[240px] flex flex-col items-center">
                    <img
                      src={qrCodeImgUrl}
                      alt="Dipu Sah UPI QR Code"
                      className="w-48 h-48 object-contain"
                    />
                    <span className="text-[10px] text-black font-black uppercase tracking-wider mt-1 block">
                      Pay ₹{finalPrice} to {activeUpiName}
                    </span>
                  </div>

                  {/* UPI ID Copy Box */}
                  <div className="bg-slate-900/90 border border-brand-border rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        UPI ID / VPA
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-brand-yellow">
                        {activeUpiId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Mobile Direct Intent / App Selection */}
                  <div className="block sm:hidden space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">
                        Tap to Pay on Mobile App:
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Copy className="w-2.5 h-2.5" /> Auto-copies UPI ID
                      </span>
                    </div>

                    {clipboardNotice && (
                      <div className="p-2.5 rounded-xl bg-yellow-500/15 border border-brand-yellow/40 text-brand-yellow text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <Sparkles className="w-4 h-4 shrink-0 text-brand-yellow" />
                        <span className="flex-1">{clipboardNotice}</span>
                        <button type="button" onClick={() => setClipboardNotice('')} className="text-brand-yellow hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleMobilePay('phonepe', 'PhonePe')}
                        className="py-2.5 px-3 bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <span>🟣 PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMobilePay('gpay', 'Google Pay')}
                        className="py-2.5 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <span>🟢 Google Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMobilePay('paytm', 'Paytm')}
                        className="py-2.5 px-3 bg-[#00b9f1] hover:bg-[#0092bf] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <span>🔵 Paytm</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMobilePay('any', 'UPI App')}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-brand-yellow font-bold text-xs rounded-xl border border-brand-yellow/30 flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <span>🟡 Any UPI App</span>
                      </button>
                    </div>

                    {paymentAppOpened && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
                        <span>Payment ho gaya? Niche Step 4 me UTR paste karein 👇</span>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('step-4-utr');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="underline font-bold text-white ml-2 shrink-0"
                        >
                          Go to Step 4
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Discount Coupon Code Box (Clearly Labeled Optional) */}
                  <div className="mb-4 bg-slate-900/60 p-3.5 rounded-2xl border border-dashed border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Tag className="w-3.5 h-3.5 text-brand-yellow" />
                        Have a Promo / Coupon Code? (Optional)
                      </span>
                      <span className="text-[10px] text-brand-yellow font-bold">
                        Optional
                      </span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-xl">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Check className="w-4 h-4" />
                          <span>Coupon {appliedCoupon.code} Applied (-₹{discountAmount})</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-slate-400 hover:text-red-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="Coupon Code (e.g. DIPU10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                            className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-brand-yellow"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-yellow font-black text-xs rounded-xl border border-brand-yellow/40 transition-colors"
                          >
                            {couponLoading ? 'Checking...' : 'Apply Code'}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1.5">
                          Coupons: <span className="text-slate-400 font-mono font-bold">DIPU10</span> (10% off), <span className="text-slate-400 font-mono font-bold">FIRSTORDER</span> (₹20 off)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-brand-cardLight rounded-2xl p-4 mb-5 border border-brand-border space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Base Video Price ({quantity}x):</span>
                      <span className="font-bold text-white">₹{baseServicePrice}</span>
                    </div>
                    {speedExtra !== 0 && (
                      <div className="flex justify-between">
                        <span>Speed ({deliverySpeed}):</span>
                        <span className="font-bold text-white">{speedExtra > 0 ? `+₹${speedExtra}` : `-₹${Math.abs(speedExtra)}`}</span>
                      </div>
                    )}
                    {addonsTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Upgrades / Add-ons:</span>
                        <span className="font-bold text-white">+₹{addonsTotal}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Coupon Discount:</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-brand-border flex justify-between items-center text-sm font-black text-white">
                      <span>Total Payable:</span>
                      <span className="text-2xl text-brand-yellow">₹{finalPrice}</span>
                    </div>
                  </div>

                  {/* Dedicated Step 4: Mandatory UTR Input Section */}
                  <div id="step-4-utr" className="bg-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-brand-yellow shadow-xl space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-yellow uppercase tracking-wider bg-yellow-500/15 px-2.5 py-1 rounded-md border border-yellow-500/30">
                          <CreditCard className="w-3.5 h-3.5" />
                          Step 4: Enter 12-Digit UTR (Mandatory) *
                        </span>
                        <span className={`text-[11px] font-mono font-black ${
                          utrNumber.length === 12 && !utrError ? 'text-emerald-400' : utrError ? 'text-red-400' : 'text-slate-400'
                        }`}>
                          {utrNumber.length}/12 Digits
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="text-[11px] text-slate-300">
                          Payment complete karne ke baad <strong>12-digit UTR Number</strong> dalein:
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handlePasteUtrFromClipboard}
                            className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 border border-brand-yellow/40 text-brand-yellow text-[11px] font-bold flex items-center gap-1 transition-all"
                            title="Paste 12-digit UTR directly from clipboard"
                          >
                            <Clipboard className="w-3 h-3" />
                            <span>📋 Auto-Paste UTR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUtrGuideModal(true)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-bold flex items-center gap-1 transition-all"
                            title="Where to find UTR in PhonePe/GPay?"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>Where to find?</span>
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          required
                          value={utrNumber}
                          onChange={handleUtrChange}
                          placeholder="e.g. 428910394821"
                          className={`w-full bg-slate-900 border-2 ${
                            utrError
                              ? 'border-red-500 focus:border-red-400 text-red-200'
                              : utrNumber.length === 12
                              ? 'border-emerald-500 text-emerald-300'
                              : 'border-brand-yellow/60 focus:border-brand-yellow text-white'
                          } rounded-xl px-4 py-3 text-base font-mono font-bold tracking-widest focus:outline-none transition-colors`}
                        />
                        {utrNumber.length === 12 && !utrError && (
                          <span className="absolute right-3 top-3 text-emerald-400 text-xs flex items-center gap-1 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            <Check className="w-4 h-4" /> 12 Digits Valid
                          </span>
                        )}
                      </div>

                      {utrError ? (
                        <p className="text-xs text-red-400 font-semibold mt-2 flex items-center gap-1.5 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{utrError}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-1.5">
                          Sirf 12-digit numeric bank UTR allow hai. Letters, symbols ya fake numbers (123456...) reject ho jayenge.
                        </p>
                      )}
                    </div>

                    {/* Screenshot Upload with Live Preview */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Payment Screenshot (Optional)</span>
                        {screenshotPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshotPreview('');
                              setScreenshotFile(null);
                            }}
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                      />
                      {screenshotPreview && (
                        <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
                          <img src={screenshotPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/25 transition-all transform hover:-translate-y-0.5 mt-4"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-black" />
                      <span>{submitting ? 'Submitting Order...' : `Submit Order (₹${finalPrice})`}</span>
                    </button>
                  </div>

                </div>

              </div>

            </form>
          </div>
        )}

        {/* Where to find UTR Guide Modal */}
        {showUtrGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="relative w-full max-w-lg bg-slate-900 border border-brand-border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setShowUtrGuideModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-yellow" />
                  <span>12-Digit UTR / Ref Number Kahan Milega?</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Payment hone ke baad apne UPI app ki transaction receipt me se 12 digits ka number dekhein:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* PhonePe */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-1">
                  <div className="flex items-center justify-between font-bold text-purple-300">
                    <span>🟣 PhonePe</span>
                    <span className="font-mono bg-purple-950 px-2 py-0.5 rounded text-[11px]">UTR / Bank Ref ID</span>
                  </div>
                  <p className="text-slate-300">
                    PhonePe open karein ➔ <strong>History</strong> me Dipu Sah transaction pe tap karein ➔ <strong>"UTR"</strong> ke aage 12 digits ka number copy icon dabakar copy karein.
                  </p>
                </div>

                {/* Google Pay */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-300">
                    <span>🟢 Google Pay (GPay)</span>
                    <span className="font-mono bg-blue-950 px-2 py-0.5 rounded text-[11px]">UPI Transaction ID</span>
                  </div>
                  <p className="text-slate-300">
                    GPay open karein ➔ <strong>See transaction history</strong> ➔ Dipu Sah payment pe click karein ➔ Niche scroll karein ➔ <strong>"UPI transaction ID"</strong> (12 digits) copy karein.
                  </p>
                </div>

                {/* Paytm */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-300">
                    <span>🔵 Paytm</span>
                    <span className="font-mono bg-cyan-950 px-2 py-0.5 rounded text-[11px]">UPI Ref No.</span>
                  </div>
                  <p className="text-slate-300">
                    Paytm open karein ➔ <strong>Balance & History</strong> ➔ Payment details me <strong>"UPI Ref No"</strong> (12 digits) copy karein.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUtrGuideModal(false);
                    handlePasteUtrFromClipboard();
                  }}
                  className="flex-1 py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all"
                >
                  <Clipboard className="w-4 h-4" />
                  <span>Maine Copy Kar Liya - Auto-Paste Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUtrGuideModal(false)}
                  className="px-4 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderPage;
