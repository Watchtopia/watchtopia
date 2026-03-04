const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const STORE_CONTACTS = {
  whatsappNumber: "994501112233",
  telegramUrl: "https://t.me/watchtopia_az",
  instagramUrl: "https://instagram.com/watchtopia.az"
};

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const chips = document.querySelectorAll(".chip");
const homeCardsWrap = document.getElementById("cards");
const productStore = window.WatchtopiaProducts;
let activeFilter = "all";
let currentLang = localStorage.getItem("watchtopia-language") || "az";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? "");
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function productDescription(item, lang) {
  return item?.shortDescription?.[lang] || item?.shortDescription?.az || item?.description?.[lang] || item?.description?.az || "";
}

function homeCardTemplate(item, lang) {
  const actionText = {
    az: { addCart: "Sebete elave et", like: "Beyen" },
    ru: { addCart: "В корзину", like: "Нравится" },
    en: { addCart: "Add to cart", like: "Like" }
  };
  const t = actionText[lang] || actionText.az;
  const isFavorite = window.WatchtopiaAuth?.isFavorite?.(item.sku);
  const images = (item.images || []).filter(Boolean).slice(0, 4);
  const slides = images
    .map(
      (img, idx) =>
        `<img class="card-image media-slide${idx === 0 ? " is-active" : ""}" src="${escapeHtml(img)}" alt="${escapeHtml(item.name)}" loading="lazy">`
    )
    .join("");

  const desc = Object.keys(item.shortDescription || {}).length ? productDescription(item, lang) : "";

  const isNewProduct = item.isNew || (item.createdAt && (Date.now() - item.createdAt < 14 * 24 * 60 * 60 * 1000));
  const discountVal = Number(item.discount) || 0;
  let badgesHtml = "";
  if (isNewProduct) {
    badgesHtml += `<span style="position:absolute; top:12px; left:12px; background:var(--gold); color:#fff; font-size:0.7rem; font-weight:700; padding:4px 8px; border-radius:4px; z-index:10; letter-spacing:0.05em; line-height:1;">NEW</span>`;
  } else if (discountVal > 0) {
    badgesHtml += `<span style="position:absolute; top:12px; left:12px; background:var(--danger, #e53e3e); color:#fff; font-size:0.7rem; font-weight:700; padding:4px 8px; border-radius:4px; z-index:10; letter-spacing:0.05em; line-height:1;">-${discountVal}%</span>`;
  }

  return `
    <article class="card reveal is-visible" data-category="${escapeHtml(item.category)}">
      <div class="card-media" style="position: relative;">
        ${badgesHtml}
        <button class="btn-heart${isFavorite ? " is-favorite" : ""}" type="button" data-toggle-favorite="${escapeHtml(item.sku)}" aria-label="Toggle Favorite">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${isFavorite ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <div class="media-track">${slides}</div>
        <button class="media-btn media-btn-prev" type="button" aria-label="Previous image">&#10094;</button>
        <button class="media-btn media-btn-next" type="button" aria-label="Next image">&#10095;</button>
        <div class="media-dots"></div>
      </div>
      <div class="card-tag">${escapeHtml(item.tag || (item.category === "design" ? "DESIGN" : "ORIGINAL"))}</div>
      <h3 style="font-size: 1.35rem; margin-bottom: 8px;">${escapeHtml(item.name)}</h3>
      <p style="font-size: 0.95rem; color: var(--muted); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(desc || `${item.brand} | ${item.mechanism}`)}</p>
      <div class="card-meta" style="margin-bottom: 20px;">
        <span style="font-size: 0.85rem; font-weight: 500; color: var(--success, #28a745);">${escapeHtml(item.status || "Stokda var")}</span>
        <strong style="font-size: 1.25rem;">${escapeHtml(formatPrice(item.price))} ${escapeHtml(item.currency || "AZN")}</strong>
      </div>
      <div class="card-actions" style="display: flex; gap: 8px; align-items: stretch; flex-direction: column;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" type="button" data-add-cart="${escapeHtml(item.sku)}" style="flex: 1; min-height: 44px; padding: 0 12px; font-size: 0.9rem;">🛒 ${t.addCart}</button>
          <a class="btn btn-ghost" href="pages/product.html?sku=${encodeURIComponent(item.sku)}" style="flex: 1; text-align: center; min-height: 44px; display: flex; align-items: center; justify-content: center; padding: 0 12px; font-size: 0.9rem;" data-i18n="cardDetails">Ətraflı</a>
        </div>
        <button class="btn btn-ghost" type="button" data-order-sku="${escapeHtml(item.sku)}" style="width: 100%; min-height: 44px; font-size: 0.9rem; border-color: transparent; background: rgba(0,0,0,0.04);" data-i18n="cardOrder">Sifariş et</button>
      </div>
    </article>
  `;
}

function applyHomeFilter() {
  document.querySelectorAll("#cards .card").forEach((card) => {
    const category = card.dataset.category;
    const show = activeFilter === "all" || category === activeFilter;
    card.classList.toggle("is-hidden", !show);
  });
}

function renderHomeCards(lang) {
  if (!homeCardsWrap || !productStore?.getAllProducts) return;
  const products = productStore.getAllProducts();
  homeCardsWrap.innerHTML = products.map((item) => homeCardTemplate(item, lang)).join("");
  document.querySelectorAll(".card-media").forEach((slider) => initMediaSlider(slider));
  applyHomeFilter();
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter || "all";
    chips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    applyHomeFilter();
  });
});

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    faqItems.forEach((el) => el.classList.remove("is-open"));
    if (!isOpen) item.classList.add("is-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealItems.forEach((item) => revealObserver.observe(item));

function initMediaSlider(root) {
  const slides = root.querySelectorAll(".media-slide");
  const track = root.querySelector(".media-track");
  const prev = root.querySelector(".media-btn-prev");
  const next = root.querySelector(".media-btn-next");
  const dotsWrap = root.querySelector(".media-dots");
  if (!slides.length || !track) return;

  let index = 0;
  let timer;
  const dots = [];

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `media-dot${i === 0 ? " is-active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Image ${i + 1}`);
    dot.addEventListener("click", () => {
      index = i;
      render();
    });
    dotsWrap?.appendChild(dot);
    dots.push(dot);
  });

  prev?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    render();
  });

  next?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    render();
  });

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index + 1) % slides.length;
      render();
    }, 4200);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", startAuto);
  startAuto();
}

renderHomeCards(currentLang);

const translations = {
  az: {
    pageTitle: "watchtopia | Premium Saatlar Sərfəli Qiymətə",
    pageDescription: "watchtopia — original sərfəli brend saatlar və premium üslubda kolleksiya. Çatdırılma yalnız Azərbaycan üzrə.",
    menu: "Menyu",
    navCatalog: "Kataloq",
    navAddProduct: "Məhsul əlavə et",
    navAbout: "Haqqımızda",
    navContact: "Əlaqə",
    heroEyebrow: "Zərif üslub, dəqiq mexanizm",
    heroTitle: "Bahalı görünən, uzunömürlü saatlar.",
    heroText: "Original sərfəli brendlər və premium estetikalı modellər. Bütün Azərbaycan üzrə sürətli çatdırılma, yoxlanış və zəmanət.",
    heroCatalog: "Kataloqa bax",
    heroContact: "Müraciət et",
    statClients: "məmnun müştəri",
    statShipping: "orta göndəriş vaxtı",
    statWarranty: "mexanizmə zəmanət",
    catalogEyebrow: "Kataloq",
    catalogTitle: "Modelinizi seçin",
    filterAll: "Hamısı",
    filterOriginal: "Original brendlər",
    filterDesign: "Luxury stil",
    card1Desc: "Paslanmayan polad korpus, mineral şüşə, 3 ATM suya davamlılıq.",
    card2Desc: "Sadə siferblat, eko-dəri kəmər, hər gün üçün universal üslub.",
    card3Desc: "Klassik dizayn, incə korpus, köynək və kostyum üçün ideal seçim.",
    card4Desc: "Kəskin bucaqlı siluet və güclü bezellə premium idman görünüşü.",
    card5Desc: "Qızılı aksent, çoxqatlı siferblat və premium təqdimat.",
    card6Desc: "Skeleton estetika, mexanizm detalları və metal qolbaq vurğusu.",
    cardInStock: "Stokda var",
    cardBestSeller: "Ən çox satılan",
    cardNewArrival: "Yeni kolleksiya",
    cardLimited: "Məhdud say",
    cardPreorder: "Ön sifariş",
    cardLeftFew: "Son 6 ədəd",
    cardDetails: "Ətraflı",
    cardOrder: "Sifariş et",
    fullCatalog: "Bütün kataloqa bax",
    aboutEyebrow: "Niyə bizi seçirlər",
    aboutTitle: "Artıq ödəmədən premium təcrübə",
    aboutText: "Güclü dizayna sahib sərfəli saatları seçir, keyfiyyəti yoxlayır və şəffaf şərtlərlə təqdim edirik.",
    aboutCard1Title: "Göndərişdən öncə yoxlanış",
    aboutCard1Text: "Hər model vizual baxışdan və dəqiqlik testindən keçir.",
    aboutCard2Title: "Zəmanət dəstəyi",
    aboutCard2Text: "Satışdan sonra mexanizm və istifadə sualları üzrə kömək edirik.",
    aboutCard3Title: "Hədiyyəlik qablaşdırma",
    aboutCard3Text: "Qutu dizaynı ilə saatlar hədiyyə üçün də hazır olur.",
    faqTitle: "Tez-tez verilən suallar",
    faqQ1: "Sifariş nə qədər tez göndərilir?",
    faqA1: "Adətən təsdiqdən sonra 24 saat ərzində. Yüksək yüklənmədə 48 saata qədər uzana bilər.",
    faqQ2: "Zəmanət müddəti nə qədərdir?",
    faqA2: "Mexanizm üçün 12 ay zəmanət veririk. İstifadə qaydalarına əməl edilməlidir.",
    faqQ3: "Çatdırılma hara mümkündür?",
    faqA3: "Çatdırılma yalnız Azərbaycan üzrə həyata keçirilir. Şəhər və rayonlara uyğun kuryer/post seçimləri mövcuddur.",
    contactEyebrow: "Əlaqə",
    contactTitle: "Müraciət edin, stilinizə uyğun modeli birlikdə seçək",
    contactText: "WhatsApp, Telegram və ya zəng üçün nömrə buraxın. İş saatlarında 10 dəqiqə ərzində cavab veririk.",
    formName: "Ad",
    formNamePlaceholder: "Adınız",
    formPhone: "Telefon / Telegram",
    formPhonePlaceholder: "+994 ...",
    formNeed: "Nə axtarırsınız",
    formNeedPlaceholder: "Məsələn: qara siferblat, metal qolbaq, 150 AZN-ə qədər",
    formSubmit: "Müraciət göndər",
    footerRights: "© 2026 watchtopia. Bütün hüquqlar qorunur.",
    footerLegal: "Yalnız legal və original məhsullar təqdim olunur.",
    footerOrder: "WhatsApp ilə sifariş",
    slidePrev: "Əvvəlki şəkil",
    slideNext: "Növbəti şəkil",
    formSuccess: "Təşəkkürlər! Müraciətiniz qəbul olundu, qısa zamanda sizinlə əlaqə saxlayacağıq."
  },
  ru: {
    pageTitle: "watchtopia | Премиальные часы по доступной цене",
    pageDescription: "watchtopia — магазин оригинальных доступных часов в premium-эстетике. Доставка только по Азербайджану.",
    menu: "Меню",
    navCatalog: "Каталог",
    navAddProduct: "Добавить товар",
    navAbout: "О нас",
    navContact: "Контакты",
    heroEyebrow: "Выверенный стиль, точный механизм",
    heroTitle: "Часы, которые выглядят дорого и служат долго.",
    heroText: "Оригинальные доступные бренды и модели в премиальной эстетике. Быстрая доставка по всему Азербайджану, проверка и гарантия.",
    heroCatalog: "Смотреть каталог",
    heroContact: "Оставить заявку",
    statClients: "довольных клиентов",
    statShipping: "средняя отправка",
    statWarranty: "гарантия на механизм",
    catalogEyebrow: "Каталог",
    catalogTitle: "Выберите свою модель",
    filterAll: "Все",
    filterOriginal: "Оригинальные бренды",
    filterDesign: "Luxury-стиль",
    card1Desc: "Корпус из нержавеющей стали, минеральное стекло, водозащита 3 ATM.",
    card2Desc: "Лаконичный циферблат, ремешок из экокожи, универсальный стиль на каждый день.",
    card3Desc: "Классический дизайн, тонкий корпус, аккуратная посадка под рубашку и костюм.",
    card4Desc: "Выразительный угловой силуэт и яркий безель в духе премиальных спортивных моделей.",
    card5Desc: "Золотистый акцент, многослойный циферблат и премиальная подача.",
    card6Desc: "Скелетон-эстетика, акцент на деталях механизма и металлическом браслете.",
    cardInStock: "В наличии",
    cardBestSeller: "Хит продаж",
    cardNewArrival: "Новая коллекция",
    cardLimited: "Ограниченная серия",
    cardPreorder: "Предзаказ",
    cardLeftFew: "Осталось 6 шт.",
    cardDetails: "Подробнее",
    cardOrder: "Заказать",
    fullCatalog: "Смотреть весь каталог",
    aboutEyebrow: "Почему выбирают нас",
    aboutTitle: "Премиальный опыт без переплаты",
    aboutText: "Мы подбираем доступные часы с сильным дизайном, проверяем качество и даём прозрачные условия.",
    aboutCard1Title: "Проверка перед отправкой",
    aboutCard1Text: "Каждая модель проходит визуальный контроль и тест точности хода.",
    aboutCard2Title: "Гарантийная поддержка",
    aboutCard2Text: "Помогаем с вопросами по механизму и эксплуатации после покупки.",
    aboutCard3Title: "Подарочная упаковка",
    aboutCard3Text: "Часы приходят в аккуратной упаковке и подходят для подарка.",
    faqTitle: "Частые вопросы",
    faqQ1: "Как быстро отправляете заказ?",
    faqA1: "Обычно в течение 24 часов после подтверждения. При высокой загрузке до 48 часов.",
    faqQ2: "Какая гарантия?",
    faqA2: "Мы даём гарантию на механизм 12 месяцев при соблюдении правил эксплуатации.",
    faqQ3: "Куда доступна доставка?",
    faqA3: "Доставка выполняется только по Азербайджану. Доступны курьер и почтовые службы по городам и районам.",
    contactEyebrow: "Контакты",
    contactTitle: "Оставьте заявку, и мы подберём модель под ваш стиль",
    contactText: "Напишите в WhatsApp/Telegram или оставьте номер. Ответим в рабочее время в течение 10 минут.",
    formName: "Имя",
    formNamePlaceholder: "Ваше имя",
    formPhone: "Телефон / Telegram",
    formPhonePlaceholder: "+994 ...",
    formNeed: "Что ищете",
    formNeedPlaceholder: "Например: черный циферблат, металлический браслет, до 150 AZN",
    formSubmit: "Отправить заявку",
    footerRights: "© 2026 watchtopia. Все права защищены.",
    footerLegal: "Мы продаем только легальные и оригинальные товары.",
    footerOrder: "Заказать в WhatsApp",
    slidePrev: "Предыдущий слайд",
    slideNext: "Следующий слайд",
    formSuccess: "Спасибо! Мы получили вашу заявку и скоро свяжемся с вами."
  },
  en: {
    pageTitle: "watchtopia | Premium Watches at Accessible Prices",
    pageDescription: "watchtopia — original affordable watch brands in a premium look. Delivery is available only across Azerbaijan.",
    menu: "Menu",
    navCatalog: "Catalog",
    navAddProduct: "Add Product",
    navAbout: "About",
    navContact: "Contact",
    heroEyebrow: "Refined style, precise movement",
    heroTitle: "Watches that look premium and last long.",
    heroText: "Original affordable brands and premium-inspired models. Fast shipping across Azerbaijan with inspection and warranty.",
    heroCatalog: "View catalog",
    heroContact: "Leave request",
    statClients: "happy clients",
    statShipping: "average dispatch time",
    statWarranty: "movement warranty",
    catalogEyebrow: "Catalog",
    catalogTitle: "Choose your model",
    filterAll: "All",
    filterOriginal: "Original brands",
    filterDesign: "Luxury style",
    card1Desc: "Stainless steel case, mineral glass, and 3 ATM water resistance.",
    card2Desc: "Clean dial, eco-leather strap, and versatile everyday style.",
    card3Desc: "Classic design, slim case, perfect fit for shirts and suits.",
    card4Desc: "Bold angular silhouette with a bezel inspired by premium sports aesthetics.",
    card5Desc: "Golden accents, layered dial, and a confident premium look.",
    card6Desc: "Skeleton-inspired aesthetic with visible movement details and steel bracelet.",
    cardInStock: "In stock",
    cardBestSeller: "Best seller",
    cardNewArrival: "New collection",
    cardLimited: "Limited series",
    cardPreorder: "Pre-order",
    cardLeftFew: "Only 6 left",
    cardDetails: "Details",
    cardOrder: "Order now",
    fullCatalog: "View full catalog",
    aboutEyebrow: "Why choose us",
    aboutTitle: "Premium feel without overpaying",
    aboutText: "We curate affordable watches with strong design, inspect quality, and provide transparent terms.",
    aboutCard1Title: "Pre-shipping inspection",
    aboutCard1Text: "Every model passes visual control and movement accuracy checks.",
    aboutCard2Title: "Warranty support",
    aboutCard2Text: "We help with movement and usage questions after purchase.",
    aboutCard3Title: "Gift-ready packaging",
    aboutCard3Text: "Each watch comes in neat packaging, ready to gift.",
    faqTitle: "Frequently asked questions",
    faqQ1: "How fast do you ship?",
    faqA1: "Usually within 24 hours after confirmation. During peak periods it may take up to 48 hours.",
    faqQ2: "What warranty do you provide?",
    faqA2: "We provide a 12-month movement warranty with proper usage.",
    faqQ3: "Where do you deliver?",
    faqA3: "Delivery is available only within Azerbaijan, including cities and regions.",
    contactEyebrow: "Contact",
    contactTitle: "Leave a request and we will match the right model for your style",
    contactText: "Message us on WhatsApp/Telegram or leave your number. We reply within 10 minutes during business hours.",
    formName: "Name",
    formNamePlaceholder: "Your name",
    formPhone: "Phone / Telegram",
    formPhonePlaceholder: "+994 ...",
    formNeed: "What are you looking for",
    formNeedPlaceholder: "Example: black dial, steel bracelet, up to 150 AZN",
    formSubmit: "Send request",
    footerRights: "© 2026 watchtopia. All rights reserved.",
    footerLegal: "We offer only legal and original products.",
    footerOrder: "Order via WhatsApp",
    slidePrev: "Previous slide",
    slideNext: "Next slide",
    formSuccess: "Thank you! We received your request and will contact you soon."
  }
};

function getWhatsAppUrl(message) {
  return `https://wa.me/${STORE_CONTACTS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function applyContactLinks() {
  const links = document.querySelectorAll("[data-contact]");
  links.forEach((link) => {
    const channel = link.dataset.contact;
    if (channel === "whatsapp") {
      link.setAttribute("href", getWhatsAppUrl("Salam! watchtopia-dan saat sifariş etmək istəyirəm."));
    }
    if (channel === "telegram") {
      link.setAttribute("href", STORE_CONTACTS.telegramUrl);
    }
    if (channel === "instagram") {
      link.setAttribute("href", STORE_CONTACTS.instagramUrl);
    }
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

const langButtons = document.querySelectorAll(".lang-btn");

function applyTranslations(lang) {
  const locale = translations[lang] ? lang : "az";
  const dict = translations[locale];
  currentLang = locale;

  document.documentElement.lang = locale;
  document.title = dict.pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", dict.pageDescription);
  }

  renderHomeCards(locale);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });

  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  if (prevBtn) prevBtn.setAttribute("aria-label", dict.slidePrev);
  if (nextBtn) nextBtn.setAttribute("aria-label", dict.slideNext);

  langButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === locale);
  });

  localStorage.setItem("watchtopia-language", locale);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => applyTranslations(button.dataset.lang));
});

const savedLanguage = localStorage.getItem("watchtopia-language") || "az";
applyTranslations(savedLanguage);
applyContactLinks();

const slidesContainer = document.querySelector(".slides");
const dotsContainer = document.getElementById("slider-dots");
let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
const prevSlideBtn = document.getElementById("slide-prev");
const nextSlideBtn = document.getElementById("slide-next");
const slider = document.getElementById("hero-slider");
let currentSlide = 0;
let slideTimer;

function renderHeroBanners() {
  if (!slidesContainer || !dotsContainer || !window.WatchtopiaAuth?.getSettings) return;
  const settings = window.WatchtopiaAuth.getSettings();
  const banners = Array.isArray(settings.homeBanners) ? settings.homeBanners : [];
  if (banners.length === 0) return; // keep default HTML if no custom banners

  const validBanners = banners.filter(b => b.img);
  if (validBanners.length === 0) return;

  slidesContainer.innerHTML = validBanners.map((b, i) => `
    <div class="slide ${i === 0 ? 'is-active' : ''}" style="background-image: url('${escapeHtml(b.img)}');">
      ${(b.title || b.sub) ? `
        <div class="hero-content" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%; max-width: 800px; z-index: 10;">
          ${b.sub ? `<p class="eyebrow" style="margin-bottom: 16px; color: var(--primary);">${escapeHtml(b.sub)}</p>` : ''}
          ${b.title ? `<h1 style="color: #fff; text-shadow: 0 4px 24px rgba(0,0,0,0.6);">${escapeHtml(b.title)}</h1>` : ''}
          ${b.link ? `
            <div class="hero-actions" style="margin-top: 32px;">
              <a href="${escapeHtml(b.link)}" class="btn btn-primary">İndi Bax</a>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `).join("");

  dotsContainer.innerHTML = validBanners.map((b, i) => `
    <button class="dot ${i === 0 ? 'is-active' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>
  `).join("");

  // Re-query the DOM
  slides = document.querySelectorAll(".slide");
  dots = document.querySelectorAll(".dot");

  // Hide the default static .hero-content if there are dynamic banners
  const staticHero = document.querySelector("#hero-slider > .hero-content:not(.slide .hero-content)");
  if (staticHero && validBanners.some(b => b.title || b.sub)) {
    staticHero.style.display = "none";
  }
}

renderHeroBanners();

function setSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === currentSlide));
  dots.forEach((dot, idx) => dot.classList.toggle("is-active", idx === currentSlide));
}

function startSlider() {
  slideTimer = setInterval(() => setSlide(currentSlide + 1), 5000);
}

function resetSlider() {
  clearInterval(slideTimer);
  startSlider();
}

if (slides.length) {
  startSlider();

  prevSlideBtn?.addEventListener("click", () => {
    setSlide(currentSlide - 1);
    resetSlider();
  });

  nextSlideBtn?.addEventListener("click", () => {
    setSlide(currentSlide + 1);
    resetSlider();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      setSlide(idx);
      resetSlider();
    });
  });

  slider?.addEventListener("mouseenter", () => clearInterval(slideTimer));
  slider?.addEventListener("mouseleave", startSlider);
}

document.addEventListener("click", (event) => {
  const cartButton = event.target.closest("[data-add-cart]");
  if (cartButton) {
    event.preventDefault();
    const auth = window.WatchtopiaAuth;
    const store = window.WatchtopiaProducts;
    const sku = cartButton.dataset.addCart;
    const lang = localStorage.getItem("watchtopia-language") || "az";
    const addedText = { az: "Sebete elave edildi.", ru: "Добавлено в корзину.", en: "Added to cart." };
    if (!auth?.addToCart) return;
    try {
      const product = store?.getProductBySku ? store.getProductBySku(sku) : null;
      const variant = store?.getDefaultVariant ? store.getDefaultVariant(product) : null;
      auth.addToCart(sku, 1, {
        variantId: variant?.id || "",
        variantLabel: variant?.label || "",
        unitPrice: variant?.price || product?.price || 0,
        unitType: variant?.unitType || product?.unitType || "piece"
      });
      alert(addedText[lang] || addedText.az);
      const card = cartButton.closest('.card');
      const img = card ? card.querySelector('.card-image') : document.querySelector('.card-image');
      if (img && window.flyToCart) window.flyToCart(img);
    } catch (error) {
      window.location.href = "pages/login.html";
    }
    return;
  }

  const likeButton = event.target.closest("[data-toggle-favorite]");
  if (likeButton) {
    event.preventDefault();
    const auth = window.WatchtopiaAuth;
    const sku = likeButton.dataset.toggleFavorite;
    if (!auth?.toggleFavorite) return;
    try {
      auth.toggleFavorite(sku);
      renderHomeCards(currentLang);
    } catch (error) {
      window.location.href = "pages/login.html";
    }
    return;
  }

  const orderLink = event.target.closest("[data-order-sku]");
  if (!orderLink) return;
  event.preventDefault();
  const auth = window.WatchtopiaAuth;
  const store = window.WatchtopiaProducts;
  if (!auth?.addToCart) return;
  try {
    const product = store?.getProductBySku ? store.getProductBySku(orderLink.dataset.orderSku) : null;
    const variant = store?.getDefaultVariant ? store.getDefaultVariant(product) : null;
    auth.addToCart(orderLink.dataset.orderSku, 1, {
      variantId: variant?.id || "",
      variantLabel: variant?.label || "",
      unitPrice: variant?.price || product?.price || 0,
      unitType: variant?.unitType || product?.unitType || "piece"
    });
    window.location.href = "pages/cart.html";
  } catch (error) {
    window.location.href = "pages/login.html";
  }
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const lang = localStorage.getItem("watchtopia-language") || "az";
    const formData = new FormData(contactForm);
    const [name, phone, need] = [...formData.values()].map((value) => String(value || "").trim());
    const linesByLang = {
      az: [
        "Salam! watchtopia üçün müraciət:",
        `Ad: ${name || "-"}`,
        `Əlaqə: ${phone || "-"}`,
        `İstək: ${need || "-"}`
      ],
      ru: [
        "Здравствуйте! Заявка с watchtopia:",
        `Имя: ${name || "-"}`,
        `Контакт: ${phone || "-"}`,
        `Запрос: ${need || "-"}`
      ],
      en: [
        "Hello! New request from watchtopia:",
        `Name: ${name || "-"}`,
        `Contact: ${phone || "-"}`,
        `Request: ${need || "-"}`
      ]
    };
    const message = (linesByLang[lang] || linesByLang.az).join("\n");
    window.open(getWhatsAppUrl(message), "_blank");
    alert(translations[lang]?.formSuccess || translations.az.formSuccess);
    contactForm.reset();
  });
}

// Ensure the home cards are rendered immediately on page load
// to replace static index.html cards with JavaScript-bound dynamic cards (for Favorites states)
renderHomeCards(currentLang);
