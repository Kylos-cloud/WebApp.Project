// Live-search dropdown for pages other than index.html.
// index.html handles its own search via modules/app.js.
(async function () {
  if (document.getElementById("mainSearchInput")) return;

  const searchEl = document.querySelector(".search");
  if (!searchEl) return;

  const input = searchEl.querySelector("input");
  if (!input) return;

  input.id = "mainSearchInput";
  input.setAttribute("autocomplete", "off");

  const dropdown = document.createElement("div");
  dropdown.className = "search-dropdown";
  dropdown.id = "searchDropdown";
  searchEl.appendChild(dropdown);

  let products = [];
  try {
    const res  = await fetch('http://localhost:3000/api/products/all');
    const data = await res.json();
    products = data.products || [];

    try {
      const adminRaw = localStorage.getItem("adminProducts");
      if (adminRaw) {
        const adminProducts = JSON.parse(adminRaw);
        if (Array.isArray(adminProducts) && adminProducts.length) {
          const existingIds = new Set(products.map(p => p.id));
          products = [...adminProducts.filter(p => !existingIds.has(p.id)), ...products];
        }
      }
    } catch (_) {}
  } catch (_) {
    return;
  }

  function formatPrice(n) {
    return (n ?? 0).toLocaleString("mn-MN") + "₮";
  }

  function showDropdown(matches) {
    dropdown.innerHTML = matches.length
      ? matches.slice(0, 8).map(p => `
          <a class="search-dropdown-item" href="product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
            <div class="search-dropdown-info">
              <div class="search-dropdown-name">${p.name}</div>
              <div class="search-dropdown-price">${formatPrice(p.newPrice)}</div>
            </div>
          </a>`).join("")
      : `<p class="search-dropdown-empty">Бараа олдсонгүй</p>`;
    dropdown.classList.add("active");
  }

  function hideDropdown() {
    dropdown.classList.remove("active");
  }

  input.addEventListener("input", function () {
    const q = this.value.toLowerCase().trim();
    if (q) {
      showDropdown(products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand    && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      ));
    } else {
      hideDropdown();
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { hideDropdown(); this.blur(); }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search")) hideDropdown();
  });
})();
