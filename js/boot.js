/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — stage flow
   landing (BSOD) → CRT die → boot sequence → desktop → shutdown

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Everything hangs off the shared window.A99 namespace.
   ═══════════════════════════════════════════════════════════════ */

window.A99 = window.A99 || {};

(function () {
  const BOOT_MESSAGES = A99.BOOT_MESSAGES;

  const stages = {
    landing: () => document.getElementById("landing"),
    boot: () => document.getElementById("boot"),
    desktop: () => document.getElementById("desktop"),
    shutdown: () => document.getElementById("shutdown"),
  };

  function show(name) {
    Object.entries(stages).forEach(([k, get]) => { get().hidden = k !== name; });
    document.body.dataset.stage = name;
    stages[name]().classList.add("fade-in");
  }

  function initFlow(onDesktopReady) {
    let entered = false;

    const enter = () => {
      if (entered) return;
      entered = true;
      const landing = stages.landing();
      landing.classList.add("dying");
      setTimeout(() => {
        show("boot");
        runBootSequence(() => {
          show("desktop");
          onDesktopReady?.();
        });
      }, 480);
    };

    // DELETE, Backspace (mac keyboards label it delete) or Enter — plus
    // click/tap anywhere on the landing screen — all get you in.
    document.addEventListener("keydown", (e) => {
      if (document.body.dataset.stage !== "landing") return;
      if (e.key === "Delete" || e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
        enter();
      }
    });
    stages.landing().addEventListener("click", enter);

    // shutdown hook, callable from the start menu / Run…
    window.__shutdown = () => {
      show("shutdown");
    };
    document.getElementById("reboot-btn").addEventListener("click", () => {
      window.location.reload();
    });
  }

  function runBootSequence(done) {
    const status = document.getElementById("boot-status");
    const fill = document.getElementById("boot-bar-fill");
    const stepMs = 620; // 4 messages ≈ 2.5s total
    BOOT_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        status.textContent = msg;
        fill.style.width = ((i + 1) / BOOT_MESSAGES.length) * 100 + "%";
      }, i * stepMs);
    });
    // last message holds ~1s, then transition
    setTimeout(done, (BOOT_MESSAGES.length - 1) * stepMs + 1000);
  }

  Object.assign(A99, { initFlow });
})();
