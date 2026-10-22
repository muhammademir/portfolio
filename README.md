# Portfolio — Muhammad Emir Fadlyanto

Web portfolio fullstack dengan admin panel untuk manage project, experience, dan sertifikat.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Auth:** NextAuth.js (Google + Credentials)
- **Database & Storage:** Supabase
- **Deploy:** Vercel

---

## Setup

### 1. Clone & Install
```bash
git clone <repo>
cd portfolio
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**, jalankan isi file `supabase-schema.sql`
3. Salin **Project URL** dan **anon key** dari Settings > API

### 3. Isi .env.local
```bash
cp .env.local.example .env.local
```
Lalu isi semua value di `.env.local`

### 4. Jalankan
```bash
npm run dev
```

---

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx                    # Halaman publik utama
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── api/auth/[...nextauth]/     # NextAuth handler
│   └── admin/
│       ├── layout.tsx              # Admin layout (protected)
│       ├── page.tsx                # Dashboard
│       ├── login/page.tsx          # Halaman login
│       ├── projects/page.tsx       # Manage projects
│       ├── experience/page.tsx     # Manage experience
│       └── certificates/page.tsx  # Upload sertifikat
│
├── components/
│   ├── public/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── hero/Hero.tsx
│   │   ├── about/About.tsx
│   │   ├── skills/Skills.tsx
│   │   ├── experience/Experience.tsx
│   │   ├── projects/Projects.tsx
│   │   ├── certificates/Certificates.tsx
│   │   └── contact/Contact.tsx
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── shared/
│       └── Providers.tsx
│
├── lib/
│   ├── supabase.ts                 # Supabase client
│   └── utils.ts                   # cn() utility
│
└── types/
    └── index.ts                    # TypeScript types
```

---

## Deploy ke Vercel
1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan semua environment variables dari `.env.local`
4. Update Google OAuth redirect URI ke domain Vercel kamu
