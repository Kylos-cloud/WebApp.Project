// ============================================================
// MODULE: ProductRenderer
// ============================================================

const PAGE_SIZE = 8;
let _instanceCount = 0;

export class ProductRenderer {
  constructor({ productsEl, brandsEl, categoriesEl, statsEl }) {
    this.productsEl   = productsEl;
    this.brandsEl     = brandsEl;
    this.categoriesEl = categoriesEl;
    this.statsEl      = statsEl;

    // Тус бүрийн instance-д өөр өөр id өгнө
    this._uid = "lmw_" + (++_instanceCount);

    this._currentProducts = [];
    this._visibleCount    = PAGE_SIZE;
  }

  _productCard(p) {
    const discount   = Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100);
    const tagHTML    = p.tag
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

  // Шинэ шүүлт → reset хийж эхний PAGE_SIZE харуулна
  renderProducts(products) {
    if (!this.productsEl) return;

    this._currentProducts = products;
    this._visibleCount    = PAGE_SIZE;
    this._removeLoadMore();

    if (!products.length) {
      this.productsEl.innerHTML = `<p class="empty-msg">Бараа олдсонгүй.</p>`;
      return;
    }

    this.productsEl.innerHTML = products
      .slice(0, PAGE_SIZE)
      .map(p => this._productCard(p))
      .join("");

    this._updateLoadMoreBtn();
  }

  // Доод талд fade-in хийж НЭМНЭ
  _loadMore() {
    const from = this._visibleCount;
    this._visibleCount = Math.min(from + PAGE_SIZE, this._currentProducts.length);

    this._currentProducts.slice(from, this._visibleCount).forEach(p => {
      const tmp = document.createElement("div");
      tmp.innerHTML = this._productCard(p).trim();
      const card = tmp.firstElementChild;
      card.style.cssText = "opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .35s ease";
      this.productsEl.appendChild(card);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        card.style.opacity   = "1";
        card.style.transform = "translateY(0)";
      }));
    });

    this._updateLoadMoreBtn();
  }

  _updateLoadMoreBtn() {
    this._removeLoadMore();
    const remaining = this._currentProducts.length - this._visibleCount;
    if (remaining <= 0) return;

    const wrap = document.createElement("div");
    wrap.id = this._uid;                  // ← instance-д өвөрмөц id
    wrap.className = "load-more-wrap";
    wrap.innerHTML = `
      <button class="load-more-btn">
        Дахин бараа харах
        <span class="load-more-count">${remaining} бараа үлдсэн</span>
      </button>`;

    // productsEl-ийн яг ДАРАА оруулна
    this.productsEl.insertAdjacentElement("afterend", wrap);

    wrap.querySelector(".load-more-btn")
        .addEventListener("click", () => this._loadMore());
  }

  _removeLoadMore() {
    document.getElementById(this._uid)?.remove();
  }

  renderBrands(brands) {
    if (!this.brandsEl) return;
    this.brandsEl.innerHTML = brands.map(b => `
      <a class="brand" href="brand.html?brand=${encodeURIComponent(b.name)}" style="text-decoration:none;color:inherit;display:block;text-align:center;min-width:120px;">
        <img src="${b.image}" alt="${b.name}" onerror="this.style.background='#eee'">
        <p>${b.name}</p>
      </a>`).join("");
  }

  renderCategories(categories) {
    if (!this.categoriesEl) return;
    this.categoriesEl.innerHTML = categories.map(c => `
      <article class="category">
        <a href="#" data-filter="${c.id}">
          <figure><img src="${c.image}" alt="${c.name}" onerror="this.style.background='#eee'"></figure>
          <h3>${c.name}</h3>
        </a>
      </article>`).join("");
  }

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

  _formatPrice(n) {
    return n.toLocaleString("mn-MN") + "₮";
  }
}