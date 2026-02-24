# UI/UX Specification - BrandMeetCreator

**Document Version:** 1.0  
**Last Updated:** 2026-01-30  
**Purpose:** Complete UI/UX guide for development team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Navigation Structure](#navigation-structure)
4. [Page Specifications](#page-specifications)
   - [Public Pages](#public-pages)
   - [Brand Pages](#brand-pages)
   - [Creator Pages](#creator-pages)
5. [Component Library](#component-library)
6. [User Flows](#user-flows)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Development Priority](#development-priority)

---

## 🎨 Overview

### Total Page Count
- **Public Pages:** 3
- **Brand Pages:** 7 main pages (simplified navigation)
- **Creator Pages:** 8 main pages
- **Shared Pages:** 2
- **Total:** 20 unique pages

### Design Philosophy
- **Clean & Modern:** Purple/Pink gradient accents
- **Professional:** Card-based layouts
- **Intuitive:** Clear hierarchy and CTAs
- **Responsive:** Mobile-first approach
- **Fast:** Smooth transitions (0.3s)

---

## 🎨 Design System

### Colors
```css
/* Primary Colors */
--primary: #6366f1;           /* Indigo - Main brand color */
--primary-dark: #4f46e5;      /* Darker shade for hover */
--secondary: #ec4899;         /* Pink - Accent color */

/* Status Colors */
--success: #10b981;           /* Green - Success, Approved */
--warning: #f59e0b;           /* Amber - Pending, Warning */
--danger: #ef4444;            /* Red - Error, Rejected */
--info: #3b82f6;              /* Blue - Information */

/* Neutral Colors */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;
--white: #ffffff;
--black: #000000;
```

### Typography
```css
/* Font Families */
font-family-sans: 'Plus Jakarta Sans', sans-serif;
font-family-mono: 'Space Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

---

## 🧭 Navigation Structure

### Brand Sidebar
```
📊 Dashboard
🏢 แคมเปญ
   ├─ ทั้งหมด
   ├─ กำลังดำเนินการ (2)
   ├─ จบแล้ว
   └─ + สร้างใหม่
⚙️ ตั้งค่า
```

**Note:** Creators, Applications, Submissions, Leaderboard, and Payments features are accessible via tabs within each Campaign Detail page.

### Creator Sidebar
```
📊 Dashboard
🔍 หาแคมเปญ
   ├─ ทั้งหมด
   ├─ แนะนำ
   └─ Challenge
📋 แคมเปญของฉัน
   ├─ กำลังทำ (2)
   ├─ รออนุมัติ
   └─ เสร็จแล้ว
💰 รายได้
   ├─ สรุป
   ├─ รางวัลที่ได้
   └─ ประวัติ
👤 โปรไฟล์
⚙️ ตั้งค่า
```

### Top Bar (Both Roles)
```
Left:  [Logo] BrandMeetCreator
Right: [Search] [🔔 Notifications] [👤 Profile Menu]
```

---

## 📄 Page Specifications

## PUBLIC PAGES

### 1. Landing Page
**Route:** `/`  
**Layout:** Full-width, no sidebar

**Sections:**
1. **Hero Section**
   - Headline: "เชื่อมต่อแบรนด์กับครีเอเตอร์"
   - Subheading: สร้างแคมเปญ จ่ายรางวัล ติดตามผล
   - CTAs: [เริ่มใช้งานฟรี] [ดูวิธีใช้งาน]
   - Hero Image/Video

2. **Features Section**
   - 3-4 Feature Cards
   - Icons + Title + Description

3. **How It Works**
   ```
   Brand: สร้างแคมเปญ → รับสมัคร → ตรวจงาน → จ่ายรางวัล
   Creator: สมัคร → ส่งงาน → รับรางวัล
   ```

4. **Benefits**
   - สำหรับแบรนด์: ROI ชัดเจน, จัดการง่าย
   - สำหรับครีเอเตอร์: รายได้มั่นคง, โปร่งใส

5. **CTA Section**
   - [สมัครเป็นแบรนด์] [สมัครเป็นครีเอเตอร์]

6. **Footer**
   - Links, Contact, Social Media

---

### 2. Login Page
**Route:** `/login`  
**Layout:** Centered form

**Elements:**
- Logo
- Title: "เข้าสู่ระบบ"
- Email Input
- Password Input (with show/hide toggle)
- [เข้าสู่ระบบ] Button
- "ลืมรหัสผ่าน?" Link
- "ยังไม่มีบัญชี? [สมัครสมาชิก]" Link

---

### 3. Register Page
**Route:** `/register`  
**Layout:** Centered form

**Step 1: Role Selection** ⭐ สำคัญมาก!
```
┌─────────────────────────────────────┐
│  คุณคือ...                          │
│                                     │
│  ┌──────────┐    ┌──────────┐     │
│  │   🏢     │    │   👤     │     │
│  │  แบรนด์   │    │ ครีเอเตอร์ │     │
│  │          │    │          │     │
│  └──────────┘    └──────────┘     │
└─────────────────────────────────────┘
```

**Step 2: Brand Form**
- Company Name
- Industry
- Email
- Password
- [สมัครสมาชิก]

**Step 3: Creator Form**
- Name
- TikTok Handle
- Instagram Handle (Optional)
- Followers Count
- Categories (Multi-select)
- Email
- Password
- [สมัครสมาชิก]

---

## BRAND PAGES

### 4. Brand Dashboard
**Route:** `/brand/dashboard`  
**Layout:** Sidebar + Content

**Quick Stats (4 Cards)**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ แคมเปญทั้งหมด │ │ Total Creators│ │ งบที่ใช้ไป    │ │ รอตรวจสอบ    │
│      5       │ │      127      │ │  ฿375,000    │ │      23      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Active Campaigns Section**
- Title: "แคมเปญที่กำลังดำเนินการ"
- Campaign Cards (3-5 cards)
  - Image, Title
  - Creators: 97/300
  - Budget: ฿375K/฿500K
  - [ดูรายละเอียด]

**Pending Submissions Section**
- Title: "งานรอตรวจสอบ"
- Submission List (5 items)
  - Creator name, Campaign, Date
  - [ตรวจสอบ]
- [ดูทั้งหมด (23)]

**Recent Activity**
- Timeline of recent actions
  - "5 creators applied to สามสิบ"
  - "12 submissions approved"

---

### 5. Campaigns List
**Route:** `/brand/campaigns`

**Header**
```
Campaigns                                    [+ สร้างแคมเปญใหม่]
```

**Filters & Search**
```
[Search...] [Status: All ▼] [Date: All time ▼] [Budget ▼]
```

**View Toggle**
```
[Grid View 📊] [List View 📋]
```

**Campaign Cards (Grid View)**
```
┌────────────────────────────────────┐
│  [Campaign Image]                  │
│  สามสิบ ตรา คุณสัมฤทธิ์             │
│  🟢 LIVE                            │
│  👥 97/300 creators                 │
│  💰 ฿375K/฿500K                     │
│  📅 26 Jan - 26 Jan 2027           │
│  [ดูรายละเอียด] [แก้ไข]            │
└────────────────────────────────────┘
```

**Status Badges:**
- 🟡 Draft (สีเหลือง)
- 🟢 Live (สีเขียว)
- 🔵 Completed (สีน้ำเงิน)
- 🔴 Cancelled (สีแดง)

---

### 6. Create Campaign ⭐⭐⭐
**Route:** `/brand/campaigns/create`

**Progress Indicator**
```
● ข้อมูลพื้นฐาน  →  ○ โครงสร้างรางวัล  →  ○ สรุป
```

**TAB 1: Basic Info**

```
┌─────────────────────────────────────────────┐
│ 📝 ข้อมูลแคมเปญ                              │
├─────────────────────────────────────────────┤
│                                             │
│ ชื่อแคมเปญ *                                 │
│ [_________________________________]         │
│                                             │
│ คำอธิบาย *                                  │
│ [                                    ]      │
│ [                                    ]      │
│ [                                    ]      │
│                                             │
│ อัปโหลดรูปภาพ                               │
│ [📷 เลือกรูป] หรือลากไฟล์มาวาง              │
│                                             │
│ ประเภทแคมเปญ *                              │
│ ⚪ Single (ส่งครั้งเดียว)                   │
│ ⚪ Challenge (ส่งทุกวัน 365 วัน)            │
│                                             │
│ ระยะเวลา *                                  │
│ วันเริ่ม [📅 26/01/2026]                    │
│ วันสิ้นสุด [📅 26/01/2027]                  │
│ วันประกาศผล [📅 27/01/2027]                 │
│                                             │
│ ข้อกำหนด                                    │
│ จำนวน Creators สูงสุด [300]                │
│ Followers ขั้นต่ำ [10000]                   │
│                                             │
│ Platform *                                  │
│ ☑ TikTok  ☑ Instagram  ☐ YouTube           │
│                                             │
│ Categories *                                │
│ ☑ Beauty  ☑ Health  ☐ Fashion              │
│                                             │
│              [< ยกเลิก] [ถัดไป: รางวัล >]   │
└─────────────────────────────────────────────┘
```

**TAB 2: Reward Structure** ⭐ ฟีเจอร์หลัก

```
┌─────────────────────────────────────────────┐
│ 💰 โครงสร้างรางวัล                          │
├─────────────────────────────────────────────┤
│                                             │
│ งบประมาณรางวัลทั้งหมด                       │
│ ฿ [50,000____________]                      │
│                                             │
│ [🤖 AI Auto Allocation]                     │
│ แบ่งสัดส่วนอัตโนมัติตาม Templates ที่เลือก  │
│                                             │
├─────────────────────────────────────────────┤
│ เลือก Reward Templates                      │
│                                             │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ 💰  │ │ 📹  │ │ 🔥  │ │ 🎲  │ │ 🎁  │   │
│ │Sales│ │Volume│ │Streak│ │Lucky│ │Custom│   │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │
│ [คลิกเพื่อเลือก]                            │
│                                             │
├─────────────────────────────────────────────┤
│ รางวัลที่เพิ่มแล้ว                           │
│                                             │
│ ✅ รางวัลที่ 1: Sales Milestones            │
│    ├─ Top 1: ฿ [8,000]                     │
│    ├─ Top 2: ฿ [5,000]                     │
│    ├─ Top 3: ฿ [3,000]                     │
│    ├─ Top 4: ฿ [2,000]                     │
│    └─ Top 5: ฿ [2,000]                     │
│    [แก้ไข] [ลบ] [↑] [↓]                    │
│                                             │
│ ✅ รางวัลที่ 2: Streak Bonus                │
│    ├─ Streak 10 วัน: สุ่ม [10] × ฿[500]   │
│    └─ Streak 20 วัน: สุ่ม [5] × ฿[1000]   │
│    [แก้ไข] [ลบ] [↑] [↓]                    │
│                                             │
├─────────────────────────────────────────────┤
│ 📊 สรุปงบประมาณ                             │
│                                             │
│ รางวัลที่ 1:        ฿20,000                 │
│ รางวัลที่ 2:        ฿10,000                 │
│ ─────────────────────────                  │
│ รวม:                ฿30,000                 │
│ คงเหลือ:            ฿20,000                 │
│                                             │
│         [< ย้อนกลับ] [ถัดไป: สรุป >]        │
└─────────────────────────────────────────────┘
```

**TAB 3: Content Guidelines (Optional)**

```
┌─────────────────────────────────────────────┐
│ 📋 คำแนะนำการทำคอนเทนต์                     │
├─────────────────────────────────────────────┤
│                                             │
│ ☑ ใช้ Content Guidelines                   │
│                                             │
│ โครงสร้างคอนเทนต์                           │
│ ⚪ กำหนดเอง                                 │
│ ⚪ 5 Steps (Hook→Story→Product→Result→CTA)  │
│                                             │
│ ✅ สิ่งที่ควรพูด (Do's)                     │
│ [+ เพิ่ม] ดูแลผิวทั้งในและนอก [×]           │
│ [+ เพิ่ม] ผิวพิงจากข้างใน [×]              │
│                                             │
│ ❌ สิ่งที่ไม่ควรพูด (Don'ts)                │
│ [+ เพิ่ม] ผิวไม่สม่ำเสมอ [×]               │
│                                             │
│ # Hashtags ที่ต้องใช้                       │
│ [+ เพิ่ม] #ปจด [×] #สามสิบคุณสัมฤทธิ์ [×]  │
│                                             │
│         [< ย้อนกลับ] [ถัดไป: สรุป >]        │
└─────────────────────────────────────────────┘
```

**TAB 4: Review & Publish**

```
┌─────────────────────────────────────────────┐
│ 📋 ตรวจสอบข้อมูลก่อนเผยแพร่                 │
├─────────────────────────────────────────────┤
│                                             │
│ ข้อมูลแคมเปญ                                │
│ ─────────────────                           │
│ ชื่อ: สามสิบ ตรา คุณสัมฤทธิ์                │
│ ประเภท: Challenge (365 วัน)                │
│ ระยะเวลา: 26 Jan 2026 - 26 Jan 2027       │
│ จำนวน Creators: 300 คน                     │
│ Followers: 10,000+                          │
│                                             │
│ โครงสร้างรางวัล                             │
│ ─────────────────                           │
│ รางวัลที่ 1: Sales Milestones (฿20,000)    │
│ รางวัลที่ 2: Streak Bonus (฿10,000)        │
│ รางวัลที่ 3: Lucky Draw (฿5,000)           │
│ รวมงบประมาณ: ฿35,000                        │
│                                             │
│ [< ย้อนกลับแก้ไข]                           │
│                                             │
│ [บันทึกแบบร่าง]     [🚀 เผยแพร่แคมเปญ]     │
└─────────────────────────────────────────────┘
```

---

### 7. Campaign Detail
**Route:** `/brand/campaigns/:id`

**Header Section**
```
┌─────────────────────────────────────────────┐
│ [Campaign Image]                            │
│ สามสิบ ตรา คุณสัมฤทธิ์          [แก้ไข] [ลบ]│
│ 🟢 LIVE                                     │
└─────────────────────────────────────────────┘
```

**Stats Cards**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Creators │ │  Videos  │ │  Reach   │ │  Budget  │
│  97/300  │ │   1,245  │ │  2.1M    │ │ 375K/500K│
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Tabs**
```
[Overview] [Creators (97)] [Applications (23)] [Submissions (1,245)] [Leaderboard] [Rewards] [GMV] [Settings]
```

**Tab: Overview**
- Description
- Timeline
- Requirements
- Content Guidelines

**Tab: Creators**
- List of approved creators
- Stats per creator
- Actions: View profile, Message

**Tab: Applications (23)**
- Pending applications
- Review interface
- Approve/Reject buttons

**Tab: Submissions (1,245)**
- Filter: All/Pending/Approved/Rejected
- Submission cards with video preview
- Quick approve/reject

**Tab: Leaderboard**
- Real-time rankings
- Sortable by: GMV, Volume, Streak
- Top 100 display

**Tab: Rewards**
- View reward structure
- Edit rewards (if campaign not started)
- Calculate rewards button (after campaign ends)

**Tab: GMV**
- Upload CSV interface
- Current GMV data table
- Last updated timestamp

**Tab: Settings**
- Edit campaign details
- Pause/Resume campaign
- End campaign early
- Delete campaign

---

### 8. Applications Review
**Route:** `/brand/applications`

**Filters**
```
Campaign: [All Campaigns ▼]
Status: [Pending ▼]
Sort: [Newest First ▼]
```

**Application Card**
```
┌─────────────────────────────────────────────┐
│ 👤 @beauty_sara                              │
│    Sarah Beauty | 52,300 followers          │
│    📱 TikTok, Instagram                      │
│    🏷️ Beauty, Lifestyle                      │
│                                             │
│ Applied to: สามสิบ ตรา คุณสัมฤทธิ์          │
│ Date: 27 Jan 2026, 14:30                    │
│                                             │
│ Message: "สนใจมากครับ ผมทำคอนเทนต์เกี่ยวกับ..."│
│                                             │
│ Portfolio:                                  │
│ [Video 1] [Video 2] [Video 3]               │
│                                             │
│ Recent Performance:                         │
│ Avg Views: 45K | Avg ER: 7.2%              │
│                                             │
│           [❌ ปฏิเสธ]     [✅ อนุมัติ]       │
└─────────────────────────────────────────────┘
```

---

### 9. Submissions Review
**Route:** `/brand/submissions`

**Filters**
```
Campaign: [All ▼]  Status: [Pending ▼]  Creator: [All ▼]  Date: [All time ▼]
```

**Submission Card**
```
┌─────────────────────────────────────────────┐
│ 👤 @beauty_sara · Day 12                    │
│ Campaign: สามสิบ ตรา คุณสัมฤทธิ์            │
│ Date: 27 Jan 2026, 18:45                    │
│                                             │
│ ┌───────────────────────┐                   │
│ │                       │                   │
│ │   [Video Preview]     │                   │
│ │   TikTok Embed        │                   │
│ │                       │                   │
│ └───────────────────────┘                   │
│                                             │
│ 🔗 Promo Code: https://short.link/abc123    │
│                                             │
│ 📊 Performance (if available):               │
│ Views: 12.5K | Likes: 892 | Comments: 45   │
│                                             │
│ Notes: วันนี้ลองใช้ตอนเช้า รู้สึกดีมาก...   │
│                                             │
│ [💬 ขอแก้ไข] [❌ ปฏิเสธ] [✅ อนุมัติ]      │
└─────────────────────────────────────────────┘
```

**Reject Modal**
```
┌──────────────────────────────┐
│ เหตุผลที่ปฏิเสธ               │
├──────────────────────────────┤
│                              │
│ [_________________________] │
│ [_________________________] │
│                              │
│ ⚠️ Streak จะ Reset           │
│                              │
│ [ยกเลิก]        [ยืนยัน]     │
└──────────────────────────────┘
```

---

### 10. Campaign Analytics/Dashboard
**Route:** `/brand/campaigns/:id/analytics`

**Performance Overview**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Total Reach│Total Engage│   GMV     │Completion │
│   2.1M   │   187K    │  ฿2.45M  │    78%    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Charts**
- Daily Submissions (Line Chart)
- Top 10 Performers (Bar Chart)
- Engagement Over Time (Area Chart)
- Streak Distribution (Pie Chart)

**Leaderboard Preview**
- Top 10 by GMV
- Top 10 by Volume
- Top 10 by Streak

**Export Options**
- [📥 Export PDF Report]
- [📊 Export Excel Data]

---

### 11. Leaderboard
**Route:** `/brand/campaigns/:id/leaderboard`

**Tabs**
```
[GMV Ranking] [Volume Ranking] [Streak Ranking] [Engagement Ranking]
```

**Table**
```
┌──────┬────────────────┬─────────┬─────────┬────────┬──────────┐
│ Rank │ Creator        │   GMV   │ Orders  │ Videos │ Streak   │
├──────┼────────────────┼─────────┼─────────┼────────┼──────────┤
│  🥇  │ @beauty_sara   │ 450,000 │  1,200  │  365   │ 365 🔥   │
│  🥈  │ @skincare_love │ 380,000 │   980   │  350   │ 350 🔥   │
│  🥉  │ @healthy_life  │ 320,000 │   850   │  320   │ 320 🔥   │
│   4  │ @makeup_kanya  │ 280,000 │   720   │  280   │ 280 🔥   │
│   5  │ @natural_pim   │ 250,000 │   650   │  250   │ 250 🔥   │
└──────┴────────────────┴─────────┴─────────┴────────┴──────────┘
```

**Filters**
- Search creator
- Min submissions filter
- Date range

---

### 12. GMV Management
**Route:** `/brand/campaigns/:id/gmv`

**Upload Section**
```
┌─────────────────────────────────────────────┐
│ 📊 Upload GMV Data                          │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │  📂 Drag & Drop CSV file here           │ │
│ │     or                                  │ │
│ │  [เลือกไฟล์]                            │ │
│ │                                         │ │
│ │  รองรับ: .csv, .xlsx                    │ │
│ │  ขนาดไม่เกิน: 10MB                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 📥 [ดาวน์โหลด Template CSV]                 │
│                                             │
│ รูปแบบไฟล์:                                 │
│ creator_id, creator_name, gmv, orders      │
└─────────────────────────────────────────────┘
```

**Current GMV Data**
```
┌─────────────────────────────────────────────┐
│ 📊 GMV Data                                 │
│ Last Updated: 27 Jan 2026, 14:30           │
├─────────────────────────────────────────────┤
│                                             │
│ Total GMV: ฿2,450,000                       │
│ Total Orders: 8,234                         │
│ Total Creators: 97                          │
│                                             │
│ [Table with sortable columns]               │
│ Rank | Creator | GMV | Orders | Updated    │
└─────────────────────────────────────────────┘
```

---

### 13. Payments
**Route:** `/brand/payments`

**Campaign Selector**
```
[Select Campaign: สามสิบ ตรา คุณสัมฤทธิ์ ▼]
```

**Summary**
```
Total Winners: 45
Total Payout: ฿125,000
Status: Pending
```

**Winners Table**
```
┌────────────────┬──────────────────┬──────────┬──────────┬──────────┐
│ Creator        │ Reward Type      │  Amount  │  Status  │ Action   │
├────────────────┼──────────────────┼──────────┼──────────┼──────────┤
│ @beauty_sara   │ Sales Rank 1     │  8,000   │ Pending  │ [จ่ายแล้ว]│
│ @skincare_love │ Sales Rank 2     │  5,000   │ Pending  │ [จ่ายแล้ว]│
│ @healthy_life  │ Streak 20 days   │  1,000   │ Paid ✓   │          │
└────────────────┴──────────────────┴──────────┴──────────┴──────────┘
```

**Bulk Actions**
```
☑ Select All
[Mark as Paid]  [Export CSV]
```

---

## CREATOR PAGES

### 14. Creator Dashboard
**Route:** `/creator/dashboard`

**Welcome Section**
```
👋 สวัสดี, Sarah!
```

**Quick Stats**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Earnings│ This Month   │Active Campaigns│Current Streak│
│   ฿32,400    │   ฿8,200     │       2       │   🔥 12 days │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Active Campaigns**
```
┌─────────────────────────────────────────────┐
│ สามสิบ ตรา คุณสัมฤทธิ์                      │
│ 🔥 Day 12/365 | Streak: 12 days            │
│ ⏰ Next Deadline: Today 23:59 (18:30:00)    │
│                                             │
│ Progress: ████████░░░░░░░░░░░░ 3%          │
│                                             │
│ Your Rank: #4 GMV | #12 Volume             │
│                                             │
│                    [📤 ส่งงานวันนี้]        │
└─────────────────────────────────────────────┘
```

**Potential Rewards**
```
💰 รางวัลที่คุณอาจได้รับ
├─ Sales Milestone Rank 4: ~฿2,000
├─ Streak 20 days: 50% chance (อีก 8 วัน)
└─ Lucky Draw: ~10% chance
```

**Recommended Campaigns**
```
🔍 แคมเปญแนะนำสำหรับคุณ
[3 Campaign Cards matching creator profile]
```

---

### 15. Browse Campaigns
**Route:** `/creator/campaigns`

**Search & Filters**
```
[Search campaigns...] 🔍

Filters:
Platform: ☑ TikTok ☑ Instagram ☐ YouTube
Category: ☑ Beauty ☐ Fashion ☐ Food
Followers: [Any ▼]
Budget: [฿10,000 - ฿500,000]
Type: ☐ Single ☑ Challenge

Sort: [Newest ▼]
```

**Campaign Cards (Grid)**
```
┌────────────────────────────────────┐
│  [Campaign Image]                  │
│  สามสิบ ตรา คุณสัมฤทธิ์             │
│  by Brand Name                     │
│                                    │
│  💰 Budget: ฿500,000               │
│  👥 97/300 creators                │
│  📅 365 days                        │
│  🏷️ 10K+ followers                 │
│                                    │
│  ⭐ Rewards: 5 types                │
│                                    │
│         [ดูรายละเอียด]              │
└────────────────────────────────────┘
```

**Match Badge**
```
✅ คุณเหมาะสมกับแคมเปญนี้
```

---

### 16. Campaign Detail (Creator View)
**Route:** `/creator/campaigns/:id`

**Header**
```
┌─────────────────────────────────────────────┐
│ [Campaign Image]                            │
│ สามสิบ ตรา คุณสัมฤทธิ์                      │
│ by [Brand Logo] Brand Name                  │
│                                             │
│ 💰 Budget: ฿500,000                         │
│ 👥 97/300 creators                          │
│ 📅 26 Jan 2026 - 26 Jan 2027               │
│                                             │
│              [📝 สมัครเข้าร่วม]             │
└─────────────────────────────────────────────┘
```

**Eligibility Check**
```
✅ คุณมีคุณสมบัติครบตามที่กำหนด
   ✓ TikTok account: @beauty_sara
   ✓ Followers: 52,300 (ต้องการ 10,000+)
   ✓ Category: Beauty ✓
```

**OR**

```
❌ คุณยังไม่มีคุณสมบัติครบ
   ✓ TikTok account: @new_creator
   ✗ Followers: 8,500 (ต้องการ 10,000+)
   ✓ Category: Beauty ✓
```

**Tabs**
```
[Overview] [Requirements] [Rewards] [Content Guidelines] [Leaderboard]
```

**Tab: Overview**
- Full description
- Campaign timeline
- Brand information

**Tab: Requirements**
- Platforms
- Minimum followers
- Categories
- Submission frequency
- Minimum submissions (if any)

**Tab: Rewards**
```
💰 โครงสร้างรางวัล

รางวัลที่ 1: Sales Milestones
├─ Top 1: ฿8,000
├─ Top 2: ฿5,000
├─ Top 3: ฿3,000
├─ Top 4: ฿2,000
└─ Top 5: ฿2,000

รางวัลที่ 2: Top Volume
├─ Top 1: ฿6,000
├─ Top 2: ฿4,000
└─ Top 3-5: ฿1,500 each

รางวัลที่ 3: Streak Bonus (สุ่ม)
├─ Streak 10 days: สุ่ม 10 คน × ฿500
└─ Streak 20 days: สุ่ม 5 คน × ฿1,000

รางวัลที่ 4: Lucky Draw
└─ ขั้นต่ำ 10 คลิป: สุ่ม 10 คน × ฿500

รางวัลที่ 5: Custom (พิเศษ)
└─ iPhone 17 Pro สำหรับยอดขาย 1 ล้าน

⚠️ รางวัลทั้งหมดจ่ายหลังจบแคมเปญ (27 ม.ค. 2570)
```

**Tab: Content Guidelines**
```
📋 โครงสร้างคอนเทนต์ (5 Steps)

1. Hook (เปิดเรื่อง หยุดนิ้ว)
   เริ่มต้นด้วยคำถามหรือข้อความที่ดึงดูดความสนใจ

2. Story (เล่าประสบการณ์)
   แชร์ประสบการณ์จริงที่เกี่ยวข้อง

3. Product Intro (แนะนำสินค้า)
   บอกว่าสินค้าช่วยอย่างไร

4. Result (ผลลัพธ์)
   แสดงการเปลี่ยนแปลง

5. CTA (ชวนให้ลอง)
   ชวนดูลิงก์แบบนุ่มนวล

✅ สิ่งที่ควรพูด:
• ดูแลผิวทั้งในและนอก
• ผิวพิงจากข้างใน

❌ สิ่งที่ไม่ควรพูด:
• ผิวไม่สม่ำเสมอ โทรมง่าย
• เน้นข้างในแค่ตัวเดียว

# Hashtags:
#ปจด #สามสิบคุณสัมฤทธิ์ #วันนี้นของเดือน
```

**Tab: Leaderboard**
- Current rankings (if joined)
- Top performers

---

### 17. My Campaigns
**Route:** `/creator/my-campaigns`

**Tabs**
```
[กำลังทำ (2)] [รออนุมัติ (1)] [เสร็จแล้ว (3)]
```

**Active Campaign Card**
```
┌─────────────────────────────────────────────┐
│ สามสิบ ตรา คุณสัมฤทธิ์                      │
│ Status: 🟢 Active                           │
│                                             │
│ 📅 Day 12/365                               │
│ 🔥 Streak: 12 days                          │
│ 📹 Videos: 12 (Approved: 12)                │
│ 💰 GMV: ฿280,000                            │
│                                             │
│ Current Ranks:                              │
│ GMV: #4 | Volume: #12 | Streak: #8         │
│                                             │
│ ⏰ Next Deadline: Today 23:59 (18:30:00)    │
│                                             │
│ [📤 ส่งงานวันนี้]  [📊 ดูสถิติ]  [ℹ️ รายละเอียด]│
└─────────────────────────────────────────────┘
```

---

### 18. Campaign Workspace ⭐⭐⭐
**Route:** `/creator/campaigns/:id/workspace`

**Layout: Sidebar + Main Content**

**Left Sidebar (Fixed)**
```
┌──────────────────────────┐
│ Campaign Info            │
├──────────────────────────┤
│ สามสิบ ตรา คุณสัมฤทธิ์   │
│ Day 12/365              │
│                          │
│ My Stats                 │
│ ├─ Videos: 12           │
│ ├─ Approved: 12         │
│ ├─ Streak: 🔥 12        │
│ └─ GMV: ฿280,000        │
│                          │
│ Current Ranks            │
│ ├─ GMV: #4              │
│ ├─ Volume: #12          │
│ └─ Streak: #8           │
│                          │
│ Potential Rewards        │
│ ├─ Sales Rank 4: ฿2K    │
│ ├─ Streak 20: 50%       │
│ └─ Lucky: 10%           │
└──────────────────────────┘
```

**Main Content**
```
┌─────────────────────────────────────────────┐
│ 📤 Today's Submission                       │
├─────────────────────────────────────────────┤
│                                             │
│ ⏰ Time Remaining: 18:30:00                 │
│                                             │
│          [📹 ส่งงานวันนี้]                  │
│                                             │
├─────────────────────────────────────────────┤
│ 📊 Milestones Progress                      │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Day 10 (Completed) - ฿500                │
│ 🎯 Day 20 (8 days to go)                   │
│    ████████░░░░░░░░░░ 60%                   │
│ ⭕ Day 30 (18 days to go)                   │
│ ⭕ Day 100                                   │
│                                             │
├─────────────────────────────────────────────┤
│ 📝 Recent Submissions                       │
├─────────────────────────────────────────────┤
│                                             │
│ Day 12 - ✅ Approved (27 Jan, 18:45)        │
│ Day 11 - ✅ Approved (26 Jan, 19:20)        │
│ Day 10 - ✅ Approved (25 Jan, 20:15)        │
│                                             │
│ [ดูทั้งหมด]                                 │
└─────────────────────────────────────────────┘
```

**Content Guidelines Panel (Collapsible/Sticky)**
```
📋 Content Guidelines
[Show/Hide]

5 Steps Structure
1. Hook...
2. Story...
...
```

---

### 19. Submit Work Modal
**Triggered from:** Campaign Workspace or My Campaigns

```
┌─────────────────────────────────────────────┐
│ 📤 ส่งงาน - Day 13                          │
│ สามสิบ ตรา คุณสัมฤทธิ์                      │
├─────────────────────────────────────────────┤
│                                             │
│ Video URL * (TikTok/Instagram)              │
│ [https://tiktok.com/@sara/video/12345]     │
│                                             │
│ Promo Code Link (Shorten URL)               │
│ [https://short.link/abc123]                │
│                                             │
│ Notes (Optional)                            │
│ [วันนี้ลองใช้ตอนเช้า...]                   │
│                                             │
│ Submission Date                             │
│ [📅 27 Jan 2026] (Auto-filled)             │
│                                             │
│ ⚠️ หากส่งงานเกินเที่ยงคืน Streak จะรีเซ็ต   │
│                                             │
│         [ยกเลิก]        [✅ ส่งงาน]         │
└─────────────────────────────────────────────┘
```

**Success Message**
```
┌──────────────────────────────┐
│ ✅ ส่งงานสำเร็จ!              │
├──────────────────────────────┤
│ งานของคุณอยู่ระหว่างตรวจสอบ  │
│                              │
│ 📅 วันพรุ่งนี้ส่งก่อน 23:59  │
│                              │
│ 🔥 Streak: 13 days           │
│                              │
│         [ปิด]                │
└──────────────────────────────┘
```

---

### 20. My Submissions
**Route:** `/creator/submissions`

**Filters**
```
Campaign: [All ▼]  Status: [All ▼]  Date: [All time ▼]
```

**Submission Card**
```
┌─────────────────────────────────────────────┐
│ สามสิบ ตรา คุณสัมฤทธิ์ - Day 12             │
│ Date: 27 Jan 2026, 18:45                    │
│ Status: ⏳ Pending Review                    │
│                                             │
│ ┌─────────────────┐                         │
│ │ [Video Preview] │                         │
│ └─────────────────┘                         │
│                                             │
│ 🔗 https://short.link/abc123                │
│                                             │
│ Notes: วันนี้ลองใช้ตอนเช้า...               │
│                                             │
│ [ดูรายละเอียด]                              │
└─────────────────────────────────────────────┘
```

**Status Badges:**
- ⏳ Pending Review (สีเหลือง)
- ✅ Approved (สีเขียว)
- ❌ Rejected (สีแดง)
- 💬 Revision Requested (สีส้ม)

**If Rejected:**
```
Status: ❌ Rejected
Reason: คุณภาพวิดีโอไม่ชัด กรุณาถ่ายใหม่ในที่แสงสว่าง
⚠️ Streak ถูกรีเซ็ต
```

---

### 21. Earnings Dashboard
**Route:** `/creator/earnings`

**Summary Cards**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Total Earnings│  This Month  │   Pending    │  Available   │
│   ฿32,400   │    ฿8,200    │    ฿1,500    │   ฿30,900   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Tabs**
```
[Overview] [History] [Rewards Won]
```

**Tab: Overview**
- Earnings Chart (Bar chart by month)
- Breakdown by campaign
- Projected earnings (from active campaigns)

**Tab: History**
```
┌──────────┬──────────────────────────┬───────────┬──────────┐
│   Date   │      Description         │   Amount  │  Status  │
├──────────┼──────────────────────────┼───────────┼──────────┤
│ 28 Jan   │ สามสิบ - Sales Rank 4    │  ฿2,000   │  Paid ✓  │
│ 28 Jan   │ Beauty - Streak 10 days  │  ฿500     │  Paid ✓  │
│ 15 Jan   │ Makeup - Top Volume #3   │  ฿1,500   │  Paid ✓  │
└──────────┴──────────────────────────┴───────────┴──────────┘
```

**Tab: Rewards Won**
```
Campaign: สามสิบ ตรา คุณสัมฤทธิ์
├─ Sales Milestone Rank 4: ฿2,000 (Paid ✓)
├─ Streak 10 days: ฿500 (Paid ✓)
└─ Lucky Draw: ฿500 (Pending)

Campaign: Beauty Challenge
├─ Top Volume Rank 3: ฿1,500 (Paid ✓)
```

---

### 22. Creator Profile
**Route:** `/creator/profile`

**Edit Form**
```
┌─────────────────────────────────────────────┐
│ 👤 โปรไฟล์                                  │
├─────────────────────────────────────────────┤
│                                             │
│ [Avatar Upload]                             │
│                                             │
│ Name *                                      │
│ [Sarah Beauty]                              │
│                                             │
│ Bio                                         │
│ [Beauty & Skincare Enthusiast...]          │
│                                             │
│ TikTok Handle *                             │
│ [@beauty_sara]                              │
│                                             │
│ Instagram Handle                            │
│ [@beautyxsara]                              │
│                                             │
│ Followers (TikTok)                          │
│ [52,300]                                    │
│                                             │
│ Categories *                                │
│ ☑ Beauty  ☑ Lifestyle  ☐ Fashion           │
│                                             │
│ Bank Account (สำหรับรับเงิน)                │
│ Bank: [ธนาคารกสิกรไทย ▼]                   │
│ Account Number: [XXX-X-XXXXX-X]            │
│ Account Name: [Sarah Beauty]               │
│                                             │
│              [บันทึก]                       │
└─────────────────────────────────────────────┘
```

---

### 23. Settings
**Route:** `/settings` (Both Brand & Creator)

**Tabs**
```
[Account] [Notifications] [Privacy] [Security]
```

**Tab: Account**
- Email
- Password change
- Language preference (TH/EN)

**Tab: Notifications**
```
Email Notifications
☑ Application approved/rejected
☑ Submission reviewed
☑ Reward won
☑ Payment sent
☑ Campaign ending soon
☐ Marketing emails

Push Notifications (if mobile app)
☑ Daily submission reminder
☑ Streak about to break
```

**Tab: Security**
- Two-factor authentication
- Active sessions
- Login history

**Tab: Privacy**
- Profile visibility
- Data export
- Delete account

---

## 🔔 Shared Components

### 24. Notifications Panel
**Triggered from:** Top bar bell icon

```
┌─────────────────────────────────────────────┐
│ 🔔 Notifications                   [Mark all read]│
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Application Approved                      │
│    Your application to "สามสิบ" was approved│
│    2 hours ago                              │
│                                             │
│ ✅ Submission Approved                       │
│    Day 12 submission approved               │
│    5 hours ago                              │
│                                             │
│ 🎉 Reward Won!                              │
│    You won Sales Rank 4 - ฿2,000           │
│    1 day ago                                │
│                                             │
│ ⏰ Reminder                                  │
│    Submit today's work before 23:59         │
│    Today, 20:00                             │
│                                             │
│ [View All (15)]                             │
└─────────────────────────────────────────────┘
```

---

## 🧩 Component Library

### Layout Components

#### `<Sidebar>`
**Props:**
- `role: 'brand' | 'creator'`
- `activeItem: string`

**Features:**
- Collapsible on mobile
- Badge counts (pending items)
- Nested menu items
- Smooth transitions

---

#### `<TopBar>`
**Props:**
- `user: User`
- `notifications: Notification[]`

**Features:**
- Search (optional)
- Notification dropdown
- Profile menu
- Responsive logo

---

#### `<PageHeader>`
**Props:**
- `title: string`
- `breadcrumb?: string[]`
- `actions?: ReactNode`

```tsx
<PageHeader 
  title="Campaigns" 
  breadcrumb={['Home', 'Campaigns']}
  actions={<Button>Create New</Button>}
/>
```

---

### Card Components

#### `<CampaignCard>`
**Props:**
- `campaign: Campaign`
- `variant: 'grid' | 'list'`
- `onAction?: () => void`

**Features:**
- Image with gradient overlay
- Status badge
- Progress indicators
- Action buttons

---

#### `<StatsCard>`
**Props:**
- `title: string`
- `value: string | number`
- `icon?: ReactNode`
- `trend?: 'up' | 'down' | 'neutral'`
- `color?: string`

```tsx
<StatsCard 
  title="Total Campaigns"
  value={5}
  icon={<CampaignIcon />}
  trend="up"
  color="primary"
/>
```

---

#### `<SubmissionCard>`
**Props:**
- `submission: Submission`
- `showActions?: boolean`
- `onApprove?: () => void`
- `onReject?: () => void`

**Features:**
- Video embed (TikTok/IG)
- Performance metrics
- Action buttons
- Status badge

---

### Form Components

#### `<CampaignForm>`
**Multi-step form with:**
- Tab navigation
- Form validation (Zod)
- Auto-save (draft)
- Progress indicator

---

#### `<RewardBuilder>`
**Features:**
- Template selection
- Configuration forms per template
- Real-time budget calculation
- Drag to reorder
- AI allocation integration

---

#### `<SubmissionForm>`
**Fields:**
- Video URL (with validation)
- Promo code link
- Notes
- Date picker

---

### Data Display

#### `<LeaderboardTable>`
**Props:**
- `data: LeaderboardEntry[]`
- `sortBy: 'gmv' | 'volume' | 'streak'`
- `showMedals?: boolean`

**Features:**
- Sortable columns
- Medal icons for top 3
- Pagination
- Export button

---

#### `<StreakDisplay>`
**Props:**
- `days: number`
- `showFire?: boolean`
- `size?: 'sm' | 'md' | 'lg'`

```tsx
<StreakDisplay days={12} showFire={true} size="lg" />
// Output: 🔥 12 days
```

---

#### `<BudgetSummary>`
**Props:**
- `rewards: Reward[]`
- `totalBudget: number`

**Features:**
- Breakdown by reward type
- Total calculation
- Remaining budget
- Warning if over budget

---

### Modals

#### `<AIAllocationModal>`
**Features:**
- Loading state (calculating)
- Result display
- Reasoning explanation
- Apply/Cancel buttons

---

#### `<ConfirmDialog>`
**Props:**
- `title: string`
- `message: string`
- `confirmText?: string`
- `onConfirm: () => void`
- `variant: 'info' | 'warning' | 'danger'`

---

#### `<SubmitWorkModal>`
Full submission form in modal format

---

## 🔄 User Flows

### Brand Flow: Create Campaign
```
1. Dashboard
2. Click "สร้างแคมเปญใหม่"
3. Fill Basic Info (Tab 1)
4. Configure Rewards (Tab 2)
   a. Enter budget
   b. Click AI Auto Allocation (optional)
   c. Review suggestions
   d. Adjust as needed
5. Add Content Guidelines (Tab 3, optional)
6. Review Summary (Tab 4)
7. Click "เผยแพร่"
8. Success! Campaign is LIVE
```

---

### Creator Flow: Join & Submit
```
1. Browse Campaigns
2. Click campaign card
3. View details (tabs)
4. Check eligibility (auto)
5. Click "สมัครเข้าร่วม"
6. Wait for approval (notification)
7. Approved! Go to "My Campaigns"
8. Click "ส่งงานวันนี้"
9. Fill submission form
10. Submit
11. Wait for review
12. Get notification (approved/rejected)
13. Check streak status
14. Repeat daily
```

---

### Brand Flow: Review & Pay
```
1. Get notification: "23 submissions pending"
2. Go to Submissions Review
3. Click submission card
4. Watch video
5. Check promo code link
6. Decision:
   - Approve: Click ✅
   - Reject: Click ❌ → Enter reason
7. Submission processed
8. Stats updated
9. Campaign ends
10. Go to GMV Management
11. Upload final CSV
12. Go to Rewards
13. Click "Calculate Rewards"
14. Review winners
15. Click "Announce Winners"
16. Go to Payments
17. Process payments
18. Mark as paid
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

### Layout Adjustments

**< 768px (Mobile)**
- Sidebar → Hamburger menu
- Grid → Single column
- Cards → Full width
- Tables → Horizontal scroll or cards
- Hide some columns

**768px - 1023px (Tablet)**
- Sidebar → Collapsible
- Grid → 2 columns
- Cards → 2 per row

**≥ 1024px (Desktop)**
- Fixed sidebar
- Grid → 3-4 columns
- Cards → 3-4 per row
- Full table display

---

## 🎯 Development Priority

### Phase 1: MVP Core (Weeks 1-6) ⭐⭐⭐

**Week 1-2: Authentication & Layout**
1. Login page
2. Register page (with role selection)
3. Sidebar component (both roles)
4. TopBar component
5. Dashboard layout

**Week 3-4: Brand Campaign Management**
6. Brand Dashboard
7. Create Campaign (full flow)
8. Campaigns List
9. Campaign Detail
10. Application Review

**Week 5-6: Creator Core Flow**
11. Creator Dashboard
12. Browse Campaigns
13. Campaign Detail (creator view)
14. My Campaigns
15. Submit Work modal

---

### Phase 2: Advanced Features (Weeks 7-8)

**Week 7: Review & Analytics**
16. Submissions Review (brand)
17. My Submissions (creator)
18. Campaign Workspace
19. Leaderboard
20. GMV Upload

**Week 8: Rewards & Payments**
21. Reward Calculation
22. Winners Display
23. Payments Management
24. Earnings Dashboard

---

### Phase 3: Polish & Enhancement (Weeks 9-10)

**Week 9: Testing & Refinement**
- Notifications system
- Settings pages
- Error handling
- Loading states
- Mobile responsive fixes

**Week 10: Launch Prep**
- Performance optimization
- Analytics integration
- Help/FAQ pages
- Landing page polish

---

## 📝 Design Checklist

### For Each Page
- [ ] Desktop layout designed
- [ ] Mobile layout designed
- [ ] Loading states defined
- [ ] Empty states defined
- [ ] Error states defined
- [ ] Success messages defined
- [ ] Responsive breakpoints tested
- [ ] Accessibility checked (WCAG AA)
- [ ] Color contrast verified
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### For Each Component
- [ ] Props interface defined
- [ ] Default props set
- [ ] Variants documented
- [ ] Examples provided
- [ ] Responsive behavior defined
- [ ] Accessibility attributes added
- [ ] Loading state handled
- [ ] Error state handled

---

## 🎨 Animation Guidelines

### Transitions
```css
/* Standard transition for interactive elements */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Quick transition for hover effects */
transition: transform 0.2s ease;

/* Slow transition for complex animations */
transition: all 0.5s ease-in-out;
```

### Common Animations
- **Hover:** `transform: translateY(-4px)`
- **Active:** `transform: scale(0.95)`
- **Slide In:** `translateX(-100%) → translateX(0)`
- **Fade In:** `opacity: 0 → opacity: 1`
- **Card Entrance:** Stagger delay (0.1s increment)

---

## 🔍 Accessibility Requirements

### Required Attributes
```html
<!-- All interactive elements -->
<button aria-label="Close modal">×</button>

<!-- Form inputs -->
<input aria-required="true" aria-invalid="false" />

<!-- Status messages -->
<div role="alert" aria-live="polite">Success!</div>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>
```

### Keyboard Navigation
- Tab: Focus next element
- Shift+Tab: Focus previous
- Enter/Space: Activate button
- Escape: Close modal/dropdown
- Arrow keys: Navigate lists/menus

### Screen Reader Support
- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- ARIA labels for icons
- Skip links for navigation
- Focus management in modals
- Announce dynamic content changes

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-30  
**Next Review:** Start of Phase 2

---

## 📞 Questions or Clarifications?

If any page specification is unclear:
1. Check TECHNICAL-SPECS.md for implementation details
2. Refer to brandmeetcreator-demo-complete.html for UI reference
3. Review DEVELOPMENT-ROADMAP.md for step-by-step guide

**Happy Building!** 🚀
