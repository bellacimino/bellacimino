# bellacimino.com, portfolio site

A static site (plain HTML/CSS/JS, no build step, no framework) for Bella Cimino's
design + art portfolio. Four pages: Home, Design, Art, About.

```
index.html          Home
design.html          Design work (School, Compintelligence, Hollis Taggart, Milieu, Artdillo, Kappa Kappa Gamma)
art.html             Art work (2D: mixed media / drawing / painting / photography, 3D, 4D)
about.html           Bio, resume download, contact
css/style.css        All styling / design tokens
js/main.js           Mobile nav + lightbox + footer year
assets/images/...     Placeholder images, replace these
assets/resume/...     Put your resume PDF here
CNAME                Tells GitHub Pages to serve this repo at bellacimino.com
```

Every placeholder image was generated so the site looks complete out of the box.
Look for the black banner at the top of each page and any text starting with
**TODO**, that's everything left to personalize.

---

## Current status (what's real vs. still placeholder)

**Live with real content:** Home page photos, Design → Milieu / Hollis Taggart /
Artdillo Studios / Kappa Kappa Gamma / School, and Art → Mixed Media / Drawing /
Painting / Digital / 3D.

**Still placeholder, needs your files:** Design → Compintelligence, Art →
Photography and 4D, the resume PDF, and every paragraph marked `TODO` (bios,
client roles/descriptions, contact links). Search each HTML file for `TODO` to
find every remaining spot.

---

## 1. Put this on GitHub

```bash
cd bellacimino
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/bellacimino.git
git push -u origin main
```

(Create the empty `bellacimino` repo on GitHub first, no README/license, since
this folder already has one.)

## 2. Turn on GitHub Pages

1. On GitHub, go to your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. GitHub will build the site at `https://<your-username>.github.io/bellacimino/`
  , give it a minute, then refresh.

## 3. Point bellacimino.com at it

You already own the domain, so this is just DNS. In your domain registrar's
DNS settings (GoDaddy, Namecheap, Squarespace Domains, etc.):

**Apex domain (bellacimino.com), add 4 A records**, all pointing at GitHub's
Pages IP addresses:

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**www subdomain (optional but recommended), add 1 CNAME record:**

| Type | Host | Value |
|------|------|-------|
| CNAME | www | `<your-username>.github.io` |

Then back in **Settings → Pages** on GitHub:
- Under **Custom domain**, enter `bellacimino.com` and save. (This is what
  writes the `CNAME` file in your repo, it's already included here, so this
  step should auto-detect it.)
- Once DNS propagates (can take a few minutes to a few hours), check
  **Enforce HTTPS** so the site serves securely.

DNS changes can take up to 24–48 hours to fully propagate, though it's
usually much faster. You can check propagation with a tool like
[whatsmydns.net](https://www.whatsmydns.net).

---

## 4. Replace the placeholder content

### Images
Every image lives under `assets/images/` in a folder that matches where it's
used. **Keep the same filename** and the site will update automatically  - 
no HTML editing required:

- `assets/images/home/hero.jpg`, main hero photo on the homepage
- `assets/images/home/montage-1.jpg` … `montage-6.jpg`, homepage photo grid
- `assets/images/about/headshot.jpg`, About page headshot
- `assets/images/about/lifestyle-1.jpg` … `lifestyle-3.jpg`, About page strip
- `assets/images/design/<client>/<client>-1.jpg`, `-2.jpg`, `-3.jpg`, for
  each of: `school`, `compintelligence`, `hollistaggart`, `milieu`,
  `artdillo`, `kappakappagamma`
- `assets/images/design/<client>/<client>-cover.jpg`, used once on the
  homepage "explore the work" teaser (currently `school-cover.jpg`)
- `assets/images/art/2d/<medium>/<medium>-1.jpg`, `-2.jpg`, `-3.jpg`, for
  each of: `mixed-media`, `drawing`, `painting`, `photography`
- `assets/images/art/3d/sculpture-1.jpg` … `sculpture-3.jpg`
- `assets/images/art/4d/motion-1.jpg` … `motion-3.jpg`

Want more or fewer images in a section? Duplicate or delete the
corresponding `<a data-lightbox>…</a>` block in the matching HTML file  - 
each image lives in its own small block, so it's copy/paste.

Recommended image sizes: hero ~1600×1000px, square/grid photos ~800×800px,
gallery photos ~800×900px. Keep files under ~500KB each (export at
"web quality," not full camera resolution) so pages load fast.

### Resume
Drop your PDF into `assets/resume/` and name it exactly:
`Isabella_Cimino_Resume.pdf`, or rename it and update the `href` in the
resume card in `about.html`.

### Text
Search each HTML file for `TODO` and replace with your own copy, intro
paragraphs, project descriptions, contact links (email, LinkedIn,
Instagram), and location. The build-note banner at the top of every page
can be deleted once you're done, just remove the `<div class="build-note">…</div>`
block near the top of each file.

---

## 5. Preview locally before pushing

No build tools needed. Either:
- Double-click `index.html` to open it in a browser, or
- From the project folder, run `python3 -m http.server 8000` and visit
  `http://localhost:8000`.

---

## Design notes

- **Fonts:** Fraunces (display) + Inter (body) + Space Mono (labels/eyebrows),
  loaded from Google Fonts.
- **Palette + type scale:** defined as CSS variables at the top of
  `css/style.css`, change once, updates everywhere.
- **Signature element:** the hand-drawn brushstroke underline under key
  headlines (a nod to the painting practice), it's an inline SVG, so it's
  easy to restyle or remove in `css/style.css` under `.brush`.
