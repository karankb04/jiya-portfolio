/* ═══════════════════════════════════════════════════════════════
   ARCHIVE.99 — CONTENT DATA
   ─────────────────────────────────────────────────────────────
   ✏️  JIYA: THIS IS THE ONLY FILE YOU NEED TO EDIT FOR CONTENT.
   Anything wrapped in [square brackets] is a placeholder.
   Every case supports:
     images: { hero: ["url", ...], gallery: [...], process: [...],
               outcome: [...] }   ← add real image URLs to replace
                                     the "EVIDENCE PENDING" frames
     links:  { behance: "", canva: "", youtube: "" }

   Plain script (no ES modules) — works even when index.html is
   opened directly from disk (file://), not just via a web server.
   Everything hangs off the shared window.A99 namespace.
   ═══════════════════════════════════════════════════════════════ */

window.A99 = window.A99 || {};

(function () {
  const PH_OVERVIEW = [
    "[Placeholder — a short 2–3 paragraph introduction to the project: the brief, the idea, and what you set out to investigate.]",
    "[Placeholder — second paragraph: the concept, references, and creative territory explored.]",
  ];
  const PH_PROCESS =
    "[Placeholder — describe the creative process: research, moodboards, sketches, fittings, shoots, iterations and behind-the-scenes decisions.]";
  const PH_OUTCOME =
    "[Placeholder — describe the final outcome and where the work lives: the campaign, the film, the publication, the collection.]";
  const PH_REFLECTION =
    "[Placeholder — a short reflection: what this case taught you, and how it changed the way you work.]";

  function makeCase(no, title, category, subtitle, opts = {}) {
    return {
      id: "case-" + no,
      no,
      title,
      category,
      subtitle,
      tools: opts.tools || "[Tools / mediums used]",
      year: opts.year || "[Year]",
      status: opts.status || "CLOSED",
      overview: opts.overview || PH_OVERVIEW,
      process: opts.process || PH_PROCESS,
      outcome: opts.outcome || PH_OUTCOME,
      reflection: opts.reflection || PH_REFLECTION,
      images: opts.images || { hero: [null, null], gallery: [null, null, null, null], process: [null, null], outcome: [null, null] },
      links: opts.links || { behance: "", canva: "", youtube: "" },
      crossRef: opts.crossRef || null,
    };
  }

  /* ── THE CASE INDEX ──────────────────────────────────────────── */
  /* Numbering is fixed for the pinned files:
     001 Carnal Hunger · 004 The End · 007 KYDVERSE · 009 Muktam ·
     012 Sneaker Culture · 015 Loopstate · 018 AQI Butterfly Effect ·
     021 Jacquemus × Barbie                                          */

  const CASES = [
    makeCase("001", "Carnal Hunger", "Styling & Creative Direction", "Editorial styling investigation"),
    makeCase("002", "Joy is a Muscle", "Styling & Creative Direction", "Styling & creative direction"),
    makeCase("003", "Kaos", "Styling & Creative Direction", "Styling & creative direction"),
    makeCase("004", "The End", "Branding & Strategy", "Brand identity & virtual retail experience"),
    makeCase("005", "Cocoleni", "Branding & Strategy", "Campaign design & marketing strategies"),
    makeCase("006", "Red Bull × MTV", "Branding & Strategy", "Cross-category collaboration to revive a dormant brand"),
    makeCase("007", "KYDVERSE", "Branding & Strategy", "A campaign design for 2030"),
    makeCase("008", "KYD Campaign Film", "Films", "Campaign film"),
    makeCase("009", "Muktam", "Films", "Short film"),
    makeCase("010", "Escape", "Films", "Short film"),
    makeCase("011", "Sighs of Belief", "Films", "Documentary"),
    makeCase("012", "Sneaker Culture", "Visual Communication", "Coffee table book — publication design"),
    makeCase("013", "Viya", "Visual Communication", "Luxury brand gamification"),
    makeCase("014", "Motion Graphics", "Visual Communication", "Motion design explorations"),
    makeCase("015", "Loopstate", "Styling & Creative Direction", "1960s resortwear × Namara Swimwear"),
    makeCase("016", "Amrita Sher-Gil", "Styling & Creative Direction", "Styling homage"),
    makeCase("017", "Choreographed Inclusivity", "Styling & Creative Direction", "Styling & creative direction"),
    makeCase("018", "AQI Butterfly Effect", "Styling & Creative Direction", "Styling × photography investigation", { crossRef: "Photography" }),
    makeCase("019", "Dressed in Decay", "Styling & Creative Direction", "Styling × photography investigation", { crossRef: "Photography" }),
    makeCase("020", "Outlawed Identity", "Photography", "Photography series"),
    makeCase("021", "Jacquemus × Barbie", "Branding & Strategy", "Co-branding case study"),
    makeCase("022", "Kal Aaj Aur Kal", "Photography", "Photography series"),
    makeCase("023", "After Image", "Photography", "Visual essay"),
    makeCase("024", "Paris Fashion Week Press Releases", "Writing", "Caroline Hu & Araftu — press office writing"),
    makeCase("025", "Long-form Feature", "Writing", "Long-form editorial feature"),
    makeCase("026", "Fashion Feature Article", "Writing", "Fashion journalism"),
    makeCase("027", "Trend Report", "Writing", "Trend forecasting & analysis"),
    makeCase("028", "Galeries Lafayette Press Release", "Writing", "Press release"),
  ];

  const caseByNo = Object.fromEntries(CASES.map((c) => [c.no, c]));

  /* ── PINNED CASE FILES (bottom-right panel) ──────────────────── */

  const PINNED = ["001", "004", "007", "009", "012", "015", "018", "021"];

  /* ── FOLDERS (desktop navigation) ────────────────────────────── */

  const FOLDERS = {
    styling: {
      label: "Styling & Creative Direction",
      blurb: "All styling and creative direction case files.",
      cases: ["001", "002", "015", "003", "016", "017", "018", "019"],
    },
    branding: {
      label: "Branding & Strategy",
      blurb: "Branding, campaign and strategy investigations.",
      cases: ["005", "021", "004", "007", "006"],
    },
    viscom: {
      label: "Visual Communication",
      blurb: "Publication design, motion graphics and visual communication.",
      cases: ["012", "013", "014"],
    },
    films: {
      label: "Films",
      blurb: "Campaign films, documentaries and short films.",
      cases: ["009", "010", "011", "008"],
    },
    photography: {
      label: "Photography",
      blurb: "Photography projects and visual essays.",
      cases: ["020", "019", "022", "018", "023"],
    },
    writing: {
      label: "Writing",
      blurb: "Press releases, feature articles, trend reports and editorial writing.",
      cases: ["024", "025", "026", "027", "028"],
    },
  };

  /* ── INDUSTRY WORK — FIELD RECORDS ───────────────────────────── */

  const FIELD_RECORDS = Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return {
      id: "field-" + n,
      no: n,
      title: `[Project / Company Name ${n}]`,
      role: "[Role placeholder]",
      period: "[Month Year – Month Year]",
      description: [
        "[Placeholder — 2–3 paragraphs describing the experience, responsibilities, contributions and overall impact.]",
        "[Placeholder — second paragraph.]",
      ],
      learnings: "[Short paragraph placeholder — key learnings from this field assignment.]",
      images: { hero: [null], gallery: [null, null, null, null] },
    };
  });

  /* ── SUBJECT PROFILE (About Me) ──────────────────────────────── */

  const PROFILE = {
    fileNo: "SUBJ-99-2005",
    name: "Jiya Bhanushali",
    alias: "jeeaah_",
    age: "20",
    location: "Mumbai, India",
    occupation: "Fashion Communication & Styling — Atlas SkillTech University",
    mbti: "[MBTI]",
    mugshot: null, // ← set to "assets/mugshot.jpg" when ready
    skills: [
      "Brand Strategy", "Styling", "Creative Direction", "Campaign Design",
      "Visual Communication", "Fashion Photography", "Filmmaking",
      "Fashion Writing", "Trend Research", "Fashion Technology",
    ],
    statement: [
      "The subject is a deeply passionate person who feels everything to the core — someone who wants to see, learn and experience everything the world has to offer. Inspiration is gathered everywhere: conversations, films, old books, architecture, music, people, memories, and the smallest everyday moments.",
      "Stories are what the subject loves most — reading them, making them, collecting them, discovering them in every possible form. The subject believes everything in existence has a story waiting to be told, and the work in this archive exists to bring those stories to life.",
      "Witnesses describe the subject as \"a little bit of a black cat\": prone to attachment to people, places and ideas she probably shouldn't be attached to; often felt like an outcast growing up. Investigators note, however, that curiosity has never killed this cat — it is precisely what makes her live life to the fullest.",
      "The subject's personality is full of contradictions, and so is her work: nostalgia balanced with modern ideas, seriousness with playfulness, structure with experimentation, darkness with hope. Classified as a pessimistic optimist. Considered creatively dangerous. Approach with curiosity.",
    ],
    fontLine: "If the subject were a font, she would be a typewriter font — adaptable, imperfect, and full of character.",
    experience: [
      { title: "[Role — Company]", meta: "[Year — placeholder, see Industry Work for full field records]" },
      { title: "[Role — Company]", meta: "[Year — placeholder]" },
      { title: "[Role — Company]", meta: "[Year — placeholder]" },
    ],
    education: [
      { title: "B.A. Fashion Communication & Styling", meta: "Atlas SkillTech University, Mumbai — 2022–2026" },
      { title: "[Previous education]", meta: "[Placeholder]" },
    ],
  };

  /* ── NOTEPAD — POEMS ─────────────────────────────────────────── */

  const POEMS = Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      no: n,
      title: `[Poem title ${n}]`,
      date: "[date written]",
      body:
        "[Placeholder — paste the full poem here.\n" +
        "Line breaks are preserved exactly as you type them,\n" +
        "like a typewriter would.]",
    };
  });

  /* ── RESUME ──────────────────────────────────────────────────── */

  const RESUME = {
    pdfPath: "assets/Jiya_Bhanushali_Resume.pdf", // ← drop the real PDF here
    headline: "Fashion Communication & Styling",
    contactLine: "Mumbai, India · jiya.bhanusatish@gmail.com",
    about:
      "[Placeholder — 2–3 line professional summary. Aspiring brand strategist with a multidisciplinary fashion communication practice spanning styling, creative direction, campaigns, film and writing.]",
    sections: [
      {
        heading: "EXPERIENCE",
        items: [
          "[Role — Company, City · Month Year – Month Year — one-line description]",
          "[Role — Company, City · Month Year – Month Year — one-line description]",
          "[Role — Company, City · Month Year – Month Year — one-line description]",
        ],
      },
      {
        heading: "EDUCATION",
        items: [
          "B.A. Fashion Communication & Styling — Atlas SkillTech University, Mumbai (2022–2026)",
          "[Previous education placeholder]",
        ],
      },
      {
        heading: "SKILLS",
        items: [
          "Brand strategy · styling · creative direction · campaign design · visual communication",
          "Fashion photography · filmmaking · fashion writing · trend research",
          "[Software / tools placeholder — e.g. Adobe CC, Figma, CLO3D…]",
        ],
      },
    ],
  };

  /* ── CONTACT ─────────────────────────────────────────────────── */

  const CONTACT = [
    { proto: "MAIL", label: "jiya.bhanusatish@gmail.com", href: "mailto:jiya.bhanusatish@gmail.com" },
    { proto: "BEHANCE", label: "behance.net/jeeah", href: "https://www.behance.net/jeeah" },
    { proto: "LINKEDIN", label: "jiya-bhanushali", href: "https://www.linkedin.com/in/jiya-bhanushali-77138a269" },
    { proto: "INSTAGRAM", label: "@jeeaah_", href: "https://www.instagram.com/jeeaah_" },
  ];

  /* ── BOOT SEQUENCE MESSAGES ──────────────────────────────────── */

  const BOOT_MESSAGES = [
    "Compiling visual evidence...",
    "Retrieving archived case files...",
    "Loading documented records...",
    "Archive successfully restored.",
  ];

  Object.assign(A99, {
    CASES, caseByNo, PINNED, FOLDERS, FIELD_RECORDS,
    PROFILE, POEMS, RESUME, CONTACT, BOOT_MESSAGES,
  });
})();
