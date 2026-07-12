# Tech-Archive


## Prerequisites

- Node.js 18+
- PostgreSQL running on `localhost:5432` (or a cloud DB — see below)
- npm

Local Setup Guide

# Ubuntu
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb tech_archive_dev

# Create user
sudo -u postgres psql -c "CREATE USER your_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE tech_archive_dev TO your_user;"
```

Then set `DATABASE_URL` in `backend/.env` to:
```
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/tech_archive_dev?schema=public"
```

# Setup


### 1. Clone and install dependencies

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

## copy the BREVO_API_KEY and EMAIL_FROM given below and setup your own JWT_SECRET & DATABASE_URL

Edit `backend/.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a random secret for signing tokens
- `BREVO_API_KEY`="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"
- `EMAIL_FROM`="pawanteja626@gmail.com"

### 3. Run

Open two terminals:


# Terminal 1 — Backend (port 4000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
VITE_API_URL=http://localhost:4000 npx vite --host
