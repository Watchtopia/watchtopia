const form = document.getElementById("product-form");
const messageEl = document.getElementById("form-message");
const store = window.WatchtopiaProducts;
const auth = window.WatchtopiaAuth;

const messages = {
  az: {
    storeMissing: "Mehsul bazasi movcud deyil. Sehifeni yenileyin.",
    invalidRequired: "Mecburi saheleri doldurun. Qiymet 0-dan boyuk olmali ve en cox 2 reqem onluq hisse ola biler.",
    invalidInstagram: "Instagram linki https://instagram.com/... ve ya https://www.instagram.com/... ile baslamalidir.",
    success: (name, sku) => `Mehsul \"${name}\" saxlanildi. SKU: ${sku}.`,
    fail: "Mehsulu saxlamaq mumkun olmadi.",
    labels: {
      name: "Product Name *",
      sku: "SKU (optional)",
      brand: "Brand *",
      category: "Category *",
      mechanism: "Mechanism *",
      price: "Price (AZN) *",
      status: "Status",
      shortDescriptionAz: "Short Description AZ *",
      shortDescriptionRu: "Short Description RU (optional)",
      shortDescriptionEn: "Short Description EN (optional)",
      longDescriptionAz: "Full Description AZ *",
      longDescriptionRu: "Full Description RU (optional)",
      longDescriptionEn: "Full Description EN (optional)",
      featuresAz: "Features AZ (one line per item)",
      featuresRu: "Features RU (optional, one line per item)",
      featuresEn: "Features EN (optional, one line per item)",
      images: "Photo URLs (one URL per line) *",
      videos: "Video URLs (one URL per line, optional)",
      instagramUrl: "Instagram post URL (optional)"
    },
    button: "Save Product"
  },
  ru: {
    storeMissing: "Хранилище товаров недоступно. Обновите страницу.",
    invalidRequired: "Заполните обязательные поля. Цена должна быть больше 0 и максимум с 2 знаками после запятой.",
    invalidInstagram: "Instagram URL должен начинаться с https://instagram.com/... или https://www.instagram.com/...",
    success: (name, sku) => `Товар \"${name}\" сохранен. SKU: ${sku}.`,
    fail: "Не удалось сохранить товар.",
    labels: {
      name: "Название товара *",
      sku: "SKU (необязательно)",
      brand: "Бренд *",
      category: "Категория *",
      mechanism: "Механизм *",
      price: "Цена (AZN) *",
      status: "Статус",
      shortDescriptionAz: "Короткое описание AZ *",
      shortDescriptionRu: "Короткое описание RU (необязательно)",
      shortDescriptionEn: "Короткое описание EN (необязательно)",
      longDescriptionAz: "Полное описание AZ *",
      longDescriptionRu: "Полное описание RU (необязательно)",
      longDescriptionEn: "Полное описание EN (необязательно)",
      featuresAz: "Характеристики AZ (по одному в строке)",
      featuresRu: "Характеристики RU (необязательно, по одному в строке)",
      featuresEn: "Характеристики EN (необязательно, по одному в строке)",
      images: "URL фото (по одному в строке) *",
      videos: "URL видео (по одному в строке, необязательно)",
      instagramUrl: "URL поста Instagram (необязательно)"
    },
    button: "Сохранить товар"
  },
  en: {
    storeMissing: "Product store is unavailable. Reload the page.",
    invalidRequired: "Fill required fields. Price must be > 0 and have up to 2 decimal places.",
    invalidInstagram: "Instagram URL must start with https://instagram.com/... or https://www.instagram.com/...",
    success: (name, sku) => `Product \"${name}\" saved. SKU: ${sku}.`,
    fail: "Failed to save product.",
    labels: {
      name: "Product Name *",
      sku: "SKU (optional)",
      brand: "Brand *",
      category: "Category *",
      mechanism: "Mechanism *",
      price: "Price (AZN) *",
      status: "Status",
      shortDescriptionAz: "Short Description AZ *",
      shortDescriptionRu: "Short Description RU (optional)",
      shortDescriptionEn: "Short Description EN (optional)",
      longDescriptionAz: "Full Description AZ *",
      longDescriptionRu: "Full Description RU (optional)",
      longDescriptionEn: "Full Description EN (optional)",
      featuresAz: "Features AZ (one line per item)",
      featuresRu: "Features RU (optional, one line per item)",
      featuresEn: "Features EN (optional, one line per item)",
      images: "Photo URLs (one URL per line) *",
      videos: "Video URLs (one URL per line, optional)",
      instagramUrl: "Instagram post URL (optional)"
    },
    button: "Save Product"
  }
};

const placeholders = {
  name: "Example: Naviforce X1 Blue",
  sku: "Example: naviforce-x1-blue",
  brand: "Example: Naviforce",
  price: "129.90",
  status: "Example: In stock",
  shortDescriptionAz: "Short card description in AZ",
  shortDescriptionRu: "Short card description in RU",
  shortDescriptionEn: "Short card description in EN",
  longDescriptionAz: "Full product description in AZ",
  longDescriptionRu: "Full product description in RU",
  longDescriptionEn: "Full product description in EN",
  featuresAz: "42 mm case\nQuartz movement\nMineral glass",
  featuresRu: "Case 42 mm\nQuartz movement",
  featuresEn: "42 mm case\nQuartz movement",
  images: "https://.../photo1.jpg\nhttps://.../photo2.jpg",
  videos: "https://.../video1.mp4",
  instagramUrl: "https://www.instagram.com/p/..."
};

function getLang() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return messages[lang] ? lang : "az";
}

function linesToArray(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setMessage(text, type = "info") {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.classList.remove("is-error", "is-success");
  if (type === "error") messageEl.classList.add("is-error");
  if (type === "success") messageEl.classList.add("is-success");
}

function parsePrice(value) {
  const normalized = String(value || "").trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.round(number * 100) / 100;
}

function parseInstagramUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  const isInstagram = /^https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/.+/i.test(url);
  return isInstagram ? url : null;
}

function setFieldLabel(name, text) {
  const field = form?.querySelector(`[name="${name}"]`);
  const label = field?.closest("label");
  if (!label) return;
  [...label.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.textContent = "";
  });
  let title = label.querySelector(".label-title");
  if (!title) {
    title = document.createElement("span");
    title.className = "label-title";
    label.insertBefore(title, label.firstChild);
  }
  title.textContent = text;
}

function applyFormLang() {
  if (!form) return;
  const lang = getLang();
  const dict = messages[lang] || messages.az;

  Object.entries(dict.labels).forEach(([name, text]) => {
    setFieldLabel(name, text);
  });

  Object.entries(placeholders).forEach(([name, text]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) field.setAttribute("placeholder", text);
  });

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = dict.button;

  const optionText = {
    az: {
      category: { original: "Original", design: "Design" },
      mechanism: { Quartz: "Quartz", Automatic: "Automatic", Skeleton: "Skeleton" }
    },
    ru: {
      category: { original: "Оригинал", design: "Дизайн" },
      mechanism: { Quartz: "Кварц", Automatic: "Автомат", Skeleton: "Скелетон" }
    },
    en: {
      category: { original: "Original", design: "Design" },
      mechanism: { Quartz: "Quartz", Automatic: "Automatic", Skeleton: "Skeleton" }
    }
  };
  const optionDict = optionText[lang] || optionText.az;
  form.querySelectorAll('[name="category"] option').forEach((opt) => {
    if (optionDict.category[opt.value]) opt.textContent = optionDict.category[opt.value];
  });
  form.querySelectorAll('[name="mechanism"] option').forEach((opt) => {
    if (optionDict.mechanism[opt.value]) opt.textContent = optionDict.mechanism[opt.value];
  });
}

function fillSelect(selectEl, values, fallback = []) {
  if (!selectEl) return;
  const current = selectEl.value;
  const merged = [...new Set([...(values || []), ...fallback].filter(Boolean))];
  selectEl.innerHTML = merged.map((value) => `<option value="${value}">${value}</option>`).join("");
  if (merged.includes(current)) selectEl.value = current;
}

function applyFilterSettings() {
  const settings = store?.getFilterSettings ? store.getFilterSettings() : null;
  if (!settings || !form) return;
  fillSelect(form.querySelector('[name="category"]'), settings.categories, ["original", "design"]);
  fillSelect(form.querySelector('[name="mechanism"]'), settings.mechanisms, ["Quartz", "Automatic", "Skeleton"]);
}

if (form) {
  applyFormLang();
  applyFilterSettings();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lang = getLang();
    const t = messages[lang];

    try {
      auth?.requireProductAccess?.();
    } catch (error) {
      setMessage(error?.message || "Access denied.", "error");
      return;
    }

    if (!store?.addCustomProduct) {
      setMessage(t.storeMissing, "error");
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const sku = String(formData.get("sku") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const category = String(formData.get("category") || "original").trim();
    const mechanism = String(formData.get("mechanism") || "Quartz").trim();
    const status = String(formData.get("status") || "Stokda var").trim();
    const price = parsePrice(formData.get("price"));

    const shortDescriptionAz = String(formData.get("shortDescriptionAz") || "").trim();
    const shortDescriptionRu = String(formData.get("shortDescriptionRu") || "").trim();
    const shortDescriptionEn = String(formData.get("shortDescriptionEn") || "").trim();
    const longDescriptionAz = String(formData.get("longDescriptionAz") || "").trim();
    const longDescriptionRu = String(formData.get("longDescriptionRu") || "").trim();
    const longDescriptionEn = String(formData.get("longDescriptionEn") || "").trim();

    const featuresAz = linesToArray(formData.get("featuresAz"));
    const featuresRu = linesToArray(formData.get("featuresRu"));
    const featuresEn = linesToArray(formData.get("featuresEn"));
    const images = linesToArray(formData.get("images"));
    const videos = linesToArray(formData.get("videos"));
    const instagramUrl = parseInstagramUrl(formData.get("instagramUrl"));

    if (!name || !brand || !shortDescriptionAz || !longDescriptionAz || !images.length || price === null) {
      setMessage(t.invalidRequired, "error");
      return;
    }
    if (instagramUrl === null) {
      setMessage(t.invalidInstagram, "error");
      return;
    }

    try {
      const created = store.addCustomProduct({
        sku,
        name,
        brand,
        category,
        mechanism,
        price,
        currency: "AZN",
        status,
        tag: category === "design" ? "DESIGN" : "ORIGINAL",
        shortDescription: {
          az: shortDescriptionAz,
          ru: shortDescriptionRu,
          en: shortDescriptionEn
        },
        longDescription: {
          az: longDescriptionAz,
          ru: longDescriptionRu,
          en: longDescriptionEn
        },
        description: {
          az: longDescriptionAz,
          ru: longDescriptionRu,
          en: longDescriptionEn
        },
        features: {
          az: featuresAz,
          ru: featuresRu,
          en: featuresEn
        },
        images,
        videos,
        instagramUrl
      });

      const currentUser = auth?.getCurrentUser?.();
      auth?.logAction?.("product_add", {
        actorUserId: currentUser?.id || null,
        details: { sku: created.sku, name: created.name }
      });

      setMessage(t.success(created.name, created.sku), "success");
      form.reset();
      applyFilterSettings();
      applyFormLang();
    } catch (error) {
      setMessage(error?.message || t.fail, "error");
    }
  });

  window.addEventListener("watchtopia:lang-changed", applyFormLang);
}
