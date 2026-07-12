<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" width="80" height="80" alt="Logo" />
  <h1 align="center">🌾 Pahadi CropSathi (Agri AI)</h1>
  <p align="center">
    <strong>An Intelligent, Multi-Lingual Agricultural Assistant Platform</strong><br>
    Powered by Next.js, Google Gemini, Leaflet, and Prisma
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </div>
</div>

---

## 🌟 About The Project

**Pahadi CropSathi** (formerly Agri AI) is a cutting-edge agricultural intelligence platform designed to empower farmers and agricultural professionals with data-driven insights. By combining computer vision, geospatial analysis, and natural language processing, this tool transforms traditional farming practices into smart, sustainable agriculture.

### 🚀 Tech Stack

- **Frontend Framework:** Next.js 14+ (App Router), React, Tailwind CSS
- **Database & ORM:** SQLite + Prisma ORM
- **Authentication & Security:** JWT (JSON Web Tokens), bcrypt hashing, Zod Input Validation, Rate Limiting
- **Maps & Geospatial:** Leaflet, Leaflet Geoman (Free & Open Source)
- **Artificial Intelligence:** Google Gemini API (`@google/genai`) using `gemini-1.5-flash`

---

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based login and registration system with password hashing and Zod input validation to ensure maximum security.
- **🔬 AI Plant Analysis:** Upload plant images for instant disease detection, severity analysis, and actionable treatment recommendations.
- **🗺️ Interactive Maps (Free Satellite Imagery):** Select and draw specific land areas using Leaflet Geoman to receive comprehensive analysis of soil quality, climate conditions, and agricultural potential.
- **🌐 Multi-Language Support:** Seamlessly available in English, Hindi, Punjabi, Tamil, Telugu, and Marathi.
- **💬 Smart Chatbot (AgriBot):** An AI-powered agricultural advisor providing expert guidance with an enhanced conversational experience.
- **💾 Persistent History:** All your plant analyses, drawn regions, and chat histories are securely saved locally using a Prisma + SQLite database.
- **🌱 Crop Recommendations:** Data-driven suggestions for optimal crop selection based on local conditions.

---

## 🛠️ Setup and Installation (Local Development)

Follow these steps to run the Next.js application locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- `npm` or `yarn` package manager

### 1. Clone the repository
```bash
git clone https://github.com/ankush850/Pahadi-CropSathi.git
cd Pahadi-CropSathi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure your environment:
```env
# Gemini API Key - Get from Google AI Studio (https://aistudio.google.com/)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Local Database URL (Automatically managed by Prisma)
DATABASE_URL="file:./dev.db"

# JWT Secret for Authentication
JWT_SECRET="your_secure_random_secret"
```

### 4. Initialize the Database
Run the following command to push the database schema to your local SQLite file (`dev.db`):
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application running! You will be prompted to create an account and log in.

---

## 🏗️ Project Structure

- `app/` - Next.js App Router files (`page.tsx`, `layout.tsx`, API routes, Authentication pages).
- `app/api/` - REST API endpoints (Auth, Chat, Analysis, Region).
- `components/` - Reusable React components (`RouteGuard`, `ChatBot`, `LocationPanel`, etc.).
- `lib/` - Server-side logic including rate limiting, JWT verification, and Prisma Client.
- `prisma/` - Database schema definition (`schema.prisma`).
- `services/` - AI integration logic (`geminiService.ts`).
- `types.ts` - TypeScript interfaces for strong typing across the app.

---

## 🤝 Contributing

We welcome contributions! If you'd like to contribute, please fork the repository and submit a pull request.

---

## 📄 License & Author

**Author:** Ankush Singh Rawat ([ankush850](https://github.com/ankush850))  
**Email:** ankushsinghrawat154@gmail.com

Developed and maintained by Ankush Singh Rawat. All rights reserved.
