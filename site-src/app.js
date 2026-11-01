// Fortis Net Lease — progressive enhancement only; every page works without this file.
(() => {
  const d = document, root = d.documentElement;
  root.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header: solid after the hero, hides on scroll down, returns on scroll up.
  const hdr = d.querySelector(".hdr");
  if (hdr) {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      if (!hdr.classList.contains("hdr--light")) hdr.classList.toggle("is-solid", y > 40);
      hdr.classList.toggle("is-hidden", y > 400 && y > last && !d.body.classList.contains("menu-open"));
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu (dialog semantics, focus kept inside, Esc closes).
  const menu = d.getElementById("menu"), burger = d.querySelector(".burger");
  if (menu && burger) {
    const open = (on) => {
      menu.classList.toggle("is-open", on);
      menu.setAttribute("aria-hidden", String(!on));
      burger.setAttribute("aria-expanded", String(on));
      d.body.classList.toggle("menu-open", on);
      d.body.style.overflow = on ? "hidden" : "";
      (on ? menu.querySelector("a,button") : burger).focus();
    };
    burger.addEventListener("click", () => open(true));
    menu.querySelector(".menu__close").addEventListener("click", () => open(false));
    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") open(false);
      if (e.key !== "Tab") return;
      const f = [...menu.querySelectorAll("a,button")], first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && d.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
  }

  // Scroll reveals.
  const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" }) : null;
  d.querySelectorAll("[data-reveal]").forEach((el) => io ? io.observe(el) : el.classList.add("in"));
  // Safety net: a fast fling can skip an observer callback, so anything already above the fold is revealed.
  if (io) {
    let tick = 0;
    addEventListener("scroll", () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        d.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) { el.classList.add("in"); io.unobserve(el); } });
      });
    }, { passive: true });
  }

  // Counters: animate the figure already present in the HTML (e.g. "$1.6B", "$535M", "19").
  const countIO = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, final = el.textContent, m = final.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) return;
    const [, pre, n, post] = m, target = parseFloat(n), dec = (n.split(".")[1] || "").length, t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), v = target * (1 - Math.pow(1 - p, 4));
      el.textContent = pre + v.toFixed(dec) + post;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 }) : null;
  if (countIO) d.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  // Filter chips (portfolio, team): buttons with aria-pressed filter items by data-group.
  d.querySelectorAll("[data-filter]").forEach((bar) => {
    const items = d.querySelectorAll(bar.dataset.filter), live = d.getElementById(bar.dataset.live);
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-value]");
      if (!b) return;
      bar.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let n = 0;
      items.forEach((it) => { const show = b.dataset.value === "all" || it.dataset.group.split(" ").includes(b.dataset.value); it.hidden = !show; n += show; });
      if (live) live.textContent = `${n} shown`;
    });
  });

  // Platform columns: one open at a time (click/hover/focus everywhere; scroll-driven on desktop below).
  const cols = [...d.querySelectorAll(".col")];
  const openCol = (i) => cols.forEach((c, j) => { c.classList.toggle("is-open", i === j); c.querySelector(".col__tab").setAttribute("aria-expanded", String(i === j)); });
  cols.forEach((c, i) => {
    c.querySelector(".col__tab").addEventListener("click", () => openCol(i));
    if (matchMedia("(hover:hover)").matches) c.addEventListener("mouseenter", () => openCol(i));
  });

  // Scroll choreography (GSAP + ScrollTrigger + Lenis, self-hosted; the page is complete without them).
  const motion = !reduce && window.gsap && window.ScrollTrigger;
  if (motion) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new window.Lenis({ lerp: .1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      d.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const el = d.querySelector(a.getAttribute("href")); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -90 }); } }));
    }

    // Shutters: each marked section opens through six vertical posts that lift away in sequence.
    d.querySelectorAll("[data-shutter]").forEach((sec) => {
      if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
      const sh = d.createElement("div");
      sh.className = "shutter"; sh.setAttribute("aria-hidden", "true");
      sh.innerHTML = "<i></i>".repeat(6);
      const bg = sec.classList.contains("phero") ? "var(--saffron)" : "var(--midnight)";
      sh.style.setProperty("--shutter", bg);
      sec.prepend(sh);
      const atTop = sec.getBoundingClientRect().top < innerHeight;
      gsap.to(sh.children, { scaleY: 0, duration: 1.1, ease: "expo.inOut", stagger: { each: .07, from: "start" }, delay: atTop ? .1 : 0,
        scrollTrigger: atTop ? undefined : { trigger: sec, start: "top 80%" }, onComplete: () => sh.remove() });
    });

    // Sentences rise out of their masks.
    d.querySelectorAll("[data-lines]").forEach((p) => gsap.from(p.querySelectorAll(".ln > span"), { yPercent: 105, duration: 1.2, ease: "expo.out", stagger: .14, scrollTrigger: { trigger: p, start: "top 80%" } }));

    // Skyline figures: each post grows from the ground, then its figure counts up (counter observer).
    gsap.utils.toArray(".post").forEach((p, i) => {
      gsap.fromTo(p.querySelector(".post__bar"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "expo.out", delay: i * .12, scrollTrigger: { trigger: ".skyline", start: "top 75%" } });
      gsap.from(p.querySelectorAll("dt,dd"), { y: 30, opacity: 0, duration: 1, ease: "expo.out", delay: .35 + i * .12, scrollTrigger: { trigger: ".skyline", start: "top 75%" } });
    });

    // Platforms: on desktop the section pins and each column opens in turn as you scroll.
    if (cols.length) ScrollTrigger.matchMedia({
      "(min-width: 1000px)": () => {
        ScrollTrigger.create({ trigger: ".cols", start: "top top", end: () => "+=" + innerHeight * 1.6, pin: ".cols__pin", scrub: true,
          onUpdate: (s) => { const i = Math.min(cols.length - 1, Math.floor(s.progress * cols.length * .999)); if (!cols[i].classList.contains("is-open")) openCol(i); } });
      },
    });

    // Case study: the brand panel rises like a post.
    if (d.querySelector(".case__panel")) {
      gsap.fromTo(".case__panel", { clipPath: "inset(100% 0% 0% 0% round 1.5rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".case", start: "top 70%" } });
      gsap.from(".case__panel > *", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: .1, delay: .6, scrollTrigger: { trigger: ".case", start: "top 70%" } });
    }

    // Headings rise in from below.
    d.querySelectorAll(".d2").forEach((h) => gsap.from(h, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } }));

    // Inner pages: headline words rise, hero media drifts, list-like blocks enter in sequence.
    d.querySelectorAll(".phero h1, .profile h1").forEach((h) => {
      const walk = (node) => [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) { const frag = d.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => frag.append(/\S/.test(t) ? Object.assign(d.createElement("span"), { className: "wm", innerHTML: `<span>${t.replace(/</g, "&lt;")}</span>` }) : t)); c.replaceWith(frag); }
        else if (c.nodeType === 1) walk(c);
      });
      walk(h);
      gsap.from(h.querySelectorAll(".wm > span"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .045, delay: .5 });
    });
    gsap.utils.toArray(".phero .eyebrow, .phero .lede, .phero .byline, .phero .crumbs").forEach((el, i) => gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: "expo.out", delay: .7 + i * .08 }));
    gsap.utils.toArray(".phero__media img").forEach((im) => gsap.fromTo(im, { scale: 1.15, yPercent: 0 }, { scale: 1, yPercent: 12, ease: "none", scrollTrigger: { trigger: im.closest(".phero"), start: "top top", end: "bottom top", scrub: true } }));
    const stagger = (sel, item) => gsap.utils.toArray(sel).forEach((g) => {
      const kids = g.querySelectorAll(item);
      kids.forEach((k) => { io?.unobserve(k); k.removeAttribute("data-reveal"); });
      if (kids.length) gsap.fromTo(kids, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: .06, scrollTrigger: { trigger: g, start: "top 85%" } });
    });
    stagger(".pgrid", ".pcard"); stagger(".people", ".person"); stagger(".alist", ".arow"); stagger(".crit", "div"); stagger(".pillars", ".pillar"); stagger(".tl", "li"); stagger(".kv", "div"); stagger(".proof", "div"); stagger(".platforms", ".plat"); stagger(".tri", ":scope > div"); stagger(".advisors ul", "li");
    gsap.utils.toArray(".profile__img img, .co-logo img").forEach((im) => gsap.from(im, { scale: 1.12, opacity: 0, duration: 1.4, ease: "expo.out" }));
    gsap.utils.toArray(".prose > p, .prose > h2").forEach((p) => gsap.from(p, { y: 24, opacity: 0, duration: .9, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 92%" } }));
    addEventListener("load", () => ScrollTrigger.refresh());
  }

  // Forms: compose a structured email to the firm (no third-party processor until one is approved).
  d.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form), lines = [];
      for (const [k, v] of fd) if (v) lines.push(`${k}: ${v}`);
      const subject = `${form.dataset.subject} — ${fd.get("Name") || ""}`.trim();
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      const s = form.querySelector(".form-status");
      if (s) s.textContent = `Your email app should now open with this message addressed to ${form.dataset.mailto}. If it doesn't, write to us there directly.`;
    });
  });
})();

// Portfolio wall: each column loops endlessly, alternate columns flowing in opposite directions.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".pwall__col").forEach((c, i) => {
    [...c.children].forEach((n) => { const k = n.cloneNode(true); k.setAttribute("aria-hidden", "true"); k.tabIndex = -1; c.appendChild(k); });
    c.style.animationDuration = `${30 + i * 5}s`;
    c.classList.add("is-flow", +c.dataset.dir > 0 ? "is-down" : "is-up");
  });
  // Hover eases the flow to a slow drift (never a stop) so a card can be read and clicked.
  const wall = document.querySelector(".pwall__cols");
  if (wall) {
    let rate = 1, target = 1, raf = 0;
    const step = () => {
      rate += (target - rate) * .06;
      wall.getAnimations({ subtree: true }).filter((a) => a.animationName).forEach((a) => { a.playbackRate = rate; });
      raf = Math.abs(target - rate) > .005 ? requestAnimationFrame(step) : 0;
    };
    const set = (t) => { target = t; if (!raf) raf = requestAnimationFrame(step); };
    wall.addEventListener("pointerenter", () => set(.3));
    wall.addEventListener("pointerleave", () => set(1));
  }
}
