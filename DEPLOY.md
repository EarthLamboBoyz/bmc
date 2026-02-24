# 🚀 Deployment Guide

## Quick Start (Docker)

### 1. ตั้งค่า Environment Variables

```bash
cp .env.example .env
# แก้ไข .env ให้ตรงกับ production environment ของคุณ
```

### 2. Deploy

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# หรือ Windows (PowerShell)
./deploy.ps1
```

หรือใช้ Docker Compose โดยตรง:

```bash
# Build and start
docker-compose up -d --build

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Manual Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Nginx (สำหรับ frontend)

### Backend Deployment

```bash
cd backend

# Install dependencies
npm ci --only=production

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start
npm start
```

### Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci

# Build with production API URL
VITE_API_URL=https://your-api.com/api npm run build

# Copy dist folder to web server
# หรือใช้ Nginx, Apache, หรือ static host เช่น Vercel
```

---

## Cloud Deployment

### Railway.app (แนะนำ)

1. Fork project ไปยัง GitHub
2. Connect Railway กับ GitHub
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### Render.com (Backend)

1. Connect GitHub repository
2. Select backend folder
3. Set build command: `npm ci && npm run build`
4. Set start command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | ✅ |
| `CORS_ORIGIN` | Frontend domain | ✅ |
| `VITE_API_URL` | API URL for frontend | ✅ |
| `CLOUDINARY_*` | Cloudinary credentials | ✅ |
| `PORT` | Backend port (default: 3001) | ❌ |

---

## Troubleshooting

### Database connection failed
- ตรวจสอบ `DATABASE_URL` ให้ถูกต้อง
- ตรวจสอบว่า PostgreSQL รันอยู่
- ตรวจสอบ firewall rules

### CORS error
- ตรวจสอบ `CORS_ORIGIN` ต้องตรงกับ frontend domain
- อย่าลืม `https://` สำหรับ production

### Build failed
- ตรวจสอบ Node.js version (ต้อง >= 18)
- ลบ `node_modules` และติดตั้งใหม่

---

## SSL/HTTPS

ใช้ Cloudflare หรือ Let's Encrypt:

```bash
# Let's Encrypt with Certbot
sudo certbot --nginx -d your-domain.com
```

หรือใช้ Cloudflare Tunnel สำหรับ development:

```bash
cloudflare tunnel --url http://localhost:3001
```
