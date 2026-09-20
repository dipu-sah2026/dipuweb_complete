import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, Search } from 'lucide-react';
import api from '../services/api';

const DEFAULT_FAQS = [
  {
    question: 'Video editing aur AI Video ka rate sirf ₹100 kaise hai?',
    answer: 'DipuEditX par hum automated AI workflows, premium templates, aur fast cutting tools (CapCut Pro, VN, Midjourney) use karte hain jisse production time kam lagta hai aur hum high quality video ultra-affordable ₹100 price par deliver kar paate hain.',
  },
  {
    question: 'Payment kaise karni hogi? Kya UPI available hai?',
    answer: 'Haan! Aapko order form bharte waqt Dipu Sah ka official UPI QR code dikhega. Aap Google Pay, PhonePe, Paytm ya kisi bhi UPI app se scan karke pay kar sakte hain aur 12-digit UTR number enter karke submit kar sakte hain.',
  },
  {
    question: 'Order karne ke baad kitne time me video milegi?',
    answer: 'Normal turnaround time 24 ghante hai. AI Voiceover aur Thumbnail design jaise quick tasks 12 ghante ke andar deliver ho jate hain.',
  },
  {
    question: 'Agar mujhe video me changes (revisions) karwane ho to kya hoga?',
    answer: 'Hum text, captions, cuts, aur background music me free revisions dete hain jab tak aap 100% satisfy na ho jayein. Aap apne dashboard se 1-click revision request bhej sakte hain.',
  },
  {
    question: 'Doctor / Hospital aur Business videos ke liye script kaun banayega?',
    answer: 'Agar aapke paas script nahi hai, to koi baat nahi! Aap bas topic ya bullet points de sakte hain. Dipu Sah AI dwara medical accurate aur high converting script khud create karenge.',
  },
  {
    question: 'Kya mai raw videos Google Drive se bhej sakta hoon?',
    answer: 'Ji haan, order form me aap Google Drive, Dropbox ya WeTransfer ka download link paste kar sakte hain.',
  },
];

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs');
        if (res.data && Array.isArray(res.data.data)) {
          setFaqs(res.data.data);
        }
      } catch (err) {
        console.log('FAQ fetch error');
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-950/80 border-t border-brand-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3.5 py-1 rounded-full border border-yellow-500/20">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Sabhi aam sawalon ke seedhe jawab (Admin Managed CMS)
          </p>

          {/* Real-time FAQ Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. revision, payment, script)..."
              className="w-full bg-slate-900 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No questions found matching "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq._id || idx}
                  className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-bold text-sm sm:text-base hover:text-brand-yellow transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-yellow shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-yellow' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-brand-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Support Helpdesk Banner */}
        <div className="mt-12 bg-gradient-to-r from-brand-card via-slate-900 to-brand-card border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-white font-bold text-base">Koi aur sawal hai?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Dipu Sah se directly WhatsApp par baat karein: +91 7481968724
            </p>
          </div>
          <a
            href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20have%20a%20question%20regarding%20video%20editing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
