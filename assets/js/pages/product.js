const STORE_CONTACTS = {
  whatsappNumber: "994501112233"
};

const lang = localStorage.getItem("watchtopia-language") || "az";
const sku = new URLSearchParams(window.location.search).get("sku");
const store = window.WatchtopiaProducts;
const auth = window.WatchtopiaAuth;
const defaultSku = "naviforce-chrono";
const product =
  (sku && store?.getProductBySku && store.getProductBySku(sku)) ||
  (store?.getProductBySku && store.getProductBySku(defaultSku));

const galleryEl = document.getElementById("product-gallery");
const trackEl = document.getElementById("product-track");
const thumbnailsEl = document.getElementById("product-thumbnails");
const prevEl = document.getElementById("product-prev");
const nextEl = document.getElementById("product-next");
const tagEl = document.getElementById("product-tag");
const nameEl = document.getElementById("product-name");
const priceEl = document.getElementById("product-price");
const descEl = document.getElementById("product-description");
const featuresEl = document.getElementById("product-features");
const variantWrapEl = document.getElementById("product-variant-wrap");
const orderEl = document.getElementById("product-order");
const addCartEl = document.getElementById("product-add-cart");
const likeEl = document.getElementById("product-like");
const instagramEl = document.getElementById("product-instagram");
const backEl = document.getElementById("product-back");

if (!product) {
  if (nameEl) nameEl.textContent = "Product not found";
  if (descEl) descEl.textContent = "The selected product is missing.";
  throw new Error("Product not found");
}

auth?.trackProductView?.(product.sku);
auth?.trackRecentlyViewed?.(product.sku);

function currentDescription(item, locale) {
  return item?.longDescription?.[locale] || item?.longDescription?.az || item?.description?.[locale] || item?.description?.az || "";
}

function currentFeatures(item, locale) {
  const features = item?.features?.[locale] || item?.features?.az || [];
  return Array.isArray(features) ? features : [];
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? "");
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function getVariants(item) {
  const variants = Array.isArray(item?.variants) ? item.variants.filter(Boolean) : [];
  if (variants.length) return variants;
  const fallback = store?.getDefaultVariant ? store.getDefaultVariant(item) : null;
  return fallback ? [fallback] : [];
}

function getVariantLabelText() {
  if (lang === "ru") return "Вариант";
  if (lang === "en") return "Variant";
  return "Variant";
}

let selectedVariant = null;

function renderVariantSelector() {
  const variants = getVariants(product);
  selectedVariant = variants[0] || null;
  if (!priceEl) return;
  if (!selectedVariant) {
    priceEl.textContent = `${formatPrice(product.price)} ${product.currency || "AZN"}`;
    if (variantWrapEl) variantWrapEl.innerHTML = "";
    return;
  }

  priceEl.textContent = `${formatPrice(selectedVariant.price)} ${product.currency || "AZN"}`;

  if (!variantWrapEl) return;
  if (variants.length < 2) {
    variantWrapEl.innerHTML = `<p><strong>${selectedVariant.label}</strong></p>`;
    return;
  }

  const variantLabel = getVariantLabelText();
  variantWrapEl.innerHTML = `
    <label class="admin-form">
      <span>${variantLabel}</span>
      <select id="product-variant-select">
        ${variants
      .map(
        (variant, index) =>
          `<option value="${variant.id}" ${index === 0 ? "selected" : ""}>${variant.label} - ${formatPrice(variant.price)} ${product.currency || "AZN"}</option>`
      )
      .join("")}
      </select>
    </label>
  `;

  const selectEl = document.getElementById("product-variant-select");
  selectEl?.addEventListener("change", () => {
    const next = variants.find((variant) => variant.id === selectEl.value);
    selectedVariant = next || variants[0] || null;
    if (selectedVariant) {
      priceEl.textContent = `${formatPrice(selectedVariant.price)} ${product.currency || "AZN"}`;
    }
  });
}

if (tagEl) tagEl.textContent = product.tag || (product.category === "design" ? "DESIGN" : "ORIGINAL");
if (nameEl) nameEl.textContent = product.name;
if (priceEl) priceEl.textContent = `${formatPrice(product.price)} ${product.currency || "AZN"}`;
if (descEl) descEl.textContent = currentDescription(product, lang);
renderVariantSelector();

if (featuresEl) {
  featuresEl.innerHTML = "";
  currentFeatures(product, lang).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    featuresEl.appendChild(li);
  });
}

const labelMap = {
  az: { order: "Sifarişi saytla et", cart: "Səbətə əlavə et", likeTitle: "Bəyən", added: "Səbətə əlavə edildi.", instagram: "Instagram-da bax", back: "Kataloqa qayıt", title: `watchtopia | ${product.name}`, buy1Click: "1-Kliklə Al", onlyLeft: "Tələsin! Yalnız {count} ədəd qalıb." },
  ru: { order: "Оформить заказ", cart: "В корзину", likeTitle: "Нравится", added: "Добавлено в корзину.", instagram: "Смотреть в Instagram", back: "Вернуться в каталог", title: `watchtopia | ${product.name}`, buy1Click: "Купить в 1 клик", onlyLeft: "Торопитесь! Осталось {count} шт." },
  en: { order: "Order on site", cart: "Add to cart", likeTitle: "Like", added: "Added to cart.", instagram: "View in Instagram", back: "Back to catalog", title: `watchtopia | ${product.name}`, buy1Click: "1-Click Buy", onlyLeft: "Hurry! Only {count} left." }
};

const labels = labelMap[lang] || labelMap.az;
document.title = labels.title;

let metaDesc = document.querySelector('meta[name="description"]');
if (!metaDesc) {
  metaDesc = document.createElement('meta');
  metaDesc.name = "description";
  document.head.appendChild(metaDesc);
}
metaDesc.content = String(currentDescription(product, lang) || "").substring(0, 160);

if (orderEl) orderEl.textContent = labels.order;

const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent(labels.title);
const wa = document.getElementById("share-whatsapp");
const tg = document.getElementById("share-telegram");
const fb = document.getElementById("share-facebook");
if (wa) wa.href = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
if (tg) tg.href = `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;
if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
if (addCartEl) addCartEl.textContent = `🛒 ${labels.cart}`;
if (likeEl) likeEl.title = labels.likeTitle;
if (instagramEl) instagramEl.textContent = labels.instagram;
if (backEl) backEl.textContent = labels.back;

const btn1Click = document.getElementById("product-1click-btn");
if (btn1Click) btn1Click.textContent = labels.buy1Click;

const stockEl = document.getElementById("product-stock");
if (stockEl) {
  const stock = typeof product.stockCount === 'number' ? product.stockCount : Math.floor(Math.random() * 8);
  if (stock > 0 && stock <= 5) {
    stockEl.textContent = labels.onlyLeft.replace("{count}", stock);
    stockEl.style.display = "block";
  } else {
    stockEl.style.display = "none";
  }
}

const modal1Click = document.getElementById("modal-1click");
const form1Click = document.getElementById("form-1click");
const close1Click = document.getElementById("modal-1click-close");

if (btn1Click && modal1Click) {
  btn1Click.addEventListener("click", () => {
    modal1Click.style.display = "flex";
  });
}
if (close1Click && modal1Click) {
  close1Click.addEventListener("click", () => {
    modal1Click.style.display = "none";
  });
}
if (modal1Click) {
  modal1Click.addEventListener("click", (e) => {
    if (e.target === modal1Click) modal1Click.style.display = "none";
  });
}
if (form1Click) {
  form1Click.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!auth?.createOrder) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }
    const name = document.getElementById("1click-name").value;
    const phone = document.getElementById("1click-phone").value;
    try {
      auth.createOrder({
        items: [{
          id: String(Date.now()),
          sku: product.sku,
          variantId: selectedVariant?.id || "",
          variantLabel: selectedVariant?.label || "",
          unitPrice: selectedVariant?.price || product.price,
          unitType: selectedVariant?.unitType || product.unitType || "piece",
          qty: 1
        }],
        totalAmount: selectedVariant?.price || product.price,
        customerName: name,
        customerPhone: phone,
        deliveryMethod: "courier",
        paymentMethod: "cash",
        city: "Baku",
        addressLine: "1-Click Buy"
      });
      alert(lang === "ru" ? "Заказ успешно создан!" : (lang === "en" ? "Order created successfully!" : "Sifariş uğurla yaradıldı!"));
      modal1Click.style.display = "none";
      form1Click.reset();
    } catch (err) {
      alert(err.message || "Failed to create order");
    }
  });
}

if (orderEl) {
  orderEl.href = "cart.html";
  orderEl.addEventListener("click", (event) => {
    event.preventDefault();
    if (!auth?.addToCart) return;
    try {
      auth.addToCart(product.sku, 1, {
        variantId: selectedVariant?.id || "",
        variantLabel: selectedVariant?.label || "",
        unitPrice: selectedVariant?.price || product.price,
        unitType: selectedVariant?.unitType || product.unitType || "piece"
      });
      window.location.href = "cart.html";
    } catch (error) {
      window.location.href = "login.html";
    }
  });
}

if (addCartEl) {
  addCartEl.addEventListener("click", () => {
    const auth = window.WatchtopiaAuth;
    if (!auth?.addToCart) return;
    try {
      auth.addToCart(product.sku, 1, {
        variantId: selectedVariant?.id || "",
        variantLabel: selectedVariant?.label || "",
        unitPrice: selectedVariant?.price || product.price,
        unitType: selectedVariant?.unitType || product.unitType || "piece"
      });
      alert(labels.added);
      const img = document.querySelector(".product-image");
      if (img && window.flyToCart) window.flyToCart(img);
    } catch (error) {
      window.location.href = "login.html";
    }
  });
}

if (likeEl) {
  const auth = window.WatchtopiaAuth;
  if (auth?.isFavorite?.(product.sku)) likeEl.classList.add("is-favorite");
  likeEl.addEventListener("click", () => {
    if (!auth?.toggleFavorite) return;
    try {
      const liked = auth.toggleFavorite(product.sku);
      likeEl.classList.toggle("is-favorite", liked);
    } catch (error) {
      window.location.href = "login.html";
    }
  });
}

if (instagramEl) {
  const instagramUrl = String(product.instagramUrl || "").trim();
  if (/^https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/.+/i.test(instagramUrl)) {
    instagramEl.hidden = false;
    instagramEl.href = instagramUrl;
    instagramEl.setAttribute("target", "_blank");
    instagramEl.setAttribute("rel", "noopener noreferrer");
  } else {
    instagramEl.hidden = true;
  }
}

function initProductSlider() {
  if (!galleryEl || !trackEl) return;

  const videos = Array.isArray(product.videos) ? product.videos.filter(Boolean) : [];
  const images = (product.images || []).filter(Boolean).slice(0, 6);
  const media = [
    ...videos.map((src) => ({ type: "video", src })),
    ...images.map((src) => ({ type: "image", src }))
  ];

  if (!media.length) return;

  trackEl.innerHTML = "";
  media.forEach((item) => {
    if (item.type === "video") {
      const video = document.createElement("video");
      video.className = "product-image product-media-slide";
      video.src = item.src;
      video.controls = true;
      video.preload = "metadata";
      trackEl.appendChild(video);
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "zoom-wrapper product-media-slide";

    const img = document.createElement("img");
    img.className = "product-image";
    img.src = item.src;
    img.alt = product.name;

    // Zoom logic
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    });

    wrapper.addEventListener("mouseenter", () => {
      wrapper.classList.add("is-zooming");
    });

    wrapper.addEventListener("mouseleave", () => {
      wrapper.classList.remove("is-zooming");
      setTimeout(() => {
        if (!wrapper.classList.contains("is-zooming")) {
          img.style.transformOrigin = "center center";
        }
      }, 200);
    });

    wrapper.appendChild(img);
    trackEl.appendChild(wrapper);
  });

  const slides = trackEl.querySelectorAll(".product-media-slide");
  let index = 0;
  const dots = [];

  function render() {
    trackEl.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === index);
      thumb.style.border = i === index ? "2px solid var(--gold)" : "2px solid transparent";
    });
  }

  if (thumbnailsEl) thumbnailsEl.innerHTML = "";
  slides.forEach((slide, i) => {
    const isVideo = slide.tagName === "VIDEO";
    const thumb = document.createElement("img");
    thumb.src = media[i].src;
    thumb.style.width = "64px";
    thumb.style.height = "64px";
    thumb.style.objectFit = "cover";
    thumb.style.borderRadius = "8px";
    thumb.style.cursor = "pointer";
    thumb.style.flexShrink = "0";
    thumb.style.border = i === index ? "2px solid var(--gold)" : "2px solid transparent";

    // Add play icon overlay if it's a video
    if (isVideo) {
      const thumbWrap = document.createElement("div");
      thumbWrap.style.position = "relative";
      thumbWrap.style.width = "64px";
      thumbWrap.style.height = "64px";
      thumbWrap.appendChild(thumb);

      const playIcon = document.createElement("div");
      playIcon.innerHTML = "▶";
      playIcon.style.position = "absolute";
      playIcon.style.top = "50%";
      playIcon.style.left = "50%";
      playIcon.style.transform = "translate(-50%, -50%)";
      playIcon.style.color = "white";
      playIcon.style.background = "rgba(0,0,0,0.5)";
      playIcon.style.borderRadius = "50%";
      playIcon.style.width = "24px";
      playIcon.style.height = "24px";
      playIcon.style.display = "flex";
      playIcon.style.alignItems = "center";
      playIcon.style.justifyContent = "center";
      playIcon.style.fontSize = "12px";
      playIcon.style.pointerEvents = "none";
      thumbWrap.appendChild(playIcon);

      thumbWrap.addEventListener("click", () => {
        index = i;
        render();
      });
      thumbnailsEl?.appendChild(thumbWrap);
      dots.push(thumb);
    } else {
      thumb.addEventListener("click", () => {
        index = i;
        render();
      });
      thumbnailsEl?.appendChild(thumb);
      dots.push(thumb);
    }
  });

  prevEl?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    render();
    window.vibrate?.(20);
  });

  nextEl?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    render();
    window.vibrate?.(20);
  });

  // Swipe logic
  let touchStartX = 0;
  let touchEndX = 0;

  trackEl.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  trackEl.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left -> next
        index = (index + 1) % slides.length;
      } else {
        // Swipe right -> prev
        index = (index - 1 + slides.length) % slides.length;
      }
      render();
      window.vibrate?.(30);
    }
  }
}

initProductSlider();

function renderCrossSells() {
  const container = document.getElementById("cross-sell-container");
  const section = document.getElementById("cross-sell-section");
  if (!container || !section || !product) return;

  const allProducts = window.WatchtopiaProducts?.getAllProducts?.() || [];
  const related = allProducts.filter(p => p.sku !== product.sku && (p.category === product.category || p.brand === product.brand)).slice(0, 4);

  if (!related.length) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  const auth = window.WatchtopiaAuth;

  container.innerHTML = related.map(p => {
    const img = p.images?.[0] || "";
    const isFav = auth?.isFavorite?.(p.sku);
    return `
      <article class="card">
        <div class="card-media" style="position: relative;">
          <img class="card-image" src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" style="margin-bottom:0; display:block;">
          <button class="btn-heart${isFav ? " is-favorite" : ""}" type="button" data-toggle-favorite="${escapeHtml(p.sku)}">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="card-tag">${escapeHtml(p.tag || p.category)}</div>
        <h3 style="font-size:1.05rem;margin-bottom:8px;">${escapeHtml(p.name)}</h3>
        <p style="font-size:1.1rem;margin-bottom:12px;font-weight:600">${formatPrice(p.price)} AZN</p>
        <div style="margin-top:auto">
          <a class="btn btn-ghost" href="product.html?sku=${encodeURIComponent(p.sku)}" style="width:100%;text-align:center;display:block;">Ətraflı</a>
        </div>
      </article>
    `;
  }).join("");
}

renderCrossSells();

window.addEventListener("watchtopia:lang-changed", () => {
  window.location.reload();
});

function renderRecentViews() {
  const container = document.getElementById("recent-views-container");
  const section = document.getElementById("recent-views-section");
  const titleEl = document.getElementById("recent-views-title");

  if (!container || !section || !auth?.getRecentlyViewed || !store?.getProductBySku) return;

  const history = auth.getRecentlyViewed().filter(s => s !== product.sku);
  if (history.length === 0) return;

  const titles = {
    az: "Son baxılanlar",
    ru: "Недавно просмотренные",
    en: "Recently viewed"
  };
  if (titleEl) titleEl.textContent = titles[lang] || titles.az;

  const actionText = {
    az: { details: "Ətraflı" },
    ru: { details: "Подробнее" },
    en: { details: "Details" }
  };
  const t = actionText[lang] || actionText.az;

  const cardsHtml = history.slice(0, 4).map(s => {
    const item = store.getProductBySku(s);
    if (!item) return "";
    const img = (item.images && item.images[0]) || "";
    const imgSrc = img.startsWith("http") ? img : `../${img.replace(/</g, "&lt;")}`;
    const isFav = auth?.isFavorite?.(item.sku);
    return `
      <article class="card">
        <div class="card-media" style="position: relative;">
          <button class="btn-heart${isFav ? " is-favorite" : ""}" type="button" data-toggle-favorite="${item.sku.replace(/</g, "&lt;")}" aria-label="Toggle Favorite">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <div class="media-track">
            <img class="card-image media-slide is-active" src="${imgSrc}" alt="${item.name.replace(/</g, "&lt;")}">
          </div>
        </div>
        <div class="card-tag">${item.tag || (item.category === 'design' ? 'DESIGN' : 'ORIGINAL')}</div>
        <h3 style="font-size: 1.2rem">${item.name.replace(/</g, "&lt;")}</h3>
        <div class="card-meta">
          <strong>${formatPrice(item.price)} ${item.currency || 'AZN'}</strong>
        </div>
        <div class="card-actions" style="margin-top: 16px;">
          <a class="btn btn-primary" style="width: 100%; text-align: center;" href="product.html?sku=${encodeURIComponent(item.sku)}">${t.details}</a>
        </div>
      </article>
    `;
  }).join("");

  if (cardsHtml) {
    container.innerHTML = cardsHtml;
    section.style.display = "block";
  }
}

function esc(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

function renderComments() {
  const listEl = document.getElementById("comments-list");
  const formWrap = document.getElementById("comment-form-wrap");
  const loginMsg = document.getElementById("comment-login-msg");
  if (!listEl) return;

  const user = auth?.getCurrentUser?.();
  if (user) {
    if (formWrap) formWrap.style.display = "block";
    if (loginMsg) loginMsg.style.display = "none";
  } else {
    if (formWrap) formWrap.style.display = "none";
    if (loginMsg) loginMsg.style.display = "block";
  }

  const comments = auth?.getProductComments?.(product.sku) || [];
  if (!comments.length) {
    const text = {
      az: "Heç bir rəy yoxdur. İlk rəyi siz yazın!",
      ru: "Пока нет отзывов. Будьте первым!",
      en: "No reviews yet. Be the first to write one!"
    };
    listEl.innerHTML = `<p style="color: var(--muted); text-align: center; font-style: italic;">${text[lang] || text.az}</p>`;
    return;
  }

  listEl.innerHTML = comments.map(c => {
    let avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.userName || "User") + "&background=random";
    const authorUser = auth?.getUserByIdRaw ? auth.getUserByIdRaw(c.userId) : null;
    if (authorUser && authorUser.avatarUrl) {
      avatarUrl = authorUser.avatarUrl;
    }

    return `
      <div style="background: var(--card); padding: 16px; border-radius: var(--radius); border: 1px solid var(--line); display: flex; gap: 16px; align-items: flex-start;">
        <img src="${esc(avatarUrl)}" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: var(--bg-soft);">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;">
            <strong style="font-size: 1.05rem; color: var(--gold); letter-spacing: 0.02em;">${esc(c.userName || "İstifadəçi")}</strong>
            <span style="font-size: 0.8rem; color: var(--muted);">${new Date(c.createdAt).toLocaleString(lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "az-AZ", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p style="font-size: 0.95rem; line-height: 1.55; color: var(--text); margin: 0;">${esc(c.text).replace(/\n/g, "<br>")}</p>
        </div>
      </div>
    `;
  }).join("");
}

const submitBtn = document.getElementById("comment-submit");
const inputEl = document.getElementById("comment-input");
if (submitBtn && inputEl) {
  submitBtn.addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (!text) return;
    try {
      if (auth?.addProductComment) {
        auth.addProductComment(product.sku, text);
        inputEl.value = "";
        renderComments();
      }
    } catch (err) {
      alert(err.message || "Xəta baş verdi");
    }
  });
}

function initCommentsLanguage() {
  const titles = { az: "Rəylər", ru: "Отзывы", en: "Reviews" };
  const titleEl = document.getElementById("comments-title");
  if (titleEl) titleEl.textContent = titles[lang] || titles.az;

  const formTitles = { az: "Rəy yazın", ru: "Оставьте отзыв", en: "Write a review" };
  const formTitleEl = document.getElementById("comment-form-title");
  if (formTitleEl) formTitleEl.textContent = formTitles[lang] || formTitles.az;

  const placeholders = { az: "Rəyinizi yazın...", ru: "Напишите ваш отзыв...", en: "Write your review..." };
  if (inputEl) inputEl.placeholder = placeholders[lang] || placeholders.az;

  const submitTexts = { az: "Göndər", ru: "Отправить", en: "Submit" };
  if (submitBtn) submitBtn.textContent = submitTexts[lang] || submitTexts.az;

  const msgEl = document.getElementById("comment-login-msg");
  if (msgEl) {
    const link = msgEl.querySelector("a");
    const span = msgEl.querySelector("span");
    if (link) link.textContent = { az: "Sayta daxil olun", ru: "Войдите на сайт", en: "Log in" }[lang] || "Sayta daxil olun";
    if (span) span.textContent = { az: "ki, rəy yaza biləsiniz.", ru: "чтобы оставить отзыв.", en: "to leave a review." }[lang] || "ki, rəy yaza biləsiniz.";
  }
}

initCommentsLanguage();
renderComments();

window.addEventListener("watchtopia:lang-changed", () => {
  initCommentsLanguage();
  renderComments();
});

renderRecentViews();
