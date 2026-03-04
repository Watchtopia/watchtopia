const navMenuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav");
const navLangButtons = document.querySelectorAll(".lang-btn");

if (navMenuBtn && navMenu) {
  navMenuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navMenuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navMenuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const navI18n = {
  az: {
    menu: "Menyu",
    navCatalog: "Kataloq",
    navAddProduct: "Məhsul əlavə et",
    navAbout: "Haqqımızda",
    navContact: "Əlaqə",
    megaCollections: "Kolleksiyalar",
    megaOriginal: "Original Seriya",
    megaDesign: "Dizayn Saatlar",
    megaNew: "Yeni Gələnlər",
    megaBrands: "Brendlər",
    megaCategories: "Kateqoriyalar",
    megaWatches: "Saatlar",
    megaPerfumes: "Parfümlər",
    megaAccessories: "Aksesuarlar",
    megaPromo1Title: "Endirim Kodu",
    megaPromo1Text: "COMEBACK10 ilə 10% endirim",
    megaPromo2Title: "Pulsuz Çatdırılma",
    megaPromo2Text: "100 AZN-dən yuxarı sifarişlərdə",
    trustSSL: "SSL Təhlükəsizlik",
    trustPayment: "Təhlükəsiz Ödəniş",
    trustQuality: "100% Orijinal"
  },
  ru: {
    menu: "Меню",
    navCatalog: "Каталог",
    navAddProduct: "Добавить товар",
    navAbout: "О нас",
    navContact: "Контакты",
    megaCollections: "Коллекции",
    megaOriginal: "Оригинальная серия",
    megaDesign: "Дизайнерское часы",
    megaNew: "Новинки",
    megaBrands: "Бренды",
    megaCategories: "Категории",
    megaWatches: "Часы",
    megaPerfumes: "Парфюмерия",
    megaAccessories: "Аксессуары",
    megaPromo1Title: "Промокод",
    megaPromo1Text: "10% скидка с кодом COMEBACK10",
    megaPromo2Title: "Бесплатная доставка",
    megaPromo2Text: "При заказе от 100 AZN",
    trustSSL: "SSL Безопасность",
    trustPayment: "Безопасная оплата",
    trustQuality: "100% Оригинал"
  },
  en: {
    menu: "Menu",
    navCatalog: "Catalog",
    navAddProduct: "Add Product",
    navAbout: "About",
    navContact: "Contact",
    megaCollections: "Collections",
    megaOriginal: "Original Series",
    megaDesign: "Design Watches",
    megaNew: "New Arrivals",
    megaBrands: "Brands",
    megaCategories: "Categories",
    megaWatches: "Watches",
    megaPerfumes: "Perfumes",
    megaAccessories: "Accessories",
    megaPromo1Title: "Promo Code",
    megaPromo1Text: "10% off with COMEBACK10",
    megaPromo2Title: "Free Delivery",
    megaPromo2Text: "On orders over 100 AZN",
    trustSSL: "SSL Security",
    trustPayment: "Secure Payment",
    trustQuality: "100% Original"
  }
};

const pageI18n = {
  catalog: {
    az: {
      pageTitle: "watchtopia | Butun Kataloq",
      pageDescription: "watchtopia butun kataloq - filtrli saat secimi",
      heading: "Butun Kataloq",
      intro: "Brend, kateqoriya, mexanizm ve axtaris filtrine gore model secin.",
      filters: "Filtrler",
      search: "Axtaris",
      searchPlaceholder: "Model ve ya brend adi yazin",
      brand: "Brend",
      category: "Kateqoriya",
      productType: "Mehsul novu",
      mechanism: "Mexanizm",
      sort: "Qiymete gore",
      reset: "Filtrleri sifirla",
      all: "Hamisi",
      categoryOriginal: "Original",
      categoryDesign: "Design",
      typeWatch: "Saat",
      typePerfume: "Parfum",
      typeGlasses: "Eynak",
      typeWallet: "Pulqabisi",
      typeAccessory: "Aksesuar",
      sortDefault: "Standart",
      sortAsc: "Ucuzdan bahaya",
      sortDesc: "Bahadan ucuza"
    },
    ru: {
      pageTitle: "watchtopia | Полный каталог",
      pageDescription: "watchtopia полный каталог - выбор часов с фильтрами",
      heading: "Полный каталог",
      intro: "Выбирайте модель по бренду, категории, механизму и поиску.",
      filters: "Фильтры",
      search: "Поиск",
      searchPlaceholder: "Введите модель или бренд",
      brand: "Бренд",
      category: "Категория",
      productType: "Тип товара",
      mechanism: "Механизм",
      sort: "Сортировка по цене",
      reset: "Сбросить фильтры",
      all: "Все",
      categoryOriginal: "Оригинал",
      categoryDesign: "Дизайн",
      typeWatch: "Часы",
      typePerfume: "Парфюм",
      typeGlasses: "Очки",
      typeWallet: "Кошелек",
      typeAccessory: "Аксессуар",
      sortDefault: "По умолчанию",
      sortAsc: "Сначала дешевле",
      sortDesc: "Сначала дороже"
    },
    en: {
      pageTitle: "watchtopia | Full Catalog",
      pageDescription: "watchtopia full catalog - filter watches by brand and specs",
      heading: "Full Catalog",
      intro: "Choose a model by brand, category, mechanism, and search.",
      filters: "Filters",
      search: "Search",
      searchPlaceholder: "Type model or brand name",
      brand: "Brand",
      category: "Category",
      productType: "Product type",
      mechanism: "Mechanism",
      sort: "Sort by price",
      reset: "Reset filters",
      all: "All",
      categoryOriginal: "Original",
      categoryDesign: "Design",
      typeWatch: "Watch",
      typePerfume: "Perfume",
      typeGlasses: "Glasses",
      typeWallet: "Wallet",
      typeAccessory: "Accessory",
      sortDefault: "Default",
      sortAsc: "Price: Low to High",
      sortDesc: "Price: High to Low"
    }
  },
  addProduct: {
    az: {
      pageTitle: "watchtopia | Mehsul Elave Et",
      pageDescription: "watchtopia mehsul elave etme paneli",
      heading: "Mehsul elave et",
      intro: "Asagidaki saheleri doldurun. Saxladigdan sonra mehsul hem katalogda, hem esas sehifede gorunecek."
    },
    ru: {
      pageTitle: "watchtopia | Добавить товар",
      pageDescription: "Панель добавления товаров watchtopia",
      heading: "Добавление товара",
      intro: "Заполните поля ниже. После сохранения товар сразу появится в каталоге и на главной странице."
    },
    en: {
      pageTitle: "watchtopia | Add Product",
      pageDescription: "watchtopia product creation panel",
      heading: "Add Product",
      intro: "Fill in the fields below. After saving, the product appears in catalog and on homepage."
    }
  }
};

function applyCatalogPageLang(locale) {
  const dict = pageI18n.catalog[locale];
  if (!dict) return;
  document.title = dict.pageTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", dict.pageDescription);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("catalog-heading", dict.heading);
  setText("catalog-intro", dict.intro);
  setText("filters-title", dict.filters);
  setText("label-search", dict.search);
  setText("label-brand", dict.brand);
  setText("label-category", dict.category);
  setText("label-product-type", dict.productType);
  setText("label-mechanism", dict.mechanism);
  setText("label-sort", dict.sort);
  setText("reset-filters", dict.reset);

  const search = document.getElementById("search-input");
  if (search) search.setAttribute("placeholder", dict.searchPlaceholder);

  document.querySelectorAll("[data-all-option]").forEach((el) => (el.textContent = dict.all));

  const sortDefault = document.querySelector('#sort-filter option[value="default"]');
  const sortAsc = document.querySelector('#sort-filter option[value="price-asc"]');
  const sortDesc = document.querySelector('#sort-filter option[value="price-desc"]');
  const categoryOriginal = document.querySelector('#category-filter option[value="original"]');
  const categoryDesign = document.querySelector('#category-filter option[value="design"]');
  if (sortDefault) sortDefault.textContent = dict.sortDefault;
  if (sortAsc) sortAsc.textContent = dict.sortAsc;
  if (sortDesc) sortDesc.textContent = dict.sortDesc;
  if (categoryOriginal) categoryOriginal.textContent = dict.categoryOriginal;
  if (categoryDesign) categoryDesign.textContent = dict.categoryDesign;
}

function applyAddProductPageLang(locale) {
  const dict = pageI18n.addProduct[locale];
  if (!dict) return;
  document.title = dict.pageTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", dict.pageDescription);
  const heading = document.getElementById("add-product-heading");
  const intro = document.getElementById("add-product-intro");
  if (heading) heading.textContent = dict.heading;
  if (intro) intro.textContent = dict.intro;
}

function applyNavLang(lang) {
  const locale = navI18n[lang] ? lang : "az";
  const dict = navI18n[locale];

  document.documentElement.lang = locale;
  document.querySelectorAll("[data-nav-i18n]").forEach((el) => {
    const key = el.dataset.navI18n;
    if (dict[key]) el.textContent = dict[key];
  });

  if (document.body.dataset.page === "catalog") applyCatalogPageLang(locale);
  if (document.body.dataset.page === "add-product") applyAddProductPageLang(locale);

  navLangButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === locale);
  });

  localStorage.setItem("watchtopia-language", locale);
  window.dispatchEvent(new CustomEvent("watchtopia:lang-changed", { detail: { lang: locale } }));
}

// Mobile Mega Menu Toggle
document.querySelectorAll(".mega-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      const parent = trigger.closest(".nav-item");
      if (parent) {
        parent.classList.toggle("is-active");
        window.vibrate?.(20);
      }
    }
  });
});

applyNavLang(localStorage.getItem("watchtopia-language") || "az");

const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  const currentTheme = localStorage.getItem("watchtopia-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("watchtopia-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("watchtopia-theme", "dark");
    }
  });
}

const globalSearchInput = document.getElementById("global-search-input");
const globalSearchResults = document.getElementById("global-search-results");

if (globalSearchInput && globalSearchResults && window.WatchtopiaProducts) {
  let searchTimeout;

  globalSearchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      globalSearchResults.style.display = "none";
      return;
    }

    searchTimeout = setTimeout(() => {
      const allProducts = window.WatchtopiaProducts.getAllProducts() || [];
      const matches = allProducts.filter(p => {
        const name = String(p.name || "").toLowerCase();
        const brand = String(p.brand || "").toLowerCase();
        const mech = String(p.mechanism || "").toLowerCase();
        return name.includes(query) || brand.includes(query) || mech.includes(query);
      }).slice(0, 6);

      if (matches.length > 0) {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const hoverBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(29, 36, 48, 0.06)";
        const borderLine = isDark ? "#3a3a3a" : "#e3e6ea";

        globalSearchResults.innerHTML = matches.map(m => {
          const img = (m.images && m.images[0]) ? (m.images[0].startsWith("http") ? m.images[0] : `../${m.images[0]}`) : "";
          const pathPrefix = window.location.pathname.includes("/admin.html") || window.location.pathname.includes("/index.html") || window.location.pathname === "/" ? "pages/product.html" : "product.html";

          return `
            <a href="${pathPrefix}?sku=${encodeURIComponent(m.sku)}" style="display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; text-decoration: none; color: inherit; transition: background 0.2s;" onmouseover="this.style.background='${hoverBg}'" onmouseout="this.style.background='transparent'">
              <div style="width: 48px; height: 48px; border-radius: 6px; overflow: hidden; background: var(--bg-soft); flex-shrink: 0; border: 1px solid ${borderLine}">
                ${img ? `<img src="${img}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">` : ""}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
                <div style="font-size: 0.8rem; color: var(--gold);">${Number(m.price).toFixed(2)} ${m.currency || 'AZN'}</div>
              </div>
            </a>
          `;
        }).join("");
        globalSearchResults.style.display = "flex";
      } else {
        const text = document.documentElement.lang === "ru" ? "Ничего не найдено" :
          (document.documentElement.lang === "en" ? "No results found" : "Heç nə tapılmadı");
        globalSearchResults.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--muted); font-size: 0.85rem;">${text}</div>`;
        globalSearchResults.style.display = "block";
      }
    }, 250);
  });

  document.addEventListener("click", (e) => {
    if (!globalSearchInput.contains(e.target) && !globalSearchResults.contains(e.target)) {
      globalSearchResults.style.display = "none";
    }
  });

  globalSearchInput.addEventListener("focus", () => {
    if (globalSearchInput.value.trim().length >= 2) {
      globalSearchInput.dispatchEvent(new Event("input"));
    }
  });
}

window.flyToCart = function (sourceImg) {
  if (!sourceImg) return;
  const cartIcon = document.querySelector('a[href*="cart.html"]');
  if (!cartIcon) return;

  const srcRect = sourceImg.getBoundingClientRect();
  const destRect = cartIcon.getBoundingClientRect();

  const clone = sourceImg.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = `${srcRect.left}px`;
  clone.style.top = `${srcRect.top}px`;
  clone.style.width = `${srcRect.width}px`;
  clone.style.height = `${srcRect.height}px`;
  clone.style.zIndex = "9999";
  clone.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  clone.style.borderRadius = "50%";
  clone.style.opacity = "0.8";
  clone.style.pointerEvents = "none";

  document.body.appendChild(clone);

  // force reflow
  clone.getBoundingClientRect();

  clone.style.left = `${destRect.left + destRect.width / 2 - 10}px`;
  clone.style.top = `${destRect.top + destRect.height / 2 - 10}px`;
  clone.style.width = "20px";
  clone.style.height = "20px";
  clone.style.opacity = "0";
  clone.style.transform = "scale(0.1)";

  setTimeout(() => {
    clone.remove();
    // optional small shake on the cart icon
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => cartIcon.style.transform = "scale(1)", 200);
  }, 800);
};

// Sticky Cart Component
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header.header");
  const origCartIcon = document.querySelector('a[href*="cart.html"]');
  if (!header || !origCartIcon) return;

  const stickyCartBtn = document.createElement("a");
  stickyCartBtn.href = origCartIcon.href;
  stickyCartBtn.className = "sticky-cart-btn";
  stickyCartBtn.style.position = "fixed";
  stickyCartBtn.style.bottom = "24px";
  stickyCartBtn.style.right = "24px";
  stickyCartBtn.style.width = "60px";
  stickyCartBtn.style.height = "60px";
  stickyCartBtn.style.background = "var(--gold, #d4af37)";
  stickyCartBtn.style.color = "#fff";
  stickyCartBtn.style.borderRadius = "50%";
  stickyCartBtn.style.display = "flex";
  stickyCartBtn.style.alignItems = "center";
  stickyCartBtn.style.justifyContent = "center";
  stickyCartBtn.style.boxShadow = "var(--shadow, 0 4px 12px rgba(0,0,0,0.15))";
  stickyCartBtn.style.zIndex = "999";
  stickyCartBtn.style.opacity = "0";
  stickyCartBtn.style.pointerEvents = "none";
  stickyCartBtn.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  stickyCartBtn.style.transform = "translateY(20px)";

  // Clone the SVG from the original cart icon if available, or set emoji
  const svg = origCartIcon.querySelector("svg");
  if (svg) {
    stickyCartBtn.innerHTML = svg.outerHTML;
  } else {
    stickyCartBtn.innerHTML = "🛒";
    stickyCartBtn.style.fontSize = "24px";
    stickyCartBtn.style.textDecoration = "none";
  }

  // Add item count badge
  const badge = document.createElement("span");
  badge.className = "cart-badge-sticky";
  badge.style.position = "absolute";
  badge.style.top = "-4px";
  badge.style.right = "-4px";
  badge.style.background = "var(--danger, #ff4d4f)";
  badge.style.color = "#fff";
  badge.style.fontSize = "12px";
  badge.style.fontWeight = "bold";
  badge.style.borderRadius = "10px";
  badge.style.padding = "2px 6px";
  badge.style.minWidth = "20px";
  badge.style.textAlign = "center";
  stickyCartBtn.appendChild(badge);

  document.body.appendChild(stickyCartBtn);

  const updateBadge = () => {
    const count = window.WatchtopiaAuth?.getCartCount?.() || 0;
    badge.textContent = count;
    badge.style.display = count > 0 ? "block" : "none";
  };

  window.addEventListener("watchtopia:cart-changed", updateBadge);
  updateBadge();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyCartBtn.style.opacity = "1";
        stickyCartBtn.style.pointerEvents = "auto";
        stickyCartBtn.style.transform = "translateY(0)";
      } else {
        stickyCartBtn.style.opacity = "0";
        stickyCartBtn.style.pointerEvents = "none";
        stickyCartBtn.style.transform = "translateY(20px)";
      }
    });
  }, { root: null, rootMargin: "0px", threshold: 0 });

  observer.observe(header);
});

/* MOBILE & UX: Haptic Feedback & FAB */
window.vibrate = function (ms = 50) {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(ms);
  }
};

// Global Floating Action Button (WhatsApp)
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.createElement("a");
  fab.href = "https://wa.me/994500000000"; // Placeholder number
  fab.target = "_blank";
  fab.className = "fab-whatsapp";
  fab.style.cssText = `
    position: fixed; bottom: 100px; right: 24px; width: 56px; height: 56px;
    background: #25d366; color: #fff; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 28px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 998;
    transition: transform 0.3s ease; text-decoration: none;
  `;
  fab.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.33 4.996l-1.415 5.176 5.297-1.389c1.472.8 3.127 1.221 4.781 1.221 5.517 0 9.993-4.476 9.993-9.993 0-5.517-4.476-9.993-9.993-9.993zm5.666 14.168s-.233.659-1.144 1.139c-.911.48-1.84.48-1.84.48s-1.417-.116-3.327-1.259c-1.91-1.143-3.13-2.613-3.644-3.551-.513-.938-.456-1.543.085-2.083.541-.54 1.112-1.258 1.112-1.258s.171-.2.257-.343c.085-.143.114-.314.028-.485-.086-.171-1.112-2.686-1.112-2.686s-.171-.371-.514-.4c-.342-.029-.714 0-.714 0s-.657.114-1.257.771c-.6.657-1.057 1.857-1.057 1.857s-.171 1.714 1.171 4.029c1.343 2.314 3.772 4.6 6.314 5.371.514.143 1.229.286 1.857.086.629-.2 1.486-.629 1.486-.629s.343-.171.429-.029c.086.143 2.114 3.114 2.114 3.114s.171.286.086.514c-.085.228-.314.543-.314.543z"/></svg>`;

  fab.onmouseover = () => fab.style.transform = "scale(1.1)";
  fab.onmouseout = () => fab.style.transform = "scale(1)";

  document.body.appendChild(fab);
});

// Auto-haptic on changes
window.addEventListener("watchtopia:cart-changed", () => {
  window.vibrate(40);
});
window.addEventListener("watchtopia:favorites-changed", () => {
  window.vibrate(30);
});

