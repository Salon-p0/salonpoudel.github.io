# Salon Poudel — Portfolio

A premium, editorial personal portfolio site.

## Important note on how this was built

The brief asked for a React / Next.js / TypeScript / Tailwind / Framer Motion
build. This environment has no network access, so `npm install` for Next.js,
Tailwind, and Framer Motion isn't possible here — nothing could actually run.

Instead, this is a **static, dependency-free HTML/CSS/JS site** that
implements every section, interaction, and design rule from the brief
(custom cursor, magnetic buttons, scroll reveals, marquee, accordions,
alternating project layouts, mobile menu, reduced-motion support, etc.)
with plain JavaScript, so it runs immediately in any browser with zero
build step. The project-data pattern still mirrors the requested
architecture — `js/projects-data.js` is the single source of truth, and
`case-study.html` renders any project from it via `?slug=`. If you later
want the real Next.js/TypeScript/Tailwind/Framer Motion version, this file
structure and copy can be ported over directly — each section maps to a
component.

## Content that still needs real information

I could not access **linkedin.com/in/salon-poudel** (LinkedIn blocks
automated access) or the **Pinterest reference board** (also blocked) from
this environment. Per the brief's own instruction not to invent facts,
every unverified item is marked `PLACEHOLDER` directly in the HTML/data —
search the project for `PLACEHOLDER` to find everything that needs a real
answer before this goes live:

- About page biography and the two Experience timeline entries (`about.html`)
- Case study detail for **Holistic Agent, FieldStream, TradePipe** (no
  verified description exists for these beyond the project name)
- Missing detail on **Masha** — challenge/approach/UX/visual/outcome
  copy (the brief only supplied its one-line description)
- Real email address (`contact.html`, currently `hello@salonpoudel.example`)
- Real portrait photo and all project screenshots (see `images/projects/`)
- Year/timeline/tools fields per project in `js/projects-data.js`
- `Cre8net`, `Panthos Labs`, `CreditFlow AI`, WordPress and social-media
  work, listed on `work.html` as names only

Once you have the real LinkedIn content and screenshots, replace the
placeholder text directly, and drop images into the matching
`images/projects/<slug>/` folder, updating the `.project-media` /
`.cs-hero-media` / `.cs-gallery-item` blocks to use `<img>` tags instead of
the dashed placeholder boxes.

## Structure

```
index.html          Home
work.html            Full project list (alternating editorial layouts)
about.html           Bio, skills, experience timeline, "currently exploring"
contact.html         Contact (dark section)
case-study.html      Case-study template, rendered from ?slug= via projects-data.js
css/styles.css       Full design system (tokens, type scale, components)
js/main.js           Nav, mobile menu, custom cursor, reveals, accordions,
                      magnetic buttons, hero canvas, page transitions
js/projects-data.js  Single source of truth for all project content
js/case-study.js     Renders case-study.html from projects-data.js
images/projects/     Placeholder folders per project for real screenshots
robots.txt / sitemap.xml
```

## Design tokens

- Font: Poppins (loaded from Google Fonts)
- Background `#F7F7F5` · Ink `#181818` · Soft `#666666` · Accent `#5BC1AC` · Dark `#1B1B1B`
- Fluid type via `clamp()`, defined in `css/styles.css` under `:root`

## Notes

- Fully keyboard-navigable, respects `prefers-reduced-motion`, custom
  cursor is desktop-only (disabled under `pointer: coarse`).
- No external JS dependencies — open `index.html` directly, or serve the
  folder with any static file server.
