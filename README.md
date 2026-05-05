# 🐝 Beauty Bees Cosmetics — Authentic Korean Skincare in Nepal

Beauty Bees Cosmetics is a premium, full-stack e-commerce platform dedicated to bringing high-quality, authentic Korean beauty products to the Nepalese market. Built with performance, security, and aesthetics in mind.

![Beauty Bees Cosmetics Banner](public/images/hero_banner_main.png)

## ✨ Top-Tier Features

### 🛍️ Storefront & User Experience
- **Premium Design**: A clean, modern aesthetic inspired by global beauty brands with smooth animations and micro-interactions.
- **Smart Live Search**: Real-time product suggestions as you type, with thumbnails and price previews.
- **Advanced Filtering**: Filter products by category, brand, skin type (Oily, Dry, Sensitive, Combination), and price range.
- **Interactive Cart**: Side-drawer shopping cart with real-time updates and persistence across page reloads.
- **Product Reviews**: Full rating and testimonial system where customers can share their experiences.

### 🛡️ Security & Account Management
- **Email Verification**: Mandatory OTP-based email verification during registration to ensure a valid customer base.
- **Multi-Factor Authentication (MFA)**: Opt-in email-based MFA for an extra layer of account protection.
- **Customer Dashboard**: Professional profile management, order history tracking, and security settings.
- **Password Protection**: Secure bcrypt hashing and session management via `iron-session`.

### 🛡️ Administrative Controls
- **Full Inventory Management**: Real-time stock tracking with automatic decrementing upon delivery.
- **Order Processing**: Manage order statuses from "Pending" to "Delivered" with visual feedback.
- **User Management**: Admins can oversee all registered users, manage roles, and reset passwords for support.
- **Analytics Dashboard**: High-level overview of revenue, order volume, and customer growth with interactive KPI cards.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Vanilla CSS
- **Backend**: Next.js API Routes, Iron Session
- **Database**: PostgreSQL (Prisma ORM) — *SQLite used for local dev*
- **Notifications**: React Hot Toast
- **Email Provider**: Resend API

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/leo3671/beauty-bees.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add your `RESEND_API_KEY` and `SESSION_SECRET`.
4. Initialize the database:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## 🐝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ for the K-Beauty community in Nepal.*
