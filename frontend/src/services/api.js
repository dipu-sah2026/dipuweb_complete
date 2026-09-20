import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dipueditx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Default fallback data if API server is not running or initializing
export const DEFAULT_SERVICES = [
  {
    _id: 's1',
    title: 'AI Video Creation (Text & Image to Video)',
    category: 'AI Video',
    description: 'Turn your ideas, prompts, or images into photorealistic cinematic videos with realistic motions, effects, and sound design.',
    basePrice: 100,
    deliveryTime: '24 Hours',
    popular: true,
    features: [
      'Full HD 1080p / 4K Resolution',
      'Hyper Realistic AI Visuals',
      'Natural Transitions & Camera Motion',
      'Background Sound & SFX',
      'Commercial Rights Included'
    ]
  },
  {
    _id: 's2',
    title: 'Shorts & Reels Editing (9:16 Viral)',
    category: 'Short Form',
    description: 'High-energy retention editing with animated captions, emoji graphics, sound effects, zooms, and trending hooks.',
    basePrice: 100,
    deliveryTime: '24 Hours',
    popular: true,
    features: [
      'Alex Hormozi Style Captions',
      'Punchy Sound Effects (SFX)',
      'Motion B-Roll & Visual Assets',
      'Speed Ramping & Color Pop',
      'Fast Turnaround Guaranteed'
    ]
  },
  {
    _id: 's3',
    title: 'Doctor & Hospital Health Videos',
    category: 'Healthcare',
    description: 'Build patient trust with high quality 2D/3D medical explanation videos (Kidney stones, Cardiology, Dental, Skin care, etc.).',
    basePrice: 199,
    deliveryTime: '24-48 Hours',
    popular: true,
    features: [
      'Accurate Medical 3D Graphics',
      'Doctor Avatar & Voiceover',
      'Hindi & English Scripting',
      'Clinic Branding & Contact Overlay',
      'Ideal for Social Media & TV Screens'
    ]
  },
  {
    _id: 's4',
    title: 'School & College Promotional Videos',
    category: 'Education',
    description: 'Boost admissions and brand prestige with dynamic campus overview reels, student achievement highlights, and faculty tours.',
    basePrice: 199,
    deliveryTime: '24-48 Hours',
    popular: false,
    features: [
      'Admission Campaign Focus',
      'Campus Drone/Footage Polishing',
      'Student Results Showcase',
      'Energetic Voiceover & Music',
      'WhatsApp Sharable Clips'
    ]
  },
  {
    _id: 's5',
    title: 'Business & Brand Commercial Video Ads',
    category: 'Business',
    description: 'High-converting video ads engineered for Meta, Instagram, and YouTube Ads to maximize clicks, leads, and sales.',
    basePrice: 249,
    deliveryTime: '24-48 Hours',
    popular: false,
    features: [
      'Problem-Agitation-Solution Hook',
      'Product Feature Animation',
      'Brand Kit & Logo Styling',
      'Conversion-Optimized CTA',
      '2 Rounds of Free Revisions'
    ]
  },
  {
    _id: 's6',
    title: 'AI Voice Over (Hindi & English)',
    category: 'Audio',
    description: 'Ultra-realistic human-sounding studio voiceovers with rich emotion, diverse accents, and professional mastering.',
    basePrice: 99,
    deliveryTime: '12 Hours',
    popular: false,
    features: [
      'Natural Male & Female Accents',
      'Hindi, Hinglish & English',
      'Crystal Clear Noise Reduction',
      'Studio Quality Mastering',
      'Instant WAV / MP3 Delivery'
    ]
  },
  {
    _id: 's7',
    title: 'Viral YouTube Thumbnail Design',
    category: 'Graphic Design',
    description: 'Eye-catching, high click-through-rate thumbnails crafted with custom cutouts, bold 3D text, glow effects, and curiosity hooks.',
    basePrice: 79,
    deliveryTime: '12 Hours',
    popular: false,
    features: [
      'High CTR Psychology',
      'Subject Glow & Contrast Pop',
      'Ultra HD (1920x1080)',
      'Free Revisions'
    ]
  },
  {
    _id: 's8',
    title: 'Channel Logo & Banner Branding',
    category: 'Graphic Design',
    description: 'Establish authority across YouTube, Instagram, and Facebook with custom logo marks and sleek header banners.',
    basePrice: 149,
    deliveryTime: '24 Hours',
    popular: false,
    features: [
      'Modern Logo Design',
      'YouTube & Social Media Banner',
      'High Resolution Vectors',
      'Source File Provided'
    ]
  }
];

export const DEFAULT_PORTFOLIO = [
  {
    _id: 'p1',
    title: 'Kidney Ki Pathri Ka Ilaj Kaise Hota Hai',
    category: 'Doctor / Hospital',
    aspectRatio: '9:16',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    description: 'Medical explainer reel explaining kidney stone formation and laser treatment with realistic 3D organs and clear Hindi voiceover.',
    toolsUsed: ['CapCut Pro', 'Midjourney', 'ElevenLabs', 'VN']
  },
  {
    _id: 'p2',
    title: 'Padhai Se Safalta Tak (Student Motivation)',
    category: 'School / Education',
    aspectRatio: '9:16',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    description: 'Inspiring journey reel featuring stylized 3D anime character visuals, cinematic lighting, and powerful pacing.',
    toolsUsed: ['Kling AI', 'CapCut', 'Clipchamp']
  },
  {
    _id: 'p3',
    title: 'AI Se Banaye Hyper Realistic Video',
    category: 'AI Realistic',
    aspectRatio: '9:16',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    description: 'Sci-fi cyberpunk visual creation showcasing complex lighting, realistic particle simulation, and high visual appeal.',
    toolsUsed: ['Runway Gen-2', 'Midjourney v6', 'Premiere Pro']
  },
  {
    _id: 'p4',
    title: 'Hari Sabjiyo Khao, Sehat Banao (Cute 3D Animation)',
    category: 'AI Realistic',
    aspectRatio: '9:16',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    description: 'Charming animated vegetables talking to kids with humorous expressions and educational nutritional tips.',
    toolsUsed: ['Pika Labs', 'ElevenLabs', 'CapCut']
  },
  {
    _id: 'p5',
    title: 'Himalayan Mountain Expedition Vlog',
    category: 'Travel & Lifestyle',
    aspectRatio: '16:9',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    description: 'Cinematic landscape color grading, atmospheric drone flow, and custom audio soundscaping.',
    toolsUsed: ['Premiere Pro', 'DaVinci Resolve']
  },
  {
    _id: 'p6',
    title: 'High Retention YouTube Shorts (Talking Head + B-Roll)',
    category: 'YouTube Shorts / Reels',
    aspectRatio: '9:16',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    description: 'Snappy editing with Alex Hormozi captions, sound effects, emojis, and visual memes ensuring high retention.',
    toolsUsed: ['CapCut', 'Photoshop', 'VN Editor']
  }
];

export const DEFAULT_SETTINGS = {
  brandName: 'Dipu Sah - Video Editor & AI Video Creator',
  domain: 'dipueditx.in',
  whatsappNumber: '7481968724',
  contactEmail: 'contact@dipueditx.in',
  formSubmitEmail: 'dipusah7481@gmail.com',
  upiId: '7481968724@upi',
  upiName: 'Dipu Sah',
  startingPrice: 100,
  bannerNotice: '⚡ Special Launch Offer: Professional AI Video & Shorts Editing Starting @ Just ₹100! 24-Hour Express Delivery Guaranteed.',
  enableNotice: true,
  tagline: 'Your Idea, My Editing & AI Magic',
};

