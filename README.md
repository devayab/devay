# devay.se

Webbplats för [Devay AB](https://www.devay.se) — ett IT-konsultbolag i Karlskrona.

## Teknikstack

- Vanilla HTML/CSS/JS — ingen build-pipeline
- GitHub Pages (repo: `devayab/devay`) — automatisk deploy vid push till `main`
- Cloudflare — DNS (nameservers delegerade från GoDaddy, proxy avstängd)
- GoDaddy — domänregistrar för devay.se
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

## Git-flöde

Branches:
- `dev` — här jobbar vi. Allt nytt committas här först.
- `main` — det som ligger live. Committa aldrig direkt här, merga bara från `dev`.

Remotes:
- `prod` — `https://github.com/devayab/devay` (live på devay.se)
- `origin` — gammalt testrepo (devaytech), används ej aktivt

## Deploy — så hamnar ändringar på devay.se

**Kort sagt: en `git push` av `main` till `prod` ÄR deployen.** Det finns ingen
build-server, inget CI och inget att ladda upp manuellt.

### Hur det hänger ihop

```
din dator (dev)  →  merge  →  din dator (main)  →  git push prod main
                                                          │
                                                          ▼
                                          GitHub: devayab/devay, branch main
                                                          │  GitHub Pages publicerar
                                                          ▼  automatiskt (ca 1–2 min)
                                          devay.se  (DNS via Cloudflare → GitHub Pages)
```

- GitHub Pages i repot `devayab/devay` är inställt på *Deploy from a branch*:
  `main`, rotmappen `/`. Varje push till `main` publicerar om hela sajten.
- Filerna serveras exakt som de ligger i repot (ingen byggprocess), så det du
  ser på `http://localhost:8000` är det som hamnar live.
- `CNAME`-filen talar om för GitHub Pages att sajten heter `devay.se`.
  **Ta aldrig bort den** — då tappar sajten sin domän.
- `www.devay.se` skickas automatiskt vidare till `devay.se`.

### Steg för steg

```bash
cd site

# 1. Se till att allt är committat på dev
git checkout dev
git status                 # ska säga "arbetskatalogen ren"

# 1b. Ändrat css/style.css eller js/main.js? Höj versionen (se "Cache" nedan)

# 2. Testa lokalt
python3 -m http.server 8000   # öppna http://localhost:8000, klicka runt, Ctrl+C när klar

# 3. Se vad som kommer gå live (commits på dev som inte finns på prod)
git fetch prod
git log --oneline prod/main..dev

# 4. Deploya
git checkout main
git merge dev
git push prod main

# 5. Tillbaka till dev
git checkout dev
```

### Cache — höj versionen när CSS/JS ändras

GitHub Pages låter webbläsare cacha filer i 10 minuter. Om HTML och JS ändras
samtidigt kan en besökare få ny HTML men gammal `main.js` — då slutar saker
fungera (hänt 2026-09-26: "Visa karta"-knappen gjorde ingenting).

Därför länkas CSS och JS med ett versionsnummer:

```html
<link rel="stylesheet" href="css/style.css?v=20260926">
<script src="js/main.js?v=20260926" defer></script>
```

**Varje gång `style.css` eller `main.js` ändras:** byt `?v=` till dagens datum
(`ÅÅÅÅMMDD`) i alla HTML-filer. Snabbast från `site/`:

```bash
V=$(date +%Y%m%d); sed -i '' -E "s/(style\.css|main\.js)\?v=[0-9]+/\1?v=$V/g" index.html integritetspolicy/index.html
```

### Kontrollera att det gick ut

- Vänta 1–2 minuter och ladda om devay.se med `Cmd+Shift+R` (tvingar fram ny
  hämtning i stället för webbläsarens cache).
- Status för varje publicering syns på GitHub: repot → fliken **Actions**
  (“pages build and deployment”) eller **Settings → Pages**.

### Om något gick fel — backa

```bash
git checkout main
git revert HEAD            # skapar en ny commit som tar bort den senaste ändringen
git push prod main         # publicerar den gamla versionen igen
git checkout dev
git merge main             # så dev också får med återställningen
```

Använd `revert`, inte `reset` + `push --force` — historiken ska aldrig skrivas om på `main`.

## Kontakt

Young Fogelström · young.fogelstrom@devay.se · 0708-119 983
