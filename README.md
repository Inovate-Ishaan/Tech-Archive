# Tech-Archive


## Prerequisites

- Node.js 18+
- PostgreSQL running on `localhost:5432` (or a cloud DB — see below)
- npm

## Local PostgreSQL Setup

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb tech_archive_dev

# Create user (optional, or use postgres superuser)
sudo -u postgres psql -c "CREATE USER your_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE tech_archive_dev TO your_user;"
```

Then set `DATABASE_URL` in `backend/.env` to:
```
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/tech_archive_dev?schema=public"
```

### Cloud DB (alternative)

You can use any remote Postgres provider (Neon, Supabase, Railway, Aiven). Get the connection string and set it as `DATABASE_URL` in `.env`. The setup commands remain the same.

## Setup

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

Edit `backend/.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a random secret for signing tokens
- `BREVO_API_KEY` — uncomment and set for real email delivery (optional for dev)

### 3. Run

Open two terminals:


# Terminal 1 — Backend (port 4000)
cd backend
node index.js

# Terminal 2 — Frontend (port 5173)
cd frontend
VITE_API_URL=http://localhost:4000 npx vite --host
