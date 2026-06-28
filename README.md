# Pahadi CropSathi

AI-powered agricultural advisory chatbot for farmers and field supervisors.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI (Python)
- Database: MongoDB
- Authentication: Firebase
- AI: Gemini API

## How to run backend locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   ```
   
   Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and update the values if needed:
   ```bash
   cp .env.example .env
   ```

5. Make sure MongoDB is running locally on port 27017.

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

7. The API will be available at http://localhost:8000
   - API documentation (Swagger UI): http://localhost:8000/docs
   - Alternative docs (ReDoc): http://localhost:8000/redoc

## API Endpoints

### Crops

- `POST /api/crops/` - Create a new crop
- `GET /api/crops/` - List all crops
- `GET /api/crops/{crop_id}` - Get a single crop by ID
- `PUT /api/crops/{crop_id}` - Update a crop
- `DELETE /api/crops/{crop_id}` - Delete a crop
- `GET /api/crops/search` - Search/filter crops by name, category, or planting season
