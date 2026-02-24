# 🚀 Getting Started with VS Code

## 📦 Package Contents

คุณได้รับไฟล์ทั้งหมด 6 ไฟล์:

### 📄 เอกสาร
1. **README.md** - ภาพรวมโปรเจค
2. **PROJECT-SUMMARY.md** - สรุปโปรเจคทั้งหมด (อ่านก่อน!)
3. **TECHNICAL-SPECS.md** - Technical details
4. **DEVELOPMENT-ROADMAP.md** - แผนพัฒนา 8-10 สัปดาห์
5. **API-DOCUMENTATION.md** - API endpoints ทั้งหมด
6. **database-schema.sql** - Database schema

### 🎨 Demo
7. **brandmeetcreator-demo-complete.html** - Interactive demo (เปิดใน browser ดูได้เลย)

---

## 🎯 วิธีเริ่มต้น (ทีละขั้น)

### ขั้นที่ 1: เตรียม Environment

#### ติดตั้ง Software
```bash
# 1. Node.js (ต้องมี!)
https://nodejs.org/  
# ดาวน์โหลดเวอร์ชั่น LTS (20.x)

# 2. PostgreSQL (Database)
https://www.postgresql.org/download/
# หรือใช้ Docker: docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

# 3. VS Code
https://code.visualstudio.com/

# 4. Git
https://git-scm.com/
```

#### VS Code Extensions ที่จำเป็น
เปิด VS Code → Extensions (Ctrl+Shift+X) → ค้นหาและติดตั้ง:
- ✅ **ESLint** - dbaeumer.vscode-eslint
- ✅ **Prettier** - esbenp.prettier-vscode
- ✅ **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- ✅ **Prisma** - Prisma.prisma
- ✅ **Thunder Client** - rangav.vscode-thunder-client (ทดสอบ API)
- ✅ **Auto Rename Tag** - formulahendry.auto-rename-tag
- ✅ **ES7+ React Snippets** - dsznajder.es7-react-js-snippets

---

### ขั้นที่ 2: สร้าง Project

#### เปิด Terminal ใน VS Code (Ctrl + `)

```bash
# 1. สร้าง folder หลัก
mkdir brandmeetcreator
cd brandmeetcreator

# 2. Copy ไฟล์ทั้งหมดที่ได้มาไว้ใน folder นี้

# 3. Initialize Git
git init
echo "node_modules/
.env
dist/
build/
uploads/
.DS_Store" > .gitignore

# 4. First commit
git add .
git commit -m "Initial commit with documentation"
```

---

### ขั้นที่ 3: สร้าง Database

```bash
# 1. เปิด PostgreSQL (ถ้าใช้ local)
# Windows: เปิด pgAdmin หรือ SQL Shell
# Mac: psql postgres

# 2. สร้าง Database
psql -U postgres
CREATE DATABASE brandmeetcreator;
\q

# 3. Run Schema
psql -U postgres -d brandmeetcreator -f database-schema.sql

# ตรวจสอบว่าสร้างสำเร็จ
psql -U postgres -d brandmeetcreator
\dt  # ดูตารางทั้งหมด
# ควรเห็น 12 tables
```

---

### ขั้นที่ 4: สร้าง Backend

```bash
# 1. สร้าง folder และ init project
mkdir backend
cd backend
npm init -y

# 2. ติดตั้ง dependencies ทั้งหมด
npm install express typescript @types/express @types/node
npm install dotenv cors helmet express-rate-limit
npm install pg @types/pg
npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt @types/cors
npm install joi multer @types/multer csv-parse
npm install -D nodemon ts-node

# 3. สร้าง tsconfig.json
npx tsc --init

# 4. สร้าง folder structure
mkdir src
mkdir src/config src/middleware src/routes src/controllers src/services src/models src/utils

# 5. สร้าง .env
echo "NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/brandmeetcreator
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173" > .env

# 6. เพิ่ม scripts ใน package.json
# เปิดไฟล์ package.json และเพิ่ม:
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

#### สร้างไฟล์ src/index.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

#### ทดสอบ Backend
```bash
npm run dev
# ควรเห็น: 🚀 Server running on http://localhost:3000

# เปิด browser ไปที่: http://localhost:3000/health
# ควรเห็น: {"status":"OK","timestamp":"..."}
```

---

### ขั้นที่ 5: สร้าง Frontend

```bash
# กลับไปที่ root folder
cd ..  # ออกจาก backend

# 1. สร้าง frontend project ด้วย Vite
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# 2. ติดตั้ง dependencies
npm install react-router-dom zustand axios @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install @headlessui/react framer-motion
npm install recharts date-fns papaparse
npm install -D @types/papaparse

# 3. ติดตั้ง Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. สร้าง .env
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env

# 5. Config Tailwind
# เปิดไฟล์ tailwind.config.js และแก้เป็น:
```

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        secondary: '#ec4899',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

#### src/index.css (เพิ่ม Tailwind directives)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
```

#### ทดสอบ Frontend
```bash
npm run dev
# เปิด browser ไปที่: http://localhost:5173
# ควรเห็นหน้า Vite + React
```

---

### ขั้นที่ 6: เชื่อม Frontend กับ Backend

#### สร้าง Axios Instance (frontend/src/services/api.ts)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Test Connection (frontend/src/App.tsx)
```typescript
import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/health').then(res => {
      setStatus(res.data.status);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary">
        BrandMeetCreator
      </h1>
      <p>API Status: {status}</p>
    </div>
  );
}

export default App;
```

---

## 📚 ลำดับการอ่านเอกสาร

### 1. เริ่มต้น (อ่านก่อน!)
- ✅ **README.md** - Overview
- ✅ **PROJECT-SUMMARY.md** - Context ทั้งหมด (อ่านทั้งหมด!)

### 2. เข้าใจ Technical
- ✅ **TECHNICAL-SPECS.md** - Tech stack, architecture
- ✅ **API-DOCUMENTATION.md** - API endpoints

### 3. เริ่มพัฒนา
- ✅ **DEVELOPMENT-ROADMAP.md** - Follow week by week
- ✅ **database-schema.sql** - Reference when coding

### 4. Demo
- ✅ **brandmeetcreator-demo-complete.html** - เปิดดูได้เลย

---

## 🎯 Workflow แนะนำ

### ทุกวัน
```
เช้า (3-4 ชม):
1. เปิด VS Code
2. git pull (ถ้าทำงานเป็นทีม)
3. อ่าน DEVELOPMENT-ROADMAP.md - Week ปัจจุบัน
4. เลือก task ที่จะทำวันนี้
5. เริ่ม code

บ่าย (3-4 ชม):
1. เขียน tests
2. Commit code
3. Push to GitHub
4. อัพเดท progress
```

### ทุกสัปดาห์
```
จันทร์: 
- Review roadmap สัปดาห์นี้
- วางแผน tasks

ศุกร์:
- Review progress
- Deploy to staging
- วางแผนสัปดาห์หน้า
```

---

## 🛠️ VS Code Tips

### Keyboard Shortcuts
- `Ctrl + P` - Quick open file
- `Ctrl + Shift + P` - Command palette
- `Ctrl + `` - Toggle terminal
- `Ctrl + B` - Toggle sidebar
- `Ctrl + /` - Comment line
- `Alt + Click` - Multiple cursors

### Useful Commands
- `Format Document` - Ctrl+Shift+P → Format
- `Organize Imports` - Shift+Alt+O
- `Rename Symbol` - F2

---

## 📞 เจอปัญหา?

### ปัญหาที่พบบ่อย

#### 1. Database connection failed
```bash
# ตรวจสอบ PostgreSQL running
# Windows: Services → PostgreSQL
# Mac: brew services list

# ตรวจสอบ connection string ใน .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

#### 2. Port already in use
```bash
# Backend (3000)
# Windows: netstat -ano | findstr :3000
# Mac: lsof -i :3000
# Kill process และรันใหม่

# Frontend (5173)
# Same as above แต่เปลี่ยนเป็น 5173
```

#### 3. Module not found
```bash
# ลืม install dependencies
cd backend  # หรือ frontend
npm install
```

#### 4. TypeScript errors
```bash
# Restart TypeScript server
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## ✅ Checklist สำหรับวันแรก

เมื่อทำตามขั้นตอนข้างบนครบแล้ว คุณควรมี:

- [ ] Node.js installed
- [ ] PostgreSQL installed และรันอยู่
- [ ] Database `brandmeetcreator` สร้างแล้ว
- [ ] Tables 12 ตารางใน database
- [ ] VS Code พร้อม extensions
- [ ] Backend project initialized
- [ ] Backend server รันได้ (port 3000)
- [ ] Frontend project initialized
- [ ] Frontend รันได้ (port 5173)
- [ ] Frontend เชื่อม Backend ได้ (/health)
- [ ] Git initialized
- [ ] อ่านเอกสารครบ

---

## 🚀 พร้อมแล้ว!

เมื่อผ่าน checklist ข้างบนครบแล้ว คุณพร้อมที่จะ:

1. **เริ่ม Week 1** ตาม DEVELOPMENT-ROADMAP.md
2. **Follow API-DOCUMENTATION.md** เวลาทำ endpoints
3. **Reference TECHNICAL-SPECS.md** เวลาต้องการ technical details
4. **เปิด Demo HTML** เวลาต้องการดู UI reference

---

**Happy Coding! 🎉**

หากมีคำถาม กลับไปอ่าน:
- PROJECT-SUMMARY.md (Context)
- TECHNICAL-SPECS.md (How to implement)
- DEVELOPMENT-ROADMAP.md (What to do next)
