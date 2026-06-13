# Tech-Archive

Full-stack auth app for IIT Bhilai with email OTP verification and JWT-based sessions.

## Prerequisites

- Node.js 18+
- PostgreSQL running on `localhost:5432`
- npm

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/Inovate-Ishaan/Tech-Archive.git
cd Tech-Archive

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a random secret for signing tokens
- `BREVO_API_KEY` — uncomment and set for real email delivery (optional for dev)

### 3. Run

Open two terminals:

```bash
# Terminal 1 — Backend (port 4000)
cd backend
node index.js

# Terminal 2 — Frontend (port 5173)
cd frontend
VITE_API_URL=http://localhost:4000 npx vite --host
```

### 4. Use

- **Register** at `http://localhost:5173/register` — account created, OTP sent
- **Verify OTP** — enter the 6-digit code (check browser console or terminal for dev code)
- **Login** at `http://localhost:5173/login` — email + password, no OTP (direct sign-in)
- **Seed user**: `seed@iitbhilai.ac.in` / `password123`

### Email in development

Without `BREVO_API_KEY`, the app uses Ethereal (fake SMTP). The OTP code is printed in:
- Backend terminal: `[DEV] OTP for ...: XXXXXX`
- Browser console (F12): `[DEV] OTP code: XXXXXX`
- Ethereal preview URL returned in the request-otp API response