const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Review = require('../models/Review');
const Setting = require('../models/Setting');
const Faq = require('../models/Faq');
const Coupon = require('../models/Coupon');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Fix for Node.js Windows SRV DNS resolution ECONNREFUSED on MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where custom DNS is restricted
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dipueditx';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections if desired
    await User.deleteMany({ role: 'admin' });
    await Service.deleteMany({});
    await Portfolio.deleteMany({});
    await Review.deleteMany({});
    await Setting.deleteMany({});
    await Faq.deleteMany({});
    await Coupon.deleteMany({});

    // 1. Create Default Admin
    const adminUser = await User.create({
      name: 'Dipu Sah (Admin)',
      email: 'admin@dipueditx.in',
      phone: '7481968724',
      password: 'Admin@12345', // Encrypted by User schema pre-save
      role: 'admin',
    });
    console.log('[Seed] Admin user created: admin@dipueditx.in / Admin@12345');

    // 2. Seed Services based on the flyer
    const services = [
      {
        title: 'AI Video Creation (Text & Image to Video)',
        slug: 'ai-video-creation',
        category: 'AI Video',
        description: 'Generate hyper-realistic cinematic videos directly from your text prompt, script, or image. Perfect for storytelling, ads, and social media.',
        basePrice: 100,
        deliveryTime: '24 Hours',
        features: [
          'High Resolution 1080p / 4K',
          'Cinematic AI Visuals',
          'Realistic Motions & Transitions',
          'Free Background Music',
          'Commercial Usage Rights',
        ],
        popular: true,
        iconName: 'Sparkles',
      },
      {
        title: 'Video Editing (Reels, Shorts, YouTube, Facebook)',
        slug: 'video-editing-shorts-reels',
        category: 'Short Form',
        description: 'Professional vertical (9:16) & horizontal editing with dynamic captions, sound effects, zooms, color grading, and viral hooks to skyrocket retention.',
        basePrice: 100,
        deliveryTime: '24 Hours',
        features: [
          'Animated Subtitles / Captions',
          'Punchy Sound FX (SFX)',
          'B-Rolls & Graphics Integration',
          'Motion Graphics & Brolls',
          'Revisions Included',
        ],
        popular: true,
        iconName: 'Clapperboard',
      },
      {
        title: 'Doctor & Hospital Medical Videos',
        slug: 'doctor-hospital-video',
        category: 'Healthcare',
        description: 'Educate patients and grow your medical clinic/hospital with informative 2D/3D AI animated health explanation videos (e.g. Kidney Stone, Dental care, Cardiology).',
        basePrice: 199,
        deliveryTime: '24-48 Hours',
        features: [
          'Medical Anatomy Visuals',
          'Professional Doctor Avatar / Voice',
          'Hindi & English Scripting Support',
          'High Patient Trust Factor',
          'Social Media Ready (Instagram/YouTube)',
        ],
        popular: true,
        iconName: 'Stethoscope',
      },
      {
        title: 'School & College Promotional Videos',
        slug: 'school-college-promotional',
        category: 'Education',
        description: 'Attract new admissions and showcase campus facilities, results, and faculty with inspiring promotional reels and overview videos.',
        basePrice: 199,
        deliveryTime: '24-48 Hours',
        features: [
          'Admission Drive Highlights',
          'Campus Tour Editing',
          'Student Achievement Graphics',
          'Voiceover & Background Score',
          'WhatsApp Shareable Formats',
        ],
        popular: false,
        iconName: 'GraduationCap',
      },
      {
        title: 'Business & Brand Commercial Videos',
        slug: 'business-brand-commercial',
        category: 'Business',
        description: 'Skyrocket product sales and local business visibility with high-converting ads for Instagram, Facebook, and Google.',
        basePrice: 249,
        deliveryTime: '24-48 Hours',
        features: [
          'Hook + Story + Call-to-Action (CTA)',
          'Product Showcase Animation',
          'Brand Colors & Logo Integration',
          'Ad Campaign Optimized',
          '2 Free Revisions',
        ],
        popular: false,
        iconName: 'Building2',
      },
      {
        title: 'AI Voice Over (Hindi & English)',
        slug: 'ai-voiceover',
        category: 'Audio',
        description: 'Crystal clear, emotionally engaging AI studio voiceovers with natural human cadence, accents, and pacing.',
        basePrice: 99,
        deliveryTime: '12 Hours',
        features: [
          'Male & Female Realistic Voices',
          'Hindi, Hinglish & English Accents',
          'Studio Quality Noise-Free Audio',
          'Audio Mastering & EQ',
          'WAV & MP3 Delivery',
        ],
        popular: false,
        iconName: 'Mic',
      },
      {
        title: 'High-CTR YouTube Thumbnail Design',
        slug: 'thumbnail-design',
        category: 'Graphic Design',
        description: 'Eye-grabbing, high click-through rate thumbnails crafted with custom face expressions, bold 3D typography, and lighting.',
        basePrice: 79,
        deliveryTime: '12 Hours',
        features: [
          'High CTR Design Theory',
          'Face Retouching & Glow',
          'Full HD (1920x1080)',
          'PSD / PNG Deliverables',
        ],
        popular: false,
        iconName: 'Image',
      },
      {
        title: 'Logo & Banner Design',
        slug: 'logo-banner-design',
        category: 'Graphic Design',
        description: 'Modern, minimalist or mascot logos and YouTube/Facebook channel banners that build instant authority.',
        basePrice: 149,
        deliveryTime: '24 Hours',
        features: [
          'Vector Quality Logo',
          'Channel Banner & Profile Match',
          'Source Files Included',
          'Multiple Concepts',
        ],
        popular: false,
        iconName: 'Palette',
      },
    ];
    await Service.insertMany(services);
    console.log('[Seed] Services populated.');

    // 3. Seed Portfolio items matching the flyer
    const portfolioItems = [
      {
        title: 'Kidney Ki Pathri Ka Ilaj (Doctor AI Explainer)',
        category: 'Doctor / Hospital',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Embed preview
        thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
        aspectRatio: '9:16',
        description: 'Complete medical awareness reel explaining symptoms and laser treatment with realistic medical 3D animations and doctor voiceover.',
        toolsUsed: ['CapCut Pro', 'Midjourney', 'ElevenLabs', 'VN Editor'],
        featured: true,
      },
      {
        title: 'Padhai Se Safalta Tak (Student Motivation Reel)',
        category: 'School / Education',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
        aspectRatio: '9:16',
        description: 'Inspiring student journey animated reel with 3D character generation, emotive background score, and dynamic captions.',
        toolsUsed: ['CapCut', 'Kling AI', 'Clipchamp'],
        featured: true,
      },
      {
        title: 'AI Se Banaye Realistic Video (Cyberpunk Sci-Fi)',
        category: 'AI Realistic',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        aspectRatio: '9:16',
        description: 'High-definition neural AI generation transforming simple concept prompts into photorealistic cinematics with sound design.',
        toolsUsed: ['Runway Gen-2', 'Midjourney v6', 'Premiere Pro'],
        featured: true,
      },
      {
        title: 'Hari Sabjiyo Khao, Sehat Banao (3D Cute Vegetable Animation)',
        category: 'AI Realistic',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
        aspectRatio: '9:16',
        description: 'Engaging talking character cartoon reel promoting organic nutrition for kids and family healthcare pages.',
        toolsUsed: ['Pika Labs', 'ElevenLabs', 'CapCut'],
        featured: true,
      },
      {
        title: 'Himalayan Mountain Odyssey (Cinematic Travel Vlog)',
        category: 'Travel & Lifestyle',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        aspectRatio: '16:9',
        description: 'Cinematic landscape color grading, speed ramps, ambient drone stabilization, and atmospheric audio mixing.',
        toolsUsed: ['Premiere Pro', 'DaVinci Resolve', 'VN Editor'],
        featured: true,
      },
      {
        title: 'High Retention YouTube Shorts (Talking Head + B-Roll)',
        category: 'YouTube Shorts / Reels',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        aspectRatio: '9:16',
        description: 'Alex Hormozi style captions, animated emojis, sound effects every 2 seconds, and seamless looping for 90%+ retention.',
        toolsUsed: ['CapCut', 'After Effects', 'Photoshop'],
        featured: true,
      },
    ];
    await Portfolio.insertMany(portfolioItems);
    console.log('[Seed] Portfolio items populated.');

    // 4. Seed Reviews
    const reviews = [
      {
        clientName: 'Dr. Rajesh Sharma',
        roleOrCompany: 'Cardiologist & Clinic Director',
        serviceType: 'Doctor / Hospital Video',
        rating: 5,
        comment: 'Dipu bhai ne hamare clinic ke liye kidney aur heart health ke bohot hi realistic AI videos banaye. Patient response bohot badhiya aaya aur sirf 24 ghante me deliver kiya! Super affordable.',
        approved: true,
        verifiedBuyer: true,
      },
      {
        clientName: 'Aman Verma',
        roleOrCompany: 'Tech YouTuber (120K Subs)',
        serviceType: 'Shorts & Reels Editing',
        rating: 5,
        comment: 'Only ₹100 me itna tagda editing quality aaj tak kisi ne nahi diya! Sound effects, captions, transitions sab top notch the. Ab mere sabhi shorts Dipu se hi banenge.',
        approved: true,
        verifiedBuyer: true,
      },
      {
        clientName: 'Pooja Singh',
        roleOrCompany: 'Fashion & E-commerce Brand',
        serviceType: 'AI Video Creation',
        rating: 5,
        comment: 'Hamare product ads ke liye AI video generate karke di jo Instagram ads pe 3x ROI de rahi hai. Payment bhi easy UPI QR se ho gaya aur instant confirmation mil gaya.',
        approved: true,
        verifiedBuyer: true,
      },
      {
        clientName: 'Vikram Mehta',
        roleOrCompany: 'Delhi Coaching Institute',
        serviceType: 'Promotional Video',
        rating: 5,
        comment: 'Admission campaign ke liye reels banwayi thi. Quality aur delivery speed dono lajawab. Dipu Sah is extremely professional and polite.',
        approved: true,
        verifiedBuyer: true,
      },
    ];
    await Review.insertMany(reviews);
    console.log('[Seed] Reviews populated.');

    // 5. Seed Site Settings
    await Setting.create({
      brandName: 'Dipu Sah - Video Editor & AI Video Creator',
      domain: 'dipueditx.in',
      whatsappNumber: '7481968724',
      contactEmail: 'contact@dipueditx.in',
      formSubmitEmail: 'dipusah7481@gmail.com',
      upiId: '7481968724@upi',
      upiName: 'Dipu Sah',
      customQrUrl: '',
      startingPrice: 100,
      bannerNotice: '⚡ Special Launch Offer: Professional AI Video & Shorts Editing Starting at Just ₹100! 24-Hour Express Delivery Guaranteed.',
      enableNotice: true,
      tagline: 'Your Idea, My Editing & AI Magic',
      socialLinks: {
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        telegram: 'https://t.me',
        linkedin: '',
      },
    });
    console.log('[Seed] Settings populated.');

    // 6. Seed FAQs
    const faqs = [
      {
        question: 'Video editing aur AI Video ka rate sirf ₹100 kaise hai?',
        answer: 'DipuEditX par hum automated AI workflows, premium templates, aur fast cutting tools (CapCut Pro, VN, Midjourney) use karte hain jisse production time kam lagta hai aur hum high quality video ultra-affordable ₹100 price par deliver kar paate hain.',
        category: 'Pricing',
        order: 1,
      },
      {
        question: 'Payment kaise karni hogi? Kya UPI available hai?',
        answer: 'Haan! Order form bharte waqt Dipu Sah ka official UPI QR code aur UPI ID dikhega. Aap Google Pay, PhonePe, Paytm ya kisi bhi UPI app se scan karke pay kar sakte hain aur 12-digit UTR number enter karke submit kar sakte hain.',
        category: 'Payment',
        order: 2,
      },
      {
        question: 'Order karne ke baad kitne time me video milegi?',
        answer: 'Normal turnaround time 24 ghante hai. AI Voiceover aur Thumbnail design jaise quick tasks 12 ghante ke andar deliver ho jate hain.',
        category: 'Delivery',
        order: 3,
      },
      {
        question: 'Agar mujhe video me changes (revisions) karwane ho to kya hoga?',
        answer: 'Hum text, captions, cuts, aur background music me free revisions dete hain jab tak aap 100% satisfy na ho jayein. Delivered video par client dashboard se 1-click revision request kar sakte hain.',
        category: 'Revisions',
        order: 4,
      },
      {
        question: 'Doctor / Hospital aur Business videos ke liye script kaun banayega?',
        answer: 'Agar aapke paas script nahi hai, to koi baat nahi! Aap bas topic ya bullet points de sakte hain. Dipu Sah AI dwara medical accurate aur high converting script khud create karenge.',
        category: 'General',
        order: 5,
      },
      {
        question: 'Kya mai raw videos Google Drive se bhej sakta hoon?',
        answer: 'Ji haan, order form me aap Google Drive, Dropbox ya WeTransfer ka download link paste kar sakte hain.',
        category: 'General',
        order: 6,
      },
    ];
    await Faq.insertMany(faqs);
    console.log('[Seed] FAQs populated.');

    // 7. Seed Coupons
    const coupons = [
      {
        code: 'DIPU10',
        discountType: 'percent',
        discountValue: 10,
        minOrderAmount: 100,
        maxUses: 500,
        active: true,
      },
      {
        code: 'FIRSTORDER',
        discountType: 'flat',
        discountValue: 20,
        minOrderAmount: 100,
        maxUses: 200,
        active: true,
      },
      {
        code: 'VIRAL20',
        discountType: 'percent',
        discountValue: 20,
        minOrderAmount: 199,
        maxUses: 100,
        active: true,
      },
    ];
    await Coupon.insertMany(coupons);
    console.log('[Seed] Coupons populated.');

    console.log('\n=============================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('Admin Email: admin@dipueditx.in');
    console.log('Admin Password: Admin@12345');
    console.log('Domain: dipueditx.in | WhatsApp: 7481968724');
    console.log('Coupons: DIPU10, FIRSTORDER, VIRAL20');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

