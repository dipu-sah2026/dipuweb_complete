import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch to FormSubmit.co
    fetch('https://formsubmit.co/ajax/dipusah7481@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Inquiry from ${formData.name} - DipuEditX`,
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Message: formData.message,
      }),
    }).catch((err) => console.log(err));

    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-brand-dark min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3.5 py-1 rounded-full border border-yellow-500/20">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3">
            Contact <span className="text-brand-yellow">Dipu Sah</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Video editing projects, custom quotations, bulk orders, ya partnerships ke liye message karein.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-brand-card border border-brand-border rounded-3xl p-6 space-y-5">
              <h3 className="text-xl font-black text-white">Direct Channels</h3>
              
              <a
                href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20have%20an%20editing%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-black flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                    WhatsApp & Phone
                  </span>
                  <span className="text-base font-black text-white group-hover:text-emerald-300">
                    +91 7481968724
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Available 9:00 AM - 10:00 PM IST</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-brand-border">
                <div className="w-11 h-11 rounded-xl bg-yellow-500/20 text-brand-yellow flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-brand-yellow font-bold uppercase tracking-wider block">
                    Email
                  </span>
                  <span className="text-sm font-black text-white">
                    contact@dipueditx.in
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">dipusah7481@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-brand-border">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                    Working Hours & Turnaround
                  </span>
                  <span className="text-sm font-bold text-white">
                    24/7 Order Booking
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Standard Delivery: Under 24 Hours</p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-black text-white mb-2">Send an Instant Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill the form below and Dipu Sah will get back to you via WhatsApp or Email within 2 hours.
              </p>

              {submitted ? (
                <div className="bg-emerald-950/50 border border-emerald-500 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-xl font-black text-white">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-300">
                    Thank you, {formData.name}. We have received your query and will reply shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vicky Verma"
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. vicky@gmail.com"
                        className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 7481968724"
                        className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Project Requirements or Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your video requirements, channel niche, or questions..."
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;

