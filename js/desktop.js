/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — desktop shell
   Icons, start menu, context menu, pinned case files, clock.

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Everything hangs off the shared window.A99 namespace.
   ═══════════════════════════════════════════════════════════════ */

window.A99 = window.A99 || {};

(function () {
  const ICONS = A99.ICONS;
  const { PINNED, caseByNo } = A99;
  const {
    openCaseFile, openFolder, openIndustry, openAbout, openResume,
    openNotepad, openContact, openRecycle, openDialog, openRun,
    openMinesweeper, spawnCat,
  } = A99;

  const IS_TOUCH = matchMedia("(pointer: coarse)").matches;

  /* desktop icon definitions — order = column order */
  const DESKTOP_ICONS = [
    { label: "About Me", icon: ICONS.casefolder, open: openAbout,
      tip: "Subject profile · handle with curiosity" },
    { label: "Resume.pdf", icon: ICONS.pdf, open: openResume,
      tip: "Archived personnel record" },
    { label: "Notepad.txt", icon: ICONS.notepad, open: openNotepad,
      tip: "Recovered writings · 10 entries" },
    { label: "Industry Work", icon: ICONS.folder, open: openIndustry,
      tip: "Field records · verified" },
    { label: "Styling & Creative Direction", icon: ICONS.folder, open: () => openFolder("styling"),
      tip: "8 case files" },
    { label: "Branding & Strategy", icon: ICONS.folder, open: () => openFolder("branding"),
      tip: "5 case files" },
    { label: "Visual Communication", icon: ICONS.folder, open: () => openFolder("viscom"),
      tip: "3 case files" },
    { label: "Films", icon: ICONS.film, open: () => openFolder("films"),
      tip: "4 case files" },
    { label: "Photography", icon: ICONS.camera, open: () => openFolder("photography"),
      tip: "5 case files" },
    { label: "Writing", icon: ICONS.pen, open: () => openFolder("writing"),
      tip: "5 case files" },
    { label: "Contact Me", icon: ICONS.phone, open: openContact,
      tip: "Open a secure line" },
    { label: "Recycle Bin", icon: ICONS.recycle, open: openRecycle,
      tip: "No deleted records." },
  ];

  function buildDesktop() {
    buildIcons();
    buildPinnedPanel();
    buildStartMenu();
    buildContextMenu();
    startClock();
    wireCrtToggle();
  }

  /* ── icons ───────────────────────────────────────────────────── */

  function buildIcons() {
    const grid = document.getElementById("icon-grid");
    DESKTOP_ICONS.forEach((def) => {
      const btn = document.createElement("button");
      btn.className = "desk-icon";
      btn.title = def.tip;
      btn.innerHTML = `<img class="di-img" src="${def.icon}" alt="">
        <span class="di-label">${def.label}</span>`;
      if (IS_TOUCH) {
        btn.addEventListener("click", () => def.open());
      } else {
        btn.addEventListener("click", () => select(btn));
        btn.addEventListener("dblclick", () => def.open());
        btn.addEventListener("keydown", (e) => { if (e.key === "Enter") def.open(); });
      }
      grid.appendChild(btn);
    });

    document.getElementById("desktop").addEventListener("pointerdown", (e) => {
      if (!e.target.closest(".desk-icon")) select(null);
    });

    function select(btn) {
      document.querySelectorAll(".desk-icon.selected").forEach((b) => b.classList.remove("selected"));
      btn?.classList.add("selected");
    }
  }

  /* ── pinned case files ───────────────────────────────────────── */

  function buildPinnedPanel() {
    const list = document.getElementById("pinned-list");
    list.innerHTML = PINNED.map((no) => {
      const c = caseByNo[no];
      return `<li><button data-no="${no}">
        <span class="pin-no">CASE_${no}</span><span>${c.title}</span>
      </button></li>`;
    }).join("");
    list.querySelectorAll("button[data-no]").forEach((b) =>
      b.addEventListener("click", () => openCaseFile(b.dataset.no)));

    const panel = document.getElementById("pinned-panel");
    document.getElementById("pinned-toggle").addEventListener("click", () =>
      panel.classList.toggle("collapsed"));
    if (IS_TOUCH || window.innerHeight < 620) panel.classList.add("collapsed");
  }

  /* ── start menu ──────────────────────────────────────────────── */

  const START_ITEMS = [
    { label: "About Me", icon: ICONS.casefolder, act: openAbout },
    { label: "Resume.pdf", icon: ICONS.pdf, act: openResume },
    { label: "Notepad.txt", icon: ICONS.notepad, act: openNotepad },
    { label: "Contact Me", icon: ICONS.phone, act: openContact },
    { separator: true },
    { label: "Evidence Sweeper", icon: ICONS.mines, act: openMinesweeper },
    { label: "black_cat.exe", icon: ICONS.cat, act: spawnCat },
    { label: "Run…", icon: ICONS.run, act: openRun },
    { separator: true },
    { label: "Help", icon: ICONS.help, act: showHelp },
    { label: "Shut Down…", icon: ICONS.shutdown, act: () => window.__shutdown?.() },
  ];

  function buildStartMenu() {
    const menu = document.getElementById("start-menu");
    const items = document.getElementById("start-menu-items");
    const startBtn = document.getElementById("start-btn");

    items.innerHTML = START_ITEMS.map((it, i) =>
      it.separator
        ? `<li class="separator"></li>`
        : `<li><button data-i="${i}"><img src="${it.icon}" alt="">${it.label}</button></li>`
    ).join("");

    items.querySelectorAll("button[data-i]").forEach((b) =>
      b.addEventListener("click", () => {
        hide();
        START_ITEMS[+b.dataset.i].act();
      }));

    function hide() { menu.hidden = true; startBtn.classList.remove("active"); }
    function toggle() {
      menu.hidden = !menu.hidden;
      startBtn.classList.toggle("active", !menu.hidden);
    }
    startBtn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener("pointerdown", (e) => {
      if (!menu.hidden && !e.target.closest("#start-menu") && !e.target.closest("#start-btn")) hide();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
  }

  function showHelp() {
    openDialog({
      id: "help", title: "Archive.99 Help", icon: ICONS.help,
      text:
        "HOW TO NAVIGATE THIS ARCHIVE\n\n" +
        "· Double-click (or tap) a desktop folder to open it.\n" +
        "· Every project is filed as an individual CASE FILE.\n" +
        "· Windows can be dragged, resized, minimized and stacked — like it's 1998.\n" +
        "· The PINNED CASE FILES panel is the fast lane to the key evidence.\n" +
        "· Some things on this machine are not listed anywhere. Try Run…\n\n" +
        "Investigate freely. Nothing here bites. Except maybe the cat.",
    });
  }

  /* ── context menu (right-click on desktop) ───────────────────── */

  function buildContextMenu() {
    const menu = document.getElementById("context-menu");
    const desktop = document.getElementById("desktop");

    const ITEMS = [
      { label: "Arrange evidence", act: () => {} },
      { label: "Refresh", act: () => flashRefresh() },
      { separator: true },
      { label: "New Case File…", act: () => openDialog({
          id: "newcase", title: "Access Denied", emoji: "🔒",
          text: "Only the archivist can open new investigations.\n\nBut if you have a project in mind for her —\ncheck Contact Me. She loves a new case.",
        }) },
      { separator: true },
      { label: "Properties", act: () => openDialog({
          id: "props", title: "Display Properties", emoji: "🖥️",
          text: "ARCHIVE.99 — recovered workstation\n\nWallpaper: Estate Blue (Pantone 19-4027)\nResolution: whatever you're reading this on\nOwner: J. Bhanushali\nLast defragmented: never. She keeps everything.",
        }) },
    ];

    menu.innerHTML = ITEMS.map((it, i) =>
      it.separator ? `<li class="separator"></li>`
        : `<li><button data-i="${i}">${it.label}</button></li>`).join("");
    menu.querySelectorAll("button[data-i]").forEach((b) =>
      b.addEventListener("click", () => { menu.hidden = true; ITEMS[+b.dataset.i].act(); }));

    desktop.addEventListener("contextmenu", (e) => {
      if (e.target.closest(".win") || e.target.closest("#taskbar") || e.target.closest("#pinned-panel")) return;
      e.preventDefault();
      menu.hidden = false;
      const mw = 210, mh = menu.offsetHeight || 170;
      menu.style.left = Math.min(e.clientX, window.innerWidth - mw) + "px";
      menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 44) + "px";
    });
    document.addEventListener("pointerdown", (e) => {
      if (!menu.hidden && !e.target.closest("#context-menu")) menu.hidden = true;
    });

    function flashRefresh() {
      desktop.style.transition = "none";
      desktop.style.filter = "brightness(1.6)";
      requestAnimationFrame(() =>
        setTimeout(() => {
          desktop.style.transition = "filter .18s";
          desktop.style.filter = "";
        }, 40));
    }
  }

  /* ── clock + CRT toggle ──────────────────────────────────────── */

  function startClock() {
    const el = document.getElementById("clock");
    const tick = () => {
      const d = new Date();
      el.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
    tick();
    setInterval(tick, 10000);
  }

  function wireCrtToggle() {
    const btn = document.getElementById("crt-toggle");
    btn.addEventListener("click", () => {
      document.body.classList.toggle("no-crt");
      btn.classList.toggle("off", document.body.classList.contains("no-crt"));
    });
  }

  Object.assign(A99, { buildDesktop });
})();
