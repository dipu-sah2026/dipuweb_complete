# DipuEditX (dipueditx.in) - Professional Video Agency & AI Studio Web Platform

A high-converting, full-stack **MERN** web platform created for **Dipu Sah (Video Editor & AI Video Creator)** based on his official promotional banner reference.

---

## 🌟 Key Highlights & Features

### 1. High-Converting Landing Page & Agency Website
- **Hero Section**: "Your Idea, My Editing & AI Magic", highlight badge *"Only ₹100 Per Video"*, direct WhatsApp CTA (+91 7481968724), and dynamic *"Order Video Now"* buttons.
- **Industry Sectors Showcase**: Website/App SaaS demos, Doctor/Hospital medical explainers, School/College admission reels, and Business/Brand commercial ads.
- **Transparent Pricing & Services**: AI Video Creation (Text/Image to Video), Shorts & Reels (9:16) Retention Editing, AI Voiceover, Thumbnail Design, and Branding.
- **Video Showcase Portfolio**: Interactive category tabs (AI Realistic, Doctor/Hospital, Education, Shorts 9:16) with built-in popup video player modal.
- **Interactive Reviews**: Real client testimonials with star ratings and a live *"Leave a Review"* client feedback form.
- **Helpdesk & FAQ**: Accordion answering turnaround times (24h TAT), free revisions, and UPI payment methods.
- **Legal & Compliance**: Privacy Policy, Terms & Conditions, and Return & Refund Policy customized for digital video editing.

### 2. Client Booking & UPI Payment Gateway
1. **Step 1**: Client chooses service, aspect ratio (9:16 / 16:9 / 1:1), and pastes their script or raw footage Google Drive link.
2. **Step 2**: System calculates total amount (₹100+) and generates an **instant UPI QR Code** payable to Dipu Sah's UPI ID (`7481968724@upi`).
3. **Step 3**: Client enters their 12-digit **UTR Number** / Transaction ID and submits the order.
4. **Step 4 (Dual Action Notification)**:
   - Order is saved into MongoDB with status `"Pending Verification"`.
   - Dispatched via **FormSubmit.co API** directly to Dipu's email (`dipusah7481@gmail.com`).
   - Client is provided with an Order ID (e.g. `DPX-48291`) and a 1-click **WhatsApp Confirmation Button** prefilling the Order ID and UTR for instant verification!

### 3. Comprehensive Admin Panel (CRM + CMS)
- **Admin Authentication**: Secure JWT route. Default credentials:
  - **Email**: `admin@dipueditx.in`
  - **Password**: `Admin@12345`
- **Leads CRM**: Search & filter orders by status (*Pending Verification, Payment Verified, In Production, Completed*).
  - **1-Click WhatsApp Button**: Opens chat with client: *"Hello [Name], I received your order #[ID] for [Service]..."*
  - **1-Click Email Button**: Directly draft email to the client.
  - **Delivery Link Saver**: Paste Google Drive / WeTransfer link and mark order as delivered!
- **Services CMS**: Add, edit, or delete services, pricing (₹100), and feature lists.
- **Portfolio CMS**: Add new video projects, embed URLs, and thumbnails.
- **Settings CMS**: Update your UPI ID, Payee name, WhatsApp number, alert email, and top banner notice without touching any code.

### 4. SEO & Production Setup for `dipueditx.in`
- Complete `sitemap.xml` with all public routes and priority indexes.
- Strict `robots.txt` allowing public indexing while disallowing `/admin/` and `/api/`.
- Dynamic OpenGraph tags, Twitter cards, and Schema.org `ProfessionalService` JSON-LD for top Google search rankings.

---

## 🚀 Local Development Setup

### 1. Backend (Node.js & Express)
```bash
cd backend
npm install
npm run seed     # Seeds default admin (admin@dipueditx.in / Admin@12345) and services
npm start        # Runs on http://localhost:5000
```

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

---

## 🌐 Production Deployment Guide

### Deploying Frontend to **Vercel**:
1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and select the repository.
3. Set **Root Directory** to `frontend`.
4. In **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed backend URL on Render (e.g. `https://dipueditx-backend.onrender.com/api`).
5. Click **Deploy**. Vercel will automatically read `frontend/vercel.json` for SPA routing.
6. Under **Project Settings > Domains**, connect your custom domain `dipueditx.in`.

### Deploying Backend to **Render**:
1. In Render Dashboard, click **New Web Service** and link your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Under **Environment Variables**, configure:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://...`).
   - `JWT_SECRET`: Any random secure secret key.
   - `FORMSUBMIT_EMAIL`: `dipusah7481@gmail.com`
   - `NODE_ENV`: `production`
   - `KEEP_ALIVE_URL`: Your live backend URL (e.g. `https://dipueditx-backend.onrender.com`)
6. Click **Create Web Service**.
7. Once deployed, run the seed command in the Render shell if you wish to populate initial services:
   ```bash
   npm run seed
   ```

---

## ⚡ 24/7 Auto-Monitoring & Keep-Alive (Prevent Render Sleep)

Render's free tier puts web servers to sleep after 15 minutes of inactivity. To keep your server online 24/7 without delays, we provided two built-in solutions:

### 1. Dedicated Health & Ping Endpoints
- **Health Check & Diagnostics**: `GET https://your-backend.onrender.com/health` (Returns JSON with server status, uptime, MongoDB connection, and memory usage)
- **Lightweight Ping**: `GET https://your-backend.onrender.com/ping` (Returns `PONG - DipuEditX is awake` with zero overhead)

### 2. Auto Monitoring via Free Services (Recommended)
1. Sign up on [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com) (100% Free).
2. Create a new monitor / cron job:
   - **URL**: `https://your-backend.onrender.com/ping`
   - **Interval**: Every **10 minutes** or **12 minutes**.
   - **Method**: `GET`
3. This sends an automatic ping every 10 minutes so Render **never** spins down!

### 3. Built-In Auto Self-Pinger
- You can simply set `KEEP_ALIVE_URL=https://your-backend.onrender.com` in your Render environment variables.
- The server will automatically ping itself every 13 minutes in the background!

---

## 📞 Support & Contacts
- **Founder**: Dipu Sah (Video Editor & AI Video Creator)
- **Domain**: [dipueditx.in](https://dipueditx.in)
- **WhatsApp**: +91 7481968724
- **Email**: contact@dipueditx.in

