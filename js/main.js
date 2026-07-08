/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — entry point

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Loaded last, after icons.js, data.js, wm.js, apps.js, desktop.js,
   boot.js have all attached themselves to window.A99.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  A99.installFavicon();
  A99.buildDesktop();
  A99.initFlow();

  /* console note for fellow investigators */
  console.log(
    "%cARCHIVE.99 — you found the back door.\n" +
      "Every investigation leaves behind evidence. Even this one.\n" +
      "— built for Jiya Bhanushali",
    "color:#CD212A;font-family:monospace;font-size:12px"
  );
})();
