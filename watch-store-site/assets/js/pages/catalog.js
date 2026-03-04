const cardsWrap = document.getElementById("catalog-cards");
const resultsCount = document.getElementById("results-count");
const searchInput = document.getElementById("search-input");
const brandFilter = document.getElementById("brand-filter");
const categoryFilter = document.getElementById("category-filter");
const productTypeFilter = document.getElementById("product-type-filter");
const mechanismFilter = document.getElementById("mechanism-filter");
const sortFilter = document.getElementById("sort-filter");
const resetBtn = document.getElementById("reset-filters");

const store = window.WatchtopiaProducts;
const catalogData = store?.getAllProducts ? store.getAllProducts() : [];

const resultsText = {
  az: "model tapildi",
  ru: "моделей найдено",
  en: "models found"
};

const uiText = {
  az: { details: "Etrafli", order: "Sifaris et", inStock: "Stokda var", addCart: "Sebete elave et", like: "Beyen", added: "Sebete elave edildi." },
  ru: { details: "Подробнее", order: "Заказать", inStock: "В наличии", addCart: "В корзину", like: "Нравится", added: "Добавлено в корзину." },
  en: { details: "Details", order: "Order now", inStock: "In stock", addCart: "Add to cart", like: "Like", added: "Added to cart." }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? "");
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function firstDescription(item, lang) {
  return item?.shortDescription?.[lang] || item?.shortDescription?.az || item?.description?.[lang] || item?.description?.az || "";
}

function uniqueValues(items, field) {
  return [...new Set(items.map((item) => String(item[field] || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function mergeWithOrder(preferred = [], discovered = []) {
  const base = [...new Set((preferred || []).filter(Boolean))];
  if (base.length) return base;
  const rest = [...new Set((discovered || []).filter(Boolean))];
  rest.sort((a, b) => a.localeCompare(b));
  return rest;
}

function getProductTypeOptionLabel(value, lang) {
  const safe = String(value || "").toLowerCase();
  const labels = {
    az: { watch: "Saat", perfume: "Parfum", glasses: "Eynak", wallet: "Pulqabisi", accessory: "Aksesuar" },
    ru: { watch: "Часы", perfume: "Парфюм", glasses: "Очки", wallet: "Кошелек", accessory: "Аксессуар" },
    en: { watch: "Watch", perfume: "Perfume", glasses: "Glasses", wallet: "Wallet", accessory: "Accessory" }
  };
  return labels[lang]?.[safe] || labels.az[safe] || value;
}

function fillChipOptions(containerId, options, activeValue = "all", getLabel = (v) => v) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const lang = localStorage.getItem("watchtopia-language") || "az";
  const allLabel = pageI18n.catalog[lang]?.all || "All";

  container.innerHTML = `
    <button type="button" class="filter-chip ${activeValue === 'all' ? 'is-active' : ''}" data-value="all" data-all-option>
      ${escapeHtml(allLabel)}
    </button>
  ` + options.map(opt => `
    <button type="button" class="filter-chip ${activeValue === opt ? 'is-active' : ''}" data-value="${escapeHtml(opt)}">
      ${escapeHtml(getLabel(opt, lang))}
    </button>
  `).join("");
}

function cardTemplate(item, lang) {
  const actions = uiText[lang] || uiText.az;
  const isFavorite = window.WatchtopiaAuth?.isFavorite?.(item.sku);
  const images = (item.images || []).filter(Boolean).slice(0, 4);
  const slides = images
    .map(
      (img, idx) =>
        `<img class="card-image media-slide${idx === 0 ? " is-active" : ""}" src="${escapeHtml(img)}" alt="${escapeHtml(item.name)}" loading="lazy">`
    )
    .join("");

  const desc = firstDescription(item, lang);
  const isNewProduct = item.isNew || (item.createdAt && (Date.now() - item.createdAt < 14 * 24 * 60 * 60 * 1000));
  const discountVal = Number(item.discount) || 0;
  let badgesHtml = "";
  if (isNewProduct) {
    badgesHtml += `<span style="position:absolute; top:12px; left:12px; background:var(--gold); color:#fff; font-size:0.7rem; font-weight:700; padding:4px 8px; border-radius:4px; z-index:10; letter-spacing:0.05em; line-height:1;">NEW</span>`;
  } else if (discountVal > 0) {
    badgesHtml += `<span style="position:absolute; top:12px; left:12px; background:var(--danger, #e53e3e); color:#fff; font-size:0.7rem; font-weight:700; padding:4px 8px; border-radius:4px; z-index:10; letter-spacing:0.05em; line-height:1;">-${discountVal}%</span>`;
  }

  return `
    <article class="card" data-category="${escapeHtml(item.category)}">
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
        <span style="font-size: 0.85rem; font-weight: 500; color: var(--success, #28a745);">${escapeHtml(item.status || actions.inStock)}</span>
        <strong style="font-size: 1.25rem;">${escapeHtml(formatPrice(item.price))} ${escapeHtml(item.currency || "AZN")}</strong>
      </div>
      <div class="card-actions" style="display: flex; gap: 8px; align-items: stretch; flex-direction: column;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" type="button" data-add-cart="${escapeHtml(item.sku)}" style="flex: 1; min-height: 44px; padding: 0 12px; font-size: 0.9rem;">🛒 ${actions.addCart}</button>
          <a class="btn btn-ghost" href="product.html?sku=${encodeURIComponent(item.sku)}" style="flex: 1; text-align: center; min-height: 44px; display: flex; align-items: center; justify-content: center; padding: 0 12px; font-size: 0.9rem;">${actions.details}</a>
        </div>
        <button class="btn btn-ghost" type="button" data-order-sku="${escapeHtml(item.sku)}" style="width: 100%; min-height: 44px; font-size: 0.9rem; border-color: transparent; background: rgba(0,0,0,0.04);">${actions.order}</button>
      </div>
    </article>
  `;
}

function render(items) {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  cardsWrap.innerHTML = items.map((item) => cardTemplate(item, lang)).join("");
  const suffix = resultsText[lang] || resultsText.az;
  resultsCount.textContent = `${items.length} ${suffix}`;
  document.querySelectorAll(".card-media").forEach((slider) => initMediaSlider(slider));
}

function renderSkeletons(count = 6) {
  let skeletons = "";
  for (let i = 0; i < count; i++) {
    skeletons += `
      <article class="card skeleton" style="pointer-events: none;">
        <div class="card-media" style="padding-bottom: 100%; background: var(--bg-soft);"></div>
        <div class="card-tag" style="width: 40px; height: 16px; margin: 12px 16px; border-radius: 4px;"></div>
        <h3 style="height: 24px; margin: 0 16px 8px 16px; border-radius: 4px; width: 80%;"></h3>
        <p style="height: 16px; margin: 0 16px 16px 16px; border-radius: 4px; width: 60%;"></p>
        <div class="card-meta" style="margin: 0 16px 20px 16px;">
           <span style="height: 12px; width: 60px; display: block; margin-bottom: 4px; border-radius: 2px;"></span>
           <strong style="height: 24px; width: 100px; display: block; border-radius: 4px;"></strong>
        </div>
        <div class="card-actions" style="margin: 0 16px 16px 16px;">
           <div style="height: 44px; width: 100%; border-radius: 6px;"></div>
        </div>
      </article>
    `;
  }
  cardsWrap.innerHTML = skeletons;
  resultsCount.textContent = "...";
}

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

  function renderSlides() {
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
      renderSlides();
    });
    dotsWrap?.appendChild(dot);
    dots.push(dot);
  });

  prev?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    renderSlides();
  });

  next?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    renderSlides();
  });

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index + 1) % slides.length;
      renderSlides();
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

  // Swipe logic for cards
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAuto();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 40;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        index = (index + 1) % slides.length;
      } else {
        index = (index - 1 + slides.length) % slides.length;
      }
      renderSlides();
      window.vibrate?.(20);
    }
  }
}

let filterTimeout;

let filterState = {
  brand: "all",
  category: "all",
  productType: "all",
  mechanism: "all",
  sort: "default",
  priceMax: 2000
};

const priceSlider = document.getElementById("price-slider");
const priceSliderVal = document.getElementById("price-slider-val");

if (priceSlider) {
  priceSlider.addEventListener("input", (e) => {
    filterState.priceMax = Number(e.target.value) || 2000;
    if (priceSliderVal) priceSliderVal.textContent = `${filterState.priceMax} AZN`;
    applyFilters();
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const brand = filterState.brand;
  const category = filterState.category;
  const productType = filterState.productType;
  const mechanism = filterState.mechanism;
  const sort = filterState.sort;

  renderSkeletons(12);
  clearTimeout(filterTimeout);

  filterTimeout = setTimeout(() => {
    let filtered = catalogData.filter((item) => {
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        String(item.brand || "").toLowerCase().includes(query) ||
        String(firstDescription(item, "az")).toLowerCase().includes(query);
      const matchBrand = brand === "all" || item.brand === brand;
      const matchCategory = category === "all" || item.category === category;
      const matchProductType = productType === "all" || item.productType === productType;
      const matchMechanism = mechanism === "all" || item.mechanism === mechanism;
      const matchPrice = item.price <= filterState.priceMax;
      return matchQuery && matchBrand && matchCategory && matchProductType && matchMechanism && matchPrice;
    });

    if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "newest") {
      filtered = [...filtered].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    if (sort === "popular") {
      const auth = window.WatchtopiaAuth;
      const views = auth?.getProductViewCounts?.() || {};
      filtered = [...filtered].sort((a, b) => (views[b.sku] || 0) - (views[a.sku] || 0));
    }

    render(filtered);
  }, 450);
}

function initFilters() {
  const settings = store?.getFilterSettings ? store.getFilterSettings() : { brands: [], mechanisms: [], categories: [] };
  const brandValues = mergeWithOrder(settings.brands || [], uniqueValues(catalogData, "brand"));
  const mechanismValues = mergeWithOrder(settings.mechanisms || [], uniqueValues(catalogData, "mechanism"));
  const categoryValues = mergeWithOrder(settings.categories || [], uniqueValues(catalogData, "category"));
  const productTypeValues = mergeWithOrder([], uniqueValues(catalogData, "productType"));

  fillChipOptions("brand-filter", brandValues, filterState.brand);
  fillChipOptions("category-filter", categoryValues, filterState.category);
  fillChipOptions("productType-filter", productTypeValues, filterState.productType, getProductTypeOptionLabel);
  fillChipOptions("mechanism-filter", mechanismValues, filterState.mechanism);
}

if (searchInput) searchInput.addEventListener("input", applyFilters);

document.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (chip) {
    const parentContainer = chip.closest(".filter-chips-grid");
    if (!parentContainer) return;

    // Update UI active state
    parentContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    const val = chip.dataset.value;
    const parentId = parentContainer.id;

    if (parentId === "brand-filter") filterState.brand = val;
    else if (parentId === "category-filter") filterState.category = val;
    else if (parentId === "product-type-filter") filterState.productType = val;
    else if (parentId === "mechanism-filter") filterState.mechanism = val;
    else if (parentId === "sort-filter") filterState.sort = val;

    applyFilters();
  }
});

resetBtn?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  filterState = {
    brand: "all",
    category: "all",
    productType: "all",
    mechanism: "all",
    sort: "default",
    priceMax: 2000
  };
  if (priceSlider) {
    priceSlider.value = 2000;
    if (priceSliderVal) priceSliderVal.textContent = "2000 AZN";
  }

  // Reset all chips UI
  document.querySelectorAll(".filter-chips-grid").forEach(container => {
    container.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
    const allChip = container.querySelector('[data-value="all"]') || container.querySelector('[data-value="default"]');
    if (allChip) allChip.classList.add("is-active");
  });

  applyFilters();
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

initFilters();
render(catalogData);

window.addEventListener("watchtopia:lang-changed", () => {
  applyFilters();
});

document.addEventListener("click", (event) => {
  const cartButton = event.target.closest("[data-add-cart]");
  const orderButton = event.target.closest("[data-order-sku]");
  const likeButton = event.target.closest("[data-toggle-favorite]");
  const auth = window.WatchtopiaAuth;

  if (orderButton) {
    event.preventDefault();
    if (!auth?.addToCart) return;
    try {
      const product = store?.getProductBySku ? store.getProductBySku(orderButton.dataset.orderSku) : null;
      const variant = store?.getDefaultVariant ? store.getDefaultVariant(product) : null;
      auth.addToCart(orderButton.dataset.orderSku, 1, {
        variantId: variant?.id || "",
        variantLabel: variant?.label || "",
        unitPrice: variant?.price || product?.price || 0,
        unitType: variant?.unitType || product?.unitType || "piece"
      });
      window.location.href = "cart.html";
    } catch (error) {
      window.location.href = "login.html";
    }
    return;
  }

  if (cartButton) {
    event.preventDefault();
    const sku = cartButton.dataset.addCart;
    const lang = localStorage.getItem("watchtopia-language") || "az";
    const addedText = uiText[lang] || uiText.az;
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
      alert(addedText.added);
    } catch (error) {
      window.location.href = "login.html";
    }
    return;
  }

  if (!likeButton) return;
  event.preventDefault();
  try {
    auth.toggleFavorite(likeButton.dataset.toggleFavorite);
    applyFilters();
  } catch (error) {
    window.location.href = "login.html";
  }
});
