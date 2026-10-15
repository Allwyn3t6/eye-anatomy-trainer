import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GROUPS, PARTS, TOUR, MCQ, LESSONS, REFERENCES } from './data.js';

const $ = (s) => document.querySelector(s);
const GROUP = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
const SEE_THROUGH = new Set(['Cornea', 'AqueousHumor', 'VitreousBody']);
const HOME = { pos: [5.4, 2.4, 6.6], target: [0, 0, -0.6] };

// ---------- storage (per-viewer convenience only) ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('eyeTrainer:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('eyeTrainer:' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

// ---------- renderer / scene ----------
const viewer = $('#viewer');
const canvas = $('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.localClippingEnabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3442, 0.5));
const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(4, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0xa9c8ff, 0.8); rim.position.set(-5, 2, -5); scene.add(rim);

const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
camera.position.fromArray(HOME.pos);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 1.2;
controls.maxDistance = 18;
controls.autoRotateSpeed = 1.2;
controls.target.fromArray(HOME.target);

// Cutaway removes the medial (x > 0) half so the inside is visible from the nasal side.
const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

const state = {
  explode: 0, explodeTarget: 0,
  labels: true, cut: false, muscles: true, spin: false,
  selected: null, hidden: new Set(), isolate: null, focus: null,
  quizMark: null, tab: 'explore', tourIndex: 0, quiz: null,
};
const parts = {};
let tween = null;

// ---------- load model ----------
new GLTFLoader().load('models/eye.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  for (const [id, def] of Object.entries(PARTS)) {
    const node = def.mesh ? model.getObjectByName(def.mesh) : null;
    const anchor = model.getObjectByName('anchor_' + id);
    const p = { id, def, node, anchor, meshes: [], base: node ? node.position.clone() : null, offset: new THREE.Vector3(...def.explode) };
    if (node) {
      node.traverse((o) => {
        if (!o.isMesh) return;
        o.material = o.material.clone();
        const m = o.material;
        m.side = THREE.DoubleSide;
        if (m.transparent) { m.depthWrite = false; o.renderOrder = 2; }
        if (SEE_THROUGH.has(id)) { m.roughness = 0.05; m.metalness = 0; }
        m.userData = { emissive: m.emissive.clone(), ei: m.emissiveIntensity, opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite };
        o.userData.partId = id;
        p.meshes.push(o);
      });
    }
    parts[id] = p;
  }
  buildLabels();
  applyCut();
  applyVisibility();
  applyLook();
  $('#loading').classList.add('done');
}, undefined, (err) => {
  $('#loading').innerHTML = '<span>Could not load models/eye.glb. If you opened index.html directly from disk, serve the folder over HTTP (GitHub Pages or <code>python -m http.server</code>).</span>';
  console.error(err);
});

// ---------- helpers ----------
const partOf = (id) => parts[id];
const meshPartId = (id) => (PARTS[id].highlight || id);
function isVisible(id) {
  const def = PARTS[id];
  const nid = meshPartId(id);
  if (state.hidden.has(id) || state.hidden.has(nid)) return false;
  if (def.group === 'muscles' && !state.muscles) return false;
  if (state.isolate && !state.isolate.has(id) && !state.isolate.has(nid)) return false;
  return true;
}
function clippable(id) { return PARTS[id].group !== 'muscles'; }

function applyVisibility() {
  for (const p of Object.values(parts)) if (p.node) p.node.visible = isVisible(p.id);
  renderList();
}
function applyCut() {
  for (const p of Object.values(parts)) for (const o of p.meshes) {
    o.material.clippingPlanes = state.cut && clippable(p.id) ? [clipPlane] : [];
    o.material.needsUpdate = true;
  }
  $('#btnCut').classList.toggle('on', state.cut);
}
// Highlight selection / quiz marks; ghost everything outside the tour focus.
function applyLook() {
  const sel = state.selected ? meshPartId(state.selected) : null;
  const focusMesh = state.focus ? new Set([...state.focus].map(meshPartId)) : null;
  for (const p of Object.values(parts)) for (const o of p.meshes) {
    const m = o.material, u = m.userData;
    let color = null;
    if (state.quizMark && state.quizMark.id === p.id) color = state.quizMark.color;
    else if (sel === p.id) color = 0x2f8cff;
    else if (focusMesh && focusMesh.has(p.id)) color = 0x2f8cff;
    if (color != null) { m.emissive.setHex(color); m.emissiveIntensity = sel === p.id || state.quizMark ? 0.55 : 0.3; }
    else { m.emissive.copy(u.emissive); m.emissiveIntensity = u.ei; }
    const ghost = focusMesh && !focusMesh.has(p.id);
    const wantT = ghost ? true : u.transparent;
    if (m.transparent !== wantT) m.needsUpdate = true;
    m.transparent = wantT;
    // see-through humours are boosted when they are the focus so they can be seen
    const boosted = SEE_THROUGH.has(p.id) && ((focusMesh && focusMesh.has(p.id)) || sel === p.id || (state.quizMark && state.quizMark.id === p.id));
    m.opacity = ghost ? Math.min(u.opacity, 0.09) : boosted ? Math.max(u.opacity, 0.45) : u.opacity;
    m.depthWrite = ghost ? false : u.depthWrite;
  }
  document.querySelectorAll('.label').forEach((el) => el.classList.toggle('selected', el.dataset.id === state.selected));
}

// ---------- labels with leader lines ----------
const labelsEl = $('#labels');
const leadersEl = $('#leaders');
function buildLabels() {
  for (const p of Object.values(parts)) {
    if (!p.anchor) continue;
    const el = document.createElement('div');
    el.className = 'label';
    el.textContent = p.def.name;
    el.dataset.id = p.id;
    el.addEventListener('click', (e) => { e.stopPropagation(); select(p.id, true); });
    labelsEl.appendChild(el);
    p.label = el;
  }
}
const tmpV = new THREE.Vector3();
// Hide labels whose anchor is hidden behind another solid structure (checked a few times per second).
const occRay = new THREE.Raycaster();
let occFrame = 0;
function updateOcclusion() {
  const meshes = [];
  for (const p of Object.values(parts)) if (p.node && isVisible(p.id) && !SEE_THROUGH.has(p.id)) {
    if (state.focus && !new Set([...state.focus].map(meshPartId)).has(p.id)) continue;
    meshes.push(...p.meshes);
  }
  const a = new THREE.Vector3();
  for (const p of Object.values(parts)) {
    if (!p.anchor) continue;
    p.anchor.getWorldPosition(a);
    if (state.cut && clippable(p.id)) a.x = -Math.abs(a.x);
    const dir = a.clone().sub(camera.position);
    const dist = dir.length();
    occRay.set(camera.position, dir.normalize());
    occRay.far = dist - 0.06;
    const own = meshPartId(p.id);
    p.occluded = occRay.intersectObjects(meshes, false).some((h) => {
      const id = h.object.userData.partId;
      if (id === own) return false;
      if (state.cut && clippable(id) && h.point.x > 0.001) return false;
      return true;
    });
  }
}
function updateLabels() {
  if (state.labels && occFrame++ % 6 === 0) updateOcclusion();
  const w = viewer.clientWidth, h = viewer.clientHeight;
  const items = [];
  for (const p of Object.values(parts)) {
    if (!p.label) continue;
    const show = state.labels && isVisible(p.id) && !p.occluded && (!state.focus || state.focus.has(p.id));
    if (!show) { p.label.style.display = 'none'; continue; }
    p.anchor.getWorldPosition(tmpV);
    if (state.cut && clippable(p.id)) tmpV.x = -Math.abs(tmpV.x);
    tmpV.project(camera);
    if (tmpV.z > 1) { p.label.style.display = 'none'; continue; }
    p.label.style.display = 'block';
    if (!p.lw) p.lw = p.label.offsetWidth;
    items.push({ p, sx: (tmpV.x * 0.5 + 0.5) * w, sy: (-tmpV.y * 0.5 + 0.5) * h });
  }
  const cx = w / 2;
  const gap = w < 600 ? 19 : 24;
  const top = 34, bottom = h - (w < 600 ? 96 : 70);
  let svg = '';
  for (const side of ['L', 'R']) {
    const col = items.filter((i) => (side === 'L' ? i.sx < cx : i.sx >= cx)).sort((a, b) => a.sy - b.sy);
    if (!col.length) continue;
    // stack labels in a column, keeping them apart vertically
    let y = top - gap;
    for (const it of col) { it.y = Math.max(it.sy, y + gap); y = it.y; }
    let next = bottom + gap;
    for (let i = col.length - 1; i >= 0; i--) { col[i].y = Math.min(col[i].y, next - gap); next = col[i].y; }
    for (const it of col) it.y = Math.max(it.y, top);
    const maxW = Math.max(...col.map((i) => i.p.lw || 100));
    if (side === 'L') {
      const edge = Math.max(8 + maxW, Math.min(...col.map((i) => i.sx)) - 50);
      for (const it of col) {
        it.p.label.style.left = (edge - it.p.lw) + 'px'; it.p.label.style.top = it.y + 'px';
        svg += `<line x1="${it.sx}" y1="${it.sy}" x2="${edge}" y2="${it.y}"/><circle cx="${it.sx}" cy="${it.sy}" r="2.6"/>`;
      }
    } else {
      const edge = Math.min(w - 8 - maxW, Math.max(...col.map((i) => i.sx)) + 50);
      for (const it of col) {
        it.p.label.style.left = edge + 'px'; it.p.label.style.top = it.y + 'px';
        svg += `<line x1="${it.sx}" y1="${it.sy}" x2="${edge}" y2="${it.y}"/><circle cx="${it.sx}" cy="${it.sy}" r="2.6"/>`;
      }
    }
  }
  leadersEl.innerHTML = svg;
}

// ---------- camera tween ----------
function flyTo(pos, target, ms = 900) {
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(...pos), t1: new THREE.Vector3(...target), start: performance.now(), ms };
}
function focusPart(id) {
  const p = parts[id];
  if (!p || !p.anchor) return;
  p.anchor.getWorldPosition(tmpV);
  if (state.cut && clippable(id)) tmpV.x = -Math.abs(tmpV.x);
  const dir = camera.position.clone().sub(controls.target).normalize();
  const dist = PARTS[id].group === 'muscles' ? 6.0 : 4.6;
  flyTo(tmpV.clone().addScaledVector(dir, dist).toArray(), tmpV.toArray());
}

// ---------- picking ----------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const meshes = [];
  for (const p of Object.values(parts)) if (p.node && isVisible(p.id)) meshes.push(...p.meshes);
  const hits = raycaster.intersectObjects(meshes, false).filter((h) => {
    const id = h.object.userData.partId;
    if (state.cut && clippable(id) && h.point.x > 0.001) return false;
    if (state.focus && !new Set([...state.focus].map(meshPartId)).has(id)) return false;
    return true;
  });
  const solid = hits.find((h) => !SEE_THROUGH.has(h.object.userData.partId));
  const hit = solid || hits[0];
  return hit ? hit.object.userData.partId : null;
}
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
  const id = pick(e);
  if (state.tab === 'quiz' && state.quiz && state.quiz.mode === 'find') { if (id) quizFindClick(id); return; }
  if (id) select(id, false); else if (state.tab === 'explore') select(null);
});
canvas.addEventListener('dblclick', (e) => {
  if (state.tab !== 'explore') return;
  const id = pick(e);
  if (id) { state.isolate = new Set([id]); applyVisibility(); select(id); focusPart(id); }
});
const tooltip = $('#tooltip');
let hoverRAF = 0;
canvas.addEventListener('pointermove', (e) => {
  if (hoverRAF) return;
  hoverRAF = requestAnimationFrame(() => {
    hoverRAF = 0;
    const quizHide = state.tab === 'quiz' && state.quiz;
    const id = e.buttons ? null : pick(e);
    if (id && !quizHide) {
      const r = viewer.getBoundingClientRect();
      tooltip.hidden = false; tooltip.textContent = PARTS[id].name;
      tooltip.style.left = (e.clientX - r.left) + 'px'; tooltip.style.top = (e.clientY - r.top) + 'px';
      canvas.style.cursor = 'pointer';
    } else { tooltip.hidden = true; canvas.style.cursor = ''; }
  });
});
canvas.addEventListener('pointerleave', () => { tooltip.hidden = true; });

// ---------- selection + info panel ----------
function select(id, fly) {
  state.selected = id;
  applyLook();
  renderList();
  if (state.tab !== 'explore' && id) setTab('explore', { keepView: true });
  renderInfo();
  if (id && fly) focusPart(id);
}
function renderInfo() {
  const el = $('#info');
  const id = state.selected;
  if (!id) {
    el.innerHTML = `<div class="empty"><h2>Select a structure</h2>
      <p>Click any part of the 3D eye, a label, or a structure in the list to see its anatomy, function and clinical relevance.</p>
      <ul class="hints"><li><b>Drag</b> to rotate · <b>scroll / pinch</b> to zoom · <b>right-drag</b> to pan</li>
      <li><b>Explode</b> separates the layers; <b>Cutaway</b> shows the inside.</li><li><b>Double-click</b> a part to isolate it.</li></ul></div>`;
    return;
  }
  const d = PARTS[id];
  el.innerHTML = `
    <p class="eyebrow">${GROUP[d.group].name}</p>
    <h2>${d.name}</h2>
    <p class="latin">${d.latin}</p>
    <p class="summary">${d.summary}</p>
    <div class="row-actions">
      <button class="btn" data-act="focus">Zoom to</button>
      <button class="btn ghost" data-act="isolate">${state.isolate ? 'Show all' : 'Isolate'}</button>
    </div>
    <h3>Structure</h3><p>${d.structure}</p>
    <h3>Function</h3><p>${d.function}</p>
    <h3>Clinical relevance</h3><p class="clinical">${d.clinical}</p>
    ${d.facts && d.facts.length ? `<h3>Key facts</h3><ul>${d.facts.map((f) => `<li>${f}</li>`).join('')}</ul>` : ''}`;
  el.querySelector('[data-act="focus"]').onclick = () => focusPart(id);
  el.querySelector('[data-act="isolate"]').onclick = () => {
    state.isolate = state.isolate ? null : new Set([id]);
    applyVisibility(); renderInfo();
    if (state.isolate) focusPart(id);
  };
}

// ---------- sidebar list ----------
function renderList() {
  const q = ($('#search').value || '').trim().toLowerCase();
  const list = $('#partList');
  list.innerHTML = '';
  for (const g of GROUPS) {
    const ids = Object.keys(PARTS).filter((id) => PARTS[id].group === g.id && (!q || PARTS[id].name.toLowerCase().includes(q) || PARTS[id].latin.toLowerCase().includes(q)));
    if (!ids.length) continue;
    const wrap = document.createElement('div');
    wrap.className = 'group';
    const allShown = ids.every((id) => !state.hidden.has(id)) && (g.id !== 'muscles' || state.muscles);
    wrap.innerHTML = `<div class="group-head"><span class="swatch" style="background:${g.color}"></span>${g.name}
      <label title="Show or hide this group"><input type="checkbox" ${allShown ? 'checked' : ''}></label></div>`;
    wrap.querySelector('input').onchange = (e) => {
      if (g.id === 'muscles') { state.muscles = e.target.checked; $('#btnMuscles').classList.toggle('on', state.muscles); }
      for (const id of ids) e.target.checked ? state.hidden.delete(id) : state.hidden.add(id);
      applyVisibility();
    };
    for (const id of ids) {
      const b = document.createElement('button');
      b.className = 'part-item' + (state.selected === id ? ' selected' : '') + (isVisible(id) ? '' : ' hidden-part');
      b.innerHTML = `<span>${PARTS[id].name}</span><span class="eye" title="Show / hide" data-eye>${state.hidden.has(id) ? '○' : '◉'}</span>`;
      b.onclick = (e) => {
        if (e.target.closest('[data-eye]')) {
          state.hidden.has(id) ? state.hidden.delete(id) : state.hidden.add(id);
          applyVisibility(); return;
        }
        if (state.tab === 'quiz' && state.quiz) return;
        select(id, true);
      };
      wrap.appendChild(b);
    }
    list.appendChild(wrap);
  }
}
$('#search').addEventListener('input', renderList);

// ---------- toolbar ----------
const slider = $('#explode');
slider.addEventListener('input', () => { state.explode = state.explodeTarget = +slider.value; syncExplodeBtn(); });
function syncExplodeBtn() { $('#btnExplode').classList.toggle('on', state.explodeTarget > 0.5); }
function setExplode(v) { state.explodeTarget = v; syncExplodeBtn(); }
$('#btnExplode').onclick = () => setExplode(state.explodeTarget > 0.5 ? 0 : 1);
$('#btnLabels').onclick = (e) => { state.labels = !state.labels; e.currentTarget.classList.toggle('on', state.labels); };
$('#btnCut').onclick = () => { state.cut = !state.cut; applyCut(); };
$('#btnMuscles').onclick = (e) => { state.muscles = !state.muscles; e.currentTarget.classList.toggle('on', state.muscles); applyVisibility(); };
$('#btnSpin').onclick = (e) => { state.spin = !state.spin; controls.autoRotate = state.spin; e.currentTarget.classList.toggle('on', state.spin); };
$('#btnReset').onclick = () => resetView();
function resetView() {
  state.isolate = null; state.hidden.clear(); state.muscles = true; $('#btnMuscles').classList.add('on');
  state.cut = false; applyCut(); setExplode(0);
  applyVisibility();
  flyTo(HOME.pos, HOME.target);
  if (state.tab === 'explore') select(null);
}

// ---------- tabs ----------
document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => setTab(t.dataset.tab)));
function setTab(tab, opts = {}) {
  const prev = state.tab;
  state.tab = tab;
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + tab));
  if (prev === 'quiz' && tab !== 'quiz') endQuiz();
  if (tab !== 'tour') state.focus = null;
  if (tab === 'tour') showTour(state.tourIndex);
  if (tab === 'quiz') renderQuizMenu();
  if (tab === 'learn') renderLearn();
  applyLook();
  if (!opts.keepView && tab === 'explore') renderInfo();
}

// ---------- guided tour ----------
function showTour(i) {
  state.tourIndex = Math.max(0, Math.min(TOUR.length - 1, i));
  const s = TOUR[state.tourIndex];
  $('#tourStep').textContent = `Step ${state.tourIndex + 1} of ${TOUR.length}`;
  $('#tourTitle').textContent = s.title;
  $('#tourText').textContent = s.text;
  $('#tourBar').style.width = ((state.tourIndex + 1) / TOUR.length * 100) + '%';
  $('#tourParts').innerHTML = s.parts.map((id) => `<button class="pill" data-id="${id}">${PARTS[id].name}</button>`).join('');
  $('#tourParts').querySelectorAll('.pill').forEach((b) => (b.onclick = () => select(b.dataset.id, true)));
  $('#tourPrev').disabled = state.tourIndex === 0;
  $('#tourNext').textContent = state.tourIndex === TOUR.length - 1 ? 'Finish ✓' : 'Next →';
  state.isolate = null;
  state.hidden.clear();
  if (s.parts.some((id) => PARTS[id].group === 'muscles')) { state.muscles = true; $('#btnMuscles').classList.add('on'); }
  state.focus = s.parts.length ? new Set(s.parts) : null;
  state.selected = null;
  state.cut = s.cut ?? s.cutaway; applyCut();
  setExplode(s.explode);
  applyVisibility(); applyLook();
  const target = s.parts.some((id) => PARTS[id].group === 'muscles') ? [0, 0, -1.2] : HOME.target;
  // tour views give a direction; keep enough distance to frame the whole globe
  const v = new THREE.Vector3(...s.view);
  v.setLength(Math.max(v.length() * 1.45, 7.0));
  flyTo(v.toArray(), target, 1200);
}
$('#tourPrev').onclick = () => showTour(state.tourIndex - 1);
$('#tourNext').onclick = () => {
  if (state.tourIndex === TOUR.length - 1) { store.set('tourDone', true); setTab('quiz'); return; }
  showTour(state.tourIndex + 1);
};

// ---------- quiz ----------
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const MODES = {
  find: { name: 'Find it on the model', desc: 'A structure is named; click it on the 3D eye. Labels are hidden.' },
  name: { name: 'Name the highlighted structure', desc: 'A structure glows on the model; pick its name.' },
  mcq: { name: 'Concepts & clinical MCQ', desc: 'Function, nerve supply and clinical questions.' },
};
function renderQuizMenu() {
  state.quiz = null; state.quizMark = null; applyLook();
  const best = store.get('best', {});
  $('#quiz').innerHTML = `<h2>Test yourself</h2><p class="muted">Ten questions per round. Your best scores are saved in this browser.</p>
    <div class="mode-list">${Object.entries(MODES).map(([k, m]) => `
      <button class="mode-card" data-mode="${k}"><b>${m.name}</b><span>${m.desc}${best[k] != null ? ` · Best: ${best[k]}/10` : ''}</span></button>`).join('')}</div>`;
  $('#quiz').querySelectorAll('.mode-card').forEach((b) => (b.onclick = () => startQuiz(b.dataset.mode)));
}
function startQuiz(mode) {
  const meshIds = Object.keys(PARTS).filter((id) => PARTS[id].mesh);
  let questions;
  if (mode === 'mcq') questions = shuffle(MCQ).slice(0, 10);
  else questions = shuffle(meshIds).slice(0, 10).map((id) => ({ id }));
  state.quiz = { mode, questions, i: 0, score: 0, answered: false, savedLabels: state.labels };
  state.labels = false; $('#btnLabels').classList.remove('on');
  state.isolate = null; state.hidden.clear(); state.focus = null; state.selected = null;
  state.muscles = true; $('#btnMuscles').classList.add('on');
  state.cut = true; applyCut(); setExplode(mode === 'mcq' ? 0.3 : 0.55);
  applyVisibility();
  flyTo([5.2, 2.2, 3.4], HOME.target);
  renderQuestion();
}
function endQuiz() {
  if (!state.quiz) return;
  state.labels = state.quiz.savedLabels; $('#btnLabels').classList.toggle('on', state.labels);
  state.quiz = null; state.quizMark = null; applyLook();
}
function renderQuestion() {
  const qz = state.quiz; const el = $('#quiz');
  if (qz.i >= qz.questions.length) return renderQuizEnd();
  qz.answered = false; state.quizMark = null;
  const q = qz.questions[qz.i];
  const meta = `<div class="q-meta"><span>${MODES[qz.mode].name}</span><span>Q ${qz.i + 1}/${qz.questions.length} · Score ${qz.score}</span></div>`;
  if (qz.mode === 'find') {
    el.innerHTML = `${meta}<p class="eyebrow">Click on the model</p><p class="q-text">${PARTS[q.id].name}</p>
      <p class="muted">Tip: rotate, zoom and use the Explode slider or Cutaway to reach inner structures.</p>
      <div id="fb"></div><div class="tour-nav"><button class="btn ghost" id="qSkip">Reveal</button><button class="btn" id="qNext" disabled>Next →</button></div>`;
    $('#qSkip').onclick = () => { if (!qz.answered) quizFindClick(null); };
  } else {
    let opts, answer;
    if (qz.mode === 'name') {
      const others = shuffle(Object.keys(PARTS).filter((id) => id !== q.id && PARTS[id].mesh)).slice(0, 3);
      opts = shuffle([q.id, ...others]).map((id) => ({ id, text: PARTS[id].name }));
      answer = opts.findIndex((o) => o.id === q.id);
      state.quizMark = { id: q.id, color: 0xffb020 };
      applyLook(); focusPart(q.id);
    } else {
      opts = q.options.map((t) => ({ text: t }));
      answer = q.a;
    }
    q._answer = answer;
    el.innerHTML = `${meta}<p class="q-text">${qz.mode === 'name' ? 'Which structure is highlighted in orange?' : q.q}</p>
      <div class="options">${opts.map((o, k) => `<button class="option" data-k="${k}">${o.text}</button>`).join('')}</div>
      <div id="fb"></div><div class="tour-nav"><span></span><button class="btn" id="qNext" disabled>Next →</button></div>`;
    el.querySelectorAll('.option').forEach((b) => (b.onclick = () => answerOption(+b.dataset.k)));
  }
  $('#qNext').onclick = () => { qz.i++; renderQuestion(); };
}
function answerOption(k) {
  const qz = state.quiz; if (qz.answered) return;
  qz.answered = true;
  const q = qz.questions[qz.i];
  const ok = k === q._answer;
  if (ok) qz.score++;
  document.querySelectorAll('.option').forEach((b, i) => {
    b.disabled = true;
    if (i === q._answer) b.classList.add('correct'); else if (i === k) b.classList.add('wrong');
  });
  const partId = qz.mode === 'name' ? q.id : q.part;
  state.quizMark = { id: meshPartId(partId), color: 0x22c55e }; applyLook();
  if (qz.mode === 'mcq') focusPart(partId);
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">${ok ? 'Correct!' : 'Not quite.'} ${PARTS[partId].summary}</div>`;
  $('#qNext').disabled = false;
}
function quizFindClick(id) {
  const qz = state.quiz; if (qz.answered) return;
  const q = qz.questions[qz.i];
  const ok = id === q.id;
  if (!ok && id) { // wrong pick: brief red flash, allow one more try? Keep it simple: one attempt.
    state.quizMark = { id, color: 0xef4444 }; applyLook();
  }
  qz.answered = true;
  if (ok) qz.score++;
  setTimeout(() => { state.quizMark = { id: q.id, color: 0x22c55e }; applyLook(); focusPart(q.id); }, ok ? 0 : 600);
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">${ok ? 'Correct!' : id ? `That was the ${PARTS[id].name}.` : 'Here it is.'} ${ok ? '' : `The ${PARTS[q.id].name} is highlighted in green.`}</div>`;
  $('#qNext').disabled = false;
}
function renderQuizEnd() {
  const qz = state.quiz;
  const best = store.get('best', {});
  const isBest = best[qz.mode] == null || qz.score > best[qz.mode];
  if (isBest) { best[qz.mode] = qz.score; store.set('best', best); }
  state.quizMark = null; applyLook();
  $('#quiz').innerHTML = `<p class="eyebrow">${MODES[qz.mode].name}</p><div class="score-big">${qz.score}/10</div>
    <p>${qz.score >= 9 ? 'Excellent: you know your eye anatomy.' : qz.score >= 6 ? 'Good work. Review the structures you missed in the Explore tab.' : 'Keep practising. The guided tour is a good refresher.'}${isBest ? ' <b>New best!</b>' : ''}</p>
    <div class="tour-nav"><button class="btn ghost" id="qMenu">All quizzes</button><button class="btn" id="qAgain">Try again</button></div>`;
  $('#qMenu').onclick = () => { endQuiz(); renderQuizMenu(); };
  $('#qAgain').onclick = () => { const m = qz.mode; endQuiz(); startQuiz(m); };
}

// ---------- learn ----------
function renderLearn() {
  $('#learn').innerHTML = `<h2>Study notes</h2><p class="muted">Core concepts that support the 3D model.</p>
    ${LESSONS.map((l, i) => `<details ${i === 0 ? 'open' : ''}><summary>${l.title}</summary><div class="body">${l.html}</div></details>`).join('')}
    <details><summary>References</summary><div class="body"><ol>${REFERENCES.map((r) => `<li>${r}</li>`).join('')}</ol></div></details>
    <p class="disclaimer">This is an educational schematic of a right eye. Proportions are simplified, and small structures such as the canal of Schlemm and the zonules are enlarged for visibility. It is not a substitute for clinical training.</p>`;
}

// ---------- resize + loop ----------
function resize() {
  const w = viewer.clientWidth, h = viewer.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < 600 ? 45 : 35;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewer);
resize();

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function loop(now) {
  requestAnimationFrame(loop);
  if (tween) {
    const t = Math.min(1, (now - tween.start) / tween.ms), k = ease(t);
    camera.position.lerpVectors(tween.p0, tween.p1, k);
    controls.target.lerpVectors(tween.t0, tween.t1, k);
    if (t >= 1) tween = null;
  }
  if (Math.abs(state.explode - state.explodeTarget) > 0.001) {
    state.explode += (state.explodeTarget - state.explode) * 0.12;
    slider.value = state.explode;
  }
  for (const p of Object.values(parts)) if (p.node) p.node.position.copy(p.base).addScaledVector(p.offset, state.explode);
  controls.update();
  renderer.render(scene, camera);
  updateLabels();
}
requestAnimationFrame(loop);

renderList();
if (!store.get('tourDone', false)) {
  // First visit: nudge towards the guided tour.
  $('.tab[data-tab="tour"]').textContent = 'Guided tour •';
}
