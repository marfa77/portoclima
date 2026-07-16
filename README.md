# Porto Clima — landing (Porto mobile AC)

Turnkey portable AC installs in Porto and within 100 km. Static Astro → GitHub Pages → climaporto.pt.

## Stack

- Astro 7 + Tailwind 4
- i18n: `/` PT · `/en/` EN (`src/i18n/*.json`)
- Model data: `src/data/models.json`
- Formspree install request form + email CTA (`contacto@climaporto.pt`)
- WhatsApp CTA gated behind `whatsappEnabled` in `src/data/site.ts` (off until real number)
- Plausible (config in `src/data/site.ts`)

## Before launch

Edit `src/data/site.ts`:

- `formspreeId` — create form at [formspree.io](https://formspree.io)
- `whatsapp` + `whatsappEnabled: true` — when a real PT mobile number is ready
- `plausibleDomain` — or disable
- `domain` / `public/CNAME` — final domain

## Dev

```bash
npm install
npm run dev
```

Or background mode per project docs: `astro dev --background`

## Build

```bash
npm run build
npm run preview
```

## Deploy

GitHub Pages → Settings → Source: **GitHub Actions**  
Workflow: `.github/workflows/deploy.yml`

## UTM

`?utm_source=threads&utm_medium=social` — stored in sessionStorage and sent with the form.

## Analytics

Plausible events: `Request Submit`
