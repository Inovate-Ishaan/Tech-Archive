# Tech-Archive

### Login
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-57-52" src="https://github.com/user-attachments/assets/d6b6a1ef-7657-464a-9846-a58009dc5a92" />

---

### Feed
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-58-25" src="https://github.com/user-attachments/assets/f3aa7faf-c53c-4783-99ab-2926d27c5be8" />

---

### Post
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-59-52" src="https://github.com/user-attachments/assets/30978092-e317-4cfd-8423-19f01440d11e" />

---

### Search filters
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-58-46" src="https://github.com/user-attachments/assets/5640bfb6-b8c7-4649-b9b3-842f4de9055b" />

---

### Uploading the Project
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 12-00-52" src="https://github.com/user-attachments/assets/b983a94d-64f0-459f-a241-e734b2b8d217" />
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 12-02-07" src="https://github.com/user-attachments/assets/591ca7d7-6fe2-4612-acdf-88f960e98a3f" />
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 12-01-14" src="https://github.com/user-attachments/assets/7e2c5d79-1499-4475-90b7-505d3a9a0341" />

---

### User Profile
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-59-13" src="https://github.com/user-attachments/assets/f007e92b-8c5a-4aae-9e12-a944d17bcc94" />
<img width="2960" height="1778" alt="Screenshot from 2026-09-05 11-59-26" src="https://github.com/user-attachments/assets/1f8b4a9a-a720-41af-88e3-7cb7edb72bba" />

---

---

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
- `BREVO_API_KEY`=""
- `EMAIL_FROM`="pawanteja626@gmail.com"

### 3. Run

Open two terminals:


# Terminal 1 — Backend (port 4000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
VITE_API_URL=http://localhost:4000 npx vite --host
