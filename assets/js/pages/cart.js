const auth = window.WatchtopiaAuth;
const store = window.WatchtopiaProducts;

const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartMessageEl = document.getElementById("cart-message");
const clearBtn = document.getElementById("cart-clear");
const checkoutForm = document.getElementById("cart-checkout-form");
const titleEl = document.getElementById("cart-title");
const introEl = document.getElementById("cart-intro");
const totalLabelEl = document.getElementById("cart-total-label");
const mapSearchInput = document.getElementById("cart-map-search");
const mapSearchBtn = document.getElementById("cart-map-search-btn");
const labelNameEl = document.getElementById("cart-label-name");
const labelEmailEl = document.getElementById("cart-label-email");
const labelPhoneEl = document.getElementById("cart-label-phone");
const labelCityEl = document.getElementById("cart-label-city");
const labelAddressEl = document.getElementById("cart-label-address");
const labelNoteEl = document.getElementById("cart-label-note");
const labelMapSearchEl = document.getElementById("cart-label-map-search");

const promoInput = document.getElementById("cart-promo-input");
const promoBtn = document.getElementById("cart-promo-btn");
let activePromo = null;

const i18n = {
  az: {
    title: "Sebet",
    intro: "Secdiyiniz mehsullar hesabiniza baglanir.",
    empty: 'Sebet bosdur. <a href="catalog.html">Kataloqa kecin</a>.',
    total: "Cemi:",
    clear: "Sebeti temizle",
    remove: "Sil",
    removed: "Mehsul silindi.",
    cleared: "Sebet temizlendi.",
    failedUpdate: "Sebeti yenilemek olmadi.",
    failedRemove: "Mehsulu silmek olmadi.",
    failedClear: "Sebeti temizlemek olmadi.",
    order: "Sifarisi tamamla",
    orderDone: "Sifaris yaradildi.",
    labels: { name: "Ad", email: "Email", phone: "Telefon", city: "Seher", address: "Catdirilma unvani", note: "Qeyd", mapSearch: "Xeritede axtaris", searchBtn: "Axtar" },
    mapSearchPlaceholder: "Baku, kucesi, ev",
    defaultCity: "Baku",
    orderFail: "Sifaris ugursuz oldu."
  },
  ru: {
    title: "Корзина",
    intro: "Выбранные товары привязаны к вашему аккаунту.",
    empty: 'Корзина пуста. <a href="catalog.html">Перейти в каталог</a>.',
    total: "Итого:",
    clear: "Очистить корзину",
    remove: "Удалить",
    removed: "Товар удален.",
    cleared: "Корзина очищена.",
    failedUpdate: "Не удалось обновить корзину.",
    failedRemove: "Не удалось удалить товар.",
    failedClear: "Не удалось очистить корзину.",
    order: "Оформить заказ",
    orderDone: "Заказ создан.",
    labels: { name: "Имя", email: "Email", phone: "Телефон", city: "Город", address: "Адрес доставки", note: "Комментарий", mapSearch: "Поиск по карте", searchBtn: "Найти" },
    mapSearchPlaceholder: "Баку, улица, дом",
    defaultCity: "Баку",
    orderFail: "Не удалось оформить заказ."
  },
  en: {
    title: "Your Cart",
    intro: "All selected products are tied to your account.",
    empty: 'Your cart is empty. <a href="catalog.html">Go to catalog</a>.',
    total: "Total:",
    clear: "Clear cart",
    remove: "Remove",
    removed: "Item removed.",
    cleared: "Cart cleared.",
    failedUpdate: "Failed to update cart.",
    failedRemove: "Failed to remove item.",
    failedClear: "Failed to clear cart.",
    order: "Place order",
    orderDone: "Order created.",
    labels: { name: "Name", email: "Email", phone: "Phone", city: "City", address: "Delivery address", note: "Note", mapSearch: "Search on map", searchBtn: "Search" },
    mapSearchPlaceholder: "Baku, street, house",
    defaultCity: "Baku",
    orderFail: "Order failed."
  }
};

function getT() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return i18n[lang] || i18n.az;
}

function parseOptionalNumber(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function qtySuffix(item) {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  const unit = String(item?.unitType || "").toLowerCase();
  if (unit === "gram") return " g";
  if (unit === "ml") return " ml";
  if (lang === "ru") return " шт";
  if (lang === "en") return " pcs";
  return " ed";
}

function setCartMessage(text, type = "info") {
  if (!cartMessageEl) return;
  cartMessageEl.textContent = text;
  cartMessageEl.classList.remove("is-error", "is-success");
  if (type === "error") cartMessageEl.classList.add("is-error");
  if (type === "success") cartMessageEl.classList.add("is-success");
}

function getOrderButton() {
  let orderBtn = document.getElementById("cart-order");
  if (!orderBtn) {
    orderBtn = document.createElement("button");
    orderBtn.id = "cart-order";
    orderBtn.className = "btn btn-primary";
    orderBtn.type = "button";
    clearBtn.insertAdjacentElement("afterend", orderBtn);
  }
  return orderBtn;
}

let checkoutMap = null;
let checkoutMarker = null;

function setMapPoint(lat, lng, updateView = false) {
  if (!checkoutMap || !checkoutMarker) return;
  checkoutMarker.setLatLng([lat, lng]);
  if (checkoutForm) {
    checkoutForm.elements.lat.value = Number(lat).toFixed(6);
    checkoutForm.elements.lng.value = Number(lng).toFixed(6);
  }
  if (updateView) checkoutMap.setView([lat, lng], 14);
}

function formatCoords(lat, lng) {
  return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
}

function setAddressLineText(baseText, lat, lng) {
  if (!checkoutForm?.elements?.addressLine) return;
  const cleanBase = String(baseText || "").trim();
  const text = cleanBase ? `${cleanBase} (${formatCoords(lat, lng)})` : formatCoords(lat, lng);
  checkoutForm.elements.addressLine.value = text;
}

async function reverseGeocode(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`,
    { headers: { Accept: "application/json" } }
  );
  if (!response.ok) throw new Error("Failed to resolve address.");
  const data = await response.json();
  return String(data?.display_name || "").trim();
}

function initCheckoutMap() {
  const mapEl = document.getElementById("cart-map");
  if (!mapEl || !window.L || checkoutMap) return;

  let lat = parseOptionalNumber(checkoutForm?.elements?.lat?.value) ?? 40.4093;
  let lng = parseOptionalNumber(checkoutForm?.elements?.lng?.value) ?? 49.8671;
  if (lat === 0 && lng === 0) {
    lat = 40.4093;
    lng = 49.8671;
  }
  checkoutMap = window.L.map(mapEl).setView([lat, lng], 12);
  window.L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { attribution: "&copy; Google Maps" }).addTo(checkoutMap);
  checkoutMarker = window.L.marker([lat, lng]).addTo(checkoutMap);

  checkoutMap.on("click", (e) => {
    const { lat, lng } = e.latlng;
    setMapPoint(lat, lng);
    reverseGeocode(lat, lng)
      .then((displayName) => setAddressLineText(displayName, lat, lng))
      .catch(() => setAddressLineText("", lat, lng));
  });

  setTimeout(() => checkoutMap.invalidateSize(), 0);
}

async function searchMapAddress() {
  const query = String(mapSearchInput?.value || "").trim();
  if (!query) return;
  const searchQuery = /baku|бак/i.test(query) ? query : `Baku, ${query}`;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}`,
    { headers: { Accept: "application/json" } }
  );
  if (!response.ok) throw new Error("Address search failed.");
  const results = await response.json();
  const first = Array.isArray(results) ? results[0] : null;
  if (!first) throw new Error("Address not found.");
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("Address coordinates not found.");
  setMapPoint(lat, lng, true);
  setAddressLineText(String(first.display_name || "").trim(), lat, lng);
}

function renderCart() {
  if (!cartItemsEl || !cartTotalEl || !auth || !store) return;

  const t = getT();
  if (titleEl) titleEl.textContent = t.title;
  if (introEl) introEl.textContent = t.intro;
  if (totalLabelEl) totalLabelEl.textContent = t.total;
  clearBtn.textContent = t.clear;
  getOrderButton().textContent = t.order;
  if (labelNameEl) labelNameEl.textContent = t.labels.name;
  if (labelEmailEl) labelEmailEl.textContent = t.labels.email;
  if (labelPhoneEl) labelPhoneEl.textContent = t.labels.phone;
  if (labelCityEl) labelCityEl.textContent = t.labels.city;
  if (labelAddressEl) labelAddressEl.textContent = t.labels.address;
  if (labelNoteEl) labelNoteEl.textContent = t.labels.note;
  if (labelMapSearchEl) labelMapSearchEl.textContent = t.labels.mapSearch;
  if (mapSearchBtn) mapSearchBtn.textContent = t.labels.searchBtn;
  if (mapSearchInput) mapSearchInput.setAttribute("placeholder", t.mapSearchPlaceholder);

  const items = auth.getCurrentCart();
  const me = auth.getCurrentUser?.();
  if (checkoutForm && me) {
    if (!checkoutForm.elements.name.value) checkoutForm.elements.name.value = me.name || "";
    if (!checkoutForm.elements.email.value) checkoutForm.elements.email.value = me.email || "";
    if (!checkoutForm.elements.phone.value) checkoutForm.elements.phone.value = me.phone || "";
    if (!checkoutForm.elements.city.value) checkoutForm.elements.city.value = t.defaultCity;
    const savedAddress = (auth.getAddressesForUser?.(me.id) || [])[0];
    if (savedAddress) {
      if (!checkoutForm.elements.addressLine.value) {
        const lat = parseOptionalNumber(savedAddress.lat);
        const lng = parseOptionalNumber(savedAddress.lng);
        if (lat !== null && lng !== null && !(lat === 0 && lng === 0)) setAddressLineText(savedAddress.addressLine || "", lat, lng);
        else checkoutForm.elements.addressLine.value = savedAddress.addressLine || "";
      }
      if (!checkoutForm.elements.city.value) checkoutForm.elements.city.value = savedAddress.label || "";
      if (!checkoutForm.elements.lat.value && parseOptionalNumber(savedAddress.lat) !== null && !(Number(savedAddress.lat) === 0 && Number(savedAddress.lng) === 0)) {
        checkoutForm.elements.lat.value = Number(savedAddress.lat).toFixed(6);
      }
      if (!checkoutForm.elements.lng.value && parseOptionalNumber(savedAddress.lng) !== null && !(Number(savedAddress.lat) === 0 && Number(savedAddress.lng) === 0)) {
        checkoutForm.elements.lng.value = Number(savedAddress.lng).toFixed(6);
      }
    }
  }
  const productsMap = new Map((store.getAllProducts() || []).map((item) => [item.sku, item]));

  if (!items.length) {
    cartItemsEl.innerHTML = `<p>${t.empty}</p>`;
    cartTotalEl.textContent = "0 AZN";
    return;
  }

  let total = 0;

  cartItemsEl.innerHTML = items
    .map((item) => {
      const product = productsMap.get(item.sku);
      if (!product) return "";
      const price = Number(item.unitPrice) || Number(product.price) || 0;
      const itemTotal = price * (Number(item.qty) || 0);
      total += itemTotal;
      const variantInfo = item.variantLabel ? `<p><small>${item.variantLabel}</small></p>` : "";
      return `
        <article class="cart-item" data-cart-item-id="${item.id}">
          <div class="cart-item-head">
            <a href="product.html?sku=${encodeURIComponent(item.sku)}">
              <img class="cart-item-image" src="${product.images?.[0] || ""}" alt="${product.name}">
            </a>
            <div>
              <h3><a href="product.html?sku=${encodeURIComponent(item.sku)}">${product.name}</a></h3>
              ${variantInfo}
              <p>${formatPrice(price)} ${product.currency || "AZN"}</p>
            </div>
          </div>
          <div class="cart-controls">
            <input type="number" min="1" step="1" value="${item.qty}" data-cart-qty="${item.id}">
            <span>${qtySuffix(item)}</span>
            <button class="btn btn-danger btn-icon" type="button" data-cart-remove="${item.id}" aria-label="${t.remove}">🗑</button>
          </div>
        </article>
      `;
    })
    .join("");

  let renderedTotal = `<span id="cart-total">${formatPrice(total)} AZN</span>`;
  let finalTotal = total;

  const spend = (me?.orders || []).reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  let loyaltyDiscount = 0;
  let loyaltyBadge = "";
  if (spend > 1000) { loyaltyDiscount = 0.15; loyaltyBadge = "Gold (15%)"; }
  else if (spend > 500) { loyaltyDiscount = 0.10; loyaltyBadge = "Silver (10%)"; }
  else if (spend > 100) { loyaltyDiscount = 0.05; loyaltyBadge = "Bronze (5%)"; }

  if (loyaltyDiscount > 0) {
    const lDiscount = total * loyaltyDiscount;
    finalTotal -= lDiscount;
    renderedTotal += `<div style="font-size:0.9rem; color:var(--gold); margin-top:4px;">Loyalty: ${loyaltyBadge} -${formatPrice(lDiscount)} AZN</div>`;
  }

  if (activePromo && Object.keys(items).length > 0) {
    const pDiscount = finalTotal * (activePromo.discount / 100);
    finalTotal -= pDiscount;
    renderedTotal += `<div style="font-size:0.9rem; color:var(--primary); margin-top:4px;">Promo: -${activePromo.discount}% (-${formatPrice(pDiscount)} AZN)</div>`;
  }

  if (loyaltyDiscount > 0 || activePromo) {
    renderedTotal = `<span style="text-decoration: line-through; color: var(--muted); margin-right: 8px;">${formatPrice(total)} AZN</span>
                     <span id="cart-total" style="color: var(--primary); font-weight: 700;">${formatPrice(finalTotal)} AZN</span>
                     ${renderedTotal.substring(renderedTotal.indexOf('<div'))}`;
  }

  cartTotalEl.innerHTML = renderedTotal;
  window.WatchtopiaCartFinalTotal = finalTotal;
  window.WatchtopiaLoyaltyDiscount = loyaltyDiscount;

  let noticeContainer = document.getElementById("cart-notice-container");
  if (!noticeContainer) {
    noticeContainer = document.createElement("div");
    noticeContainer.id = "cart-notice-container";
    cartItemsEl.parentNode.insertBefore(noticeContainer, cartItemsEl);
  }

  if (items.length > 0 && !activePromo) {
    noticeContainer.innerHTML = `
      <div style="background: var(--gold); color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 24px; text-align: center; font-weight: 500;">
        We saved your cart! Use code <strong>COMEBACK10</strong> for 10% off your entire order.
      </div>
    `;
  } else {
    noticeContainer.innerHTML = "";
  }
  initCheckoutMap();
  const lat = parseOptionalNumber(checkoutForm?.elements?.lat?.value);
  const lng = parseOptionalNumber(checkoutForm?.elements?.lng?.value);
  if (lat !== null && lng !== null && !(lat === 0 && lng === 0)) setMapPoint(lat, lng, true);
}

if (cartItemsEl && auth) {
  cartItemsEl.addEventListener("change", (event) => {
    const input = event.target.closest("[data-cart-qty]");
    if (!input) return;
    const t = getT();
    try {
      auth.updateCartItem(input.dataset.cartQty, Number(input.value));
      renderCart();
    } catch (error) {
      setCartMessage(error?.message || t.failedUpdate, "error");
    }
  });

  cartItemsEl.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-cart-remove]");
    if (!removeBtn) return;
    const t = getT();
    try {
      auth.updateCartItem(removeBtn.dataset.cartRemove, 0);
      setCartMessage(t.removed, "success");
      renderCart();
    } catch (error) {
      setCartMessage(error?.message || t.failedRemove, "error");
    }
  });
}

clearBtn?.addEventListener("click", () => {
  const t = getT();
  try {
    auth.clearCart();
    setCartMessage(t.cleared, "success");
    renderCart();
  } catch (error) {
    setCartMessage(error?.message || t.failedClear, "error");
  }
});

mapSearchBtn?.addEventListener("click", async () => {
  try {
    await searchMapAddress();
  } catch (error) {
    setCartMessage(error?.message || getT().orderFail, "error");
  }
});

mapSearchInput?.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  try {
    await searchMapAddress();
  } catch (error) {
    setCartMessage(error?.message || getT().orderFail, "error");
  }
});

document.addEventListener("click", (event) => {
  const orderBtn = event.target.closest("#cart-order");
  if (!orderBtn) return;
  const t = getT();
  try {
    if (checkoutForm && !checkoutForm.reportValidity()) return;
    const payload = checkoutForm
      ? {
        customer: {
          name: String(checkoutForm.elements.name.value || "").trim(),
          email: String(checkoutForm.elements.email.value || "").trim(),
          phone: String(checkoutForm.elements.phone.value || "").trim(),
          city: String(checkoutForm.elements.city.value || "").trim(),
          addressLine: String(checkoutForm.elements.addressLine.value || "").trim(),
          lat: parseOptionalNumber(checkoutForm.elements.lat.value),
          lng: parseOptionalNumber(checkoutForm.elements.lng.value)
        },
        note: String(checkoutForm.elements.note.value || "").trim(),
        promoCode: activePromo ? activePromo.code : null,
        promoDiscount: activePromo ? activePromo.discount : null,
        totalAmount: window.WatchtopiaCartFinalTotal || 0,
        loyaltyDiscount: window.WatchtopiaLoyaltyDiscount || 0
      }
      : {};
    auth.createOrderFromCart(payload);
    setCartMessage(t.orderDone, "success");
    if (checkoutForm) checkoutForm.elements.note.value = "";
    renderCart();
  } catch (error) {
    setCartMessage(error?.message || t.orderFail, "error");
  }
});

window.addEventListener("watchtopia:cart-changed", renderCart);
window.addEventListener("watchtopia:lang-changed", renderCart);

promoBtn?.addEventListener("click", () => {
  const code = String(promoInput?.value || "").trim();
  if (!code) {
    activePromo = null;
    renderCart();
    return;
  }
  const t = getT();
  const valid = auth.validatePromoCode(code);
  if (valid) {
    activePromo = valid;
    setCartMessage("Promo code applied!", "success");
  } else {
    activePromo = null;
    setCartMessage("Invalid promo code.", "error");
  }
  renderCart();
});

renderCart();

