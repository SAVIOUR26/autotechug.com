/**
 * AutoTech UG — Main JavaScript
 * Shop logic: render, filter, search, modals, WhatsApp ordering
 */
(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────────── */
  const PAGE_SIZE = 12;
  let page = 1;
  let activeCat = 'all';
  let searchQ = '';
  let orderProduct = null;

  /* ── DOM ────────────────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const productsGrid   = $('productsGrid');
  const loadMoreBtn    = $('loadMoreBtn');
  const filterBar      = $('filterBar');
  const categoriesGrid = $('categoriesGrid');
  const searchInput    = $('searchInput');
  const searchToggle   = $('searchToggle');
  const searchBarEl    = $('searchBar');
  const closeSearch    = $('closeSearch');
  const productModal   = $('productModal');
  const modalContent   = $('modalContent');
  const modalClose     = $('modalClose');
  const orderModal     = $('orderModal');
  const orderModalClose= $('orderModalClose');
  const orderForm      = $('orderForm');
  const orderProdName  = $('orderProductName');
  const enquiryForm    = $('enquiryForm');
  const backToTop      = $('backToTop');
  const hamburger      = $('hamburger');
  const mainNav        = $('mainNav');
  const header         = $('header');

  /* ── Helpers ────────────────────────────────────────────────── */
  function fmt(p) { return Number(p).toLocaleString('en-UG'); }

  function catIcon(cat) {
    return 'fas ' + (CATEGORY_ICONS[cat] || CATEGORY_ICONS['default']);
  }

  function getCats() {
    const m = {};
    PRODUCTS.forEach(p => { const c = p.category || 'General'; m[c] = (m[c] || 0) + 1; });
    return m;
  }

  function filtered() {
    return PRODUCTS.filter(p => {
      const mc = activeCat === 'all' || p.category === activeCat;
      const q  = searchQ.toLowerCase();
      const ms = !q || (p.name||'').toLowerCase().includes(q) ||
                       (p.description||'').toLowerCase().includes(q) ||
                       (p.category||'').toLowerCase().includes(q);
      return mc && ms;
    });
  }

  /* ── Categories ─────────────────────────────────────────────── */
  function renderCategories() {
    const cats = getCats();
    categoriesGrid.innerHTML = '';
    Object.entries(cats).forEach(([cat, count]) => {
      const d = document.createElement('div');
      d.className = 'cat-card';
      d.innerHTML = `
        <div class="cat-icon"><i class="${catIcon(cat)}"></i></div>
        <div class="cat-name">${cat}</div>
        <div class="cat-count">${count} part${count !== 1 ? 's' : ''}</div>`;
      d.addEventListener('click', () => {
        setCategory(cat);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      });
      categoriesGrid.appendChild(d);
    });
  }

  /* ── Filter buttons ─────────────────────────────────────────── */
  function renderFilterBtns() {
    const cats = getCats();
    filterBar.innerHTML = '<button class="filter-btn active" data-cat="all">All Parts</button>';
    Object.keys(cats).forEach(cat => {
      const b = document.createElement('button');
      b.className = 'filter-btn';
      b.dataset.cat = cat;
      b.textContent = cat;
      filterBar.appendChild(b);
    });
    filterBar.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (btn) setCategory(btn.dataset.cat);
    });
  }

  function setCategory(cat) {
    activeCat = cat;
    page = 1;
    filterBar.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === cat)
    );
    renderProducts();
  }

  /* Exposed for footer links */
  window.filterCat = function (cat) {
    setCategory(cat);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    return false;
  };

  /* ── Product card ────────────────────────────────────────────── */
  function cardHTML(p, idx) {
    const imgEl = p.image
      ? `<img src="images/products/${p.image}" alt="${p.name}" loading="lazy"
              onerror="this.parentElement.innerHTML='<div class=\\'product-img-placeholder\\'><i class=\\'fas fa-wrench\\'></i><span>No Image</span></div>'">`
      : `<div class="product-img-placeholder">
           <i class="${catIcon(p.category)}"></i>
           <span>No Image Yet</span>
         </div>`;
    return `
      <div class="product-card" data-id="${p.id}" style="animation-delay:${(idx % PAGE_SIZE) * 0.05}s">
        <div class="product-img">
          ${imgEl}
          <div class="product-category-badge">${p.category || 'Auto Part'}</div>
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.description || 'Contact us for specifications.'}</p>
          <div class="product-footer">
            <div class="product-price">
              UGX ${fmt(p.price)}
              <span>${p.currency || 'UGX'}</span>
            </div>
            <button class="btn-order" data-id="${p.id}">
              <i class="fab fa-whatsapp"></i> Order
            </button>
          </div>
        </div>
      </div>`;
  }

  /* ── Render products ─────────────────────────────────────────── */
  function renderProducts(append) {
    const list  = filtered();
    const start = (page - 1) * PAGE_SIZE;
    const items = list.slice(start, start + PAGE_SIZE);

    if (!append) productsGrid.innerHTML = '';

    if (!list.length) {
      productsGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No products found for "<strong>${searchQ || activeCat}</strong>"</p>
        </div>`;
      loadMoreBtn.classList.add('hidden');
      return;
    }

    items.forEach((p, i) => productsGrid.insertAdjacentHTML('beforeend', cardHTML(p, i)));

    /* click listeners on new cards */
    productsGrid.querySelectorAll('.product-card').forEach(card => {
      card.onclick = e => {
        if (e.target.closest('.btn-order')) {
          openOrderModal(e.target.closest('.btn-order').dataset.id);
        } else {
          openProductModal(card.dataset.id);
        }
      };
    });

    loadMoreBtn.classList.toggle('hidden', start + items.length >= list.length);
  }

  /* ── Product detail modal ────────────────────────────────────── */
  function openProductModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const img = p.image
      ? `<img src="images/products/${p.image}" alt="${p.name}">`
      : `<i class="${catIcon(p.category)}"></i>`;
    modalContent.innerHTML = `
      <div class="modal-product-img">${img}</div>
      <div class="modal-cat-badge">${p.category || 'Auto Part'}</div>
      <h2 class="modal-product-name">${p.name}</h2>
      <div class="modal-product-price">UGX ${fmt(p.price)}</div>
      <p class="modal-product-desc">${p.description || 'Contact us for complete specifications.'}</p>
      <div class="modal-actions">
        <button class="btn-order" id="modalOrderBtn"><i class="fab fa-whatsapp"></i> Order Now</button>
        <button class="btn-outline" id="modalCloseInner"><i class="fas fa-times"></i> Close</button>
      </div>`;
    document.getElementById('modalOrderBtn').onclick = () => { closeModal(productModal); openOrderModal(p.id); };
    document.getElementById('modalCloseInner').onclick = () => closeModal(productModal);
    openModal(productModal);
  }

  /* ── Order modal ─────────────────────────────────────────────── */
  function openOrderModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    orderProduct = p;
    orderProdName.textContent = p.name;
    openModal(orderModal);
    document.getElementById('modalName').focus();
  }

  /* ── Modal helpers ───────────────────────────────────────────── */
  function openModal(el)  { el.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeModal(el) { el.classList.remove('open'); document.body.style.overflow = ''; }

  /* ── WhatsApp message builder ────────────────────────────────── */
  function waMsg(name, phone, location, notes, product) {
    let m = `🛒 *New Order — AutoTech UG*\n\n`;
    if (product) {
      m += `📦 *Product:* ${product.name}\n`;
      m += `💰 *Price:* UGX ${fmt(product.price)}\n\n`;
    }
    m += `👤 *Customer Name:* ${name}\n`;
    m += `📱 *Phone:* ${phone}\n`;
    m += `📍 *Location:* ${location}\n`;
    if (notes) m += `📝 *Notes:* ${notes}\n`;
    m += `\n_Sent via autotechug.com_`;
    return encodeURIComponent(m);
  }

  function waNumber(product) {
    return product && product.phone === '256757469374' ? '256757469374' : '256757169673';
  }

  /* ── Events ──────────────────────────────────────────────────── */
  loadMoreBtn.addEventListener('click', () => {
    page++;
    renderProducts(true);
    setTimeout(() => {
      const cards = productsGrid.querySelectorAll('.product-card');
      const t = cards[cards.length - PAGE_SIZE];
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });

  modalClose.addEventListener('click', () => closeModal(productModal));
  orderModalClose.addEventListener('click', () => closeModal(orderModal));
  productModal.addEventListener('click', e => { if (e.target === productModal) closeModal(productModal); });
  orderModal.addEventListener('click',   e => { if (e.target === orderModal)   closeModal(orderModal); });
  document.addEventListener('keydown',   e => { if (e.key === 'Escape') { closeModal(productModal); closeModal(orderModal); } });

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('modalName').value.trim();
    const phone    = document.getElementById('modalPhone').value.trim();
    const location = document.getElementById('modalLocation').value.trim();
    const notes    = document.getElementById('modalNotes').value.trim();
    if (!name || !phone || !location) return;
    window.open(`https://wa.me/${waNumber(orderProduct)}?text=${waMsg(name, phone, location, notes, orderProduct)}`, '_blank');
    closeModal(orderModal);
    orderForm.reset();
  });

  enquiryForm && enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('orderName').value.trim();
    const phone    = document.getElementById('orderPhone').value.trim();
    const location = document.getElementById('orderLocation').value.trim();
    const msg      = document.getElementById('orderMessage').value.trim();
    if (!name || !phone || !location) return;
    window.open(`https://wa.me/256757169673?text=${waMsg(name, phone, location, msg, null)}`, '_blank');
  });

  searchToggle.addEventListener('click', () => { searchBarEl.classList.add('open'); searchInput.focus(); });
  closeSearch.addEventListener('click',  () => { searchBarEl.classList.remove('open'); searchQ = ''; page = 1; renderProducts(); });
  searchInput.addEventListener('input',  () => {
    searchQ = searchInput.value.trim();
    activeCat = 'all';
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    page = 1;
    renderProducts();
  });

  hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Counter animation ───────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target || 0);
      const step   = target / (1400 / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = Math.floor(cur);
      }, 16);
    });
  }
  const heroObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
  }, { threshold: 0.3 });
  heroObs.observe(document.querySelector('.hero'));

  /* ── Init ────────────────────────────────────────────────────── */
  renderCategories();
  renderFilterBtns();
  renderProducts();

})();
