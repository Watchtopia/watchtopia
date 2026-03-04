const auth = window.WatchtopiaAuth;
const store = window.WatchtopiaProducts;

const headWrap = document.getElementById("profile-head");
const ordersWrap = document.getElementById("profile-orders");
const favoritesWrap = document.getElementById("profile-favorites");
const messageEl = document.getElementById("profile-message");
const editLink = document.getElementById("profile-edit-link");
const ordersTitle = document.getElementById("profile-orders-title");
const favoritesTitle = document.getElementById("profile-favorites-title");

const i18n = {
  az: { edit: "Profili redakte et", orders: "Sifarisleriniz", favorites: "Beyendikleriniz", noOrders: "Hele sifaris yoxdur.", noFav: "Hele beyendiyiniz mehsul yoxdur.", privateAddress: "Unvan: yalniz siz, admin ve owner gore biler.", details: "Etrafli", remove: "Sil" },
  ru: { edit: "Редактировать профиль", orders: "Ваши заказы", favorites: "Избранное", noOrders: "Заказов пока нет.", noFav: "Пока нет избранных товаров.", privateAddress: "Адрес: виден только вам, admin и owner.", details: "Подробнее", remove: "Удалить" },
  en: { edit: "Edit profile", orders: "Your orders", favorites: "Your favorites", noOrders: "No orders yet.", noFav: "No favorites yet.", privateAddress: "Address is visible only to you, admin and owner.", details: "Details", remove: "Remove" }
};

function t() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return i18n[lang] || i18n.az;
}

function setMessage(text, type = "info") {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.classList.remove("is-error", "is-success");
  if (type === "error") messageEl.classList.add("is-error");
  if (type === "success") messageEl.classList.add("is-success");
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function unitLabel(unitType) {
  const unit = String(unitType || "").toLowerCase();
  const lang = localStorage.getItem("watchtopia-language") || "az";
  if (unit === "gram") return "g";
  if (unit === "ml") return "ml";
  if (lang === "ru") return "шт";
  if (lang === "en") return "pcs";
  return "ed";
}

function renderHead() {
  const user = auth.getCurrentUser();
  if (!user) return;
  const addresses = auth.getAddressesForUser(user.id);
  const safeBio = String(user.bio || "").replace(/</g, "&lt;");

  const addrsHtml = addresses.length > 0
    ? addresses.map(a => `<p style="margin-top: 4px;">📍 ${a.label ? `<strong>${String(a.label).replace(/</g, "&lt;")}:</strong> ` : ""}${String(a.addressLine || "").replace(/</g, "&lt;")}</p>`).join("")
    : `<p style="opacity: 0.6;">-</p>`;

  headWrap.innerHTML = `
    <div class="public-user-head">
      ${user.avatarUrl ? `<img src="${String(user.avatarUrl).replace(/</g, "&lt;")}" alt="${String(user.name).replace(/</g, "&lt;")}" class="public-user-avatar">` : '<div class="public-user-avatar"></div>'}
      <div>
        <h1>${String(user.name).replace(/</g, "&lt;")}</h1>
        <p>${String(user.email).replace(/</g, "&lt;")}</p>
        ${safeBio ? `<p>${safeBio}</p>` : ""}
        <p style="margin-top: 12px; font-size: 0.9em;"><strong>${t().privateAddress}</strong></p>
        ${addrsHtml}
      </div>
    </div>
  `;
}

function renderOrders() {
  const orders = auth.listOrdersForCurrentUser();
  const products = new Map(store.getAllProducts().map((p) => [p.sku, p]));
  const displayIdMap = {};
  [...orders]
    .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0))
    .forEach((order, index) => {
      displayIdMap[order.id] = index + 1;
    });
  if (!orders.length) {
    ordersWrap.innerHTML = `<p>${t().noOrders}</p>`;
    return;
  }

  ordersWrap.innerHTML = orders
    .map((order) => {
      const rows = (order.items || [])
        .map((item) => {
          const product = products.get(item.sku);
          const price = Number(item?.unitPrice) || Number(product?.price) || 0;
          const variantText = item.variantLabel ? ` (${item.variantLabel})` : "";
          return `<li style="display:flex;align-items:center;gap:8px;">
            ${product?.images?.[0] ? `<img src="${product.images[0]}" alt="${product?.name || item.sku}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;">` : ""}
            <a href="product.html?sku=${encodeURIComponent(item.sku)}">${product?.name || item.sku}</a>${variantText}
            <span>x${item.qty} ${unitLabel(item.unitType)} (${formatPrice(price)} AZN)</span>
          </li>`;
        })
        .join("");
      return `<article class="order-card"><h3>#${displayIdMap[order.id] || "-"}</h3><p>Status: ${order.status}</p><ul>${rows}</ul></article>`;
    })
    .join("");
}

function renderFavorites() {
  const dict = t();
  const favoriteSkus = auth.getCurrentFavorites();
  const products = store.getAllProducts().filter((product) => favoriteSkus.includes(product.sku));
  if (!products.length) {
    favoritesWrap.innerHTML = `<p>${t().noFav}</p>`;
    return;
  }

  favoritesWrap.innerHTML = products
    .map(
      (item) => `
        <article class="card">
          <div class="card-media" style="position: relative;">
            <img class="card-image" style="margin-bottom: 0;" src="${item.images?.[0] || ""}" alt="${item.name}">
          </div>
          <div class="card-tag">${item.tag || "WATCH"}</div>
          <h3 style="font-size: 1.25rem; margin-bottom: 8px;">${item.name}</h3>
          <p style="font-size: 0.95rem; color: var(--muted); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.shortDescription?.ru || item.shortDescription?.az || item.shortDescription?.en || ""}</p>
          <div class="card-meta" style="margin-bottom: 20px;">
            <span style="font-size: 0.85rem; font-weight: 500; color: var(--success, #28a745);">${item.status || "In stock"}</span>
            <strong style="font-size: 1.25rem;">${formatPrice(item.price)} ${item.currency || "AZN"}</strong>
          </div>
          <div class="card-actions" style="display: flex; gap: 8px; flex-direction: column;">
            <div style="display: flex; gap: 8px;">
              <a class="btn btn-primary" href="product.html?sku=${encodeURIComponent(item.sku)}" style="flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 44px; font-size: 0.9rem;">${dict.details}</a>
            </div>
            <button class="btn btn-ghost" type="button" data-profile-fav-remove="${item.sku}" style="width: 100%; min-height: 44px; font-size: 0.9rem; background: rgba(0,0,0,0.04); border-color: transparent; color: var(--danger, #ff4d4f);">${dict.remove}</button>
          </div>
        </article>
      `
    )
    .join("");
}

favoritesWrap?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-profile-fav-remove]");
  if (!removeBtn) return;
  try {
    auth.toggleFavorite(removeBtn.dataset.profileFavRemove);
    renderFavorites();
  } catch (error) {
    setMessage(error?.message || "Failed to update favorites.", "error");
  }
});

function renderPage() {
  editLink.textContent = t().edit;
  ordersTitle.textContent = t().orders;
  favoritesTitle.textContent = t().favorites;
  renderHead();
  renderOrders();
  renderFavorites();
}

window.addEventListener("watchtopia:lang-changed", renderPage);
renderPage();
