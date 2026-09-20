import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  QrCode, 
  Phone, 
  Mail, 
  Globe, 
  Sparkles, 
  Share2, 
  Lock, 
  ShieldCheck,
  Eye,
  EyeOff,
  Cloud,
  Key,
  ExternalLink
} from 'lucide-react';
import api, { DEFAULT_SETTINGS } from '../../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showCloudinarySecret, setShowCloudinarySecret] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.log('Using default settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data.data);
      setSuccessMsg('Settings updated successfully! Changes are live across dipueditx.in.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      await api.put('/users/profile', {
        currentPassword,
        newPassword,
      });
      setPasswordMsg('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const previewQrUri = `upi://pay?pa=${settings.upiId || '7481968724@upi'}&pn=${encodeURIComponent(settings.upiName || 'Dipu Sah')}&am=100&cu=INR`;
  const qrPreviewImg = settings.customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(previewQrUri)}`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-yellow" />
          <span>Agency & Global Website CMS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize UPI QR destination, WhatsApp number, email notifications, social links & banner notices.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitSettings} className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* 1. UPI Payment & QR Code */}
        <div className="space-y-4 pb-6 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-brand-yellow" />
              <span>UPI Payment & QR Settings</span>
            </h3>
            <span className="text-xs text-brand-yellow font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
              Live on /order
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  UPI ID (VPA) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiId || ''}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="7481968724@upi"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-yellow font-mono font-bold focus:outline-none focus:border-brand-yellow"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This exact UPI address will receive payments when clients scan the QR code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Payee Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiName || ''}
                  onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                  placeholder="Dipu Sah"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Custom QR Image URL (Optional - leave empty for auto-generated UPI QR)
                </label>
                <input
                  type="url"
                  value={settings.customQrUrl || ''}
                  onChange={(e) => setSettings({ ...settings, customQrUrl: e.target.value })}
                  placeholder="https://... or leave blank to auto-generate"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            {/* Live QR Preview Box */}
            <div className="md:col-span-4 bg-slate-900 border border-brand-border rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live QR Preview</span>
              <div className="bg-white p-2 rounded-xl inline-block shadow">
                <img src={qrPreviewImg} alt="QR Preview" className="w-32 h-32 object-contain" />
              </div>
              <p className="text-[11px] font-mono text-brand-yellow font-bold mt-2 truncate">{settings.upiId}</p>
            </div>
          </div>
        </div>

        {/* 2. Contact & Notification Settings */}
        <div className="space-y-4 pb-6 border-b border-brand-border">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>Contact & Alert Email Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="7481968724"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                FormSubmit.co Alert Email (Your Mailbox) *
              </label>
              <input
                type="email"
                required
                value={settings.formSubmitEmail || ''}
                onChange={(e) => setSettings({ ...settings, formSubmitEmail: e.target.value })}
                placeholder="dipusah7481@gmail.com"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Public Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@dipueditx.in"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Base Offer Starting Price (₹)
              </label>
              <input
                type="number"
                value={settings.startingPrice || 100}
                onChange={(e) => setSettings({ ...settings, startingPrice: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>
        </div>

        {/* 2.5 Cloudinary API Configuration */}
        <div className="space-y-4 pb-6 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <span>Cloudinary API (Video Hosting & Direct Delivery)</span>
            </h3>
            {settings.cloudinary?.cloudName && settings.cloudinary?.apiKey && settings.cloudinary?.apiSecret ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                API Configured
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full">
                ⚠️ Not Configured
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-400">
            Jab aap Admin panel se client ko direct video upload karke deliver karenge, toh video aapke Cloudinary account me upload hogi aur uska direct streaming link client ko mil jayega. (Free tier: 25 GB storage).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Cloud Name *
              </label>
              <input
                type="text"
                value={settings.cloudinary?.cloudName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cloudinary: { ...settings.cloudinary, cloudName: e.target.value },
                  })
                }
                placeholder="e.g. dpxvideo"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                API Key *
              </label>
              <input
                type="text"
                value={settings.cloudinary?.apiKey || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cloudinary: { ...settings.cloudinary, apiKey: e.target.value },
                  })
                }
                placeholder="e.g. 849281938192831"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>API Secret *</span>
                <button
                  type="button"
                  onClick={() => setShowCloudinarySecret(!showCloudinarySecret)}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {showCloudinarySecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showCloudinarySecret ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <input
                type={showCloudinarySecret ? 'text' : 'password'}
                value={settings.cloudinary?.apiSecret || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cloudinary: { ...settings.cloudinary, apiSecret: e.target.value },
                  })
                }
                placeholder="••••••••••••••••••••"
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>🔑 Free API credentials kahan milenge? <strong>cloudinary.com</strong> pe free sign-up karke Dashboard se copy karein.</span>
            <a
              href="https://cloudinary.com/users/register_free"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-bold shrink-0"
            >
              <span>Get Free API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3. Social Media Links CMS */}
        <div className="space-y-4 pb-6 border-b border-brand-border">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <span>Social Media Channels (Live in Footer & Navbar)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/@..."
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telegram Community / Channel</label>
              <input
                type="url"
                value={settings.socialLinks?.telegram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, telegram: e.target.value },
                  })
                }
                placeholder="https://t.me/..."
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>
        </div>

        {/* 4. Top Announcement Notice CMS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Top Bar Announcement Notice</span>
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableNotice"
                checked={settings.enableNotice}
                onChange={(e) => setSettings({ ...settings, enableNotice: e.target.checked })}
                className="w-4 h-4 rounded text-brand-yellow"
              />
              <label htmlFor="enableNotice" className="text-xs font-bold text-slate-300 cursor-pointer">
                Show Banner
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Notice Message Text</label>
            <input
              type="text"
              value={settings.bannerNotice || ''}
              onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={settings.bannerCtaText || 'Order Now'}
                onChange={(e) => setSettings({ ...settings, bannerCtaText: e.target.value })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CTA Destination Link</label>
              <input
                type="text"
                value={settings.bannerCtaLink || '/order'}
                onChange={(e) => setSettings({ ...settings, bannerCtaLink: e.target.value })}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/25 transition-all"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
        </button>

      </form>

      {/* Admin Security & Password Change Box */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-400" />
          <span>Change Admin Password</span>
        </h3>

        {passwordMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl">
            {passwordMsg}
          </div>
        )}
        {passwordError && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold rounded-xl">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">New Password (min 6 chars) *</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AdminSettings;
