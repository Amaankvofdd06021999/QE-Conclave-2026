# QE Conclave 2026 — Website

Marketing / registration site for **QE Conclave 2026**
🗓 **11 December 2026** · 📍 **Hyderabad International Convention Centre (HICC), HITEC City, Hyderabad**
Theme: *Beyond Assurance: Engineering Trust in the Age of AI*

This is a **static website** (plain HTML/CSS/JS — no build step, no framework, no database). It is hosted on GitHub Pages. This document is the **handover + pre-launch reference**: it explains the code layout, every link, every form, every asset, and the checklist to complete before going live.

---

## 1. Run it locally

The hero background is an MP4 that is seeked by script (it skips the first 15s / last 10s). For the video to play and seek, the local server **must support HTTP Range requests**. Python's default `http.server` does **not** — use the bundled range server:

```bash
cd /path/to/QECOnclave
python3 tools/rangeserver.py 8000 .
# then open http://localhost:8000
```

> A plain `python3 -m http.server` will load the page but the hero video will appear frozen/black (it can't seek). **On GitHub Pages the video works fine** — GitHub supports range requests.

No install/build is required. Just edit the files and refresh.

---

## 2. Project structure

```
QECOnclave/
├── index.html              # All page markup (sections in source order)
├── css/
│   └── styles.css          # All styles (single stylesheet)
├── js/
│   ├── main.js             # Nav, mobile menu, countdown, modals, video player,
│   │                       #   testimonials carousel, theme toggle, reveal-on-scroll
│   ├── animations.js       # GSAP scroll animation (event statement) — loads after GSAP CDN
│   └── cursor-3d.js        # three.js cursor companion (desktop only, ES module)
├── assets/
│   ├── video/              # hero background video + poster
│   ├── gallery/            # DSC*.png — "Scenes from past editions" strip + CTA bg
│   ├── decor/              # QELogo.png (spinning decor), bg-who-should-attend.png
│   ├── models/             # cursor-companion.glb (3D cursor)
│   ├── logos/              # QE Conclave brand logos (source SVG/PNG) + QualiZeal
│   ├── sponsors/           # Past-sponsor logos (white + colour variants)
│   ├── speakers/
│   │   ├── current/        # 2026 speaker photos (Image*.jpg) — PLACEHOLDERS
│   │   ├── photos/         # extra speaker photos used in cards/agenda
│   │   └── alumni/         # Past Speaker Alumni headshots (real, from past editions)
│   └── venue/              # HICC venue slideshow images + convention-center fallback
├── tools/
│   └── rangeserver.py      # local dev server with video range support
├── README.md               # this file
└── archive/                # unused/old assets (git-ignored, kept locally only)
```

External dependencies (loaded from CDN, no install): **Google Fonts** (Space Grotesk, Work Sans, Manrope), **GSAP + ScrollTrigger**, **three.js** (via the inline `importmap` in `index.html`).

---

## 3. Page sections (in source order)

Nav → Hero → Stats ("By the Numbers") → About (event statement) → Who Should Attend → Tracks (**hidden**) → CTA banner ("In Person / Free") → Sponsors (+ Past Sponsors) → Speakers (+ Past Speaker Alumni + Call for Speakers) → Testimonials carousel → Agenda → Talks from past editions → Gallery → Venue → Registration form → Footer.

> The **Tracks** section is intentionally hidden (`style="display:none"`). Un-hide it in `index.html` if needed.

---

## 4. Links — full inventory

### Internal (scroll to section) — working
| Link | Target |
|---|---|
| Nav: About | `#event-statement` |
| Nav: Speakers | `#speakers` |
| Nav: Schedule | `#agenda` |
| Nav: Sponsors | `#sponsors` |
| Nav: Register Now | `#register-form` |
| Hero: Register Free | `#register-form` |
| CTA banner: Register Now | `#register-form` |
| Agenda: View full agenda | `#agenda` |

### External — working, **verify they're correct**
| Link | URL |
|---|---|
| Nav → Past Editions → QE Conclave 2025 | `https://qeconclave.com/` |
| Nav → Past Editions → QE Conclave 2024 | `https://qeconclave.com/qe-conclave-2024/` |
| Nav → Past Editions → QE Conclave 2023 | `https://qeconclave.com/qe-conclave-2023/` |
| Venue → Google Maps | `https://maps.google.com/?q=Hyderabad+International+Convention+Centre` |
| Footer → LinkedIn (company) | `https://www.linkedin.com/company/qe-conclave/` |
| Footer → YouTube (channel) | `https://www.youtube.com/channel/UC7HgCxzvHx_PPGeUcD7URRw` |
| Footer → Instagram | `https://www.instagram.com/qeconclave/` |

### Video links (open in an in-page overlay)
- **Hero "Watch 2025 Highlights"** → YouTube `pKwbeladpBE`
- **Testimonials cards** → YouTube IDs: `pKwbeladpBE`, `9vu2U-hKpQM`, `crtydLrWMww`, `KkQWF6x_p4g`, `F029dm1APHA`, `HG6R0I-onmI`, `hZyWza24aWY`, `JRhE2oon2Yk`

### ⚠️ Dead links (`href="#"`) — MUST be set before launch
| Where | Needs |
|---|---|
| Agenda → **Download full agenda (PDF)** | real PDF URL |
| Footer nav → **About**, **Past Events** | real targets |
| Footer legal → **Privacy policy**, **Terms & Conditions**, **Disclaimer** | real pages/URLs |

### ⚠️ Speaker LinkedIn icons — placeholders
Each speaker card's LinkedIn icon points to a **LinkedIn name-search** (e.g. `…/search/results/people/?keywords=Priya%20Narayanan`), **not** a real profile. Replace with each speaker's actual profile URL once the lineup is confirmed.

---

## 5. Forms — ⚠️ NONE are connected to a backend yet

All three forms are **front-end only**. On submit they show a "thank you" state in the browser and **do not send, store, or email anything**. **Before launch, wire each `<form>` to a backend** (e.g. Formspree, Google Forms, HubSpot, or a custom endpoint) — set the `action`/handler in `js/main.js` (modal submit handler) and in the registration form.

| Form | Location | Fields | Submit button |
|---|---|---|---|
| **Registration** | `#register-form` section | First Name, Last Name, Work Email, Company, Job Title, Phone *(optional)* | "Get my free pass" |
| **Become a Sponsor** | modal (`#sponsorModal`), opened by "Become a Sponsor" | Company, Contact Name, Work Email, Phone *(optional)*, Sponsorship Tier *(select)*, Message *(optional)* | "Submit sponsorship interest" |
| **Become a Speaker** | modal (`#speakerModal`), opened by "Become a Speaker" | Full Name, Work Email, Company/Org, Job Title, Talk Title, Talk Abstract, LinkedIn/Profile *(optional)* | "Submit proposal" |

---

## 6. Content that is PLACEHOLDER and must be finalised

| Item | Current state |
|---|---|
| **Stats** ("By the Numbers") | 1500+ Attendees · 20+ Speakers · 700+ Companies · 4th Edition — confirm all numbers |
| **Speakers (2026)** | The 12 speaker cards use **placeholder names + photos** (`assets/speakers/current` + `…/photos`). Replace with the real 2026 lineup, titles, companies, talks, photos, and LinkedIn URLs. |
| **Agenda** | Session titles, times, tracks and speaker avatars are **placeholder**. Replace with the real schedule. |
| **Sponsors (2026 tiers)** | Title = QualiZeal; Platinum/Gold/Silver are "Your Logo Here" **placeholders**. Add real 2026 sponsors. (Past Sponsors logos are real.) |
| **Testimonials quotes** | Quote text is **placeholder** copy; only the videos are real. |
| **Hero theme line** | "Beyond Assurance: Engineering Trust in the Age of AI" — confirm final theme wording. |
| **Countdown** | Auto-calculates to **11 Dec 2026** (set in `js/main.js`). Update if the date changes. |

---

## 7. Assets — where each lives

- **Brand logos:** `assets/logos/` (the hero logo is inlined as SVG inside `index.html`; source is `qe-conclave-2026-logo.svg`).
- **Hero video:** `assets/video/herointronewvideo.mp4` (+ `…-poster.jpg`).
- **Gallery strip & CTA background:** `assets/gallery/DSC*.png`.
- **Speaker photos:** `assets/speakers/current`, `…/photos`, `…/alumni`.
- **Sponsor logos:** `assets/sponsors/` (each brand has a `-white` and `-color` file where available; the **Past Sponsors** row uses the colour versions on white cards).
- **Venue slideshow:** `assets/venue/hicc-*.jpg` (cross-fades every 4s; sourced from hicc.com).
- **Decor / 3D:** `assets/decor/`, `assets/models/`.

> `archive/` holds old/unused assets (e.g. previous hero logo, old sponsor PNGs, unused videos). It is **git-ignored** — kept on disk for reference only. The raw vendor sponsor-logo pack (`past sponsor logos/`) is also git-ignored.

---

## 8. ✅ Pre-launch checklist

**Forms & data capture**
- [ ] Connect the **Registration** form to a real backend/endpoint and test a submission.
- [ ] Connect the **Become a Sponsor** form and test.
- [ ] Connect the **Become a Speaker** form and test.
- [ ] Confirm where submissions go (email/CRM/sheet) and that confirmations are sent.

**Links**
- [ ] Add the **Download full agenda (PDF)** link (or remove the button).
- [ ] Set footer **About** and **Past Events** links.
- [ ] Add **Privacy Policy**, **Terms & Conditions**, **Disclaimer** pages/links.
- [ ] Replace all **speaker LinkedIn** icons with real profile URLs.
- [ ] Verify the **Past Editions** (2023/2024/2025) and **social** links are correct.
- [ ] Verify the **Venue → Google Maps** pin.

**Content**
- [ ] Finalise the **2026 speaker lineup** (names, titles, companies, talks, photos).
- [ ] Finalise the **agenda** (sessions, times, tracks, speaker avatars).
- [ ] Add real **2026 sponsors** (replace "Your Logo Here" placeholders) per tier.
- [ ] Replace placeholder **testimonial quotes** (or hide quotes, keep videos).
- [ ] Confirm **stats** numbers (attendees / speakers / companies / edition).
- [ ] Confirm **date, venue, theme**, and the countdown target date.
- [ ] Proofread all copy.

**Media**
- [ ] Confirm hero video is the intended reel (and the 15s/10s trim still looks right).
- [ ] Confirm "Watch 2025 Highlights" + all testimonial **YouTube IDs** are correct & public.
- [ ] Confirm venue photos are licensed for use.

**Technical / SEO / launch**
- [ ] Add page `<title>`/meta description, Open Graph + Twitter card image, favicon.
- [ ] Add analytics (e.g. GA4) if required.
- [ ] Test on mobile (hamburger menu, sponsor grids, modals, forms).
- [ ] Test **light & dark mode** across all sections.
- [ ] Run an accessibility/contrast pass.
- [ ] Verify the custom domain / GitHub Pages settings and HTTPS.
- [ ] Final cross-browser check (Chrome, Safari, Firefox, Edge).

---

## 9. How to make common edits

- **Change a sponsor logo:** drop the file in `assets/sponsors/`, reference it in the relevant `.sponsor-logo` in `index.html`.
- **Add/replace a speaker:** edit the `.speaker-card` block in `index.html`; put the photo in `assets/speakers/current/`.
- **Edit the agenda:** edit the `#agenda-day` rows in `index.html`.
- **Change colours/spacing:** all styles are in `css/styles.css` (brand colours are CSS variables at the top: `--yellow`, `--cyan`, `--red`, plus light/dark theme tokens).
- **Change the countdown date / video trim / form behaviour:** `js/main.js`.
