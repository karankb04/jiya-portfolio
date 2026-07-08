/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — window manager
   Draggable / resizable / minimize / maximize / close windows,
   taskbar buttons, focus handling. Touch-friendly: on small
   screens windows are forced near-fullscreen by CSS.

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Everything hangs off the shared window.A99 namespace.
   ═══════════════════════════════════════════════════════════════ */

window.A99 = window.A99 || {};

(function () {
  const layer = () => document.getElementById("windows-layer");
  const taskbarButtons = () => document.getElementById("taskbar-buttons");

  let zCounter = 10;
  let cascade = 0;
  const openWindows = new Map(); // id → { el, tb, title }

  function isOpen(id) {
    return openWindows.has(id);
  }

  function focusWindow(id) {
    const w = openWindows.get(id);
    if (!w) return;
    if (w.el.classList.contains("minimized")) w.el.classList.remove("minimized");
    document.querySelectorAll(".win.focused").forEach((el) => el.classList.remove("focused"));
    document.querySelectorAll(".tb-btn.active").forEach((el) => el.classList.remove("active"));
    w.el.classList.add("focused");
    w.tb.classList.add("active");
    w.el.style.zIndex = ++zCounter;
  }

  function closeWindow(id) {
    const w = openWindows.get(id);
    if (!w) return;
    w.el.remove();
    w.tb.remove();
    openWindows.delete(id);
    const last = [...openWindows.keys()].pop();
    if (last) focusWindow(last);
  }

  function minimizeWindow(id) {
    const w = openWindows.get(id);
    if (!w) return;
    w.el.classList.add("minimized");
    w.el.classList.remove("focused");
    w.tb.classList.remove("active");
  }

  function toggleMaximize(id) {
    const w = openWindows.get(id);
    if (!w) return;
    w.el.classList.toggle("maximized");
    focusWindow(id);
  }

  /**
   * openWindow({ id, title, icon, width, height, render, statusLeft,
   *              statusRight, chromeBody, dialog })
   * render(bodyEl) fills the window body.
   */
  function openWindow(opts) {
    const { id, title, icon } = opts;
    if (openWindows.has(id)) { focusWindow(id); return openWindows.get(id).el; }

    const el = document.createElement("section");
    el.className = "win";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", title);

    const vw = window.innerWidth, vh = window.innerHeight - 40;
    const width = Math.min(opts.width || 560, vw - 24);
    const height = Math.min(opts.height || 460, vh - 24);
    const step = (cascade++ % 7) * 26;
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.left = Math.max(6, Math.min(60 + step, vw - width - 12)) + "px";
    el.style.top = Math.max(6, Math.min(30 + step, vh - height - 12)) + "px";

    const iconImg = icon ? `<img class="wt-icon" src="${icon}" alt="">` : "";
    el.innerHTML = `
      <header class="win-titlebar">
        <span class="win-title">${iconImg}${title}</span>
        <span class="win-btns">
          ${opts.dialog ? "" : `<button class="bevel-out" data-act="min" aria-label="Minimize">_</button>
          <button class="bevel-out" data-act="max" aria-label="Maximize">□</button>`}
          <button class="bevel-out" data-act="close" aria-label="Close">✕</button>
        </span>
      </header>
      <div class="win-body bevel-in ${opts.chromeBody ? "chrome-bg" : ""}"></div>
      ${opts.dialog ? "" : `<footer class="win-statusbar bevel-in">
        <span>${opts.statusLeft || "ARCHIVE.99"}</span>
        <span>${opts.statusRight || ""}</span>
      </footer>
      <div class="win-grip" aria-hidden="true"></div>`}
    `;

    layer().appendChild(el);
    opts.render(el.querySelector(".win-body"), el);

    // taskbar button
    const tb = document.createElement("button");
    tb.className = "tb-btn bevel-out";
    tb.innerHTML = `${icon ? `<img src="${icon}" alt="">` : ""}<span>${title}</span>`;
    tb.addEventListener("click", () => {
      const w = openWindows.get(id);
      if (w.el.classList.contains("minimized") || !w.el.classList.contains("focused")) {
        focusWindow(id);
      } else {
        minimizeWindow(id);
      }
    });
    taskbarButtons().appendChild(tb);

    openWindows.set(id, { el, tb, title });

    // window controls
    el.addEventListener("pointerdown", () => focusWindow(id));
    el.querySelector(".win-btns").addEventListener("click", (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (act === "close") closeWindow(id);
      else if (act === "min") minimizeWindow(id);
      else if (act === "max") toggleMaximize(id);
    });
    el.querySelector(".win-titlebar").addEventListener("dblclick", (e) => {
      if (!e.target.closest("button") && !opts.dialog) toggleMaximize(id);
    });

    makeDraggable(el, el.querySelector(".win-titlebar"));
    const grip = el.querySelector(".win-grip");
    if (grip) makeResizable(el, grip);

    focusWindow(id);
    return el;
  }

  function makeDraggable(win, handle) {
    let startX, startY, origX, origY, dragging = false;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || win.classList.contains("maximized")) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      origX = win.offsetLeft; origY = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const nx = origX + e.clientX - startX;
      const ny = origY + e.clientY - startY;
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 80;
      win.style.left = Math.max(-win.offsetWidth + 120, Math.min(nx, maxX)) + "px";
      win.style.top = Math.max(0, Math.min(ny, maxY)) + "px";
    });
    const stop = () => { dragging = false; };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  function makeResizable(win, grip) {
    let startX, startY, origW, origH, resizing = false;

    grip.addEventListener("pointerdown", (e) => {
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      origW = win.offsetWidth; origH = win.offsetHeight;
      grip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    grip.addEventListener("pointermove", (e) => {
      if (!resizing) return;
      win.style.width = Math.max(260, origW + e.clientX - startX) + "px";
      win.style.height = Math.max(140, origH + e.clientY - startY) + "px";
    });
    const stop = () => { resizing = false; };
    grip.addEventListener("pointerup", stop);
    grip.addEventListener("pointercancel", stop);
  }

  Object.assign(A99, { isOpen, focusWindow, closeWindow, openWindow });
})();
