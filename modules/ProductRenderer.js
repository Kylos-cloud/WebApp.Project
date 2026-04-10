// ============================================================
// MODULE: ProductRenderer
// HTML DOM ашиглан хуудасны агуулгыг динамикаар үүсгэх класс
// ============================================================

export class ProductRenderer {
  constructor({ productsEl, brandsEl, categoriesEl, statsEl }) {
    this.productsEl   = productsEl;
    this.brandsEl     = brandsEl;
    this.categoriesEl = categoriesEl;
    this.statsEl      = statsEl;
  }

  // --- Барааны карт HTML үүсгэх (private helper) ---
  _productCard(p) {
    const discount = Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100);
    const tagHTML  = p.tag
      ? `<span class="product-tag product-tag--${p.tag}">${p.tag === "sale" ? "SALE" : "NEW"}</span>`
      : "";
    const stockClass = p.inStock ? "" : "product--outofstock";

    return `
      <article class="product ${stockClass}" data-id="${p.id}" data-category="${p.category}">
        <figure>
          <img src="${p.image}" alt="${p.name}" loading="lazy"
               onerror="this.style.display='none'">
          ${tagHTML}
          ${!p.inStock ? `<span class="product-tag product-tag--out">ДУУССАН</span>` : ""}
        </figure>
        <h3>${p.name}</h3>
        <p class="price">
          <span class="old">${this._formatPrice(p.oldPrice)}</span>
          <span class="new">${this._formatPrice(p.newPrice)}</span>
          <span class="discount-badge">-${discount}%</span>
        </p>
      </article>`;
  }

  // --- Барааны жагсаалтыг DOM-д харуулах ---
  renderProducts(products) {
    if (!this.productsEl) return;
    if (!products.length) {
      this.productsEl.innerHTML = `<p class="empty-msg">Бараа олдсонгүй.</p>`;
      return;
    }
    this.productsEl.innerHTML = products.map(p => this._productCard(p)).join("");
  }

  // --- Брэндийг DOM-д харуулах ---
  renderBrands(brands) {
    if (!this.brandsEl) return;
    this.brandsEl.innerHTML = brands.map(b => `
      <div class="brand">
        <img src="${b.image}" alt="${b.name}"
             onerror="this.style.background='#eee'">
        <p>${b.name}</p>
      </div>`).join("");
  }

  // --- Ангиллыг DOM-д харуулах ---
  renderCategories(categories) {
    if (!this.categoriesEl) return;
    this.categoriesEl.innerHTML = categories.map(c => `
      <div class="category">
        <a href="#" data-filter="${c.id}">
          <img src="${c.image}" alt="${c.name}"
               onerror="this.style.background='#eee'">
          <h3>${c.name}</h3>
        </a>
      </div>`).join("");
  }

  // --- Статистик мэдээллийг харуулах ---
  renderStats({ total, avgRating, totalDiscount, brandNames }) {
    if (!this.statsEl) return;
    this.statsEl.innerHTML = `
      <div class="stats-bar">
        <span>📦 Нийт бараа: <strong>${total}</strong></span>
        <span>⭐ Дундаж үнэлгээ: <strong>${avgRating}</strong></span>
        <span>💰 Нийт хэмнэлт: <strong>${this._formatPrice(totalDiscount)}</strong></span>
        <span class="stats-brands">🏷️ ${brandNames}</span>
      </div>`;
  }

  // --- Үнийг форматлах helper ---
  _formatPrice(n) {
    return n.toLocaleString("mn-MN") + "₮";
  }
}