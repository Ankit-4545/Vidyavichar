# VidyaVichar

A simple MERN stack classroom sticky-note Q&A board.

## Run locally

1. Start MongoDB (local or Atlas).
2. Backend
   - cd backend
   - copy .env.example to .env and edit MONGODB_URI
   - npm install
   - npm run dev
3. Frontend
   - cd frontend
   - npm install
   - npm start

API is served at http://localhost:5000 by default; frontend runs on http://localhost:3000.

## Notes
- Duplicate prevention is simple: exact text duplicates blocked.
- You can extend with authentication, websocket updates, and analytics.
