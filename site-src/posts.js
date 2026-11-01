// Hero skyline: one post of light per live listing, west to east, as tall as its asking price.
// Posts rise from left to right on load, then lean gently toward the pointer. Pointing at a post names the property.
(() => {
  const cv = document.getElementById("posts"), tip = document.getElementById("ptip");
  if (!cv || !window.POSTS) return;
  const P = window.POSTS, ctx = cv.getContext("2d"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr, mx = -1, my = -1, lean = 0, t0 = performance.now(), hit = -1;
  const size = () => { dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener("resize", size);
  const hero = cv.parentElement;
  hero.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => { mx = my = -1; });
  const frame = (now) => {
    if (cv.getBoundingClientRect().bottom > 0) {
      const T = (now - t0) / 1000, n = P.length, x0 = W * .04, x1 = W * .96, base = H * .99, amp = H * .62;
      lean += ((mx < 0 ? 0 : (mx / W - .5)) - lean) * .05;
      ctx.clearRect(0, 0, W, H);
      let best = -1, bd = 18;
      for (let i = 0; i < n; i++) {
        const [h] = P[i], x = x0 + (x1 - x0) * (i + .5) / n;
        const rise = reduce ? 1 : Math.min(1, Math.max(0, (T - .3 - i * .018) / 1.1)), e = 1 - Math.pow(1 - rise, 3);
        const top = base - (24 + h * amp) * e, dx = lean * 26 * (1 - (top / H));
        const near = mx >= 0 ? Math.max(0, 1 - Math.abs(mx - x) / 140) : 0;
        const g = ctx.createLinearGradient(0, top, 0, base);
        g.addColorStop(0, `rgba(255,210,94,${.55 + .45 * near})`); g.addColorStop(.35, `rgba(155,92,255,${.28 + .3 * near})`); g.addColorStop(1, "rgba(61,90,254,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.2 + 1.6 * near;
        ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x + dx, top); ctx.stroke();
        ctx.fillStyle = `rgba(255,226,150,${.7 + .3 * near})`; ctx.beginPath(); ctx.arc(x + dx, top, 1.6 + 1.6 * near, 0, 7); ctx.fill();
        const d = Math.abs(mx - x); if (my > 0 && my > top - 20 && d < bd) { bd = d; best = i; }
      }
      if (best !== hit) { hit = best; tip.innerHTML = hit < 0 ? "" : `<b>${P[hit][1]}</b> · ${P[hit][2]} · ${P[hit][3]}`; }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
