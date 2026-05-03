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
    ctx.fillStyle = 'rgba(0,117,93,0.09)';

    for (let i = 0; i < dots.length; i++) {
      const d  = dots[i];
      const dx = d.bx - mx, dy = d.by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let px = d.bx, py = d.by;
      if (dist < WARP_RADIUS && dist > 0) {
        const f = (1 - dist / WARP_RADIUS) * WARP_FORCE;
        px += (dx / dist) * f;
        py += (dy / dist) * f;
      }
      ctx.beginPath();
      ctx.arc(px, py, DOT_R, 0, Math.PI * 2);
      ctx.fill();
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

  // Track position
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  // Show / hide when entering / leaving the viewport
  document.addEventListener('mouseenter', () => dot.classList.remove('cursor-hidden'));
  document.addEventListener('mouseleave', () => dot.classList.add('cursor-hidden'));

  // Expand to ring over anything interactive
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

// ── Typewriter tooltips on nav data-hover ───────────────────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a[data-hover]').forEach(link => {
      let timer = null;
      let tip   = null;

      link.addEventListener('mouseenter', () => {
        const text = link.dataset.hover;
        tip = document.createElement('span');
        tip.className = 'nav-tooltip';
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
  // Works for both filename URLs (index.html) and clean Vercel URLs (/notes)
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
