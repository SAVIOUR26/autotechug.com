/**
 * OUTO TECH UG — Main JavaScript
 * Shop logic: render, filter, search, modals, gallery, WhatsApp ordering
 */
(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────────── */
  const PAGE_SIZE = 12;
  const IMG_DIR = 'images/products/';
  let page = 1;
  let activeCat = 'all';   /* 'all', a category name, or an array of categories */
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
  const lightbox       = $('lightbox');
  const lbImg          = $('lbImg');
  const lbCap          = $('lbCap');

  /* ── Helpers ────────────────────────────────────────────────── */
  function fmt(p) { return Number(p).toLocaleString('en-UG'); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function hasPrice(p) { return p.price !== '' && p.price != null && !isNaN(Number(p.price)) && Number(p.price) > 0; }

  function priceText(p) {
    if (!hasPrice(p)) return 'Price on request';
    return (p.priceFrom ? 'From ' : '') + 'UGX ' + fmt(p.price);
  }

  function photos(p) {
    return [p.image].concat(p.gallery || []).filter(Boolean);
  }

  function catIcon(cat) {
    return 'fas ' + (CATEGORY_ICONS[cat] || CATEGORY_ICONS['default']);
  }

  function getCats() {
    const m = {};
    PRODUCTS.forEach(p => { const c = p.category || 'General'; m[c] = (m[c] || 0) + 1; });
    return m;
  }

  function inCat(p) {
    if (activeCat === 'all') return true;
    if (Array.isArray(activeCat)) return activeCat.includes(p.category);
    return p.category === activeCat;
  }

  function filtered() {
    const q = searchQ.toLowerCase();
    return PRODUCTS.filter(p => {
      const ms = !q || (p.name||'').toLowerCase().includes(q) ||
                       (p.description||'').toLowerCase().includes(q) ||
                       (p.category||'').toLowerCase().includes(q);
      return inCat(p) && ms;
    });
  }

  /* ── Categories ─────────────────────────────────────────────── */
  function renderCategories() {
    const cats = getCats();
    categoriesGrid.innerHTML = '';
    Object.entries(cats).forEach(([cat, count]) => {
      const d = document.createElement('button');
      d.className = 'cat-card';
      d.type = 'button';
      d.innerHTML = `
        <div class="cat-icon"><i class="${catIcon(cat)}"></i></div>
        <div class="cat-name">${esc(cat)}</div>
        <div class="cat-count">${count} item${count !== 1 ? 's' : ''}</div>`;
      d.addEventListener('click', () => window.filterCat(cat));
      categoriesGrid.appendChild(d);
    });
  }

  /* ── Filter buttons ─────────────────────────────────────────── */
  function renderFilterBtns() {
    const cats = getCats();
    filterBar.innerHTML = '<button class="filter-btn active" data-cat="all">All</button>';
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
    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      const on = Array.isArray(cat) ? cat.includes(b.dataset.cat) : b.dataset.cat === cat;
      b.classList.toggle('active', on);
    });
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
    const n = photos(p).length;
    const imgEl = p.image
      ? `<img src="${IMG_DIR}${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
              onerror="this.parentElement.querySelector('.product-img-placeholder').hidden=false;this.remove()">
         <div class="product-img-placeholder" hidden><i class="${catIcon(p.category)}"></i><span>No Image</span></div>`
      : `<div class="product-img-placeholder">
           <i class="${catIcon(p.category)}"></i>
           <span>No Image Yet</span>
         </div>`;
    return `
      <div class="product-card" data-id="${esc(p.id)}" style="animation-delay:${(idx % PAGE_SIZE) * 0.05}s">
        <div class="product-img">
          ${imgEl}
          <div class="product-category-badge">${esc(p.category || 'Product')}</div>
          ${n > 1 ? `<div class="product-photos-badge"><i class="fas fa-images"></i> ${n}</div>` : ''}
        </div>
        <div class="product-body">
          <h3 class="product-name">${esc(p.name)}</h3>
          <p class="product-desc">${esc(p.description || 'Contact us for specifications.')}</p>
          <div class="product-footer">
            <div class="product-price${hasPrice(p) ? '' : ' on-request'}">${esc(priceText(p))}</div>
            <button class="btn-order" data-id="${esc(p.id)}">
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
      const label = searchQ || (Array.isArray(activeCat) ? activeCat.join(', ') : activeCat);
      productsGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No products found for "<strong>${esc(label)}</strong>"</p>
          <p class="no-results-sub">Ask us on WhatsApp — we may have it in store.</p>
        </div>`;
      loadMoreBtn.classList.add('hidden');
      return;
    }

    items.forEach((p, i) => productsGrid.insertAdjacentHTML('beforeend', cardHTML(p, i)));

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
    const pics = photos(p);
    const main = pics.length
      ? `<img id="modalMainImg" src="${IMG_DIR}${esc(pics[0])}" alt="${esc(p.name)}">`
      : `<i class="${catIcon(p.category)}"></i>`;
    const thumbs = pics.length > 1
      ? `<div class="modal-thumbs">${pics.map((f, i) =>
          `<button class="modal-thumb${i === 0 ? ' active' : ''}" data-src="${IMG_DIR}${esc(f)}" aria-label="Photo ${i + 1}">
             <img src="${IMG_DIR}${esc(f)}" alt="" loading="lazy">
           </button>`).join('')}</div>`
      : '';
    modalContent.innerHTML = `
      <div class="modal-product-img">${main}</div>
      ${thumbs}
      <div class="modal-cat-badge">${esc(p.category || 'Product')}</div>
      <h2 class="modal-product-name">${esc(p.name)}</h2>
      <div class="modal-product-price${hasPrice(p) ? '' : ' on-request'}">${esc(priceText(p))}</div>
      <p class="modal-product-desc">${esc(p.description || 'Contact us for complete specifications.')}</p>
      <div class="modal-actions">
        <button class="btn-order" id="modalOrderBtn"><i class="fab fa-whatsapp"></i> ${hasPrice(p) ? 'Order Now' : 'Ask for Price'}</button>
        <button class="btn-outline" id="modalCloseInner"><i class="fas fa-times"></i> Close</button>
      </div>`;
    let cur = 0;
    modalContent.querySelectorAll('.modal-thumb').forEach((t, i) => {
      t.onclick = () => {
        cur = i;
        $('modalMainImg').src = t.dataset.src;
        modalContent.querySelectorAll('.modal-thumb').forEach(x => x.classList.toggle('active', x === t));
      };
    });
    const mainImg = $('modalMainImg');
    if (mainImg) mainImg.onclick = () =>
      openLightbox(pics.map(f => ({ src: IMG_DIR + f, cap: p.name })), cur);
    $('modalOrderBtn').onclick = () => { closeModal(productModal); openOrderModal(p.id); };
    $('modalCloseInner').onclick = () => closeModal(productModal);
    openModal(productModal);
  }

  /* ── Order modal ─────────────────────────────────────────────── */
  function openOrderModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    orderProduct = p;
    orderProdName.textContent = p.name;
    openModal(orderModal);
    $('modalName').focus();
  }

  /* ── Modal helpers ───────────────────────────────────────────── */
  function openModal(el)  { el.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeModal(el) {
    el.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open, .lightbox.open')) document.body.style.overflow = '';
  }

  /* ── Lightbox ────────────────────────────────────────────────── */
  let lbList = [], lbIdx = 0;
  function showLb() {
    const it = lbList[lbIdx];
    lbImg.src = it.src; lbImg.alt = it.cap || ''; lbCap.textContent = it.cap || '';
    lightbox.classList.toggle('single', lbList.length < 2);
  }
  function openLightbox(list, idx) {
    lbList = list; lbIdx = idx || 0; showLb();
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-overlay.open')) document.body.style.overflow = '';
  }
  function stepLb(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; showLb(); }

  $('lbClose').addEventListener('click', closeLightbox);
  $('lbPrev').addEventListener('click', e => { e.stopPropagation(); stepLb(-1); });
  $('lbNext').addEventListener('click', e => { e.stopPropagation(); stepLb(1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  const workItems = [...document.querySelectorAll('.work-item')];
  const workList  = workItems.map(w => ({ src: w.dataset.src, cap: w.dataset.cap }));
  workItems.forEach((w, i) => w.addEventListener('click', () => openLightbox(workList, i)));

  /* Swipe support for the lightbox on phones */
  let touchX = null;
  lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && lbList.length > 1) stepLb(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ── WhatsApp message builder ────────────────────────────────── */
  function waMsg(name, phone, location, notes, product, service) {
    let m = product ? `🛒 *New Order — OUTO TECH UG*\n\n` : `📋 *Quote Request — OUTO TECH UG*\n\n`;
    if (product) {
      m += `📦 *Product:* ${product.name}\n`;
      m += `💰 *Price:* ${priceText(product)}\n\n`;
    }
    if (service) m += `🛠️ *Service:* ${service}\n`;
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
  document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') stepLb(1);
      else if (e.key === 'ArrowLeft') stepLb(-1);
      return;
    }
    if (e.key === 'Escape') { closeModal(productModal); closeModal(orderModal); }
  });

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const name     = $('modalName').value.trim();
    const phone    = $('modalPhone').value.trim();
    const location = $('modalLocation').value.trim();
    const notes    = $('modalNotes').value.trim();
    if (!name || !phone || !location) return;
    window.open(`https://wa.me/${waNumber(orderProduct)}?text=${waMsg(name, phone, location, notes, orderProduct)}`, '_blank');
    closeModal(orderModal);
    orderForm.reset();
  });

  enquiryForm && enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    const name     = $('orderName').value.trim();
    const phone    = $('orderPhone').value.trim();
    const location = $('orderLocation').value.trim();
    const service  = $('orderService').value;
    const msg      = $('orderMessage').value.trim();
    if (!name || !phone || !location) return;
    window.open(`https://wa.me/256757169673?text=${waMsg(name, phone, location, msg, null, service)}`, '_blank');
  });

  /* Service cards: "View products" filters the shop to that division */
  document.querySelectorAll('.btn-link[data-cats]').forEach(b => {
    b.addEventListener('click', () => window.filterCat(b.dataset.cats.split(',')));
  });

  /* Service cards: "Get a Quote" pre-selects the division in the contact form */
  document.querySelectorAll('.btn-quote[data-service]').forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault();
      const sel = $('orderService');
      const grp = sel && [...sel.querySelectorAll('optgroup')].find(g => g.label === b.dataset.service);
      if (grp) sel.value = grp.querySelector('option').value;
      $('contact').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => $('orderName').focus({ preventScroll: true }), 600);
    });
  });

  const alarmBtn = $('alarmOrderBtn');
  if (alarmBtn) alarmBtn.addEventListener('click', () => {
    const alarm = PRODUCTS.find(p => p.category === 'Car Alarms');
    if (alarm) openOrderModal(alarm.id);
    else window.open('https://wa.me/256757169673', '_blank');
  });

  searchToggle.addEventListener('click', () => { searchBarEl.classList.add('open'); searchInput.focus(); });
  closeSearch.addEventListener('click',  () => { searchBarEl.classList.remove('open'); searchInput.value = ''; searchQ = ''; page = 1; renderProducts(); });
  searchInput.addEventListener('input',  () => {
    searchQ = searchInput.value.trim();
    activeCat = 'all';
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    page = 1;
    renderProducts();
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') $('products').scrollIntoView({ behavior: 'smooth' });
  });

  hamburger.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open'); hamburger.classList.remove('open');
  }));

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

  /* ── Scroll reveal ───────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    revealObs.observe(el);
  });

  /* ── Init ────────────────────────────────────────────────────── */
  const yr = $('year');
  if (yr) yr.textContent = new Date().getFullYear();
  renderCategories();
  renderFilterBtns();
  renderProducts();

})();
