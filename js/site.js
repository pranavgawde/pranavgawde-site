/* site.js — shared interactive layer for pranavgawde.in */

// ── Warping dot grid ──────────────────────────────────────────────────────────
(function () {
  const canvas = document.createElement('canvas');
  canvas.className = 'bg-waves';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  const SPACING     = 36;
  const DOT_R       = 1.4;
  const WARP_RADIUS = 100;
  const WARP_FORCE  = 16;

  let W, H, dots;
  let mx = -9999, my = -9999;

  function build() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const cols = Math.ceil(W / SPACING) + 2;
    const rows = Math.ceil(H / SPACING) + 2;
    dots = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({ bx: c * SPACING, by: r * SPACING });
  }

  window.addEventListener('resize', build, { passive: true });
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  build();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Pass 1: base dots (not warped) at low opacity
    ctx.fillStyle = 'rgba(0,117,93,0.09)';
    ctx.beginPath();
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = d.bx - mx, dy = d.by - my;
      const dist2 = dx * dx + dy * dy;
      if (dist2 >= WARP_RADIUS * WARP_RADIUS) {
        ctx.moveTo(d.bx + DOT_R, d.by);
        ctx.arc(d.bx, d.by, DOT_R, 0, Math.PI * 2);
      }
    }
    ctx.fill();

    // Pass 2: warped dots at enhanced opacity
    for (let i = 0; i < dots.length; i++) {
      const d  = dots[i];
      const dx = d.bx - mx, dy = d.by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < WARP_RADIUS && dist > 0) {
        const ratio = 1 - dist / WARP_RADIUS;
        const f  = ratio * WARP_FORCE;
        const px = d.bx + (dx / dist) * f;
        const py = d.by + (dy / dist) * f;
        const alpha = (0.09 + ratio * 0.38).toFixed(2);
        ctx.fillStyle = `rgba(0,117,93,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ── Custom cursor (pointer/mouse devices only) ──────────────────────────────
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.body.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseenter', () => dot.classList.remove('cursor-hidden'));
  document.addEventListener('mouseleave', () => dot.classList.add('cursor-hidden'));

  const interactive = 'a, button, label, [role="button"], .mosaic-cell, .note-card, .consult-item, .category-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) dot.classList.add('is-link');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) dot.classList.remove('is-link');
  });
}

// ── Page subtitle typewriter on load ────────────────────────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page-subtitle').forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';
      let i = 0;
      setTimeout(() => {
        const timer = setInterval(() => {
          el.textContent = text.slice(0, ++i);
          if (i >= text.length) clearInterval(timer);
        }, 22);
      }, 250);
    });
  });
})();

// ── Typewriter tooltips on nav and footer nav data-hover ────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a[data-hover], .footer-nav a[data-hover]').forEach(link => {
      const isFooter = link.closest('.footer-nav') !== null;
      let timer = null;
      let tip   = null;

      link.addEventListener('mouseenter', () => {
        const text = link.dataset.hover;
        tip = document.createElement('span');
        tip.className = isFooter ? 'footer-tip' : 'nav-tooltip';
        link.appendChild(tip);
        let i = 0;
        timer = setInterval(() => {
          tip.textContent = text.slice(0, ++i);
          if (i >= text.length) clearInterval(timer);
        }, 38);
      });

      link.addEventListener('mouseleave', () => {
        clearInterval(timer);
        if (tip) { tip.remove(); tip = null; }
      });
    });
  });
})();

// ── Active nav link ─────────────────────────────────────────────────────────
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const match =
      href === page ||
      href.replace('.html', '') === page ||
      href.replace('.html', '') === page.replace('.html', '');
    if (match) a.classList.add('active');
  });
})();

// ── Wordmark hover: "pranavgawde" → "pranav gawde" ──────────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.wordmark').forEach(el => {
      const nameEl = el.querySelector('.wordmark-name');
      if (!nameEl) return;
      el.addEventListener('mouseenter', () => { nameEl.textContent = 'pranav gawde'; });
      el.addEventListener('mouseleave', () => { nameEl.textContent = 'pranavgawde'; });
    });
  });
})();

// ── Social preview cards (LinkedIn / Behance / Instagram hover) ─────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.social-preview-wrap').forEach(wrap => {
      const card  = wrap.querySelector('.social-preview-card');
      const link  = wrap.querySelector('a');
      if (!card || !link) return;

      wrap.addEventListener('mouseenter', () => { card.style.opacity = '1'; card.style.pointerEvents = 'none'; });
      wrap.addEventListener('mouseleave', () => { card.style.opacity = '0'; });
    });
  });
})();
