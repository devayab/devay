# devay.se

Webbplats för [Devay AB](https://www.devay.se) — ett IT-konsultbolag i Karlskrona.

## Teknikstack

- Vanilla HTML/CSS/JS — ingen build-pipeline
- GitHub Pages (repo: `devayab/devay`) — automatisk deploy vid push till `main`
- Cloudflare — DNS och CDN framför GitHub Pages
- Domän: `devay.se` (apex) och `www.devay.se`

## Struktur

```
site/
├── index.html              # Startsidan (hero, tjänster, om oss, case, kontakt)
├── integritetspolicy/
│   └── index.html          # Integritetspolicy (GDPR)
├── css/
│   └── style.css           # All styling
├── js/                     # Vanilla JS (scroll, animationer m.m.)
├── images/                 # Bilder (WebP + PNG fallbacks)
├── fonts/                  # Lokalt hostade typsnitt
├── CNAME                   # GitHub Pages custom domain → devay.se
├── robots.txt
└── sitemap.xml
```

## Lokalt

Kör en lokal server från `site/`-mappen:

```bash
python3 -m http.server 8000
# Öppna http://localhost:8000
```

## Deploya

```bash
# Pusha till produktion (devayab/devay)
git push prod main

# Pusha till test (origin)
git push origin main
```

Remotes:
- `origin` — testrepo
- `prod` — `https://github.com/devayab/devay` (live på devay.se)

## Kontakt

Young Fogelström · young.fogelstrom@devay.se · 0708-119 983
