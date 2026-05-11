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

  // Merge admin-panel products (saved via localStorage) into the product list
  try {
    const adminRaw = localStorage.getItem("adminProducts");
    if (adminRaw) {
      const adminProducts = JSON.parse(adminRaw);
      if (Array.isArray(adminProducts) && adminProducts.length) {
        const existingIds = new Set(data.products.map(p => p.id));
        const newOnes = adminProducts.filter(p => !existingIds.has(p.id));
        data.products = [...newOnes, ...data.products];
      }
    }
  } catch (e) { /* ignore corrupt localStorage */ }

  const store = new ProductStore(data);
  window._store = store;
  window._data = data;

  const mainRenderer = new ProductRenderer({ productsEl, brandsEl, statsEl });
  mainRenderer.renderProducts(store.allProducts);
  mainRenderer.renderBrands(store.allBrands);
  mainRenderer.renderStats({
    total:         store.allProducts.length,
    avgRating:     store.getAverageRating(),
    totalDiscount: store.getTotalDiscount(),
    brandNames:    store.getBrandNames()
  });


  if (saleEl) {
    const saleRenderer = new ProductRenderer({ productsEl: saleEl });
    saleRenderer.renderProducts(store.getSaleProducts());
  }

  // ── category menu navigation (3-level nav) ───────────────
  window.addEventListener("categoryNavigation", (e) => {
    const { categoryKey, subName, itemName } = e.detail;

    let filtered = categoryKey
      ? store.allProducts.filter(p => p.category === categoryKey)
      : store.allProducts;

    mainRenderer.renderProducts(filtered);

    document.querySelectorAll(".filter-btn[data-filter]").forEach(b => {
      b.classList.toggle("active-filter", b.dataset.filter === (categoryKey || "all"));
    });

    const header = document.querySelector("#sales .section-header h2");
    if (header) {
      const catLabel = data.categories?.find(c => c.id === categoryKey)?.name ?? categoryKey;
      if (itemName) {
        header.textContent = `${catLabel} › ${itemName} — ${filtered.length} бараа`;
      } else if (catLabel) {
        header.textContent = `${catLabel} — ${filtered.length} бараа`;
      }
    }

    if (searchInput) searchInput.value = "";
  });

  // ── filter товч ──────────────────────────────────────────
  document.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn[data-filter]");
    if (!btn) return;
    e.preventDefault();

    const cat      = btn.dataset.filter;
    const filtered = cat === "all" ? store.allProducts : store.getByCategory(cat);
    mainRenderer.renderProducts(filtered);
    if (searchInput) searchInput.value = "";

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

      document.querySelectorAll(".filter-btn[data-filter]").forEach(b => {
        b.classList.toggle("active-filter", !q && b.dataset.filter === "all");
      });

      const header = document.querySelector("#sales .section-header h2");
      if (header) header.textContent = q ? `"${q}" хайлтын үр дүн` : "Бүх бараа";
    });
  }
}

document.addEventListener("DOMContentLoaded", init);