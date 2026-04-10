// ============================================================
// MODULE: app.js  (type="module" шаардлагатай)
// fetch → ProductStore → ProductRenderer → DOM
// ============================================================

import { ProductStore }    from "./ProductStore.js";
import { ProductRenderer } from "./ProductRenderer.js";

// ─── 1. DOM элементүүдийг олох ────────────────────────────
const productsEl   = document.getElementById("productsGrid");
const brandsEl     = document.getElementById("brandsContainer");
const categoriesEl = document.getElementById("categoriesContainer");
const statsEl      = document.getElementById("statsBar");
const filterBtns   = document.querySelectorAll("[data-filter]");
const searchInput  = document.querySelector(".search input");

// ─── 2. fetch ашиглан JSON өгөгдлийг татах ───────────────
async function loadData() {
  const res  = await fetch("products.json");
  const data = await res.json();
  return data;
}

// ─── 3. Аппликейшн эхлүүлэх ──────────────────────────────
async function init() {
  const data = await loadData();
  if (!data) return;

  // 3a. Store үүсгэх (map/filter/reduce/join дотор ашиглана)
  const store = new ProductStore(data);

  // 3b. Renderer үүсгэх
  const renderer = new ProductRenderer({
    productsEl,
    brandsEl,
    categoriesEl,
    statsEl
  });

  // 3c. Анхны рендер
  renderer.renderProducts(store.allProducts);
  renderer.renderBrands(store.allBrands);
  renderer.renderCategories(store.allCategories);

  // 3d. Статистик харуулах (reduce + join + map ашиглана)
  renderer.renderStats({
    total:         store.allProducts.length,
    avgRating:     store.getAverageRating(),       // reduce
    totalDiscount: store.getTotalDiscount(),        // reduce
    brandNames:    store.getBrandNames()            // join
  });

  // Console-д хэрэглэсэн аргуудын жишээ гаргах
  console.log("── map: үнийн жагсаалт ──",     store.getPriceList());
  console.log("── filter: хямдарсан ──",        store.getSaleProducts().map(p => p.name));
  console.log("── reduce: ангиллаар ──",        store.groupByCategory());
  console.log("── join: брэндүүд ──",           store.getBrandNames());
  console.log("── filter+map+join: хураангуй ──", store.getSaleSummary());

  // ─── 4. Ангилал дарахад шүүлт хийх (filter + DOM) ──────
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    e.preventDefault();

    const cat = btn.dataset.filter;
    const filtered = cat === "all"
      ? store.allProducts
      : store.getByCategory(cat);     // filter ашиглана

    renderer.renderProducts(filtered);

    // Идэвхтэй товчийг тэмдэглэх
    document.querySelectorAll("[data-filter]")
      .forEach(b => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");
  });

  // ─── 5. Хайлт (filter + map) ─────────────────────────────
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const q = this.value.toLowerCase().trim();
      const results = q
        ? store.allProducts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q))
        : store.allProducts;
      renderer.renderProducts(results);
    });
  }

  // ─── 6. Sale хэсэгт хямдарсан бараа тусгаарлан харуулах ─
  const saleEl = document.getElementById("saleGrid");
  if (saleEl) {
    const saleRenderer = new ProductRenderer({ productsEl: saleEl });
    saleRenderer.renderProducts(store.getSaleProducts()); // filter
  }
}

// ─── 7. DOM бэлэн болсны дараа эхлүүлэх ─────────────────
document.addEventListener("DOMContentLoaded", init);