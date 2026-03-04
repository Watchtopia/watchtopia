const auth = window.WatchtopiaAuth;
const store = window.WatchtopiaProducts;

const headWrap = document.getElementById("public-user-head");
const favWrap = document.getElementById("public-user-favorites");
const likedTitleEl = document.getElementById("public-liked-title");

const i18n = {
  az: { role: "Rol", liked: "Beyenilen mehsullar", none: "Hele beyendiyi mehsul yoxdur.", details: "Etrafli", missing: "Istifadeci tapilmadi." },
  ru: { role: "Роль", liked: "Понравившиеся товары", none: "Пока нет понравившихся товаров.", details: "Подробнее", missing: "Пользователь не найден." },
  en: { role: "Role", liked: "Liked products", none: "No liked products yet.", details: "Details", missing: "User not found." }
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

const userId = new URLSearchParams(window.location.search).get("id");
const profile = auth.getPublicUserProfile(userId);

if (!profile) {
  headWrap.innerHTML = `<h1>${t().missing}</h1>`;
} else {
  if (likedTitleEl) likedTitleEl.textContent = t().liked;
  headWrap.innerHTML = `
    <div class="public-user-head">
      ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" alt="${profile.name}" class="public-user-avatar">` : ""}
      <div>
        <h1>${profile.name}</h1>
        <p>${t().role}: ${profile.role}</p>
        <p>${profile.bio || ""}</p>
      </div>
    </div>
  `;

  const favorites = store.getAllProducts().filter((item) => (profile.favorites || []).includes(item.sku));
  if (!favorites.length) {
    favWrap.innerHTML = `<p>${t().none}</p>`;
  } else {
    favWrap.innerHTML = favorites
      .map(
        (item) => `
          <article class="card">
            <div class="card-media" style="position: relative;">
              <img class="card-image" style="margin-bottom: 0;" src="${item.images?.[0] || ""}" alt="${item.name}">
            </div>
            <div class="card-tag">${item.tag || "WATCH"}</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">${item.name}</h3>
            <div class="card-meta" style="margin-bottom: 20px;">
              <span style="font-size: 0.85rem; font-weight: 500; color: var(--success, #28a745);">${item.status || "In stock"}</span>
              <strong style="font-size: 1.25rem;">${formatPrice(item.price)} ${item.currency || "AZN"}</strong>
            </div>
            <div class="card-actions" style="display: flex; gap: 8px; flex-direction: column;">
              <a class="btn btn-ghost" href="product.html?sku=${encodeURIComponent(item.sku)}" style="width: 100%; text-align: center; min-height: 44px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; background: rgba(0,0,0,0.04); border-color: transparent;">${t().details}</a>
            </div>
          </article>
        `
      )
      .join("");
  }
}

