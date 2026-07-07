<div align="center">
  <h1 align="center">🌾 Pahadi CropSathi (Agri AI)</h1>
  <p align="center">
    <strong>An Intelligent, Multi-Lingual Agricultural Assistant Platform</strong><br>
    Powered by Next.js, Google Gemini, Leaflet, and Prisma
  </p>
</div>

---

## 🌟 About The Project

**Pahadi CropSathi** (formerly Agri AI) is a cutting-edge agricultural intelligence platform designed to empower farmers and agricultural professionals with data-driven insights. By combining computer vision, geospatial analysis, and natural language processing, this tool transforms traditional farming practices into smart, sustainable agriculture.

### 🚀 Tech Stack

- **Frontend Framework:** Next.js 14+ (App Router), React, Tailwind CSS
- **Database & ORM:** SQLite + Prisma ORM
- **Maps & Geospatial:** Leaflet, Leaflet Geoman (Free & Open Source, replacing Mapbox)
- **Artificial Intelligence:** Google Gemini API (`@google/genai`) using `gemini-1.5-flash`

---

## ✨ Key Features

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
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
# Gemini API Key - Get from Google AI Studio (https://aistudio.google.com/)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Local Database URL (Automatically managed by Prisma)
DATABASE_URL="file:./dev.db"
```
*(Note: Mapbox is no longer required as the project now uses free Leaflet maps!)*

### 4. Initialize the Database
Run the following command to push the database schema to your local SQLite file (`dev.db`):
```bash
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application running!

---

## 🏗️ Project Structure

- `app/` - Next.js App Router files (`page.tsx`, `layout.tsx`, API routes).
- `app/api/` - REST API endpoints connecting the frontend to the Prisma database.
- `components/` - Reusable React components (ChatBot, LocationPanel, etc.).
- `prisma/` - Database schema definition (`schema.prisma`).
- `services/` - AI integration logic (`geminiService.ts`).
- `types.ts` - TypeScript interfaces for strong typing across the app.

---

## 🤝 Contributing

We welcome contributions! If you'd like to contribute, please fork the repository and submit a pull request.

---

## 📄 License

Developed and maintained by Ankush Singh Rawat. All rights reserved.
