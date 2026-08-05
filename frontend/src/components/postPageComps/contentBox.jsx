import styles from "./contentBox.module.css";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';

export default function ContentBox({ sectionName="", readTime="", currentSection="", totalSections="", content="" }) {
const markdown = `
# Tech-Archive


## Prerequisites

- Node.js 18+
- npm

Local Setup Guide

# Ubuntu
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb tech_archive_dev

### 3. Run

Open two terminals:


# Terminal 1 — Backend (port 4000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
VITE_API_URL=http://localhost:4000 npx vite --host

`;
console.log(content);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentHeader}>
        <div className={styles.subsectionTitle}>
          Overview
        </div>
        <div className={styles.readTimeAndSecNum}>
          11 minutes read | Section 1 of 6
        </div>
        </div>
        <div className={styles.content}>
        <Markdown remarkPlugins={[remarkGfm]}>
        {content}
        </Markdown>
        </div>
      </div>
    </>
  );
}
