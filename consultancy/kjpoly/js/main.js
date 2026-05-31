// ── Tab navigation ──
function goTab(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(b => b.classList.remove('on'));
  document.getElementById('tab-' + id).classList.add('on');
  if (btn) btn.classList.add('on');
  window.scrollTo(0, 0);
}

// ── Accordion — pass group name to make siblings mutually exclusive ──
function tog(head, group) {
  const acc = head.closest('.acc');
  const isOpen = acc.classList.contains('open');
  if (group) {
    document.querySelectorAll('.acc[data-grp="' + group + '"]').forEach(a => a.classList.remove('open'));
  }
  if (!isOpen) acc.classList.add('open');
}

// ── Navigate to a tab by name (for inline links) ──
function goTabTo(id) {
  const map = { overview: 0, lab: 1, course: 2 };
  goTab(id, document.querySelectorAll('.ntab')[map[id]]);
}

// ── Lab visual image tabs ──
function switchLabImg(n, btn) {
  document.querySelectorAll('.lv-panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.lvt').forEach(b => b.classList.remove('on-g', 'on-b', 'on-p'));
  document.getElementById('lv-' + n).classList.add('on');
  btn.classList.add(n === 1 ? 'on-g' : 'on-b');
}
