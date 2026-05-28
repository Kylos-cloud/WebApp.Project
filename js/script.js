// =====================
// INFINITE CYCLING SLIDER
// =====================
document.querySelectorAll(".categories-wrapper").forEach(wrapper => {
  const leftBtn = wrapper.querySelector(".left");
  const rightBtn = wrapper.querySelector(".right");
  const slider = wrapper.querySelector(".categories, .brands");
  if (!slider) return;

  let initialized = false;

  function setupInfinite() {
    if (initialized) return;
    const items = Array.from(slider.children);
    if (items.length === 0) return;
    initialized = true;

    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add("clone");
      slider.appendChild(clone);
    });
  }

  // For statically rendered sliders (categories)
  setupInfinite();

  // For dynamically rendered sliders (brands via JS)
  const observer = new MutationObserver((mutations, obs) => {
    const hasRealItems = Array.from(slider.children).some(c => !c.classList.contains("clone"));
    if (hasRealItems) {
      obs.disconnect();
      setupInfinite();
    }
  });
  observer.observe(slider, { childList: true });

  // Seamless loop reset
  slider.addEventListener("scroll", () => {
    const half = slider.scrollWidth / 2;
    if (slider.scrollLeft >= half) {
      slider.scrollLeft -= half;
    } else if (slider.scrollLeft <= 0) {
      slider.scrollLeft += half;
    }
  }, { passive: true });

  const SCROLL_AMOUNT = 300;

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      slider.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    });
  }
  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      slider.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    });
  }

  // Auto-scroll on desktop and mobile
  let autoTimer;
  function startAuto() {
    stopAuto();
    const step = window.innerWidth <= 768 ? 160 : SCROLL_AMOUNT;
    autoTimer = setInterval(() => {
      slider.scrollBy({ left: step, behavior: "smooth" });
    }, window.innerWidth <= 768 ? 2500 : 3000);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

  startAuto();
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);
  // Pause briefly on touch, then resume so it keeps animating
  slider.addEventListener("touchstart", stopAuto, { passive: true });
  slider.addEventListener("touchend", () => setTimeout(startAuto, 1500), { passive: true });
});

// =====================
// MENU OPEN / CLOSE
// =====================
function openMenu() {
  const menu = document.getElementById("categoryMenu");
  const overlay = document.getElementById("overlay");
  if (menu) menu.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

function closeMenu() {
  const menu = document.getElementById("categoryMenu");
  const overlay = document.getElementById("overlay");
  if (menu) menu.classList.remove("active", "level-2");
  if (overlay) overlay.classList.remove("active");
}

// =====================
// CATEGORY SEARCH
// =====================
const searchInput = document.getElementById("categorySearch");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const items = document.querySelectorAll(".menu-item");
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(value);
      item.style.display = match ? "flex" : "none";
      // Mobile accordion: hide the .mobile-sub that was inserted after this
      // item so it doesn't float under unrelated search results.
      const sub = item.nextElementSibling;
      if (sub && sub.classList.contains("mobile-sub")) {
        sub.style.display = match ? "" : "none";
      }
    });
  });
}

// =====================
// 3-LEVEL NAV DATA
// =====================
const categoryData = {
  "tsakhilgaan": {
    label: "Цахилгаан бараа",
    subcategories: [
      { name: "Гар утас & Таблет", items: ["Гар утас", "Таблет", "Утасны хамгаалалт", "Дата кабель", "Цэнэглэгч"] },
      { name: "Компьютер & Ноутбук", items: ["Ноутбук", "Десктоп компьютер", "Монитор", "Гар & Хулгана", "SSD & HDD"] },
      { name: "Дуу & Зураг", items: ["Чихэвч", "Дохиоллын систем", "Камер", "Гэрэл зургийн хэрэгсэл"] },
      { name: "Гэрийн цахилгаан", items: ["Телевизор", "Хөргөгч", "Угаалгын машин", "Тоос сорогч", "Агааржуулагч"] }
    ]
  },
  "ger-ahui": {
    label: "Гэр ахуй",
    subcategories: [
      { name: "Унтлагийн өрөө", items: ["Дэвгэр", "Дэр", "Хөнжил", "Унтлагийн шкаф", "Орны хаалт"] },
      { name: "Угаалгийн өрөө", items: ["Шампоо", "Сав суулга", "Алчуур", "Шүдний сойз", "Нүүрний тос"] },
      { name: "Гал тогооны өрөө", items: ["Аяга таваг", "Тогооч", "Хутга", "Хоол хийх хэрэгсэл", "Хадгалах сав"] },
      { name: "Байшин чимэглэл", items: ["Дэвсгэр", "Хөшиг", "Зул", "Ургамал", "Гэрэлтүүлэг"] }
    ]
  },
  "shine-huns": {
    label: "Шинэ хүнс",
    subcategories: [
      { name: "Жимс & Хүнсний ногоо", items: ["Алим", "Нимбэг", "Гурил", "Төмс", "Лууван"] },
      { name: "Мах & Загас", items: ["Үхрийн мах", "Хонины мах", "Загас", "Тахианы мах"] },
      { name: "Сүү & Цагаан идээ", items: ["Сүү", "Тараг", "Бяслаг", "Зөгийн бал", "Ааруул"] }
    ]
  },
  "bolovsruulsan-huns": {
    label: "Боловсруулсан хүнс",
    subcategories: [
      { name: "Консерв & Саванд", items: ["Консерв мах", "Консерв загас", "Консерв хүнс"] },
      { name: "Гурилан бүтээгдэхүүн", items: ["Талх", "Бисквит", "Печень", "Вафли"] },
      { name: "Амттан", items: ["Шоколад", "Чихэр", "Мармелад", "Карамел"] }
    ]
  },
  "shingen-huns": {
    label: "Шингэн хүнс",
    subcategories: [
      { name: "Ус & Ундаа", items: ["Цэвэр ус", "Рашаан ус", "Жүүс", "Лемонад"] },
      { name: "Цай & Кофе", items: ["Ногоон цай", "Хар цай", "Эспрессо", "Капучино"] },
      { name: "Спортын ундаа", items: ["Энерги ундаа", "Электролит ундаа", "Протейн шейк"] }
    ]
  },
  "goo-saikhan": {
    label: "Гоо сайхан",
    subcategories: [
      { name: "Арьс арчилгаа", items: ["Нүүрний тос", "Сэрүүлэгч", "Нүүрний угаалтуур", "Маск", "Нарнаас хамгаалагч"] },
      { name: "Үс арчилгаа", items: ["Шампоо", "Кондиционер", "Үсний тос", "Үсний маск"] },
      { name: "Гоо сайхны хэрэгсэл", items: ["Сурьма", "Помада", "Хонхор", "Тушь", "Хайлайтер"] }
    ]
  },
  "huvtsas": {
    label: "Хувцас, Гутал",
    subcategories: [
      { name: "Эрэгтэй хувцас", items: ["Цамц", "Өмд", "Куртка", "Костюм", "Доторт хувцас"] },
      { name: "Эмэгтэй хувцас", items: ["Даашинз", "Блуз", "Юбка", "Пальто", "Доторт хувцас"] },
      { name: "Гутал", items: ["Пүүз", "Гутал", "Сандал", "Дотор гутал", "Спорт гутал"] }
    ]
  },
  "huuhdiin": {
    label: "Хүүхдийн бараа",
    subcategories: [
      { name: "Хүүхдийн хувцас", items: ["Оройны хувцас", "Спорт хувцас", "Дотор хувцас", "Малгай & Бээлий"] },
      { name: "Тоглоом", items: ["Бебийн тоглоом", "Хар самбар", "Дагина", "Машин тоглоом", "Паазл"] },
      { name: "Хүүхдийн тэжээл", items: ["Нялхсын сүү", "Жижиглэсэн хүнс", "Жимсний пюре"] }
    ]
  },
  "avto": {
    label: "Авто",
    subcategories: [
      { name: "Автомашины эд анги", items: ["Тос", "Шүүр", "Акумлятор", "Дугуй"] },
      { name: "Гадна засал", items: ["Угаах хэрэгсэл", "Будаг", "Хамгаалалт бүрэлт"] },
      { name: "Дотор засал", items: ["Суудлын бүрэлт", "Сагс", "Ароматайзер", "Тоног хэрэгсэл"] }
    ]
  },
  "barilga": {
    label: "Барилгын материал",
    subcategories: [
      { name: "Барилгын үндсэн", items: ["Цемент", "Тоосго", "Төмрийн зориглол", "Мод"] },
      { name: "Засал чимэглэл", items: ["Будаг", "Шал хучлага", "Ханын цаас", "Тааз хийц"] },
      { name: "Хэрэгсэл", items: ["Гар хэрэгсэл", "Цахилгаан хэрэгсэл", "Хэмжих хэрэгсэл"] }
    ]
  },
  "ayalal": {
    label: "Аялал зугаалга",
    subcategories: [
      { name: "Аялалын хэрэгсэл", items: ["Чемодан", "Нуруувч", "Нойрны уут", "Майхан"] },
      { name: "Гадаа үйл ажиллагаа", items: ["Загас агнуур", "Явган аялал", "Кемпинг хэрэгсэл"] }
    ]
  },
  "sport": {
    label: "Спорт",
    subcategories: [
      { name: "Фитнесс", items: ["Жин", "Гимнастикийн хэрэгсэл", "Йога", "Уян харимхай"] },
      { name: "Хөдөлгөөнт спорт", items: ["Хөлбөмбөг", "Сагсан бөмбөг", "Теннис", "Бокс"] },
      { name: "Спортын хувцас", items: ["Тренировкийн хувцас", "Спорт гутал", "Малгай", "Бугуйвч"] }
    ]
  },
  "togloom": {
    label: "Тоглоом хобби",
    subcategories: [
      { name: "Видео тоглоом", items: ["PlayStation", "Xbox", "Nintendo", "PC тоглоом", "Тоглоомын хэрэгсэл"] },
      { name: "Нийгмийн тоглоом", items: ["Ширээний тоглоом", "Карт тоглоом", "Паазл", "Шатар"] }
    ]
  },
  "bichig": {
    label: "Бичиг хэрэг",
    subcategories: [
      { name: "Сургуулийн хэрэгсэл", items: ["Дэвтэр", "Үзэг", "Харандаа", "Линейка", "Баг"] },
      { name: "Оффисын хэрэгсэл", items: ["Принтер цаас", "Файл", "Clipboard", "Стикер"] }
    ]
  },
  "bayar": {
    label: "Баяр ёслол",
    subcategories: [
      { name: "Баярын чимэглэл", items: ["Бөмбөлөг", "Туг", "Хэрлэн цаас", "Лент"] },
      { name: "Бэлэг", items: ["Бэлгийн хайрцаг", "Бэлгийн карт", "Баглаа боодол"] }
    ]
  },
  "eruul": {
    label: "Эрүүл мэнд",
    subcategories: [
      { name: "Эм", items: ["Витамин", "Хавсралт", "Хүйтний эм", "Өвдөлт намдаагч"] },
      { name: "Эмнэлгийн хэрэгсэл", items: ["Термометр", "Цусны даралт хэмжигч", "Таяг", "Бинт"] }
    ]
  },
  "tejeewr": {
    label: "Тэжээвэр амьтан",
    subcategories: [
      { name: "Нохойн хэрэгсэл", items: ["Нохойн хоол", "Нохойн тоглоом", "Нохойн хувцас", "Нохойн ор"] },
      { name: "Муурны хэрэгсэл", items: ["Муурны хоол", "Муурны элс", "Муурны тоглоом", "Гэрэгнийн модон"] }
    ]
  },
  "hyamdral": {
    label: "Хямдрал",
    subcategories: [
      { name: "Хямдарсан бараа", items: ["Электроник хямдрал", "Хувцас хямдрал", "Гэр ахуй хямдрал", "Хүнс хямдрал"] },
      { name: "Флеш борлуулалт", items: ["Өнөөдрийн хямдрал", "7 хоногийн хямдрал"] }
    ]
  }
};
window.categoryData = categoryData;

// RENDER MENU RIGHT
const menuRight = document.getElementById("menuRight");

function renderSubcategories(categoryKey) {
  if (!menuRight) return;
  const data = categoryData[categoryKey];

  if (!data) {
    menuRight.innerHTML = '<p class="menu-right-hint">Удахгүй нэмэгдэнэ</p>';
    return;
  }

  // <section> болон <h3> ашиглаж, item-ийг <button> болголоо.
  const catLabel = data.label;
  let html = `
    <button class="submenu-back-mobile" onclick="closeSubPanel()" aria-label="Буцах">
      ← Буцах
    </button>
    <button onclick="navigateToCategory('${categoryKey}')" style="
      display:inline-flex; align-items:center; gap:6px;
      margin-bottom:16px; padding:8px 16px;
      background: hsl(0,0%,15%); color:white;
      border:none; border-radius:30px; font:inherit;
      font-size:13px; font-weight:600; cursor:pointer;
      transition:opacity 0.2s;
    " onmouseover="this.style.opacity='.8'" onmouseout="this.style.opacity='1'">
      ${catLabel} — бүгдийг харах →
    </button>
  `;

  data.subcategories.forEach((sub, subIndex) => {
    html += `
      <section class="submenu-section">
        <h3 class="submenu-section-title">${sub.name}</h3>
    `;
    sub.items.forEach((item, itemIndex) => {
      html += `
        <button class="submenu-item-link"
          onclick="navigateToItem('${categoryKey}', ${subIndex}, ${itemIndex})"
          style="width:100%; text-align:left; background:none; border:none; font:inherit;"
        >
          ${item}
        </button>
      `;
    });
    html += `</section>`;
  });

  menuRight.innerHTML = html;
}

function navigateToItem(categoryKey, subIndex, itemIndex) {
  const data = categoryData[categoryKey];
  const sub = data.subcategories[subIndex];
  const item = sub.items[itemIndex];

  closeMenu();

  if (document.getElementById("productsGrid")) {
    window.dispatchEvent(new CustomEvent("categoryNavigation", {
      detail: { categoryKey, subName: sub.name, itemName: item }
    }));
    setTimeout(() => {
      const salesSection = document.getElementById("sales");
      if (salesSection) salesSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } else {
    window.location.href = `index.html?category=${encodeURIComponent(categoryKey)}&sub=${subIndex}&item=${itemIndex}`;
  }
}

function navigateToCategory(categoryKey) {
  closeMenu();

  if (document.getElementById("productsGrid")) {
    window.dispatchEvent(new CustomEvent("categoryNavigation", {
      detail: { categoryKey, subName: null, itemName: null }
    }));
    setTimeout(() => {
      const salesSection = document.getElementById("sales");
      if (salesSection) salesSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } else {
    window.location.href = `index.html?category=${encodeURIComponent(categoryKey)}`;
  }
}

// MOBILE SEARCH TOGGLE
const searchToggle = document.getElementById("searchToggle");
const searchEl = document.querySelector(".search");

if (searchToggle && searchEl) {
  searchToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // Desktop: focus the search input and scroll to products section
      const input = searchEl.querySelector("input");
      input.focus();
      input.select();
      const salesSection = document.getElementById("sales");
      if (salesSection) {
        salesSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const isOpen = searchEl.classList.contains("open");
    if (isOpen) {
      searchEl.classList.remove("open");
      searchToggle.classList.remove("hidden");
    } else {
      searchEl.classList.add("open");
      searchToggle.classList.add("hidden");
      searchEl.querySelector("input")?.focus();
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;
    if (!searchEl.contains(e.target) && e.target !== searchToggle && !searchToggle.contains(e.target)) {
      searchEl.classList.remove("open");
      searchToggle.classList.remove("hidden");
    }
  });
}

// SCROLL: hide bottom nav on scroll down, show on scroll up
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    nav.style.transform = "translateY(100%)";
  } else {
    nav.style.transform = "translateY(0)";
  }

  lastScrollY = currentScrollY;
});

// BOTTOM NAV ACTIVE STATE
document.querySelectorAll(".bottom-nav-item").forEach(item => {
  item.addEventListener("click", function () {
    document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");
  });
});

const btn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (!btn) return;
  const scrollTop = document.documentElement.scrollTop;

  if (scrollTop > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openContact() {
  const el = document.getElementById("contact");
  const overlay = document.getElementById("contactOverlay");
  if (el) el.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// If we arrived with #contact in the URL (icon from another page),
// auto-open the contact modal once the DOM is ready.
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash === "#contact" && document.getElementById("contact")) {
    openContact();
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
});

function closeContact() {
  const el = document.getElementById("contact");
  const overlay = document.getElementById("contactOverlay");
  if (el) el.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeContact();
});

function handleContactSubmit(e) {
  e.preventDefault();
  const success = document.getElementById("contactSuccess");
  if (!success) return;
  success.classList.add("show");
  e.target.reset();
  setTimeout(() => success.classList.remove("show"), 4000);
}

document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", function () {

    // ── DESKTOP ──
    if (window.innerWidth > 768) {
      document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
      this.classList.add("active");
      renderSubcategories(this.dataset.category);
      return;
    }

    // ── MOBILE accordion ──
    const isOpen = this.classList.contains("active");

    // Бүгдийг хаах
    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    document.querySelectorAll(".mobile-sub").forEach(s => s.remove());

    if (isOpen) return;

    // Нээх
    this.classList.add("active");
    const catKey = this.dataset.category;
    const data = categoryData[catKey];
    if (!data) return;

    const sub = document.createElement("div");
    sub.className = "mobile-sub";

    let html = `
      <button class="mobile-sub-all" onclick="navigateToCategory('${catKey}')">
        ${data.label} — бүгдийг үзэх →
      </button>
    `;

    data.subcategories.forEach((s, si) => {
      html += `<div class="mobile-sub-section">${s.name}</div>`;
      s.items.forEach((itm, ii) => {
        html += `
          <div class="mobile-sub-item" onclick="navigateToItem('${catKey}', ${si}, ${ii})">
            <span>${itm}</span><span class="mobile-sub-arrow">›</span>
          </div>`;
      });
    });

    sub.innerHTML = html;
    this.insertAdjacentElement("afterend", sub);
  });

  item.addEventListener("dblclick", function () {
    navigateToCategory(this.dataset.category);
  });
});

// Mobile-only: back from level 2 → level 1
window.closeSubPanel = function () {
  const aside = document.getElementById("categoryMenu");
  if (aside) aside.classList.remove("level-2");
};
function openReturns() {
  const el = document.getElementById("returns");
  const overlay = document.getElementById("returnsOverlay");
  if (el) el.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeReturns() {
  document.getElementById("returns").classList.remove("active");
  document.getElementById("returnsOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function handleReturnsSubmit(e) {
  e.preventDefault();
  const success = document.getElementById("returnsSuccess");
  success.classList.add("show");
  e.target.reset();
  setTimeout(() => success.classList.remove("show"), 4000);
}
function openFaq() {
  const el = document.getElementById("faq");
  const overlay = document.getElementById("faqOverlay");
  if (el) el.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeFaq() {
  document.getElementById("faq").classList.remove("active");
  document.getElementById("faqOverlay").classList.remove("active");
  document.body.style.overflow = "";
}