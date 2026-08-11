/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — applications (window content renderers)

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Everything hangs off the shared window.A99 namespace.
   ═══════════════════════════════════════════════════════════════ */

window.A99 = window.A99 || {};

(function () {
  const ICONS = A99.ICONS;
  const openWindow = A99.openWindow;
  const closeWindow = A99.closeWindow;
  const { CASES, caseByNo, FOLDERS, FIELD_RECORDS, PROFILE, POEMS, RESUME, CONTACT } = A99;

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* wrap [placeholder] text in a highlight so it's easy to spot */
  const phFormat = (s) =>
    esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');

  function evidenceFrames(urls, tagPrefix, { hero = false } = {}) {
    return (urls || [])
      .map((url, i) => {
        const tag = `${tagPrefix}-${String(i + 1).padStart(2, "0")}`;
        const img = url
          ? `<img class="real" src="${esc(url)}" alt="${esc(tag)}" loading="lazy">`
          : `<div class="ev-img"></div>`;
        return `<figure class="ev-frame ${hero && i === 0 ? "hero" : ""}">
          ${img}<figcaption class="ev-tag">EXHIBIT <b>${tag}</b></figcaption>
        </figure>`;
      })
      .join("");
  }

  /* ── CASE FILE ───────────────────────────────────────────────── */

  function openCaseFile(no) {
    const c = caseByNo[no];
    if (!c) return;
    openWindow({
      id: c.id,
      title: `CASE_${c.no} — ${c.title}`,
      icon: ICONS.casefolder,
      width: 720,
      height: Math.min(620, window.innerHeight - 80),
      statusLeft: `CASE_${c.no} · ${c.category.toUpperCase()}`,
      statusRight: `STATUS: ${c.status}`,
      render(body) {
        const links = Object.entries(c.links)
          .map(([k, v]) => v
            ? `<a href="${esc(v)}" target="_blank" rel="noopener">↗ ${k.toUpperCase()}</a>`
            : `<a class="disabled">↗ ${k.toUpperCase()} [link pending]</a>`)
          .join("");
        body.innerHTML = `
        <article class="casefile">
          <div class="cf-classification">
            <span>ARCHIVE.99 · CREATIVE INVESTIGATION UNIT</span>
            <span class="red">DECLASSIFIED</span>
          </div>
          <header class="cf-head">
            <div class="cf-stamp">CASE CLOSED</div>
            <div class="cf-caseno">CASE_${c.no}</div>
            <h2 class="cf-title-line">${esc(c.title)}</h2>
            <dl class="cf-meta">
              <div><dt>TITLE</dt><dd>${esc(c.title)} — ${phFormat(c.subtitle)}</dd></div>
              <div><dt>CATEGORY</dt><dd>${esc(c.category)}${c.crossRef ? ` <span style="color:var(--scarlet)">⟲ cross-referenced: ${esc(c.crossRef)}</span>` : ""}</dd></div>
              <div><dt>TOOLS</dt><dd>${phFormat(c.tools)}</dd></div>
              <div><dt>YEAR</dt><dd>${phFormat(c.year)}</dd></div>
              <div><dt>STATUS</dt><dd class="status-closed">■ ${esc(c.status)}</dd></div>
            </dl>
          </header>

          <section class="cf-section">
            <h3 class="cf-section-title">HERO EVIDENCE</h3>
            <div class="ev-grid">${evidenceFrames(c.images.hero, c.no + "H", { hero: true })}</div>
          </section>
          <p class="cf-arrow">↓</p>

          <section class="cf-section">
            <h3 class="cf-section-title">PROJECT OVERVIEW</h3>
            ${c.overview.map((p) => `<p>${phFormat(p)}</p>`).join("")}
          </section>
          <p class="cf-arrow">↓</p>

          <section class="cf-section">
            <h3 class="cf-section-title">PROJECT GALLERY</h3>
            <div class="ev-grid">${evidenceFrames(c.images.gallery, c.no + "G")}</div>
          </section>
          <p class="cf-arrow">↓</p>

          <section class="cf-section">
            <h3 class="cf-section-title">CREATIVE PROCESS</h3>
            <p>${phFormat(c.process)}</p>
            <div class="ev-grid">${evidenceFrames(c.images.process, c.no + "P")}</div>
          </section>
          <p class="cf-arrow">↓</p>

          <section class="cf-section">
            <h3 class="cf-section-title">FINAL OUTCOME</h3>
            <p>${phFormat(c.outcome)}</p>
            <div class="ev-grid">${evidenceFrames(c.images.outcome, c.no + "F")}</div>
          </section>
          <p class="cf-arrow">↓</p>

          <section class="cf-section">
            <h3 class="cf-section-title">REFLECTION</h3>
            <p>${phFormat(c.reflection)}</p>
          </section>

          <section class="cf-section">
            <h3 class="cf-section-title">EXTERNAL LINKS</h3>
            <div class="cf-links">${links}</div>
          </section>

          <footer class="cf-footer">
            <span>FILED BY J. BHANUSHALI</span>
            <span>ARCHIVE.99 // NOTHING IS EVER REALLY DELETED</span>
          </footer>
        </article>`;
      },
    });
  }

  /* ── CATEGORY FOLDER ─────────────────────────────────────────── */

  function openFolder(key) {
    const f = FOLDERS[key];
    if (!f) return;
    openWindow({
      id: "folder-" + key,
      title: f.label,
      icon: ICONS.folder,
      width: 520, height: 440,
      chromeBody: true,
      statusLeft: `${f.cases.length} object(s)`,
      statusRight: f.blurb,
      render(body) {
        body.innerHTML = `
          <div class="folder-toolbar">
            <span>Address</span>
            <span class="addr">C:\\ARCHIVE99\\${key.toUpperCase()}\\</span>
          </div>
          <ul class="folder-list">
            ${f.cases.map((no) => {
              const c = caseByNo[no];
              return `<li><button data-no="${no}">
                <img src="${ICONS.casefolder}" alt="">
                <span><span class="fl-name">${esc(c.title)}</span>
                  <span class="fl-meta">${esc(c.subtitle)}</span></span>
                <span class="fl-caseno">CASE_${no}</span>
              </button></li>`;
            }).join("")}
          </ul>`;
        body.querySelectorAll("button[data-no]").forEach((btn) =>
          btn.addEventListener("click", () => openCaseFile(btn.dataset.no)));
      },
    });
  }

  /* ── INDUSTRY WORK (field records) ───────────────────────────── */

  function openIndustry() {
    openWindow({
      id: "industry",
      title: "Industry Work",
      icon: ICONS.folder,
      width: 540, height: 460,
      chromeBody: true,
      statusLeft: `${FIELD_RECORDS.length} object(s)`,
      statusRight: "Internships & professional projects",
      render(body) {
        body.innerHTML = `
          <div class="folder-toolbar">
            <span>Address</span>
            <span class="addr">C:\\ARCHIVE99\\INDUSTRY_WORK\\</span>
          </div>
          <ul class="folder-list">
            ${FIELD_RECORDS.map((r) => `<li><button data-id="${r.id}">
              <img src="${ICONS.document}" alt="">
              <span><span class="fl-name">${phFormat(r.title)}</span>
                <span class="fl-meta">${phFormat(r.role)}</span></span>
              <span class="fl-caseno">FR_${r.no}</span>
            </button></li>`).join("")}
          </ul>`;
        body.querySelectorAll("button[data-id]").forEach((btn) =>
          btn.addEventListener("click", () => openFieldRecord(btn.dataset.id)));
      },
    });
  }

  function openFieldRecord(id) {
    const r = FIELD_RECORDS.find((x) => x.id === id);
    if (!r) return;
    openWindow({
      id,
      title: `FIELD RECORD ${r.no}`,
      icon: ICONS.document,
      width: 640, height: 560,
      statusLeft: `FIELD RECORD ${r.no}`,
      statusRight: "INDUSTRY WORK",
      render(body) {
        body.innerHTML = `
        <article class="casefile">
          <div class="cf-classification">
            <span>ARCHIVE.99 · FIELD OPERATIONS</span>
            <span class="red">VERIFIED</span>
          </div>
          <header class="cf-head">
            <div class="cf-caseno">FIELD RECORD ${r.no}</div>
            <dl class="cf-meta" style="margin-top:14px">
              <div><dt>TITLE</dt><dd>${phFormat(r.title)}</dd></div>
              <div><dt>ROLE</dt><dd>${phFormat(r.role)}</dd></div>
              <div><dt>PERIOD</dt><dd>${phFormat(r.period)}</dd></div>
            </dl>
          </header>
          <section class="cf-section">
            <h3 class="cf-section-title">DESCRIPTION</h3>
            ${r.description.map((p) => `<p>${phFormat(p)}</p>`).join("")}
          </section>
          <section class="cf-section">
            <h3 class="cf-section-title">IMAGE GALLERY</h3>
            <div class="ev-grid">
              ${evidenceFrames(r.images.hero, "FR" + r.no + "H", { hero: true })}
              ${evidenceFrames(r.images.gallery, "FR" + r.no + "G")}
            </div>
          </section>
          <section class="cf-section">
            <h3 class="cf-section-title">KEY LEARNINGS</h3>
            <p>${phFormat(r.learnings)}</p>
          </section>
          <footer class="cf-footer">
            <span>FILED BY J. BHANUSHALI</span><span>ARCHIVE.99</span>
          </footer>
        </article>`;
      },
    });
  }

  /* ── ABOUT ME (subject profile — now shows the Canva PDF) ─────── */

  function openAbout() {
    openWindow({
      id: "about",
      title: "About Me — Subject Profile",
      icon: ICONS.casefolder,
      width: 700, height: Math.min(620, window.innerHeight - 80),
      statusLeft: "SUBJECT PROFILE",
      statusRight: PROFILE.fileNo,
      render(body) {
        body.innerHTML = `
        <div class="about-pdf-view">
          <div class="resume-actions">
            <a class="bevel-out" href="assets/About-Me-Subject-Profile.pdf" target="_blank" rel="noopener">↗ Open PDF in new tab</a>
          </div>
          <iframe class="about-pdf-frame"
            src="assets/About-Me-Subject-Profile.pdf"
            title="About Me — Subject Profile">
          </iframe>
        </div>`;
      },
    });
  }

  /* ── RESUME ──────────────────────────────────────────────────── */

  function openResume() {
    openWindow({
      id: "resume",
      title: "Resume.pdf — Archived Personnel Record",
      icon: ICONS.pdf,
      width: 660, height: Math.min(600, window.innerHeight - 80),
      statusLeft: "PERSONNEL RECORD",
      statusRight: "1 page",
      render(body) {
        body.innerHTML = `
        <div class="resume-view">
          <div class="resume-actions">
            <a class="bevel-out" href="${esc(RESUME.pdfPath)}" download>💾 Download PDF</a>
          </div>
          <div class="resume-page">
            <h2>${esc(PROFILE.name)}</h2>
            <div class="r-sub">${esc(RESUME.headline)} · ${esc(RESUME.contactLine)}</div>
            <p>${phFormat(RESUME.about)}</p>
            ${RESUME.sections.map((s) => `
              <h3>${esc(s.heading)}</h3>
              <ul>${s.items.map((i) => `<li>${phFormat(i)}</li>`).join("")}</ul>
            `).join("")}
          </div>
        </div>`;
      },
    });
  }

  /* ── NOTEPAD (poems) ─────────────────────────────────────────── */

  function openNotepad() {
    openWindow({
      id: "notepad",
      title: "Notepad.txt — poems",
      icon: ICONS.notepad,
      width: 620, height: 480,
      statusLeft: `${POEMS.length} entries`,
      statusRight: "typed, never deleted",
      render(body) {
        body.innerHTML = `
        <div class="notepad">
          <nav class="np-list">
            <header>RECOVERED WRITINGS</header>
            ${POEMS.map((p, i) => `<button data-i="${i}" ${i === 0 ? 'class="active"' : ""}>
              <span class="np-no">${p.no}</span>${phFormat(p.title)}
            </button>`).join("")}
          </nav>
          <div class="np-page">
            <h3></h3><div class="np-date"></div><pre></pre>
          </div>
        </div>`;
        const show = (i) => {
          const p = POEMS[i];
          body.querySelector(".np-page h3").innerHTML = phFormat(p.title);
          body.querySelector(".np-date").innerHTML = "· " + phFormat(p.date) + " ·";
          body.querySelector(".np-page pre").textContent = p.body;
          body.querySelectorAll(".np-list button").forEach((b, j) =>
            b.classList.toggle("active", i === j));
        };
        body.querySelectorAll(".np-list button").forEach((b) =>
          b.addEventListener("click", () => show(+b.dataset.i)));
        show(0);
      },
    });
  }

  /* ── CONTACT ─────────────────────────────────────────────────── */

  function openContact() {
    openWindow({
      id: "contact",
      title: "Contact Me — Open a Line",
      icon: ICONS.phone,
      width: 520, height: 420,
      statusLeft: "SECURE CHANNELS",
      statusRight: "response time: usually fast",
      render(body) {
        body.innerHTML = `
        <div class="contact">
          <h2>ESTABLISH CONTACT</h2>
          <div class="c-sub">ALL CHANNELS MONITORED BY THE SUBJECT PERSONALLY</div>
          <ul class="contact-lines">
            ${CONTACT.map((c) => `<li>
              <a href="${esc(c.href)}" target="_blank" rel="noopener">
                <span class="cl-proto">${esc(c.proto)}</span>
                <span class="cl-val">${esc(c.label)}</span>
                <span class="cl-arrow">→</span>
              </a></li>`).join("")}
          </ul>
          <p class="contact-note">Every investigation starts with a conversation.
          If you've read this far into the archive, we should probably have one.</p>
        </div>`;
      },
    });
  }

  /* ── RECYCLE BIN ─────────────────────────────────────────────── */

  function openRecycle() {
    openWindow({
      id: "recycle",
      title: "Recycle Bin",
      icon: ICONS.recycle,
      width: 440, height: 340,
      statusLeft: "0 object(s)",
      statusRight: "0 bytes",
      render(body) {
        body.innerHTML = `
        <div class="recycle">
          <div>
            <div class="rc-icon">🗑</div>
            <p>No deleted records.</p>
            <p class="rc-sub">Nothing in this archive was ever thrown away.<br>
            Every draft, every detour, every "failed" experiment<br>became part of the work.</p>
            <div class="rc-hidden"><button id="rc-secret">restore hidden item?</button></div>
          </div>
        </div>`;
        body.querySelector("#rc-secret").addEventListener("click", () => {
          closeWindow("recycle");
          spawnCat();
          openDialog({
            id: "cat-note", title: "black_cat.exe", icon: ICONS.cat,
            text: "One item could not be deleted:\n\nblack_cat.exe — attachment level: too high.\n\nCuriosity never killed this one.\nIt's the reason the whole archive exists.",
          });
        });
      },
    });
  }

  /* ── GENERIC DIALOG ──────────────────────────────────────────── */

  function openDialog({ id, title, text, icon, emoji = "⚠️", buttons }) {
    openWindow({
      id, title, icon, dialog: true,
      width: 380, height: 200,
      render(body, win) {
        win.style.height = "auto";
        body.innerHTML = `
          <div class="dialog-body">
            <span class="dlg-icon">${icon ? `<img src="${icon}" width="32" height="32" style="image-rendering:pixelated" alt="">` : emoji}</span>
            <p style="white-space:pre-wrap">${esc(text)}</p>
          </div>
          <div class="dialog-actions">
            ${(buttons || ["OK"]).map((b, i) => `<button class="bevel-out" data-i="${i}">${esc(b)}</button>`).join("")}
          </div>`;
        body.querySelectorAll(".dialog-actions button").forEach((b) =>
          b.addEventListener("click", () => closeWindow(id)));
      },
    });
  }

  /* ── RUN… ────────────────────────────────────────────────────── */

  function openRun() {
    openWindow({
      id: "run", title: "Run", icon: ICONS.run, dialog: true,
      width: 400,
      render(body, win) {
        win.style.height = "auto";
        body.innerHTML = `
          <div class="run-body">
            <label for="run-input">Type the name of a program, folder or secret, and the archive will open it for you.</label>
            <input id="run-input" class="run-input" spellcheck="false"
                   placeholder="e.g. black_cat.exe">
            <p class="run-hint">known commands: black_cat.exe · minesweeper · about · contact · shutdown</p>
          </div>
          <div class="dialog-actions">
            <button class="bevel-out" data-act="ok">OK</button>
            <button class="bevel-out" data-act="cancel">Cancel</button>
          </div>`;
        const input = body.querySelector("#run-input");
        setTimeout(() => input.focus(), 50);
        const exec = () => {
          const v = input.value.trim().toLowerCase();
          closeWindow("run");
          if (v.includes("cat")) spawnCat();
          else if (v.includes("mine")) openMinesweeper();
          else if (v.includes("about")) openAbout();
          else if (v.includes("contact")) openContact();
          else if (v.includes("shutdown") || v.includes("shut down")) window.__shutdown?.();
          else if (v) openDialog({
            id: "run-err", title: "Error", emoji: "❌",
            text: `Cannot find the file '${v}'.\n\nBut in this archive, not finding something\nusually means it found you first.`,
          });
        };
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") exec(); });
        body.querySelector('[data-act="ok"]').addEventListener("click", exec);
        body.querySelector('[data-act="cancel"]').addEventListener("click", () => closeWindow("run"));
      },
    });
  }

  /* ── MINESWEEPER ─────────────────────────────────────────────── */

  function openMinesweeper() {
    openWindow({
      id: "mines", title: "Evidence Sweeper", icon: ICONS.mines,
      width: 290, height: 400,
      chromeBody: true,
      statusLeft: "9×9 · 10 mines",
      statusRight: "careful where you dig",
      render(body) {
        const SIZE = 9, MINES = 10;
        let grid, revealed, flagged, alive, won, opened;

        const top = document.createElement("div");
        top.className = "mines-top bevel-in";
        const gridEl = document.createElement("div");
        gridEl.className = "mines-grid";
        const note = document.createElement("p");
        note.className = "mines-note";
        note.textContent = "left-click / tap: dig · right-click / long-press: flag";
        const wrap = document.createElement("div");
        wrap.className = "mines";
        wrap.append(top, gridEl, note);
        body.appendChild(wrap);

        function init() {
          grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
          revealed = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
          flagged = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
          alive = true; won = false; opened = 0;
          let placed = 0;
          while (placed < MINES) {
            const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
            if (grid[r][c] !== -1) { grid[r][c] = -1; placed++; }
          }
          for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === -1) continue;
            let n = 0;
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr, cc = c + dc;
              if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && grid[rr][cc] === -1) n++;
            }
            grid[r][c] = n;
          }
          draw();
        }

        function reveal(r, c) {
          if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || revealed[r][c] || flagged[r][c]) return;
          revealed[r][c] = true; opened++;
          if (grid[r][c] === -1) { alive = false; return; }
          if (grid[r][c] === 0)
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
        }

        function draw() {
          won = alive && opened === SIZE * SIZE - MINES;
          const face = !alive ? "💀" : won ? "😎" : "🕵️";
          const flags = flagged.flat().filter(Boolean).length;
          top.innerHTML = `<span class="lcd">${String(MINES - flags).padStart(3, "0")}</span>
            <button class="mines-face bevel-out">${face}</button>
            <span class="lcd">CASE</span>`;
          top.querySelector(".mines-face").addEventListener("click", init);

          gridEl.innerHTML = "";
          for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
            const b = document.createElement("button");
            const isOpen = revealed[r][c] || (!alive && grid[r][c] === -1);
            if (isOpen) {
              b.className = "open";
              if (grid[r][c] === -1) b.textContent = "✱";
              else if (grid[r][c] > 0) { b.textContent = grid[r][c]; b.classList.add("n" + grid[r][c]); }
            } else {
              b.className = "bevel-out";
              if (flagged[r][c]) b.textContent = "⚑";
            }
            if (alive && !won) {
              b.addEventListener("click", () => {
                if (flagged[r][c]) return;
                reveal(r, c); draw();
              });
              b.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (!revealed[r][c]) { flagged[r][c] = !flagged[r][c]; draw(); }
              });
              let t;
              b.addEventListener("touchstart", () => {
                t = setTimeout(() => { flagged[r][c] = !flagged[r][c]; draw(); }, 450);
              }, { passive: true });
              b.addEventListener("touchend", () => clearTimeout(t));
            }
            gridEl.appendChild(b);
          }
        }
        init();
      },
    });
  }

  /* ── BLACK CAT ───────────────────────────────────────────────── */

  function spawnCat() {
    document.getElementById("black-cat")?.remove();
    const cat = document.createElement("div");
    cat.id = "black-cat";
    cat.innerHTML = `<svg viewBox="0 0 32 20" shape-rendering="crispEdges">
      <g class="cat-body" fill="#101012">
        <rect x="6" y="8" width="16" height="7"/>
        <rect x="4" y="15" width="3" height="4"/><rect x="10" y="15" width="3" height="4"/>
        <rect x="16" y="15" width="3" height="4"/><rect x="21" y="15" width="3" height="4"/>
        <rect x="20" y="4" width="8" height="6"/>
        <rect x="20" y="1" width="2" height="3"/><rect x="26" y="1" width="2" height="3"/>
        <rect x="2" y="4" width="4" height="5"/>
        <rect x="0" y="2" width="3" height="3"/>
      </g>
      <rect x="22" y="6" width="2" height="1" fill="#CD212A"/>
      <rect x="26" y="6" width="2" height="1" fill="#CD212A"/>
    </svg>`;
    document.body.appendChild(cat);
    cat.addEventListener("animationend", () => cat.remove());
  }

  Object.assign(A99, {
    openCaseFile, openFolder, openIndustry, openAbout, openResume,
    openNotepad, openContact, openRecycle, openDialog, openRun,
    openMinesweeper, spawnCat,
  });
})();
