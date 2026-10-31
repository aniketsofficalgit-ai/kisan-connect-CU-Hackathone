# 🌾 KISAN CONNECT
### Smart Agricultural Waste Management & Recycling Platform
**Tagline:** *Turning Farm Waste into Valuable Resources.*

---

**Team Name:** CLOVER GUARDIAN  
**Team Members:** Prakhar, Ayush, Raj, Aniket Dubey  

---

## 📖 1. Project Overview

**Kisan Connect** is a full-stack agritech web platform engineered to eliminate stubble burning, minimize rural pollution, restore soil microbiome health, and unlock additional income streams for Indian farmers.

The platform directly bridges the gap between agricultural producers who have farm residues (paddy stubble, wheat husk, livestock manure, discarded drip plastics, and horticulture trimmings) and industrial recyclers—including biomass power plants, bio-briquette manufacturers, certified vermicompost producers, and authorized plastic recycling facilities.

### 🌟 Core Highlights
- **Role-Based Workflows:** Tailored experiences for **Farmers**, **Recycling Partners / Waste Collectors**, and **Platform Administrators**.
- **Live Waste Marketplace:** Real database-backed listings with categories, quantities (kg/quintals/tonnes), photos, location, and price.
- **Partner Discovery & Interactive Map:** Geolocation and category filtering of verified aggregators with direct pickup booking.
- **Complete Collection Tracking:** 7-stage lifecycle (`Pending` &rarr; `Accepted` &rarr; `Scheduled` &rarr; `Picked Up` &rarr; `Completed`, plus `Rejected`/`Cancelled`) with status history timelines.
- **Kisan AI Assistant:** Built-in intelligent chatbot equipped with agricultural waste expertise, partner matching from real database entries, bilingual English & Hindi support, and microphone speech-to-text voice recognition.
- **Bilingual Interface:** Instant switching between English and Hindi (`हिन्दी`) across key components, navigation, and assistant responses.

---

## 🏗️ 2. Modular Architecture & Folder Structure

The project strictly follows a modular, feature-oriented structure where each domain has its own dedicated components, styles, services, and backend endpoints.

```text
KISAN-CONNECT/
│
├── frontend/                               # React 19 + Vite + TailwindCSS Frontend
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── favicon.svg
│   │   └── logo.png
│   │
│   └── src/
│       ├── components/                     # Reusable shared components
│       │   ├── Navbar/                     # Role-aware navbar with language switcher
│       │   ├── Footer/                     # Team Clover Guardian credits & helpline
│       │   ├── Sidebar/                    # Responsive dashboard sidebar
│       │   ├── Loading/                    # Leaf spinner animation
│       │   └── Notifications/              # Real-time bell & dropdown
│       │
│       ├── context/
│       │   ├── AuthContext.jsx             # Authentication state & JWT session management
│       │   └── LanguageContext.jsx         # English & Hindi bilingual dictionary
│       │
│       ├── features/                       # Modular feature domains
│       │   ├── home/                       # Landing page, Hero, FeatureCards, Impact
│       │   ├── authentication/             # Login, Signup, Auth.css, authService
│       │   ├── farmer-dashboard/           # Real farmer stats, listings, and activities
│       │   ├── waste-management/           # AddWaste, WasteList, WasteDetails, wasteService
│       │   ├── partner-discovery/          # FindPartners, PartnerDetails, Leaflet PartnerMap
│       │   ├── collection-tracking/        # TrackingTimeline, CollectionRequests, Details
│       │   ├── recycling-education/        # RecyclingGuide, WasteCategories, Details
│       │   ├── partner-dashboard/          # Inbound requests, open feed, profile editor
│       │   ├── admin-dashboard/            # Metrics, partner verification, user moderation
│       │   ├── ai-assistant/               # Chatbot, ChatWindow, VoiceInput, chatbotService
│       │   ├── notifications/              # NotificationList, notificationService
│       │   └── user-profile/               # UserProfile, EditProfile, security
│       │
│       ├── services/
│       │   ├── api.js                      # Axios instance with JWT interceptor
│       │   └── authGuard.jsx               # Protected route role authorization guard
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx               # Central router linking all feature pages
│       │
│       ├── assets/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend/                                # Python Flask Modular Backend
│   ├── app/
│   │   ├── auth/                           # JWT auth routes, service, models
│   │   ├── farmers/                        # Farmer statistics, dashboard, listings
│   │   ├── waste_management/               # Category listings, CRUD, image uploads
│   │   ├── partners/                       # Recycler directory, operations, stats
│   │   ├── collections/                    # Request lifecycle & timeline tracking
│   │   ├── ai_assistant/                   # Kisan AI Assistant, Gemini API & prompt engine
│   │   ├── notifications/                  # User notification dispatch & state
│   │   ├── admin/                          # Platform analytics & partner approvals
│   │   ├── recycling/                      # Educational guides for 6 waste categories
│   │   ├── database/                       # SQLAlchemy connection, models, auto-seed
│   │   └── __init__.py                     # Flask application factory & blueprint registry
│   │
│   ├── uploads/                            # Stored waste listing photos
│   ├── config.py                           # Configuration & database fallback resolver
│   ├── requirements.txt                    # Python dependencies
│   └── run.py                              # Server launcher (Port 5000)
│
├── .env.example                            # Sample environment variables
├── .gitignore
├── README.md
├── docker-compose.yml
├── run_dev.bat                             # One-click Windows Command Prompt dev launcher
└── start.ps1                               # One-click PowerShell dev launcher
```

---

## 👥 3. Pre-Seeded Demo Accounts (One-Click Testing)

The database automatically seeds realistic demo data on initial launch so all workflows can be tested immediately:

| Role | Name / Organization | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Prakhar Admin | `admin@kisanconnect.com` | `Admin@123` | Full access to approve partners, moderate listings, and view analytics. |
| **Farmer** | Ramesh Kumar | `ramesh@kisanconnect.com` | `Farmer@123` | Ludhiana, Punjab &bull; 12.5 acres &bull; Active Paddy Straw & Plastic listings. |
| **Farmer** | Suresh Patel | `suresh@kisanconnect.com` | `Farmer@123` | Anand, Gujarat &bull; 8 acres &bull; Completed Dairy Manure collection. |
| **Farmer** | Aniket Dubey | `aniket@kisanconnect.com` | `Farmer@123` | Karnal, Haryana &bull; 15 acres &bull; Clean Wheat Straw listing. |
| **Partner** | Raj Renewable Biomass | `greenbio@kisanconnect.com` | `Partner@123` | Approved Biomass Plant &bull; Procures paddy straw at ₹240/qtl. |
| **Partner** | Ayush Compost Solutions| `ecocompost@kisanconnect.com` | `Partner@123`| Approved Organic Composter &bull; Procures cattle dung manure. |
| **Partner** | Clover Clean Recyclers | `agriplastic@kisanconnect.com` | `Partner@123`| Approved CPCB Plastic Recycler &bull; Procures drip pipes at ₹22/kg. |
| **Partner** | SunPower Bio-Energy | `cloverpower@kisanconnect.com` | `Partner@123`| *Pending approval* &bull; Use to test Admin approval workflow! |

*Note: The login page includes convenient one-click buttons to instantly prefill demo credentials.*

---

## ⚡ 4. Installation & Quick Start

### Prerequisites
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** (Tested on Node.js v24)
- **MySQL** (Optional: the backend automatically uses SQLite if MySQL is not configured or running locally).

### Option A: One-Click Launch (Windows)
Run either script from the project root:
```powershell
.\start.ps1
```
or double click `run_dev.bat`.

---

### Option B: Manual Step-by-Step Launch

#### 1. Backend Setup
```bash
cd backend

# Create and activate virtual environment (if not already created)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask backend (runs on http://localhost:5000)
python run.py
```

#### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open your browser at **http://localhost:5173**.

---

## 🤖 5. Kisan AI Assistant Integration

The **Kisan AI Assistant** is accessible via a floating action button on every page and provides:
1. **Agricultural Waste Identification:** Farmers can describe their waste (e.g. "I have 500 kg of rice straw, what should I do?") and receive immediate recycling guidance.
2. **Real Partner Discovery:** Queries the database for actual registered partners in the farmer's area (e.g. "Find someone who collects paddy straw near me").
3. **Price & Valuation Guidance:** Gives realistic market ranges without fabricating fake numbers.
4. **Voice Recognition:** Web Speech API microphone dictation in English and Hindi.
5. **Google Gemini LLM Integration:** If `GEMINI_API_KEY` is provided in `.env`, the assistant calls Gemini 1.5 Flash grounded with live database context. If omitted or offline, our built-in agricultural knowledge engine handles responses seamlessly.

---

## 🌿 6. Six Core Waste Streams

1. **Crop Residue & Paddy Stubble:** Mechanized baling, biomass briquettes, PUSA bio-decomposer.
2. **Straw & Husk (Bhusa):** Clean fuel pellets for industrial boilers and paper manufacturing.
3. **Organic Farm & Vegetable Waste:** Aerobic composting, vermicomposting, and bio-fertilizer.
4. **Animal Manure & Dairy Slurry:** Compressed Biogas (CBG/Bio-CNG) and enriched organic manure (FOM).
5. **Agricultural Plastics:** Drip lateral pipes and mulch film collection for authorized CPCB polymer recycling.
6. **Other Agricultural Byproducts:** Coconut coir pith, sugarcane bagasse, and mushroom substrates.

---

## 🏆 Team Credits
Developed with pride by **CLOVER GUARDIAN**:
- **Prakhar**
- **Ayush**
- **Aniket Dubey**
