const PRODUCT_STORAGE_KEY = "watchtopia-products-v2";
const LEGACY_CUSTOM_PRODUCTS_KEY = "watchtopia-custom-products-v1";
const FILTER_SETTINGS_KEY = "watchtopia-catalog-filters-v1";

const DEFAULT_PRODUCTS = [
  {
    sku: "naviforce-chrono",
    name: "Naviforce Chrono Steel",
    brand: "Naviforce",
    category: "original",
    mechanism: "Quartz",
    tag: "ORIGINAL",
    price: 129,
    currency: "AZN",
    status: "Stokda var",
    description: {
      az: "Paslanmayan polad korpus, mineral şüşə və 3 ATM suya davamlılıq.",
      ru: "Корпус из нержавеющей стали, минеральное стекло и водозащита 3 ATM.",
      en: "Stainless steel case, mineral glass, and 3 ATM water resistance."
    },
    features: {
      az: ["42 mm korpus", "Quartz mexanizm", "Gündəlik istifadə üçün ideal"],
      ru: ["Корпус 42 мм", "Кварцевый механизм", "Идеально для повседневной носки"],
      en: ["42 mm case", "Quartz movement", "Perfect for daily wear"]
    },
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  },
  {
    sku: "curren-urban",
    name: "Curren Urban Classic",
    brand: "Curren",
    category: "original",
    mechanism: "Quartz",
    tag: "ORIGINAL",
    price: 99,
    currency: "AZN",
    status: "Ən çox satılan",
    description: {
      az: "Sadə siferblat, eko-dəri kəmər və universal üslub.",
      ru: "Лаконичный циферблат, ремешок из экокожи и универсальный стиль.",
      en: "Clean dial, eco-leather strap, and versatile style."
    },
    features: {
      az: ["40 mm korpus", "Yüngül çəki", "Ofis və şəhər üçün uyğun"],
      ru: ["Корпус 40 мм", "Легкий вес", "Подходит для офиса и города"],
      en: ["40 mm case", "Lightweight", "Great for office and city use"]
    },
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  },
  {
    sku: "crrju-heritage",
    name: "Crrju Heritage Line",
    brand: "Crrju",
    category: "original",
    mechanism: "Quartz",
    tag: "ORIGINAL",
    price: 109,
    currency: "AZN",
    status: "Yeni kolleksiya",
    description: {
      az: "Klassik dizayn və incə korpusla zərif seçim.",
      ru: "Классический дизайн и тонкий корпус для элегантного образа.",
      en: "Classic design with a slim case for an elegant look."
    },
    features: {
      az: ["Minimalist siferblat", "Rahat kəmər", "Hədiyyəlik seçim"],
      ru: ["Минималистичный циферблат", "Комфортный ремешок", "Подходит как подарок"],
      en: ["Minimalist dial", "Comfortable strap", "Good gift option"]
    },
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  },
  {
    sku: "imperium-octa",
    name: "Imperium Octa Black",
    brand: "Imperium",
    category: "design",
    mechanism: "Automatic",
    tag: "DESIGN",
    price: 169,
    currency: "AZN",
    status: "Məhdud say",
    description: {
      az: "Premium idman estetikası ilə güclü dizayn.",
      ru: "Выразительный спортивный дизайн в премиальной эстетике.",
      en: "Bold premium-inspired sports design."
    },
    features: {
      az: ["Bucaqlı bezel dizaynı", "Metal qolbaq", "Diqqət çəkən görünüş"],
      ru: ["Угловой безель", "Металлический браслет", "Яркий акцент в образе"],
      en: ["Angular bezel", "Steel bracelet", "Strong statement look"]
    },
    images: [
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  },
  {
    sku: "royal-moonphase",
    name: "Royal Moonphase Gold",
    brand: "Royal",
    category: "design",
    mechanism: "Automatic",
    tag: "DESIGN",
    price: 189,
    currency: "AZN",
    status: "Ön sifariş",
    description: {
      az: "Qızılı aksentlərlə premium görünüş.",
      ru: "Премиальный внешний вид с золотистыми акцентами.",
      en: "Premium look with gold-tone accents."
    },
    features: {
      az: ["Çoxqatlı siferblat", "Klassik + premium üslub", "Zərif qutu dizaynı"],
      ru: ["Многослойный циферблат", "Классика + premium стиль", "Аккуратная упаковка"],
      en: ["Layered dial", "Classic + premium style", "Clean gift packaging"]
    },
    images: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  },
  {
    sku: "chronarch-skeleton",
    name: "Chronarch Skeleton One",
    brand: "Chronarch",
    category: "design",
    mechanism: "Skeleton",
    tag: "DESIGN",
    price: 209,
    currency: "AZN",
    status: "Son 6 ədəd",
    description: {
      az: "Skeleton estetikasında detalyönümlü model.",
      ru: "Модель в скелетон-эстетике с акцентом на детали.",
      en: "Detail-focused model with skeleton-inspired aesthetics."
    },
    features: {
      az: ["Metal korpus", "Mexanizm detalları", "Premium görünüş"],
      ru: ["Металлический корпус", "Видимые детали", "Премиальный стиль"],
      en: ["Metal case", "Visible movement details", "Premium look"]
    },
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: []
  }
];

const DEFAULT_FILTER_SETTINGS = {
  categories: ["original", "design"],
  mechanisms: ["Quartz", "Automatic", "Skeleton"],
  brands: ["Naviforce", "Curren", "Crrju", "Imperium", "Royal", "Chronarch"]
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map((v) => String(v).trim()).filter(Boolean);
  return [];
}

function normalizeFilterSettings(raw) {
  const categories = [...new Set(toArray(raw?.categories).map((v) => v.toLowerCase()))].filter(Boolean);
  const mechanisms = [...new Set(toArray(raw?.mechanisms))].filter(Boolean);
  const brands = [...new Set(toArray(raw?.brands))].filter(Boolean);

  return {
    categories: categories.length ? categories : [...DEFAULT_FILTER_SETTINGS.categories],
    mechanisms: mechanisms.length ? mechanisms : [...DEFAULT_FILTER_SETTINGS.mechanisms],
    brands: brands.length ? brands : [...DEFAULT_FILTER_SETTINGS.brands]
  };
}

function normalizePrice(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.round(number * 100) / 100;
}

function normalizeProductType(value) {
  const safe = String(value || "").trim().toLowerCase();
  if (["watch", "perfume", "glasses", "wallet", "accessory"].includes(safe)) return safe;
  return "watch";
}

function normalizeUnitType(value) {
  const safe = String(value || "").trim().toLowerCase();
  if (["piece", "gram", "ml"].includes(safe)) return safe;
  return "piece";
}

function normalizeVariant(rawVariant, fallbackPrice = 0, index = 0, unitType = "piece") {
  const label = String(rawVariant?.label || "").trim();
  const price = normalizePrice(rawVariant?.price ?? fallbackPrice);
  if (!label || !price) return null;
  const id = String(rawVariant?.id || slugify(`${label}-${index + 1}`)).trim() || `variant-${index + 1}`;
  return {
    id,
    label,
    price,
    unitType: normalizeUnitType(rawVariant?.unitType || unitType)
  };
}

function normalizeVariants(rawVariants, fallbackPrice = 0, unitType = "piece") {
  if (!Array.isArray(rawVariants)) return [];
  return rawVariants
    .map((item, index) => normalizeVariant(item, fallbackPrice, index, unitType))
    .filter(Boolean)
    .filter((variant, index, arr) => arr.findIndex((item) => item.id === variant.id) === index);
}

function normalizeProduct(raw) {
  const name = String(raw?.name || "").trim();
  const sku = String(raw?.sku || slugify(name)).trim();
  const images = toArray(raw?.images);
  const category = raw?.category === "design" ? "design" : "original";

  const descRaw = raw?.description || {};
  const featuresRaw = raw?.features || {};

  const descriptionAz = String(descRaw.az || descRaw.ru || descRaw.en || "").trim();
  const shortDescRaw = raw?.shortDescription || {};
  const longDescRaw = raw?.longDescription || {};
  const shortAz = String(shortDescRaw.az || shortDescRaw.ru || shortDescRaw.en || descriptionAz).trim();
  const longAz = String(longDescRaw.az || longDescRaw.ru || longDescRaw.en || descriptionAz).trim();
  const featuresAz = toArray(featuresRaw.az || featuresRaw.ru || featuresRaw.en);
  const instagramUrlRaw = String(raw?.instagramUrl || "").trim();
  const instagramUrl =
    /^https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/.+/i.test(instagramUrlRaw) ? instagramUrlRaw : "";
  const productType = normalizeProductType(raw?.productType);
  const unitType = normalizeUnitType(raw?.unitType);
  const variants = normalizeVariants(raw?.variants, raw?.price, unitType);
  const basePrice = variants[0]?.price || normalizePrice(raw?.price);

  return {
    sku,
    name,
    brand: String(raw?.brand || "").trim() || "Custom",
    category,
    mechanism: String(raw?.mechanism || "").trim() || "Quartz",
    tag: String(raw?.tag || (category === "design" ? "DESIGN" : "ORIGINAL")).toUpperCase(),
    productType,
    unitType,
    variants,
    price: basePrice,
    currency: String(raw?.currency || "AZN").trim() || "AZN",
    status: String(raw?.status || "Stokda var").trim(),
    description: {
      az: longAz,
      ru: String(longDescRaw.ru || descRaw.ru || longAz).trim(),
      en: String(longDescRaw.en || descRaw.en || longAz).trim()
    },
    shortDescription: {
      az: shortAz,
      ru: String(shortDescRaw.ru || descRaw.ru || shortAz).trim(),
      en: String(shortDescRaw.en || descRaw.en || shortAz).trim()
    },
    longDescription: {
      az: longAz,
      ru: String(longDescRaw.ru || descRaw.ru || longAz).trim(),
      en: String(longDescRaw.en || descRaw.en || longAz).trim()
    },
    features: {
      az: featuresAz,
      ru: toArray(featuresRaw.ru).length ? toArray(featuresRaw.ru) : featuresAz,
      en: toArray(featuresRaw.en).length ? toArray(featuresRaw.en) : featuresAz
    },
    images,
    videos: toArray(raw?.videos),
    instagramUrl,
    isCustom: Boolean(raw?.isCustom),
    createdAt: Number(raw?.createdAt) || 0
  };
}

function getDefaultVariant(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  if (variants.length) return variants[0];
  const price = normalizePrice(product?.price);
  if (!price) return null;
  return {
    id: "default",
    label: product?.unitType === "gram" ? "1 g" : "Default",
    price,
    unitType: normalizeUnitType(product?.unitType)
  };
}

function getVariantById(product, variantId) {
  const safeVariantId = String(variantId || "").trim();
  if (!safeVariantId) return getDefaultVariant(product);
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.find((variant) => variant.id === safeVariantId) || getDefaultVariant(product);
}

function readProducts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || "null");
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map(normalizeProduct).filter((item) => item.name && item.sku);
    }
  } catch (error) {}

  // Migration: bring old custom products into the new editable product storage.
  let legacyCustom = [];
  try {
    const parsedLegacy = JSON.parse(localStorage.getItem(LEGACY_CUSTOM_PRODUCTS_KEY) || "[]");
    if (Array.isArray(parsedLegacy)) legacyCustom = parsedLegacy.map(normalizeProduct);
  } catch (error) {}

  const defaults = DEFAULT_PRODUCTS.map(normalizeProduct);
  const merged = [...legacyCustom];
  const seen = new Set(legacyCustom.map((item) => item.sku));
  defaults.forEach((item) => {
    if (!seen.has(item.sku)) merged.push(item);
  });

  writeProducts(merged);
  return merged;
}

function readFilterSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FILTER_SETTINGS_KEY) || "null");
    return normalizeFilterSettings(parsed || DEFAULT_FILTER_SETTINGS);
  } catch (error) {
    return normalizeFilterSettings(DEFAULT_FILTER_SETTINGS);
  }
}

function writeFilterSettings(settings) {
  localStorage.setItem(FILTER_SETTINGS_KEY, JSON.stringify(normalizeFilterSettings(settings)));
}

function writeProducts(products) {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function getAllProducts() {
  return readProducts().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function getProductBySku(sku) {
  return getAllProducts().find((item) => item.sku === sku) || null;
}

function addProduct(rawProduct) {
  const normalized = normalizeProduct({
    ...rawProduct,
    isCustom: true,
    createdAt: Date.now()
  });

  if (!normalized.name || !normalized.sku) {
    throw new Error("Product name and SKU are required.");
  }

  const current = readProducts();
  if (current.some((item) => item.sku === normalized.sku)) {
    throw new Error("SKU already exists. Use another SKU or product name.");
  }

  current.unshift(normalized);
  writeProducts(current);
  return normalized;
}

function updateProduct(sku, nextFields = {}) {
  const current = readProducts();
  const index = current.findIndex((item) => item.sku === sku);
  if (index < 0) throw new Error("Product not found.");

  const existing = current[index];
  const nextSku = String(nextFields.sku || existing.sku).trim();
  if (!nextSku) throw new Error("SKU is required.");
  if (nextSku !== sku && current.some((item) => item.sku === nextSku)) {
    throw new Error("SKU already exists.");
  }

  const updated = normalizeProduct({
    ...existing,
    ...nextFields,
    sku: nextSku,
    createdAt: existing.createdAt || Date.now(),
    isCustom: true
  });

  current[index] = updated;
  writeProducts(current);
  return updated;
}

function deleteProduct(sku) {
  const current = readProducts();
  const next = current.filter((item) => item.sku !== sku);
  if (next.length === current.length) throw new Error("Product not found.");
  writeProducts(next);
}

function getFilterSettings() {
  return readFilterSettings();
}

function updateFilterSettings(nextSettings = {}) {
  const current = readFilterSettings();
  const merged = normalizeFilterSettings({
    ...current,
    ...nextSettings
  });
  writeFilterSettings(merged);
  return merged;
}

function addFilterOption(group, value) {
  const key = String(group || "").trim();
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) throw new Error("Filter value is required.");
  const current = readFilterSettings();
  if (!current[key] || !Array.isArray(current[key])) throw new Error("Unknown filter group.");
  const next = [...current[key], normalizedValue];
  return updateFilterSettings({ [key]: [...new Set(next)] });
}

function removeFilterOption(group, value) {
  const key = String(group || "").trim();
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) throw new Error("Filter value is required.");
  const current = readFilterSettings();
  if (!current[key] || !Array.isArray(current[key])) throw new Error("Unknown filter group.");
  const next = current[key].filter((item) => item !== normalizedValue);
  return updateFilterSettings({ [key]: next });
}

function moveFilterOption(group, value, direction) {
  const key = String(group || "").trim();
  const normalizedValue = String(value || "").trim();
  const move = String(direction || "").trim().toLowerCase();
  if (!normalizedValue) throw new Error("Filter value is required.");
  if (!["up", "down"].includes(move)) throw new Error("Direction must be up or down.");

  const current = readFilterSettings();
  if (!current[key] || !Array.isArray(current[key])) throw new Error("Unknown filter group.");
  const next = [...current[key]];
  const index = next.findIndex((item) => item === normalizedValue);
  if (index < 0) throw new Error("Filter option not found.");

  const targetIndex = move === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= next.length) return current;

  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return updateFilterSettings({ [key]: next });
}

window.WatchtopiaProducts = {
  getAllProducts,
  getProductBySku,
  addCustomProduct: addProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getFilterSettings,
  updateFilterSettings,
  addFilterOption,
  removeFilterOption,
  moveFilterOption,
  normalizeProduct,
  getDefaultVariant,
  getVariantById
};
