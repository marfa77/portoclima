# Porto Clima — landing + quiz (Porto mobile AC)

Teste de procura antes da operação (fevereiro 2026). Static Astro → GitHub Pages → domínio `.pt`.

## Stack

- Astro 7 + Tailwind 4
- i18n: `/` PT · `/en/` EN (`src/i18n/*.json`)
- Quiz rule-based: `src/lib/quiz.ts` + `src/data/models.json`
- Formspree waitlist + WhatsApp CTA
- Plausible (config in `src/data/site.ts`)

## Antes do launch

Editar `src/data/site.ts`:

- `formspreeId` — criar form em [formspree.io](https://formspree.io)
- `whatsapp` — número PT
- `plausibleDomain` — ou desactivar
- `domain` / `public/CNAME` — domínio final

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

GitHub Pages → Settings → Source: **GitHub Actions**  
Workflow: `.github/workflows/deploy.yml`

Ver `../shared/docs/deploy-github-pages.md`

## UTM

`?utm_source=threads&utm_medium=social` — gravado em sessionStorage e enviado no form.

## Métricas

Plausible events: `Quiz Complete`, `Waitlist Submit`
