<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" width="80" height="80" alt="Logo" />
  <h1 align="center">🌾 Pahadi CropSathi (Agri AI)</h1>
  <p align="center">
    <strong>An Intelligent, Multi-Lingual Agricultural Intelligence & Machine Learning Platform</strong><br>
    Powered by Next.js, TensorFlow ML Models, ONNX Runtime, Google Gemini, and Prisma
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
    <img src="https://img.shields.io/badge/ONNX_Runtime-00599C?style=for-the-badge&logo=onnx&logoColor=white" alt="ONNX Runtime" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  </div>
</div>

---

## 🌟 About The Project

**Pahadi CropSathi** is an advanced agricultural intelligence platform built for mountain and field farmers. It combines offline machine learning neural networks, computer vision, geospatial mapping, and generative AI to provide real-time crop recommendations, disease diagnostics, and weed density analysis.

---

## 📸 Application Screenshots

<div align="center">
  <img src="./assest/Screenshot.png" width="45%" alt="Dashboard" />
  <img src="./assest/Screenshot%201.png" width="45%" alt="Feature Module" />
  <br><br>
  <img src="./assest/Screenshot%202.png" width="45%" alt="Plant Scanner" />
  <img src="./assest/Screenshot%203.png" width="45%" alt="Crop Recommender" />
  <br><br>
  <img src="./assest/Screenshot%204.png" width="45%" alt="Arecanut Diagnostic" />
  <img src="./assest/Screenshot%205.png" width="45%" alt="Weed Density Scanner" />
</div>

---

## 📐 System Architecture

```mermaid
graph TD
    subgraph Frontend["React & Next.js UI Layer"]
        UI["Pahadi CropSathi Web Dashboard"]
        CR_UI["🌱 Crop Recommender Component"]
        AN_UI["🌴 Arecanut Diagnostic Component"]
        CD_UI["🌾 Crop & Weed Scanner Component"]
        MAP_UI["🗺️ Leaflet Satellite Map Component"]
    end

    subgraph API["Next.js App Router API Services"]
        REC_API["/api/recommendation"]
        ARE_API["/api/ai/arecanut"]
        CROP_API["/api/ai/crop-detection"]
        REG_API["/api/ai/region"]
    end

    subgraph ML_Engine["100% Local ML Microservice (Python FastAPI / Node.js)"]
        GNB["Native TS Naive Bayes Engine (99.50% Acc)"]
        LOCAL_SRV["FastAPI Server (http://127.0.0.1:8080)"]
        TF_AREC["TensorFlow Arecanut Model (models/1)"]
        ONNX_WEED["ONNX Weed Segmentation (352x480)"]
    end

    subgraph External_DB["Database & AI Services"]
        GEMINI["Google Gemini Server API"]
        DB[(SQLite Database / dev.db)]
    end

    UI --> CR_UI & AN_UI & CD_UI & MAP_UI
    CR_UI --> REC_API --> GNB
    AN_UI --> ARE_API --> LOCAL_SRV --> TF_AREC
    CD_UI --> CROP_API --> LOCAL_SRV --> ONNX_WEED
    MAP_UI --> REG_API --> GEMINI
    REC_API & ARE_API & CROP_API & REG_API --> DB
```

---

## 🗄️ Database ER Diagram (Prisma + SQLite)

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ SESSION : has
    USER ||--o{ PLANT_ANALYSIS : creates
    USER ||--o{ CHAT_MESSAGE : sends
    USER ||--o{ COMMUNITY_POST : publishes

    USER {
        string id PK
        string name
        string email UK
        string image
        string password
        datetime createdAt
    }

    PLANT_ANALYSIS {
        string id PK
        string userId FK
        string plantName
        string diseaseName
        float confidence
        float severity
        string treatments
        boolean isHealthy
        string soilTypeRecommendation
        datetime createdAt
    }

    REGION_ANALYSIS {
        string id PK
        string soilPotential
        string climateSuitability
        string waterSources
        string overallRating
        string coordinates
        datetime createdAt
    }

    CHAT_MESSAGE {
        string id PK
        string userId FK
        string role
        string text
        datetime createdAt
    }

    COMMUNITY_POST {
        string id PK
        string author
        string title
        string content
        int likes
        int comments
    }

    MARKET_PRICE {
        string id PK
        string name
        float currentPrice
        string location
    }

    RATE_LIMIT {
        string ip PK
        int count
        datetime expiresAt
    }
```

---

## ✨ Integrated Machine Learning Modules & Accuracy

| Module Name | Model Architecture | Accuracy / Performance | Execution Mode |
| :--- | :--- | :--- | :--- |
| **🌱 ML Crop Recommender** | Gaussian Naive Bayes Classifier (`lib/cropRecommender.ts`) | **99.50% Test Accuracy** (2,189 / 2,200 dataset samples) | **100% In-Memory Local TypeScript** |
| **🌴 Arecanut Palm Disease Diagnostic** | TensorFlow Neural Network (`arecanut-detector/models/1`) | **Multi-Class Disease Diagnosis** (Fruit Rot / Koleroga, Stem Bleeding, Healthy) | **100% Offline Python Microservice** |
| **🌾 Field Crop & Weed Density Detector** | ONNX Semantic Segmentation (`lib/crop_weed_model.onnx`) | **Canopy Ratio & ExG Index** (Crop % vs Weed % vs Soil %) | **100% Offline Python Microservice** |
| **🔬 AI Plant Health Scanner** | Multimodal Vision AI (`lib/geminiServer.ts`) | **Comprehensive Diagnostics & Treatment Plans** | **Server API Endpoint** |

---

## 🌴 Directory Tree Structure

```
Pahadi-CropSathi/
├── app/                        # Next.js App Router (Pages & API Routes)
│   ├── api/
│   │   ├── ai/
│   │   │   ├── analyse/        # Plant Health Gemini Scanner
│   │   │   ├── arecanut/       # Arecanut Local Model Proxy
│   │   │   ├── crop-detection/ # Field Crop & Weed Local Model Proxy
│   │   │   └── region/         # Regional Analysis Endpoint
│   │   ├── auth/               # JWT Registration & Login Routes
│   │   └── recommendation/     # ML Crop Recommendation Endpoint
│   ├── layout.tsx              # Root Layout with Navigation & Footer
│   └── page.tsx                # Main Agricultural Intelligence Dashboard
├── assest/                     # Application Interface Screenshots & Assets
├── components/                 # Reusable React Components
│   ├── ArecanutDiagnostic.tsx  # Arecanut Palm Disease Diagnostic UI
│   ├── CropDetectionScanner.tsx# Field Crop & Weed Density Scanner UI
│   ├── CropRecommender.tsx     # ML Crop Recommendation UI
│   ├── ChatBot.tsx             # Interactive AgriBot Assistant
│   ├── LocationPanel.tsx       # Leaflet Satellite Map Component
│   └── Navbar.tsx              # Navigation & Language Switcher
├── lib/                        # Machine Learning Models & Utils
│   ├── arecanutData.ts         # Arecanut Disease Knowledge Database
│   ├── cropRecommender.ts      # Native TS Gaussian Naive Bayes Engine
│   ├── crop_model.json         # Precomputed Naive Bayes Parameters
│   ├── crop_weed_model.onnx    # Converted ONNX Model (352x480)
│   ├── geminiServer.ts         # Google Gemini Server AI Service
│   ├── prisma.ts               # Prisma ORM Singleton Instance
│   └── rate-limit.ts           # IP Rate Limiting Service
├── scripts/                    # Offline ML Microservice
│   ├── local_inference_server.py # FastAPI Server (Port 8080)
│   └── evaluate_nb_pure.py     # Accuracy Evaluation Script (99.50%)
├── crop-recommender/           # Crop Dataset & Model Artifacts
│   ├── Crop_recommendation.csv # 2,200 Agricultural Soil/Weather Samples
│   └── model.pkl               # Python Pickle Model Binary
├── arecanut-detector/          # Trained TensorFlow Model
│   └── models/1/               # SavedModel Directory (saved_model.pb)
├── crop-detection/             # Trained Neural Network
│   └── models/                 # Model Checkpoint (model_352x480_3_30.hd5)
├── prisma/                     # Database Configuration
│   ├── dev.db                  # Local SQLite Database
│   └── schema.prisma           # Prisma Data Schema
├── README.md                   # Comprehensive Project Documentation
└── package.json                # Project Dependencies & Scripts
```

---

## 🛠️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Python 3.10+](https://www.python.org/) with `pip`

### 1. Clone the repository
```bash
git clone https://github.com/ankush850/Pahadi-CropSathi.git
cd Pahadi-CropSathi
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install Python Machine Learning Dependencies
```bash
pip install fastapi uvicorn onnxruntime tensorflow pillow numpy
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secure_random_secret"
GITHUB_ID="your_github_oauth_id"
GITHUB_SECRET="your_github_oauth_secret"
```

### 5. Initialize Database
```bash
npx prisma db push
npx prisma generate
```

### 6. Start the Local ML Microservice (Terminal 1)
```bash
python scripts/local_inference_server.py
```
*(Runs 100% offline on `http://127.0.0.1:8080` for local model predictions)*

### 7. Start the Next.js Web Application (Terminal 2)
```bash
npm run dev
```

Open `http://localhost:3000` in your web browser!

---

## 📄 License & Author

**Author:** Ankush Singh Rawat ([ankush850](https://github.com/ankush850))  
**Email:** ankushsinghrawat154@gmail.com

Developed and maintained by Ankush Singh Rawat. All rights reserved.
