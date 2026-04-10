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
const FALLBACK_DATA = {
  products: [
    { id:1, name:"Loewe liquid soap",    category:"goo-saikhan", tag:"sale", image:"image/product1.jpg", oldPrice:75000,   newPrice:60000,   brand:"Loewe",           rating:4.5, inStock:true },
    { id:2, name:"Maison Margiela perfume", category:"goo-saikhan", tag:"new", image:"image/product2.jpg", oldPrice:420000, newPrice:390000, brand:"Maison Margiela", rating:4.8, inStock:true },
    { id:3, name:"Byredo perfume man",   category:"goo-saikhan", tag:"sale", image:"image/product3.jpg", oldPrice:510000,  newPrice:340000,  brand:"Byredo",          rating:4.7, inStock:true },
    { id:4, name:"Acne Studios bag",     category:"huvtsas",     tag:"sale", image:"image/product4.jpg", oldPrice:4200000, newPrice:3210000, brand:"Acne Studios",    rating:4.6, inStock:true },
    { id:5, name:"Luggage 25inch",       category:"ayalal",      tag:"sale", image:"image/product5.jpg", oldPrice:950000,  newPrice:740000,  brand:"Generic",         rating:4.2, inStock:true },
    { id:6, name:"Sleep well gummie pill", category:"eruul",     tag:"new",  image:"image/product6.jpg", oldPrice:130000,  newPrice:97000,   brand:"Wellness",        rating:4.0, inStock:false },
    { id:7, name:"iPhone 17 Pro Max",    category:"tsakhilgaan", tag:"new",  image:"image/product7.png", oldPrice:6500000, newPrice:6100000, brand:"Apple",           rating:5.0, inStock:true },
    { id:8, name:"T-Shirt",              category:"huvtsas",     tag:"sale", image:"image/product8.jpg", oldPrice:349000,  newPrice:300000,  brand:"Generic",         rating:3.9, inStock:true },
    { id:9, name:"Wireless Earbuds",     category:"tsakhilgaan", tag:"new",  image:"image/product9.jpg", oldPrice:400000,  newPrice:300000,  brand:"Sony",            rating:4.3, inStock:true },
    { id:10, name:"Leather Sneakers",    category:"huvtsas",     tag:"sale", image:"image/product10.jpg",oldPrice:400000,  newPrice:300000,  brand:"Generic",         rating:4.1, inStock:true }
  ],
  brands: [
    { id:1, name:"Loewe",        image:"image/brand1.jpg" },
    { id:2, name:"Byredo",       image:"image/brand2.jpg" },
    { id:3, name:"Apple",        image:"image/brand3.jpg" },
    { id:4, name:"Acne Studios", image:"image/brand4.jpg" },
    { id:5, name:"Sony",         image:"image/brand5.jpg" },
    { id:6, name:"Generic",      image:"image/brand6.jpg" },
    { id:7, name:"Wellness",     image:"image/brand7.jpg" },
    { id:8, name:"Maison Margiela", image:"image/brand8.jpg" }
  ],
  categories: [
    { id:"huvtsas",     name:"Хувцас",      image:"image/clothes.jpg" },
    { id:"tsakhilgaan", name:"Электроникс", image:"image/electronic.png" },
    { id:"goo-saikhan", name:"Гоо сайхан",  image:"image/beauty.jpg" },
    { id:"ger-ahui",    name:"Гэр ахуй",    image:"image/home.png" },
    { id:"ayalal",      name:"Аялал",       image:"image/travel.jpg" }
  ]
};

async function loadData() {
  try {
    const res  = await fetch("products.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("products.json татагдсангүй — fallback өгөгдөл ашиглаж байна:", err.message);
    return FALLBACK_DATA;
  }
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