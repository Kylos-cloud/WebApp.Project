// ============================================================
// MODULE: app.js  (type="module" шаардлагатай)
// ============================================================

import { ProductStore }    from "./ProductStore.js";
import { ProductRenderer } from "./ProductRenderer.js";

const productsEl  = document.getElementById("productsGrid");
const saleEl      = document.getElementById("saleGrid");
const brandsEl    = document.getElementById("brandsContainer");
const statsEl     = document.getElementById("statsBar");
const searchInput = document.querySelector(".search input");

async function loadData() {
  const res  = await fetch("products.json");
  const data = await res.json();
  return data;
}

async function init() {
  const data = await loadData();
  if (!data) return;

  const store = new ProductStore(data);

  // ── "Бүх бараа" renderer (өөрийн uid: lmw_1) ─────────────
  const mainRenderer = new ProductRenderer({ productsEl, brandsEl, statsEl });
  mainRenderer.renderProducts(store.allProducts);
  mainRenderer.renderBrands(store.allBrands);
  mainRenderer.renderStats({
    total:         store.allProducts.length,
    avgRating:     store.getAverageRating(),
    totalDiscount: store.getTotalDiscount(),
    brandNames:    store.getBrandNames()
  });

  // ── "Хямдралтай" renderer (өөрийн uid: lmw_2) ────────────
  if (saleEl) {
    const saleRenderer = new ProductRenderer({ productsEl: saleEl });
    saleRenderer.renderProducts(store.getSaleProducts());
  }

  // ── filter товч ──────────────────────────────────────────
  document.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn[data-filter]");
    if (!btn) return;
    e.preventDefault();

    const cat      = btn.dataset.filter;
    const filtered = cat === "all" ? store.allProducts : store.getByCategory(cat);
    mainRenderer.renderProducts(filtered);

    document.querySelectorAll(".filter-btn[data-filter]")
      .forEach(b => b.classList.toggle("active-filter", b.dataset.filter === cat));

    const header = document.querySelector("#sales .section-header h2");
    if (header) {
      const label = cat === "all" ? "Бүх бараа"
        : data.categories?.find(c => c.id === cat)?.name ?? cat;
      header.textContent = label;
    }
  });

  // ── хайлт ────────────────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const q = this.value.toLowerCase().trim();
      const results = q
        ? store.allProducts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q))
        : store.allProducts;
      mainRenderer.renderProducts(results);

      const header = document.querySelector("#sales .section-header h2");
      if (header) header.textContent = q ? `"${q}" хайлтын үр дүн` : "Бүх бараа";
    });
  }
}

document.addEventListener("DOMContentLoaded", init);