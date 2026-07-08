# ARCHIVE.99 — Jiya Bhanushali · Creative Case Archive

A Windows-98-inspired digital case archive portfolio. Pure static HTML/CSS/JS —
no build step, no CMS, no dependencies, no ES modules (so it also runs if you
just double-click `index.html` — no local server required). Open it on any
static host (built for Vercel) and it just works.

## The experience

1. **Landing** — a BSOD-style blue screen. Press `DELETE`, `ENTER`, or click/tap
   anywhere to enter.
2. **Boot sequence** — "INITIALISING JIYA'S DIGITAL ARCHIVE..." (~3 seconds).
3. **Desktop** — a recovered Win98 workstation. Every portfolio section is a
   folder/file; every project is an individual **CASE FILE** opening in a
   draggable, resizable, minimizable window.

If you ever edit the JS files and the site seems to ignore your changes,
that's your browser serving a cached copy — bump the `?v=` number on the
`<script>` tags at the bottom of `index.html` to force a fresh load.

## ✏️ How Jiya edits content (the only file that matters)

**All content lives in [`js/data.js`](js/data.js).** Open it in any text editor.
Anything wrapped in `[square brackets]` is a placeholder — on the site these are
highlighted with a red dashed outline so they're easy to spot. Replace the text
(keep it inside the quotes) and the highlight disappears automatically.

### Adding real project images

Each case has an `images` object:

```js
images: { hero: [null, null], gallery: [null, null, null, null], ... }
```

Replace `null` with an image URL (hosted file or a path like `"assets/cases/001/hero-1.jpg"`):

```js
images: { hero: ["assets/cases/001/hero-1.jpg"], gallery: ["...", "..."] }
```

`null` entries render as "EVIDENCE PENDING SCAN" placeholder frames. Add or
remove entries freely — the layout adapts. Put image files in `assets/`.

### Other content in `js/data.js`

| Section | What to edit |
|---|---|
| `CASES` | every project: title, subtitle, tools, year, overview/process/outcome/reflection text, images, Behance/Canva/YouTube links |
| `FIELD_RECORDS` | the 10 Industry Work entries |
| `PROFILE` | About Me: mugshot (`mugshot: "assets/mugshot.jpg"`), skills, statement, experience, education |
| `POEMS` | the 10 Notepad poems (titles + full text; line breaks are preserved) |
| `RESUME` | on-screen resume text; drop the real PDF at `assets/Jiya_Bhanushali_Resume.pdf` |
| `CONTACT` | links (already real) |

## Deploying to Vercel

```
npx vercel --prod
```

or connect the Git repo in the Vercel dashboard — no framework preset, no build
command, output directory = root.

## Hidden features (don't tell everyone)

- **Start → Run…** understands a few commands (`black_cat.exe`, `minesweeper`, …)
- The **Recycle Bin** has one item that could never be deleted
- **Evidence Sweeper** (Minesweeper) is in the Start menu
- **Shut Down…** actually shuts the archive down
- `CRT` button in the taskbar toggles the scanline/flicker effects
- There's a note in the browser console for fellow investigators

## Structure

```
index.html        the four stages: landing → boot → desktop → shutdown
css/main.css      base + CRT effects + landing/boot/shutdown
css/win98.css     window chrome, taskbar, menus, icons, pinned panel
css/apps.css      case files, subject profile, notepad, resume, contact…
js/data.js        ★ ALL CONTENT — the only file to edit
js/icons.js       pixel-art icons (ASCII maps → SVG)
js/wm.js          window manager
js/apps.js        window content renderers
js/desktop.js     desktop shell, start menu, easter eggs
js/boot.js        stage flow
assets/           favicon + your images/PDF go here
```
