/**
 * AutoTech UG — Admin Dashboard JavaScript
 * Full CRUD: Add, Edit, Delete, Image Upload, Export
 * Persistence: localStorage (export to sync with live site)
 */

/* ── Auth ─────────────────────────────────────────────────────── */
(function () {
  const HASH = '311dd86684a13e4da76ea1661658c1c60d71c94a1636a23d1c2ef846302ebcd3'; // AutoTech2025
  const SESSION_KEY = 'atug_auth';

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const screen  = document.getElementById('loginScreen');
  const form    = document.getElementById('loginForm');
  const pwInput = document.getElementById('loginPw');
  const toggle  = document.getElementById('pwToggle');
  const errEl   = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  function showError(msg) {
    errEl.textContent = msg;
    errEl.classList.add('show');
    pwInput.style.borderColor = 'var(--red)';
  }
  function clearError() {
    errEl.classList.remove('show');
    pwInput.style.borderColor = '';
  }

  // Check existing session
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    screen.classList.add('hidden');
  }

  // Toggle password visibility
  toggle.addEventListener('click', () => {
    const show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    toggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
  });

  // Login submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying…';
    const hash = await sha256(pwInput.value);
    if (hash === HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      screen.classList.add('hidden');
    } else {
      showError('Incorrect password. Please try again.');
      pwInput.value = '';
      pwInput.focus();
    }
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-unlock"></i> Sign In';
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  pwInput.addEventListener('input', clearError);
})();

/* ── Dashboard ────────────────────────────────────────────────── */
(function () {
  'use strict';

  const STORE_KEY = 'atug_products_v2';

  /* ── Load data ──────────────────────────────────────────────── */
  function load() {
    try {
      const s = localStorage.getItem(STORE_KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return JSON.parse(JSON.stringify(PRODUCTS));
  }
  function save(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); }
    catch (e) { toast('Storage error — export data manually', 'error'); }
  }

  let prods = load();

  /* ── Helpers ────────────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  function fmt(p) { return Number(p).toLocaleString('en-UG'); }
  function cats()  {
    const m = {};
    prods.forEach(p => { const c = p.category || 'General'; m[c] = (m[c] || 0) + 1; });
    return m;
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ── Toast ──────────────────────────────────────────────────── */
  const toastEl = $('toast');
  let toastT;
  function toast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = `toast ${type} show`;
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.className = 'toast'; }, 3200);
  }

  /* ── Navigation ─────────────────────────────────────────────── */
  const SEC_TITLES = {
    dashboard:     'Dashboard',
    products:      'Manage Products',
    'add-product': 'Add Product',
    settings:      'Store Settings'
  };

  function nav(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-section]').forEach(n =>
      n.classList.toggle('active', n.dataset.section === id)
    );
    const sec = $(`sec-${id}`);
    if (sec) sec.classList.add('active');
    $('topbarTitle').textContent = SEC_TITLES[id] || id;

    if (id === 'dashboard')   renderDashboard();
    if (id === 'products')    renderAdminGrid();
    if (id === 'add-product') resetForm();
  }

  /* Expose globally for onclick in HTML */
  window.nav = nav;

  document.querySelectorAll('.nav-item[data-section]').forEach(n => {
    n.addEventListener('click', e => { e.preventDefault(); nav(n.dataset.section); });
  });

  /* ── Sidebar mobile ─────────────────────────────────────────── */
  $('menuBtn').addEventListener('click', () => $('sidebar').classList.toggle('open'));
  $('sbClose').addEventListener('click', () => $('sidebar').classList.remove('open'));

  /* ── Dashboard ──────────────────────────────────────────────── */
  function renderDashboard() {
    const withImg = prods.filter(p => p.image).length;
    $('dTotal').textContent  = prods.length;
    $('dCats').textContent   = Object.keys(cats()).length;
    $('dImages').textContent = withImg;
    $('dNoImg').textContent  = prods.length - withImg;

    /* Recent products table */
    const tbody = $('recentTbl').querySelector('tbody');
    tbody.innerHTML = '';
    [...prods].reverse().slice(0, 8).forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-name">${p.name}</td>
        <td>${p.category || '—'}</td>
        <td class="td-price">UGX ${fmt(p.price)}</td>
        <td><span class="img-badge ${p.image ? 'img-yes' : 'img-no'}">${p.image ? 'Yes' : 'No'}</span></td>`;
      tbody.appendChild(tr);
    });

    /* Category bars */
    const cMap = cats();
    const maxN = Math.max(...Object.values(cMap), 1);
    const bars = $('catBars');
    bars.innerHTML = '';
    Object.entries(cMap).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
      const pct = Math.round((n / maxN) * 100);
      bars.innerHTML += `
        <div class="cat-row">
          <div class="cat-row-hdr">
            <span class="cat-row-lbl">${c}</span>
            <span class="cat-row-cnt">${n} parts</span>
          </div>
          <div class="cat-bar"><div class="cat-fill" style="width:0" data-w="${pct}%"></div></div>
        </div>`;
    });
    setTimeout(() => {
      bars.querySelectorAll('.cat-fill').forEach(el => { el.style.width = el.dataset.w; });
    }, 80);
  }

  /* ── Admin product grid ─────────────────────────────────────── */
  let searchQ = '';
  let catFilter = 'all';

  function renderAdminGrid() {
    /* Rebuild category filter */
    const catSel = $('pCatFilter');
    const prev = catSel.value;
    catSel.innerHTML = '<option value="all">All Categories</option>';
    Object.keys(cats()).forEach(c => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      if (c === prev) o.selected = true;
      catSel.appendChild(o);
    });

    const q = searchQ.toLowerCase();
    const list = prods.filter(p => {
      const mc = catFilter === 'all' || p.category === catFilter;
      const ms = !q || (p.name||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q);
      return mc && ms;
    });

    const grid = $('adminGrid');
    grid.innerHTML = '';

    if (!list.length) {
      grid.innerHTML = `<div style="color:var(--text3);padding:40px;text-align:center;grid-column:1/-1">No products found</div>`;
      return;
    }

    list.forEach(p => {
      const icon = 'fas ' + (CATEGORY_ICONS[p.category] || CATEGORY_ICONS['default']);
      const div = document.createElement('div');
      div.className = 'apc';
      div.innerHTML = `
        <div class="apc-img" data-id="${p.id}">
          ${p._blob ? `<img src="${p._blob}" alt="${p.name}">` : p.image ? `<img src="../images/products/${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : `<i class="${icon}"></i>`}
          ${!p.image ? `<div class="no-img-tag">No Image</div>` : ''}
          <div class="apc-overlay"><i class="fas fa-camera"></i><span>Upload Image</span></div>
        </div>
        <div class="apc-body">
          <div class="apc-cat">${p.category || 'General'}</div>
          <div class="apc-name">${p.name}</div>
          <div class="apc-price">UGX ${fmt(p.price)}</div>
        </div>
        <div class="apc-btns">
          <button class="apc-btn apc-edit" data-id="${p.id}"><i class="fas fa-pen"></i> Edit</button>
          <button class="apc-btn apc-img-btn" data-id="${p.id}"><i class="fas fa-image"></i></button>
          <button class="apc-btn apc-del" data-id="${p.id}"><i class="fas fa-trash"></i></button>
        </div>`;
      div.querySelector('.apc-img').addEventListener('click', () => triggerImgUpload(p.id));
      div.querySelector('.apc-edit').addEventListener('click', () => editProduct(p.id));
      div.querySelector('.apc-img-btn').addEventListener('click', () => triggerImgUpload(p.id));
      div.querySelector('.apc-del').addEventListener('click', () => confirmDelete(p.id));
      grid.appendChild(div);
    });
  }

  $('pSearch').addEventListener('input', e => { searchQ = e.target.value; renderAdminGrid(); });
  $('pCatFilter').addEventListener('change', e => { catFilter = e.target.value; renderAdminGrid(); });

  /* ── Image upload (from grid) ───────────────────────────────── */
  let uploadTargetId = null;
  const hiddenFile = document.createElement('input');
  hiddenFile.type = 'file'; hiddenFile.accept = 'image/*'; hiddenFile.style.display = 'none';
  document.body.appendChild(hiddenFile);

  function triggerImgUpload(id) {
    uploadTargetId = id;
    hiddenFile.value = '';
    hiddenFile.click();
  }
  hiddenFile.addEventListener('change', () => {
    const file = hiddenFile.files[0];
    if (!file || !uploadTargetId) return;
    const idx = prods.findIndex(p => p.id === uploadTargetId);
    if (idx === -1) return;
    const fname = `${uploadTargetId}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    prods[idx].image = fname;
    prods[idx]._blob = URL.createObjectURL(file);
    save(prods);
    renderAdminGrid();
    toast(`Image set for "${prods[idx].name}"`);
  });

  /* ── Product form ───────────────────────────────────────────── */
  let formImgFile = null;

  function resetForm() {
    $('productForm').reset();
    $('fpId').value = '';
    formImgFile = null;
    $('imgPreview').style.display = 'none';
    $('uploadPlaceholder').style.display = 'flex';
    $('removeImg').style.display = 'none';
    $('formTitle').innerHTML = 'Add <span class="acc">Product</span>';
    $('formSub').textContent  = 'Fill in the product details below';
    /* Populate category datalist */
    const dl = $('catList'); dl.innerHTML = '';
    Object.keys(cats()).forEach(c => {
      const o = document.createElement('option'); o.value = c; dl.appendChild(o);
    });
  }

  function editProduct(id) {
    const p = prods.find(x => x.id === id);
    if (!p) return;
    nav('add-product');
    setTimeout(() => {
      $('fpId').value      = p.id;
      $('fpName').value    = p.name;
      $('fpCat').value     = p.category || '';
      $('fpPrice').value   = p.price;
      $('fpCurrency').value= p.currency || 'UGX';
      $('fpDesc').value    = p.description || '';
      $('fpPhone').value   = p.phone || '256757169673';
      $('formTitle').innerHTML = 'Edit <span class="acc">Product</span>';
      $('formSub').textContent = p.name;
      if (p.image || p._blob) {
        $('imgPreview').src = p._blob || `../images/products/${p.image}`;
        $('imgPreview').style.display = 'block';
        $('uploadPlaceholder').style.display = 'none';
        $('removeImg').style.display = 'flex';
      }
    }, 50);
  }

  /* Upload area events */
  const uploadArea = $('uploadArea');
  const fpImage    = $('fpImage');
  const imgPreview = $('imgPreview');

  uploadArea.addEventListener('click', () => fpImage.click());
  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--acc)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.style.borderColor = '';
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFormImg(f);
  });
  fpImage.addEventListener('change', () => { if (fpImage.files[0]) handleFormImg(fpImage.files[0]); });

  function handleFormImg(file) {
    formImgFile = file;
    imgPreview.src = URL.createObjectURL(file);
    imgPreview.style.display = 'block';
    $('uploadPlaceholder').style.display = 'none';
    $('removeImg').style.display = 'flex';
  }
  $('removeImg').addEventListener('click', e => {
    e.stopPropagation();
    formImgFile = null;
    imgPreview.src = ''; imgPreview.style.display = 'none';
    $('uploadPlaceholder').style.display = 'flex';
    $('removeImg').style.display = 'none';
    fpImage.value = '';
  });

  /* Form submit */
  $('productForm').addEventListener('submit', e => {
    e.preventDefault();
    const id       = $('fpId').value;
    const name     = $('fpName').value.trim();
    const category = $('fpCat').value.trim();
    const price    = $('fpPrice').value;
    const currency = $('fpCurrency').value;
    const desc     = $('fpDesc').value.trim();
    const phone    = $('fpPhone').value;
    const imgFname = formImgFile
      ? `${id || 'new'}_${formImgFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      : null;

    if (id) {
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) {
        prods[idx] = {
          ...prods[idx], name, category, price, currency, description: desc, phone,
          ...(imgFname ? { image: imgFname, _blob: formImgFile ? URL.createObjectURL(formImgFile) : prods[idx]._blob } : {})
        };
        toast(`"${name}" updated`);
      }
    } else {
      prods.push({
        id: uid(), name, category, price, currency, description: desc, phone,
        image: imgFname || '',
        ...(imgFname && formImgFile ? { _blob: URL.createObjectURL(formImgFile) } : {})
      });
      toast(`"${name}" added`);
    }
    save(prods);
    nav('products');
  });

  $('formCancel').addEventListener('click', () => nav('products'));

  /* ── Delete ─────────────────────────────────────────────────── */
  const deleteModal = $('deleteModal');
  let delId = null;

  function confirmDelete(id) {
    const p = prods.find(x => x.id === id);
    if (!p) return;
    delId = id;
    $('delMsg').textContent = `Delete "${p.name}"? This cannot be undone.`;
    deleteModal.classList.add('open');
  }
  $('delCancel').addEventListener('click', () => { deleteModal.classList.remove('open'); delId = null; });
  $('delConfirm').addEventListener('click', () => {
    if (!delId) return;
    const idx = prods.findIndex(p => p.id === delId);
    if (idx !== -1) {
      const name = prods[idx].name;
      prods.splice(idx, 1);
      save(prods); renderAdminGrid();
      toast(`"${name}" deleted`);
    }
    deleteModal.classList.remove('open'); delId = null;
  });
  deleteModal.addEventListener('click', e => {
    if (e.target === deleteModal) { deleteModal.classList.remove('open'); delId = null; }
  });

  /* ── Export ─────────────────────────────────────────────────── */
  $('exportJSON').addEventListener('click', () => {
    const clean = prods.map(({ _blob, ...rest }) => rest);
    const js = `/**\n * AutoTech UG — Products Data (exported ${new Date().toLocaleDateString()})\n */\n\nconst PRODUCTS = ${JSON.stringify(clean, null, 2)};\n\nconst CATEGORY_ICONS = ${JSON.stringify(CATEGORY_ICONS, null, 2)};\n`;
    dlFile('products.js', js, 'text/javascript');
    toast('products.js exported — replace in js/ folder & redeploy');
  });
  $('exportCSV').addEventListener('click', () => {
    const h = ['id','name','category','price','currency','description','phone','image'];
    const rows = prods.map(p => h.map(k => `"${(p[k]||'').toString().replace(/"/g,'""')}"`).join(','));
    dlFile('products.csv', [h.join(','), ...rows].join('\n'), 'text/csv');
    toast('CSV exported');
  });
  function dlFile(name, content, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  /* ── Settings ───────────────────────────────────────────────── */
  $('settingsForm').addEventListener('submit', e => { e.preventDefault(); toast('Settings saved'); });

  /* ── Init ───────────────────────────────────────────────────── */
  nav('dashboard');

})();
