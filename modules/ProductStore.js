// ============================================================
// MODULE: ProductStore
// Өгөгдлийг хадгалах, шүүх, хувиргах класс
// map, filter, reduce, join ашиглана
// ============================================================

export class ProductStore {
  constructor(data) {
    this._products   = data.products   || [];
    this._brands     = data.brands     || [];
    this._categories = data.categories || [];
  }

  // --- Getters ---

  get allProducts()   { return this._products; }
  get allBrands()     { return this._brands; }
  get allCategories() { return this._categories; }

  // --- filter: зөвхөн хямдарсан барааг авах ---
  getSaleProducts() {
    return this._products.filter(p => p.tag === "sale");
  }

  // --- filter: ангиллаар шүүх ---
  getByCategory(categoryId) {
    return this._products.filter(p => p.category === categoryId);
  }

  // --- filter + map: нэрсийн жагсаалт гаргах ---
  getProductNames() {
    return this._products
      .filter(p => p.inStock)
      .map(p => p.name);
  }

  // --- map: үнийн мэдээллийг хувиргах ---
  getPriceList() {
    return this._products.map(p => ({
      id:       p.id,
      name:     p.name,
      discount: Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100),
      newPrice: p.newPrice
    }));
  }

  // --- reduce: нийт хямдралын дүн тооцох ---
  getTotalDiscount() {
    return this._products.reduce((sum, p) => sum + (p.oldPrice - p.newPrice), 0);
  }

  // --- reduce: ангиллаар бүлэглэх ---
  groupByCategory() {
    return this._products.reduce((groups, p) => {
      const key = p.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
      return groups;
    }, {});
  }

  // --- join: бүх брэндийн нэрийг нэгтгэх ---
  getBrandNames() {
    return this._brands.map(b => b.name).join(" · ");
  }

  // --- filter + map + join: гарчиг үүсгэх ---
  getSaleSummary() {
    const saleNames = this.getSaleProducts()
      .map(p => p.name)
      .join(", ");
    return `Хямдарсан бараанууд: ${saleNames}`;
  }

  // --- Дундаж үнэлгээ (reduce) ---
  getAverageRating() {
    if (!this._products.length) return 0;
    const total = this._products.reduce((sum, p) => sum + p.rating, 0);
    return (total / this._products.length).toFixed(1);
  }
}