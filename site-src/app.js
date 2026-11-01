// Fortis Net Lease — progressive enhancement only; the page is complete without this file.
(() => {
  const d = document, root = d.documentElement, $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // Header slides away on scroll down, returns on scroll up.
  const hdr = $(".hdr"); let last = scrollY;
  addEventListener("scroll", () => { const y = scrollY; hdr.classList.toggle("up", y > 500 && y > last); last = y; }, { passive: true });

  // Mobile menu.
  const menu = $("#menu"), burger = $(".burger");
  const setMenu = (on) => { menu.classList.toggle("open", on); menu.setAttribute("aria-hidden", String(!on)); burger.setAttribute("aria-expanded", String(on)); d.body.style.overflow = on ? "hidden" : ""; };
  burger.addEventListener("click", () => setMenu(true)); $(".menu__x").addEventListener("click", () => setMenu(false));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Reveals and survey lines.
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$("[data-r], .survey").forEach((el) => reduce ? el.classList.add("in") : io.observe(el));

  // Counters on the proof band: animate the figure already in the HTML.
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, html = el.innerHTML, m = el.textContent.match(/^(\D*)([\d,.]+)(.*)$/); if (!m || reduce) return;
    const target = parseFloat(m[2].replace(/,/g, "")), comma = m[2].includes(","), t0 = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - t0) / 1500), v = Math.round(target * (1 - Math.pow(1 - p, 4)));
      el.innerHTML = p < 1 ? html.replace(m[2], comma ? v.toLocaleString("en-US") : v) : html; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  // The deal deck: real listings fanned in a stack; the top card deals off every few seconds.
  const deck = $(".deck");
  if (deck) {
    const cards = $$(".dcard", deck); let top = 0, timer;
    const lay = () => cards.forEach((c, i) => {
      const k = (i - top + cards.length) % cards.length, vis = k < 4;
      c.style.zIndex = String(cards.length - k);
      c.style.opacity = vis ? "1" : "0";
      c.style.transform = `translate(-50%,-50%) translate(${k * 18}px,${k * -10}px) rotate(${k * 3.2 - 2}deg) scale(${1 - k * .045})`;
      c.style.pointerEvents = k === 0 ? "auto" : "none";
      c.setAttribute("aria-hidden", String(k !== 0));
    });
    const deal = (dir = 1) => {
      const c = cards[top];
      if (!reduce && dir > 0) { c.style.transform = "translate(-50%,-50%) translate(-60%,30px) rotate(-14deg)"; c.style.opacity = "0"; }
      setTimeout(() => { top = (top + dir + cards.length) % cards.length; lay(); $("#dn").textContent = String(top + 1).padStart(2, "0"); $$(".hero__bg img").forEach((im, i) => { if (i === top && !im.complete) im.loading = "eager"; im.classList.toggle("on", i === top); }); }, reduce ? 0 : 260);
    };
    const play = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => deal(1), 5000); };
    lay(); play();
    deck.addEventListener("pointerenter", () => clearInterval(timer)); deck.addEventListener("pointerleave", play);
    cards.forEach((c) => c.addEventListener("click", () => deal(1)));
    $("#dprev").addEventListener("click", () => deal(-1)); $("#dnext").addEventListener("click", () => deal(1));
    let sx = 0; deck.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    deck.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) deal(dx < 0 ? 1 : -1); });
  }

  // Contours: faint topographic lines from a smooth noise field, drifting very slowly.
  const cv = $(".hero__topo");
  if (cv) {
    const ctx = cv.getContext("2d"); let W, H, dpr;
    const size = () => { dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);
    // a sum of a few soft waves stands in for terrain; contour lines are drawn by marching squares
    const field = (x, y, t) => Math.sin(x * .0042 + t * .03) * Math.cos(y * .0051 - t * .02) + .6 * Math.sin((x + y) * .0029 + 1.3) + .45 * Math.cos(x * .0071 - y * .0033 + t * .025);
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H); const s = 14, cols = Math.ceil(W / s) + 1, rows = Math.ceil(H / s) + 1, v = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v[j * cols + i] = field(i * s, j * s, t);
      for (let L = -1.6; L <= 1.6; L += .2) {
        const major = Math.abs(L % .8) < .01;
        ctx.strokeStyle = major ? "rgba(31,122,90,.20)" : "rgba(13,42,34,.075)"; ctx.lineWidth = major ? 1.1 : .8; ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
          const a = v[j * cols + i], b = v[j * cols + i + 1], c = v[(j + 1) * cols + i + 1], e = v[(j + 1) * cols + i];
          const k = (a > L) | ((b > L) << 1) | ((c > L) << 2) | ((e > L) << 3); if (k === 0 || k === 15) continue;
          const x = i * s, y = j * s, lp = (p, q) => (L - p) / (q - p);
          const T = [x + s * lp(a, b), y], R = [x + s, y + s * lp(b, c)], B = [x + s * lp(e, c), y + s], Lf = [x, y + s * lp(a, e)];
          const seg = { 1: [Lf, T], 2: [T, R], 3: [Lf, R], 4: [R, B], 5: [Lf, T, R, B], 6: [T, B], 7: [Lf, B], 8: [B, Lf], 9: [B, T], 10: [T, R, B, Lf], 11: [B, R], 12: [R, Lf], 13: [R, T], 14: [T, Lf] }[k];
          for (let n = 0; n < seg.length; n += 2) { ctx.moveTo(seg[n][0], seg[n][1]); ctx.lineTo(seg[n + 1][0], seg[n + 1][1]); }
        }
        ctx.stroke();
      }
    };
    if (reduce) draw(0);
    else { let t = 0, lastT = 0; const loop = (now) => { if (now - lastT > 90 && cv.getBoundingClientRect().bottom > 0) { t += .09; draw(t); lastT = now; } requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }

  // Listing filter chips.
  const chips = $(".chips");
  if (chips) chips.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", chips).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    let n = 0; $$(".card").forEach((c) => { const on = b.dataset.v === "all" || c.dataset.sec === b.dataset.v; c.hidden = !on; n += on; });
    $("#lcount").textContent = `${n} shown`;
  });

  // Valuation: show the record with this tenant before anything is submitted.
  const vt = $("#vt"), REC = window.RECORD || [];
  if (vt) {
    const money = (s) => +String(s || "").replace(/[^0-9.]/g, "") || 0, fmt = (p) => p >= 1e6 ? "$" + (p / 1e6).toFixed(1) + "M" : "$" + Math.round(p / 1e3) + "K";
    vt.addEventListener("input", () => {
      const q = vt.value.trim().toLowerCase(), h = $("#mh"), ul = $("#ml"), sum = $("#ms");
      if (q.length < 2) { h.textContent = "Type a tenant to see it."; h.classList.add("dim"); ul.innerHTML = ""; sum.textContent = ""; return; }
      const hits = REC.filter((r) => r[0].toLowerCase().includes(q)); h.classList.remove("dim");
      h.textContent = hits.length ? `${hits.length} ${vt.value.trim()} sale${hits.length > 1 ? "s" : ""} on our published record.` : `No ${vt.value.trim()} sales on the published record yet.`;
      ul.innerHTML = hits.slice(0, 5).map((r, i) => `<li style="animation-delay:${i * 60}ms">${r[3] ? `<img src="${r[3]}" alt="">` : "<span></span>"}<span>${r[0]}<small>${r[1]}</small></span><em>${r[2]}</em></li>`).join("");
      sum.textContent = hits.length ? `${fmt(hits.reduce((a, r) => a + money(r[2]), 0))} closed with this tenant.` : "An advisor will price it from comparable sales.";
    });
    $("#vform").addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target, msg = $("#vmsg");
      if (!f.tenant.value.trim()) { msg.textContent = "Add the tenant so we know which property."; f.tenant.focus(); return; }
      if (!/^\S+@\S+\.\S+$/.test(f.email.value)) { msg.textContent = "Add an email so the advisor can send the valuation."; f.email.focus(); return; }
      location.href = `mailto:info@fortisnetlease.com?subject=${encodeURIComponent("Valuation request: " + f.tenant.value)}&body=${encodeURIComponent(`Tenant: ${f.tenant.value}\nEmail: ${f.email.value}`)}`;
      msg.textContent = "Your email app should open with the request addressed to info@fortisnetlease.com.";
    });
  }

  // ---- presence ----
  // Smooth, weighted scrolling.
  if (!reduce && window.Lenis) {
    const lenis = new window.Lenis({ lerp: .09, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const el = a.getAttribute("href").length > 1 && $(a.getAttribute("href")); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80 }); } }));
  }
  // Header: dusk over the hero, daylight after it.
  const hero = $(".hero");
  const day = () => hdr.classList.toggle("day", scrollY > hero.offsetHeight - 90);
  addEventListener("scroll", day, { passive: true }); day();
  // Copper foil catches the pointer like metal.
  addEventListener("pointermove", (e) => root.style.setProperty("--fx", (10 + 60 * e.clientX / innerWidth).toFixed(1) + "%"), { passive: true });
  // The deck leans toward the pointer; light slides across the top card.
  const tilt = $(".deck__tilt");
  if (tilt && !reduce && matchMedia("(hover:hover)").matches) {
    deck.addEventListener("pointermove", (e) => { const r = deck.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.setProperty("--ry", (x * 10).toFixed(2) + "deg"); tilt.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      $$(".dcard", deck).forEach((c) => { c.style.setProperty("--lx", (x * 100 + 50) + "%"); c.style.setProperty("--ly", (y * 100 + 50) + "%"); }); });
    deck.addEventListener("pointerleave", () => { tilt.style.setProperty("--ry", "0deg"); tilt.style.setProperty("--rx", "0deg"); });
  }
  // Listing cards: a soft highlight follows the pointer.
  $$(".card").forEach((c) => c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--lx", ((e.clientX - r.left) / r.width * 100) + "%"); c.style.setProperty("--ly", ((e.clientY - r.top) / r.height * 100) + "%"); }));
  // Featured photo settles as it scrolls through.
  const feat = $(".feat");
  if (feat && !reduce) addEventListener("scroll", () => { const r = feat.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (innerHeight + r.height))); feat.style.setProperty("--fs", (1.14 - p * .14).toFixed(3)); }, { passive: true });
  // Headlines rise word by word out of a mask. Words inside a foil span carry the foil themselves.
  if (!reduce) $$("h1, .t2").forEach((h) => {
    let w = 0;
    const walk = (node, foil) => [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) { const f = d.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => { if (!/\S/.test(t)) return f.append(t); const o = d.createElement("span"); o.className = "wm"; const i = d.createElement("span"); i.textContent = t; i.style.setProperty("--w", w++); if (foil) i.className = "foil"; o.append(i); f.append(o); }); c.replaceWith(f); }
      else if (c.nodeType === 1) { const isFoil = c.classList.contains("foil"); if (isFoil) c.classList.remove("foil"); walk(c, foil || isFoil); }
    });
    walk(h, false); h.removeAttribute("data-r");
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { h.classList.add("split-in"); o.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" }).observe(h);
  });
  // Palette study (temporary): ?p=name or the switcher; the choice is remembered.
  const pal = $(".pal");
  if (pal) {
    let p = new URLSearchParams(location.search).get("p"); try { p = p || localStorage.getItem("fnl-p"); } catch {}
    const set = (k) => { root.dataset.p = k; $$("button", pal).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === k))); try { localStorage.setItem("fnl-p", k); } catch {} };
    set(p || "forest"); pal.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) set(b.dataset.p); });
  }
})();
