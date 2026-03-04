const auth = window.WatchtopiaAuth;
const store = window.WatchtopiaProducts;
const wrap = document.getElementById("favorites-cards");
const titleEl = document.getElementById("favorites-title");
const introEl = document.getElementById("favorites-intro");

const i18n = {
  az: { title: "Beyenilenler", intro: "Beyendiyiniz mehsullar.", empty: "Hele beyendiyiniz mehsul yoxdur.", details: "Etrafli", remove: "Sil" },
  ru: { title: "Избранное", intro: "Товары, которые вам понравились.", empty: "Пока нет избранных товаров.", details: "Подробнее", remove: "Удалить" },
  en: { title: "Favorites", intro: "Products you liked.", empty: "No favorites yet.", details: "Details", remove: "Remove" }
};

function t() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return i18n[lang] || i18n.az;
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function renderFavorites() {
  const dict = t();
  if (titleEl) titleEl.textContent = dict.title;
  if (introEl) introEl.textContent = dict.intro;

  const favoriteSkus = auth.getCurrentFavorites();
  const products = store.getAllProducts().filter((product) => favoriteSkus.includes(product.sku));

  if (!products.length) {
    wrap.innerHTML = `<p>${dict.empty}</p>`;
    return;
  }

  wrap.innerHTML = products
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
          <button class="btn btn-ghost" type="button" data-fav-remove="${item.sku}" style="width: 100%; min-height: 44px; font-size: 0.9rem; background: rgba(0,0,0,0.04); border-color: transparent; color: var(--danger, #ff4d4f);">${dict.remove}</button>
        </div>
      </article>
    `
    )
    .join("");
}

wrap?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-fav-remove]");
  if (!removeBtn) return;
  auth.toggleFavorite(removeBtn.dataset.favRemove);
  renderFavorites();
});

renderFavorites();
window.addEventListener("watchtopia:favorites-changed", renderFavorites);
window.addEventListener("watchtopia:lang-changed", renderFavorites);
