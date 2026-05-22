# GuideHost

> SaaS con abbonamento mensile per creare guide interattive digitali per proprietà Airbnb.

---

## Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 16.2.6 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Pagamenti | Stripe |
| Email | Resend |
| Deploy | Vercel |

---

## Struttura Progetto

```
airbnb-guide/
├── app/
│   ├── (auth)/                    # Route group auth (no sidebar)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── dashboard/                 # Area protetta proprietario
│   │   ├── layout.tsx             # Shell: sidebar + topbar
│   │   ├── page.tsx               # Overview / home
│   │   ├── properties/
│   │   │   ├── page.tsx           # Lista proprietà
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── guides/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Editor drag & drop
│   │   │       └── preview/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── qr-codes/page.tsx
│   │   └── settings/
│   │       ├── page.tsx           # Profilo utente
│   │       └── billing/page.tsx   # Stripe billing
│   ├── g/[slug]/page.tsx          # Guida pubblica ospiti (no auth)
│   ├── api/
│   │   ├── stripe/webhook/route.ts
│   │   ├── guides/views/route.ts
│   │   └── auth/callback/route.ts
│   ├── globals.css                # Design system completo
│   ├── layout.tsx                 # Root layout (Inter font + metadata)
│   └── page.tsx                   # Landing page pubblica
│
├── components/
│   ├── ui/                        # Componenti base riusabili
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Spinner.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── StatCard.tsx
│   │   └── PropertyCard.tsx
│   ├── editor/
│   │   ├── SectionList.tsx        # Lista sezioni drag & drop
│   │   ├── SectionEditor.tsx      # Editor della sezione attiva
│   │   ├── MobilePreview.tsx      # Anteprima mobile in tempo reale
│   │   └── sections/              # Un componente per tipo sezione
│   │       ├── WifiSection.tsx
│   │       ├── WelcomeSection.tsx
│   │       ├── RulesSection.tsx
│   │       ├── FaqSection.tsx
│   │       └── ...
│   └── guide/                     # Componenti vista pubblica ospite
│       ├── GuideHeader.tsx
│       ├── SectionCard.tsx
│       └── sections/
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts              # Client server-side (cookies)
│   │   └── client.ts              # Client browser-side
│   ├── stripe/
│   │   └── client.ts              # Stripe server client + piani
│   └── utils.ts                   # cn(), generateSlug(), formatDate()...
│
├── types/
│   └── index.ts                   # TypeScript types globali
│
├── supabase/
│   └── schema.sql                 # Schema DB + RLS policies + triggers
│
├── middleware.ts                   # Protezione /dashboard/* + session refresh
└── .env.local                     # Variabili d'ambiente (non committare)
```

---

## Modello di Business

| Piano | Prezzo | Proprietà | Sezioni | Analytics |
|---|---|---|---|---|
| Free | €0/mese | 1 | 5 | ❌ |
| Pro | €9/mese | 5 | ∞ | ✅ Base |
| Business | €29/mese | ∞ | ∞ | ✅ Avanzato |

Trial gratuito di 14 giorni su piano Pro.

---

## Database Schema (Supabase)

```
profiles         → estende auth.users (piano, stripe_customer_id)
properties       → proprietà di ogni host
guides           → una guida per proprietà (tema, colore, pubblicata)
guide_sections   → sezioni modulari ordinate (content: jsonb)
guide_views      → analytics visite (per paese, per data)
```

Tutte le tabelle hanno **Row Level Security (RLS)** attiva.
Le guide pubblicate sono leggibili da chiunque senza auth.

---

## Tipi di Sezione

| Tipo | Label | Emoji |
|---|---|---|
| `welcome` | Benvenuto | 👋 |
| `wifi` | Wi-Fi | 📶 |
| `checkin` | Check-in / Check-out | 🔑 |
| `rules` | Regole della casa | 📋 |
| `how_to` | Come funziona... | ⚙️ |
| `map` | Mappa e dintorni | 📍 |
| `recommendations` | Consigli locali | ⭐ |
| `emergency` | Contatti di emergenza | 🚨 |
| `faq` | Domande frequenti | ❓ |
| `gallery` | Galleria foto | 🖼️ |
| `checkout_checklist` | Checklist partenza | ✅ |
| `custom` | Sezione personalizzata | 📝 |

---

## Comandi

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Lint
npm run lint
```

---

## Variabili d'Ambiente

Copia `.env.local` e compila con le tue credenziali:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Setup Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor** e incolla il contenuto di `supabase/schema.sql`
3. Abilita **Google OAuth** in Authentication → Providers
4. Copia URL e chiavi in `.env.local`

---

## Setup Stripe

1. Crea prodotti e prezzi su [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crea due prezzi ricorrenti: Pro (€9/mese) e Business (€29/mese)
3. Copia i Price ID in `.env.local`
4. Configura webhook endpoint: `https://tuodominio.com/api/stripe/webhook`

---

## Route Principali

| URL | Descrizione | Auth |
|---|---|---|
| `/` | Landing page | No |
| `/login` | Login | No |
| `/signup` | Registrazione | No |
| `/dashboard` | Overview | ✅ |
| `/dashboard/properties` | Lista proprietà | ✅ |
| `/dashboard/guides/[id]` | Editor guida | ✅ |
| `/dashboard/analytics` | Analytics | ✅ |
| `/dashboard/settings/billing` | Piano e fatture | ✅ |
| `/g/[slug]` | Guida pubblica ospiti | No |
