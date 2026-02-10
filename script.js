(() => {
  const $ = (sel) => document.querySelector(sel);

  // ===== Elements =====
  const stageIntro = $("#stageIntro");
  const stageAsk = $("#stageAsk");
  const stageQuiz = $("#stageQuiz");
  const stageScan = $("#stageScan");
  const stageYes = $("#stageYes");

  const btnBegin = $("#btnBegin");
  const btnSkipToQuestion = $("#btnSkipToQuestion");

  const btnYes = $("#btnYes");
  const btnCinematic = $("#btnCinematic");
  const btnCoffee = $("#btnCoffee");
  const btnNo = $("#btnNo");

  const hintText = $("#hintText");
  const btnRow = $("#btnRow");

  const moodSelect = $("#moodSelect");
  const coffeeSelect = $("#coffeeSelect");
  const dateSelect = $("#dateSelect");
  const btnRunScan = $("#btnRunScan");
  const btnBackToChoices = $("#btnBackToChoices");

  const progressBar = $("#progressBar");
  const scanLog = $("#scanLog");
  const btnProceed = $("#btnProceed");
  const btnAbort = $("#btnAbort");

  const btnReplay = $("#btnReplay");
  const btnCopy = $("#btnCopy");

  const introGallery = $("#introGallery");
  const memoryGrid = $("#memoryGrid");
  const memoryMessage = $("#memoryMessage");

  const nameDialog = $("#nameDialog");
  const personalizeBtn = $("#personalizeBtn");

  const popupDialog = $("#popupDialog");
  const popupTitle = $("#popupTitle");
  const popupText = $("#popupText");

  const herNameInput = $("#herName");
  const yourNameInput = $("#yourName");

  const herNameHero = $("#herNameHero");
  const herNameFinal = $("#herNameFinal");
  const nameSlot = $("#nameSlot");
  const sigSlot = $("#sigSlot");

  const soundToggle = $("#soundToggle");

  const canvas = $("#confetti");
  const ctx = canvas?.getContext?.("2d", { alpha: true });

  // ===== Guard =====
  const required = [
    stageAsk, stageQuiz, stageScan, stageYes,
    btnYes, btnCinematic, btnCoffee, btnNo,
    progressBar, scanLog, btnProceed, btnAbort,
    btnReplay, btnCopy,
    introGallery, memoryGrid
  ];
  if (required.some(x => !x)) {
    console.warn("Missing required DOM elements. Check index.html ids.");
    return;
  }

  // ===== localStorage personalization =====
  const savedHer = (localStorage.getItem("vday_her") || "").trim();
  const savedYou = (localStorage.getItem("vday_you") || "").trim();
  const defaults = { her: savedHer || "Anvi", you: savedYou || "Vishwa" };

  function getHer() {
    return (localStorage.getItem("vday_her") || defaults.her).trim() || "Valentine";
  }
  function getYou() {
    return (localStorage.getItem("vday_you") || defaults.you).trim() || "Me";
  }

  function applyNames() {
    const her = getHer();
    const you = getYou();

    herNameHero.textContent = her;
    herNameFinal.textContent = her;
    nameSlot.textContent = her;
    sigSlot.textContent = you;

    herNameInput.value = her;
    yourNameInput.value = you;
  }
  applyNames();

  // ===== Personalize dialog =====
  personalizeBtn.addEventListener("click", () => {
    if (typeof nameDialog.showModal === "function") nameDialog.showModal();
  });

  nameDialog.addEventListener("close", () => {
    if (nameDialog.returnValue === "save") {
      localStorage.setItem("vday_her", (herNameInput.value || "").trim());
      localStorage.setItem("vday_you", (yourNameInput.value || "").trim());
    }
    applyNames();
  });

  // ===== Sound (tiny UI beeps) =====
  let soundOn = false;
  let audioCtx = null;

  function beep(freq = 660, dur = 0.06, type = "triangle", gain = 0.03) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function setSoundUI() {
    soundToggle.textContent = `Sound: ${soundOn ? "On" : "Off"}`;
    soundToggle.setAttribute("aria-pressed", String(soundOn));
  }

  soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    setSoundUI();
    beep(880, 0.05, "triangle", 0.03);
  });
  setSoundUI();

  // ===== Stage control =====
  function showStage(stage) {
    [stageIntro, stageAsk, stageQuiz, stageScan, stageYes]
      .filter(Boolean)
      .forEach(s => s.classList.remove("stage--active"));
    stage.classList.add("stage--active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== Compliments =====
 const COMPLIMENTS = [
  "{her}, you make ordinary moments feel ridiculously special.",
  "I’m not subtle, {her}: you’re my favorite person.",
  "{her}, your presence is calming in the best way.",
  "You’re beautiful, {her}, and somehow also the safest place.",
  "{her}, you’re the kind of rare that doesn’t happen twice.",
  "If I’m honest, {her}, you’re my best idea.",
  "{her}, you make me want to be softer and braver at the same time.",
  "I admire you, {her}. Like, constantly.",
  "{her}, you’re effortlessly brilliant and it’s unfair.",
  "I like you a lot, {her}. Love you more.",
  "{her}, you’re the prettiest plot twist in my life.",
  "You’re magic, {her}. The quiet, real kind.",

  // deeper romantic
  "{her}, loving you feels easy in a way I didn’t know was possible.",
  "You make my world feel calmer just by being in it, {her}.",
  "{her}, you are my favorite place to return to.",
  "There’s something about you that makes everything feel right.",
  "You make ordinary days feel like memories worth keeping.",
  "{her}, you make me feel understood without trying too hard.",
  "Every version of you is my favorite version, {her}.",
  "You make life feel warmer, {her}.",

  // admiration
  "You’re strong in quiet ways people don’t always notice, {her}. I do.",
  "{her}, your kindness is one of your most powerful traits.",
  "You have this calm confidence that’s honestly addictive.",
  "{her}, you make intelligence look graceful.",
  "You carry yourself in a way that makes people feel safe.",
  "You make chaos look elegant somehow.",

  // playful romantic
  "{her}, I’m still surprised I get to call you mine.",
  "You’re dangerously charming, {her}. I never stood a chance.",
  "This was never a fair game. You already won me.",
  "{her}, I would choose you again without hesitation.",
  "You make me smile in ways I can’t fake.",
  "You’re my favorite distraction from everything else.",

  // emotional intimacy
  "{her}, you make me feel like I can be completely myself.",
  "Being with you feels like coming home.",
  "You understand me in ways I didn’t expect anyone to.",
  "{her}, you make vulnerability feel safe.",
  "You make silence feel comfortable instead of empty.",

  // soft poetic
  "{her}, you’re the calm after a long day.",
  "You feel like a deep breath I didn’t know I needed.",
  "You’re the gentle kind of beautiful that stays.",
  "{her}, you turn moments into stories.",
  "You’re my favorite chapter that keeps getting better.",

  // confident romantic
  "{her}, I don’t question how much I care about you. It’s obvious.",
  "Loving you feels like the most natural thing.",
  "You make me certain about things I used to doubt.",
  "{her}, you make the future feel exciting.",
  "You’re the best part of my day, consistently.",

  // sweet
  "You deserve softness, patience, and endless affection, {her}.",
  "{her}, you’re more incredible than you realize.",
  "You make the world look brighter.",
  "You make me want to be better in quiet ways.",
  "{her}, you’re my favorite person to think about.",

  // slightly cinematic (because you added cinematic button)
  "{her}, if this were a movie, you’d be the reason the story matters.",
  "You’re not just part of my story, you’re the heart of it.",
  "{her}, every scene feels better when you’re in it.",
  "You make real life feel cinematic.",

  // emotional warmth
  "{her}, you bring calm where I used to carry noise.",
  "You make closeness feel natural instead of scary.",
  "Being loved by you feels like luck I don’t take lightly.",
  "{her}, you make happiness feel real.",
];

  let lastComplimentIndex = -1;
  function pickRandomCompliment() {
    if (!COMPLIMENTS.length) return "You’re my favorite person.";
    let j = Math.floor(Math.random() * COMPLIMENTS.length);
    if (COMPLIMENTS.length > 1) {
      while (j === lastComplimentIndex) j = Math.floor(Math.random() * COMPLIMENTS.length);
    }
    lastComplimentIndex = j;
    return COMPLIMENTS[j];
  }

  // ===== Photo discovery (auto-detect any number) =====
  // Place images in /assets: 01.jpg, 02.jpg, 03.jpg ... OR .jpeg/.png/.webp
  const MAX_PHOTOS = 160;
  const FAILS_TO_STOP = 6;
  const EXT_CANDIDATES = ["jpg", "jpeg", "png", "webp"];

  // Optional per-image focus overrides
  const PHOTO_FOCUS_OVERRIDES = {
    // "assets/07.jpg": "top",
    // "assets/12.jpg": "bottom",
  };

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function probeImage(src, timeoutMs = 1200) {
    return new Promise((resolve) => {
      const img = new Image();
      let done = false;

      const finish = (ok) => {
        if (done) return;
        done = true;
        resolve(ok);
      };

      const t = setTimeout(() => finish(false), timeoutMs);
      img.onload = () => { clearTimeout(t); finish(true); };
      img.onerror = () => { clearTimeout(t); finish(false); };

      // cache-bust in dev
      img.src = `${src}?v=${Date.now()}`;
    });
  }

  async function discoverPhotos() {
    const found = [];
    let consecutiveFails = 0;

    for (let i = 1; i <= MAX_PHOTOS; i++) {
      const base = `assets/${pad2(i)}`;
      let okSrc = null;

      for (const ext of EXT_CANDIDATES) {
        const candidate = `${base}.${ext}`;
        // eslint-disable-next-line no-await-in-loop
        const ok = await probeImage(candidate);
        if (ok) { okSrc = candidate; break; }
      }

      if (okSrc) {
        consecutiveFails = 0;
        const focus = PHOTO_FOCUS_OVERRIDES[okSrc] || "center";
        found.push({ src: okSrc, caption: `Memory ${pad2(i)}`, focus });
      } else {
        consecutiveFails++;
        if (found.length > 0 && consecutiveFails >= FAILS_TO_STOP) break;
      }
    }

    return found;
  }

  let PHOTOS = [];

  // ===== UI builders =====
  function applyFocus(img, focus) {
    if (focus === "top") img.style.objectPosition = "50% 20%";
    else if (focus === "bottom") img.style.objectPosition = "50% 80%";
    else img.style.objectPosition = "center";
  }

  function makePhotoFrame(photo) {
    const wrap = document.createElement("div");
    wrap.className = "photoFrame";
    wrap.style.setProperty("--bgimg", `url(${photo.src})`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "Photo";
    img.loading = "lazy";
    applyFocus(img, photo.focus);

    wrap.appendChild(img);
    return wrap;
  }

  function openPopup(title, text) {
    if (popupDialog && typeof popupDialog.showModal === "function") {
      popupTitle.textContent = title;
      popupText.textContent = text;
      popupDialog.showModal();
      return;
    }
    memoryMessage.textContent = text;
  }

  function makeMemoryCard(photo, idx) {
    const btn = document.createElement("button");
    btn.className = "memoryCard";
    btn.type = "button";
    btn.style.setProperty("--bgimg", `url(${photo.src})`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || `Memory ${idx + 1}`;
    img.loading = "lazy";
    applyFocus(img, photo.focus);

    const label = document.createElement("span");
    label.className = "memoryLabel";
    label.textContent = photo.caption || `Memory ${String(idx + 1).padStart(2, "0")}`;

    btn.appendChild(img);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      beep(840, 0.05);
      const her = getHer();
      const msg = pickRandomCompliment().replaceAll("{her}", her);
      memoryMessage.textContent = msg;
      openPopup(label.textContent, msg);
    });

    return btn;
  }

  function buildUIFromPhotos() {
    introGallery.innerHTML = "";
    memoryGrid.innerHTML = "";

    for (const p of PHOTOS) introGallery.appendChild(makePhotoFrame(p));
    PHOTOS.forEach((p, idx) => memoryGrid.appendChild(makeMemoryCard(p, idx)));
  }

  // Init photos
  (async () => {
    PHOTOS = await discoverPhotos();

    if (!PHOTOS.length) {
      console.warn("No photos found. Check /assets naming like 01.jpg, 02.jpg, etc.");
      introGallery.innerHTML =
        `<p class="subtitle">No photos found in /assets. Name files like 01.jpg, 02.jpg, 03.jpg…</p>`;
      return;
    }

    buildUIFromPhotos();
  })();

  // ===== Intro buttons =====
  btnBegin.addEventListener("click", () => {
    beep(760, 0.06);
    showStage(stageAsk);
  });

  btnSkipToQuestion.addEventListener("click", () => {
    beep(700, 0.05);
    showStage(stageAsk);
  });

  // ===== No-button dodge =====
  let dodgeEnabled = true;

  function dodgeNoButton() {
    if (!dodgeEnabled) return;

    const rowRect = btnRow.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = rowRect.width - btnRect.width;
    const maxY = rowRect.height - btnRect.height;

    if (maxX < 5 || maxY < 5) {
      hintText.textContent = "“No” is under maintenance for romantic reasons.";
      beep(240, 0.08, "square", 0.02);
      return;
    }

    const currentLeft = btnNo.offsetLeft;
    const currentTop = btnNo.offsetTop;

    let nx, ny, tries = 0;
    do {
      nx = Math.random() * maxX;
      ny = Math.random() * maxY;
      tries++;
    } while (tries < 12 && Math.hypot(nx - currentLeft, ny - currentTop) < 90);

    btnNo.style.position = "absolute";
    btnNo.style.left = `${nx}px`;
    btnNo.style.top = `${ny}px`;

    hintText.textContent = "That’s funny. Try again.";
    beep(330, 0.05, "square", 0.02);
  }

  btnNo.addEventListener("mouseenter", dodgeNoButton);
  btnNo.addEventListener("pointerenter", dodgeNoButton);

  btnNo.addEventListener("click", () => {
    beep(160, 0.1, "sawtooth", 0.03);
    hintText.textContent = "Request denied. Reason: unacceptable timeline.";
    setTimeout(() => showStage(stageQuiz), 450);
  });

  // ===== Route YES-ish choices to quiz =====
  function goQuiz() {
    beep(720, 0.05, "triangle", 0.02);
    showStage(stageQuiz);
  }

  btnYes.addEventListener("click", goQuiz);
  btnCinematic.addEventListener("click", goQuiz);
  btnCoffee.addEventListener("click", goQuiz);

  btnBackToChoices.addEventListener("click", () => {
    beep(520, 0.05, "triangle", 0.02);
    showStage(stageAsk);
  });

  // ===== Scan steps =====
  let scanTimer = null;
  let scanIndex = 0;
  let scanSteps = [];

  function logLine(pill, text) {
    const li = document.createElement("li");
    const p = document.createElement("span");
    p.className = "pill";
    p.textContent = pill;

    const t = document.createElement("span");
    t.textContent = text;

    li.appendChild(p);
    li.appendChild(t);
    scanLog.appendChild(li);
    scanLog.scrollTop = scanLog.scrollHeight;
  }

  function resetScanUI() {
    scanLog.innerHTML = "";
    progressBar.style.width = "0%";
    btnProceed.disabled = true;
    scanIndex = 0;
    if (scanTimer) clearInterval(scanTimer);
    scanTimer = null;
  }

  function buildScanSteps({ mood, coffee, dateMode }) {
    const her = getHer();
    const you = getYou();

    const moodLine = {
      soft: "Soft & cozy mode detected. Approved.",
      chaos: "Chaos-but-cute energy detected. Strangely perfect.",
      boss: "Main character energy detected. I’m impressed and slightly intimidated.",
      sleepy: "Sleepy mode detected. Scheduling coffee rescue."
    }[mood] || "Vibe detected. Approved.";

    const coffeeLine = {
      latte: "Latte chosen. Taste = elite.",
      americano: "Americano chosen. Respectfully intense.",
      espresso: "Espresso chosen. That’s powerful behavior.",
      tea: "Tea chosen. Still valid. Still adored."
    }[coffee] || "Beverage alignment confirmed.";

    const dateLine = {
      cafe: "Date mode: cute café + talk forever. That sounds like us.",
      art: "Date mode: art date + wandering. You’d make it beautiful.",
      swim: "Date mode: swim + warm food. Iconic combination.",
      movie: "Date mode: movie night + blankets. Dangerous levels of cozy."
    }[dateMode] || "Date mode: confirmed.";

    return [
      { pill: "INFO", text: `Booting Valentine Protocol for ${her}…` },
      { pill: "PASS", text: moodLine },
      { pill: "PASS", text: coffeeLine },
      { pill: "PASS", text: dateLine },
      { pill: "PASS", text: `Running “do I miss you?” test… result: yes. Always.` },
      { pill: "PASS", text: `Integrity check: ${you} is annoyingly serious about ${her}. Confirmed.` },
      { pill: "OK", text: "Verdict: Accepted. Officially." }
    ];
  }

  function startScan() {
    dodgeEnabled = false;

    btnNo.style.position = "";
    btnNo.style.left = "";
    btnNo.style.top = "";

    const mood = moodSelect.value || "soft";
    const coffee = coffeeSelect.value || "latte";
    const dateMode = dateSelect.value || "cafe";

    scanSteps = buildScanSteps({ mood, coffee, dateMode });

    resetScanUI();
    showStage(stageScan);

    logLine("INFO", "Initializing romance protocol…");
    beep(660, 0.05, "triangle", 0.02);

    scanTimer = setInterval(() => {
      const step = scanSteps[scanIndex];
      const pct = Math.round(((scanIndex + 1) / scanSteps.length) * 100);
      progressBar.style.width = `${pct}%`;

      logLine(step.pill, step.text);
      beep(720 + scanIndex * 22, 0.05, "sine", 0.018);

      scanIndex++;

      if (scanIndex >= scanSteps.length) {
        clearInterval(scanTimer);
        scanTimer = null;
        btnProceed.disabled = false;
        beep(980, 0.06, "triangle", 0.025);
      }
    }, 700);
  }

  btnRunScan.addEventListener("click", startScan);

  btnAbort.addEventListener("click", () => {
    beep(180, 0.10, "square", 0.03);
    logLine("WARN", "Abort requested… denied (romance protocol is non-optional).");
  });

  btnProceed.addEventListener("click", () => {
    beep(880, 0.05, "triangle", 0.03);
    finalizeYes();
  });

  // ===== Confetti =====
  let W = 0, H = 0;
  let confetti = [];
  let raf = null;

  function resize() {
    if (!canvas || !ctx) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = Math.floor(window.innerWidth * dpr);
    H = Math.floor(window.innerHeight * dpr);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnConfetti(burst = 180) {
    if (!canvas || !ctx) return;
    const originX = W * 0.5;
    const originY = H * 0.20;

    for (let i = 0; i < burst; i++) {
      confetti.push({
        x: originX + rand(-50, 50),
        y: originY + rand(-40, 40),
        vx: rand(-3.4, 3.4),
        vy: rand(1.6, 5.6),
        w: rand(6, 14),
        h: rand(8, 18),
        rot: rand(0, Math.PI),
        vr: rand(-0.13, 0.13),
        g: rand(0.05, 0.12),
        life: rand(150, 240)
      });
    }
  }

  function drawConfetti() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, W, H);

    confetti = confetti.filter(p => p.life > 0 && p.y < H + 40);

    for (const p of confetti) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      const t = (p.life % 70) / 70;
      const r = Math.floor(255 - 35 * t);
      const g = Math.floor(90 + 25 * t);
      const b = Math.floor(210 + 25 * t);
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (confetti.length > 0) raf = requestAnimationFrame(drawConfetti);
    else raf = null;
  }

  function confettiBurst() {
    if (!canvas || !ctx) return;
    spawnConfetti(180);
    spawnConfetti(120);
    if (!raf) drawConfetti();
  }

  window.addEventListener("resize", resize);
  resize();

  // ===== Finalize =====
  function finalizeYes() {
    applyNames();
    showStage(stageYes);
    confettiBurst();

    if (PHOTOS.length) buildUIFromPhotos();
    memoryMessage.textContent = `Unlocked: Memory Vault. Tap a photo, ${getHer()}.`;
  }

  // ===== Copy love note =====
  btnCopy.addEventListener("click", async () => {
    const loveNote = $("#loveNote");
    const text = (loveNote?.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
    try {
      await navigator.clipboard.writeText(text);
      beep(880, 0.05, "triangle", 0.03);
      btnCopy.textContent = "Copied";
      setTimeout(() => (btnCopy.textContent = "Copy love note"), 1200);
    } catch (_) {
      btnCopy.textContent = "Copy failed";
      setTimeout(() => (btnCopy.textContent = "Copy love note"), 1200);
    }
  });

  // ===== Replay =====
  btnReplay.addEventListener("click", () => {
    beep(660, 0.05, "triangle", 0.02);
    dodgeEnabled = true;
    hintText.textContent = "Tip: “No” exists for comedic purposes.";
    showStage(stageIntro || stageAsk);
  });

  // ===== Easter Egg =====
  const secret = ["v", "a", "l", "e"];
  let secretIndex = 0;

  window.addEventListener("keydown", (e) => {
    const k = (e.key || "").toLowerCase();
    if (k === secret[secretIndex]) {
      secretIndex++;
      if (secretIndex === secret.length) {
        secretIndex = 0;
        confettiBurst();
        openPopup("Hidden Ending Unlocked", `${getHer()}, you discovered the secret path. Result confirmed: smartest, most captivating, and permanently my favorite person. This was always rigged in your favor.`);
        beep(1000, 0.06);
      }
    } else {
      secretIndex = 0;
    }
  });

  // ===== Start =====
  showStage(stageIntro || stageAsk);
})();