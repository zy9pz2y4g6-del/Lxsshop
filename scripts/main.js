const products = [
  { id: 1, title: 'Sudadera Downtown', desc: 'Comodidad urbana con cuello alto y corte relajado.', price: 45, img: 'assets/images/producto-1.svg', images: ['assets/images/producto-1.svg'] },
  { id: 2, title: 'Camiseta Street', desc: 'Algodón suave con estampado minimalista de temporada.', price: 25, img: 'assets/images/producto-2.svg', images: ['assets/images/producto-2.svg'] },
  { id: 3, title: 'Gorra Metro', desc: 'Accesorio urbano con diseño estructurado y ventilación moderna.', price: 18, img: 'assets/images/producto-3.svg', images: ['assets/images/producto-3.svg'] },
  { id: 4, title: 'Buzo Oversize Chicago', desc: 'Buzo oversize con estampado Chicago en la espalda. Disponible en varios colores.', price: 55, img: 'assets/images/BuzoChicago2.webp', images: [
      'assets/images/BuzoChicago2.webp',
      'assets/images/BuzoChicago3.webp',
      'assets/images/BuzoChicagoModelo.png',
      'assets/images/BuzoChicago5.webp'
    ]
  }
];

const cartCountElement = document.getElementById('cartCount');
let cartCount = 0;

function formatPrice(p) {
  return `$${p}`;
}

function addToCart(productId) {
  cartCount += 1;
  cartCountElement.textContent = cartCount;

  const btn = document.querySelector(`button.add-to-cart[data-product-id="${productId}"]`);
  if (btn) {
    btn.textContent = 'Agregado';
    btn.disabled = true;
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Agregar al carrito';
      btn.disabled = false;
      btn.classList.remove('added');
    }, 1200);
  }
}

function openProductModal(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  const modal = document.getElementById('productModal');
  modal.querySelector('.modal-title').textContent = product.title;
  modal.querySelector('.modal-desc').textContent = product.desc;
  modal.querySelector('.modal-price').textContent = formatPrice(product.price);
  const img = modal.querySelector('.modal-img');
  // support single img or images array
  const gallery = product.images && product.images.length ? product.images : (product.img ? [product.img] : []);
  img.src = gallery[0] || '';
  img.alt = product.title;
  // render thumbnails
  const thumbs = modal.querySelector('.modal-thumbs');
  thumbs.innerHTML = '';
  gallery.forEach(src => {
    const t = document.createElement('img');
    t.src = src;
    t.alt = product.title;
    t.className = 'thumb';
    t.addEventListener('click', () => {
      img.src = src;
    });
    // hide or replace broken thumbnails
    t.onerror = () => { t.src = 'assets/images/image-missing.svg'; };
    thumbs.appendChild(t);
  });
  // main image fallback
  img.onerror = () => { img.src = 'assets/images/image-missing.svg'; };
  const addBtn = modal.querySelector('.modal-add');
  addBtn.dataset.productId = product.id;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.productId = p.id;
    const imgSrc = p.img || (p.images && p.images[0]) || 'assets/images/image-missing.svg';
    article.innerHTML = `
      <img src="${imgSrc}" alt="${p.title}" class="product-clickable">
      <div class="product-card-body">
        <h3 class="product-clickable">${p.title}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn btn-secondary add-to-cart" data-product-id="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    grid.appendChild(article);
  });

  // Delegated events for product grid
  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('button.add-to-cart');
    if (addBtn) {
      addToCart(addBtn.dataset.productId);
      return;
    }
    const clickable = e.target.closest('.product-clickable');
    if (clickable) {
      const article = clickable.closest('.product-card');
      if (article) openProductModal(article.dataset.productId);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  // Modal close handlers
  const modal = document.getElementById('productModal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) closeProductModal();
  });

  const modalAdd = document.querySelector('#productModal .modal-add');
  modalAdd.addEventListener('click', function () {
    addToCart(this.dataset.productId);
    closeProductModal();
  });
});
