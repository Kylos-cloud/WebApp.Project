// =====================
// SLIDER
// =====================
const slider = document.querySelector(".categories");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

rightBtn.addEventListener("click", () => {
  slider.scrollBy({ left: 350, behavior: "smooth" });
});

leftBtn.addEventListener("click", () => {
  slider.scrollBy({ left: -350, behavior: "smooth" });
});

// =====================
// MENU OPEN / CLOSE
// =====================
function openMenu() {
  document.getElementById("categoryMenu").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeMenu() {
  document.getElementById("categoryMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// =====================
// CATEGORY SEARCH
// =====================
const searchInput = document.getElementById("categorySearch");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const items = document.querySelectorAll(".menu-item");
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(value) ? "flex" : "none";
  });
});

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

// RENDER MENU RIGHT
const menuRight = document.getElementById("menuRight");

function renderSubcategories(categoryKey) {
  const data = categoryData[categoryKey];

  if (!data) {
    menuRight.innerHTML = '<p class="menu-right-hint">Удахгүй нэмэгдэнэ</p>';
    return;
  }

  // <section> болон <h3> ашиглаж, item-ийг <button> болголоо.
  let html = '';
  data.subcategories.forEach((sub, subIndex) => {
    html += `
      <section class="submenu-section">
        <h3 class="submenu-section-title">${sub.name}</h3>
    `;
    sub.items.forEach((item, itemIndex) => {
      html += `
        <button class="submenu-item-link" 
          onclick="navigateToItem('${categoryKey}', ${subIndex}, ${itemIndex})"
          style="width: 100%; text-align: left; background: none; border: none; font: inherit;"
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

  const sectionId = item.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    console.log(`Navigate → ${data.label} > ${sub.name} > ${item}`);
  }
}

// MOBILE SEARCH TOGGLE
const searchToggle = document.getElementById("searchToggle");
const searchEl = document.querySelector(".search");

if (searchToggle && searchEl) {
    searchToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        const isOpen = searchEl.classList.contains("open");
        if (isOpen) {
            searchEl.classList.remove("open");
            searchToggle.classList.remove("hidden");
        } else {
            searchEl.classList.add("open");
            searchToggle.classList.add("hidden");
            setTimeout(() => searchEl.querySelector("input").focus(), 50);
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

// MENU ITEM CLICK
document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", function () {
    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");
    renderSubcategories(this.dataset.category);
  });
});


const btn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
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