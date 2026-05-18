import { ProductStore }    from "./ProductStore.js";
import { ProductRenderer } from "./ProductRenderer.js";

const productsEl    = document.getElementById("productsGrid");
const saleEl        = document.getElementById("saleGrid");
const brandsEl      = document.getElementById("brandsContainer");
const statsEl       = document.getElementById("statsBar");
const searchInput   = document.getElementById("mainSearchInput");
const searchDropdown = document.getElementById("searchDropdown");

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

  // ── handle category navigation from other pages (URL params) ─────────
  const urlParams = new URLSearchParams(window.location.search);
  const urlCatKey = urlParams.get("category");
  if (urlCatKey) {
    const urlSubIdx  = urlParams.get("sub");
    const urlItemIdx = urlParams.get("item");
    const filtered = store.allProducts.filter(p => p.category === urlCatKey);
    mainRenderer.renderProducts(filtered);

    const header = document.querySelector("#sales .section-header h2");
    if (header) {
      const catLabel = data.categories?.find(c => c.id === urlCatKey)?.name
        ?? window.categoryData?.[urlCatKey]?.label
        ?? urlCatKey;
      if (urlSubIdx !== null && urlItemIdx !== null) {
        const catData = window.categoryData?.[urlCatKey];
        const itemName = catData?.subcategories?.[parseInt(urlSubIdx)]?.items?.[parseInt(urlItemIdx)];
        header.textContent = itemName
          ? `${catLabel} › ${itemName} — ${filtered.length} бараа`
          : `${catLabel} — ${filtered.length} бараа`;
      } else {
        header.textContent = `${catLabel} — ${filtered.length} бараа`;
      }
    }

    document.querySelectorAll(".filter-btn[data-filter]").forEach(b => {
      b.classList.toggle("active-filter", b.dataset.filter === urlCatKey);
    });

    history.replaceState(null, "", window.location.pathname);

    setTimeout(() => {
      const salesSection = document.getElementById("sales");
      if (salesSection) salesSection.scrollIntoView({ behavior: "smooth" });
    }, 300);
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
      const catLabel = data.categories?.find(c => c.id === categoryKey)?.name
        ?? window.categoryData?.[categoryKey]?.label
        ?? categoryKey;
      if (itemName) {
        header.textContent = `${catLabel} › ${itemName} — ${filtered.length} бараа`;
      } else if (catLabel) {
        header.textContent = `${catLabel} — ${filtered.length} бараа`;
      }
    }

    if (searchInput) searchInput.value = "";
    hideDropdown();
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
    hideDropdown();

    document.querySelectorAll(".filter-btn[data-filter]")
      .forEach(b => b.classList.toggle("active-filter", b.dataset.filter === cat));

    const header = document.querySelector("#sales .section-header h2");
    if (header) {
      const label = cat === "all" ? "Бүх бараа"
        : data.categories?.find(c => c.id === cat)?.name ?? cat;
      header.textContent = label;
    }
  });

  // ── хайлт + dropdown ─────────────────────────────────────
  function formatPrice(n) {
    return n?.toLocaleString("mn-MN") + "₮";
  }

  function showDropdown(matches) {
    if (!searchDropdown) return;
    if (!matches.length) {
      searchDropdown.innerHTML = `<p class="search-dropdown-empty">Бараа олдсонгүй</p>`;
    } else {
      searchDropdown.innerHTML = matches.slice(0, 8).map(p => `
        <a class="search-dropdown-item" href="product.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
          <div class="search-dropdown-info">
            <div class="search-dropdown-name">${p.name}</div>
            <div class="search-dropdown-price">${formatPrice(p.newPrice)}</div>
          </div>
        </a>`).join("");
    }
    searchDropdown.classList.add("active");
  }

  function hideDropdown() {
    if (searchDropdown) searchDropdown.classList.remove("active");
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const q = this.value.toLowerCase().trim();
      if (q) {
        const results = store.allProducts.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q));
        showDropdown(results);
      } else {
        hideDropdown();
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideDropdown();
        this.blur();
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search")) hideDropdown();
    });
  }
}

document.addEventListener("DOMContentLoaded", init);