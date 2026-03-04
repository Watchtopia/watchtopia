const AUTH_KEYS = {
  users: "watchtopia-users-v2",
  session: "watchtopia-session-v2",
  carts: "watchtopia-carts-v2",
  logs: "watchtopia-audit-log-v2",
  favorites: "watchtopia-favorites-v1",
  orders: "watchtopia-orders-v1",
  productStats: "watchtopia-product-stats-v1",
  addresses: "watchtopia-addresses-v1",
  messages: "watchtopia-messages-v1",
  groups: "watchtopia-groups-v1",
  userGroups: "watchtopia-user-groups-v1",
  settings: "watchtopia-settings-v1"
};

const ROLE = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER"
};

const OWNER_SEED = {
  name: "Owner",
  email: "owner@watchtopia.local",
  password: "Owner123!",
  role: ROLE.OWNER,
  isOwner: true,
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
};

const PERMISSION = {
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  FILTERS_MANAGE: "filters.manage",
  ORDERS_VIEW: "orders.view",
  ORDERS_UPDATE: "orders.update",
  USERS_VIEW: "users.view",
  USERS_BLOCK: "users.block",
  MESSAGES_REPLY: "messages.reply",
  ADDRESS_VIEW_PRIVATE: "address.view_private",
  ROLES_MANAGE: "roles.manage",
  SETTINGS_MANAGE: "settings.manage"
};

const SENSITIVE_PERMISSIONS = [PERMISSION.ROLES_MANAGE, PERMISSION.SETTINGS_MANAGE];
const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanName(name) {
  return String(name || "").replace(/[<>"'&]/g, "").trim();
}

function normalizeBirthDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const todayIso = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  if (raw > todayIso) return "";
  return raw;
}

function normalizePhone(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function loadUsers() {
  return readJson(AUTH_KEYS.users, []);
}

function saveUsers(users) {
  writeJson(AUTH_KEYS.users, users);
}

function loadCarts() {
  return readJson(AUTH_KEYS.carts, {});
}

function saveCarts(carts) {
  writeJson(AUTH_KEYS.carts, carts);
}

function loadLogs() {
  return readJson(AUTH_KEYS.logs, []);
}

function saveLogs(logs) {
  writeJson(AUTH_KEYS.logs, logs);
}

function loadFavorites() {
  return readJson(AUTH_KEYS.favorites, {});
}

function saveFavorites(favorites) {
  writeJson(AUTH_KEYS.favorites, favorites);
}

function loadOrders() {
  return readJson(AUTH_KEYS.orders, []);
}

function saveOrders(orders) {
  writeJson(AUTH_KEYS.orders, orders);
}

function loadProductStats() {
  return readJson(AUTH_KEYS.productStats, {});
}

function saveProductStats(stats) {
  writeJson(AUTH_KEYS.productStats, stats);
}

function loadAddresses() {
  return readJson(AUTH_KEYS.addresses, {});
}

function saveAddresses(addresses) {
  writeJson(AUTH_KEYS.addresses, addresses);
}

function loadMessages() {
  return readJson(AUTH_KEYS.messages, []);
}

function saveMessages(messages) {
  writeJson(AUTH_KEYS.messages, messages);
}

function loadGroups() {
  return readJson(AUTH_KEYS.groups, []);
}

function saveGroups(groups) {
  writeJson(AUTH_KEYS.groups, groups);
}

function loadUserGroups() {
  return readJson(AUTH_KEYS.userGroups, {});
}

function saveUserGroups(userGroups) {
  writeJson(AUTH_KEYS.userGroups, userGroups);
}

function getSessionUserId() {
  return localStorage.getItem(AUTH_KEYS.session) || "";
}

function setSessionUserId(userId) {
  if (!userId) {
    localStorage.removeItem(AUTH_KEYS.session);
    return;
  }
  localStorage.setItem(AUTH_KEYS.session, userId);
}

function sanitizeUser(user) {
  if (!user) return null;
  const groupIds = getUserGroupIds(user.id);
  const permissions = getUserPermissions(user.id);
  return {
    id: user.id,
    name: user.name,
    surname: String(user.surname || "").trim(),
    email: user.email,
    role: user.role,
    isOwner: Boolean(user.isOwner),
    isBlocked: Boolean(user.isBlocked),
    avatarUrl: String(user.avatarUrl || "").trim(),
    phone: normalizePhone(user.phone),
    gender: String(user.gender || "").trim(),
    newsletterOptIn: Boolean(user.newsletterOptIn),
    bio: String(user.bio || "").trim(),
    birthDate: normalizeBirthDate(user.birthDate),
    groupIds,
    permissions,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null
  };
}

function logAction(type, payload = {}) {
  const logs = loadLogs();
  logs.unshift({
    id: uid("log"),
    type,
    actorUserId: payload.actorUserId || null,
    targetUserId: payload.targetUserId || null,
    details: payload.details || {},
    createdAt: Date.now()
  });
  saveLogs(logs.slice(0, 2000));
}

function ensureOwnerUser() {
  const users = loadUsers();
  const ownerByFlag = users.find((user) => Boolean(user.isOwner));
  if (ownerByFlag) return;

  const ownerByEmail = users.find((u) => normalizeEmail(u.email) === normalizeEmail(OWNER_SEED.email));
  if (ownerByEmail) {
    ownerByEmail.isOwner = true;
    ownerByEmail.role = ROLE.OWNER;
    saveUsers(users);
    logAction("owner_upgraded", { actorUserId: ownerByEmail.id, details: { email: ownerByEmail.email } });
    return;
  }

  const ownerUser = {
    id: uid("user"),
    name: OWNER_SEED.name,
    email: OWNER_SEED.email,
    password: OWNER_SEED.password,
    role: ROLE.OWNER,
    isOwner: true,
    isBlocked: false,
    avatarUrl: OWNER_SEED.avatarUrl,
    phone: "",
    gender: "",
    newsletterOptIn: false,
    bio: "",
    birthDate: "1990-01-01",
    createdAt: Date.now(),
    lastLoginAt: null
  };

  users.push(ownerUser);
  saveUsers(users);
  logAction("owner_seeded", { actorUserId: ownerUser.id, details: { email: ownerUser.email } });
}

function getUserByIdRaw(userId) {
  return loadUsers().find((user) => user.id === userId) || null;
}

function getOwnerUser() {
  return loadUsers().find((user) => user.isOwner) || null;
}

function getPermissionsCatalog() {
  return Object.values(PERMISSION);
}

function getDefaultGroups() {
  return [
    {
      id: "group_owner_core",
      name: "Owner Core",
      permissions: getPermissionsCatalog(),
      isSystem: true,
      isProtected: true
    },
    {
      id: "group_admin",
      name: "Admin",
      permissions: [
        PERMISSION.PRODUCTS_CREATE,
        PERMISSION.PRODUCTS_UPDATE,
        PERMISSION.PRODUCTS_DELETE,
        PERMISSION.FILTERS_MANAGE,
        PERMISSION.ORDERS_VIEW,
        PERMISSION.ORDERS_UPDATE,
        PERMISSION.USERS_VIEW,
        PERMISSION.USERS_BLOCK,
        PERMISSION.MESSAGES_REPLY,
        PERMISSION.ADDRESS_VIEW_PRIVATE
      ],
      isSystem: true,
      isProtected: false
    },
    {
      id: "group_customer",
      name: "Customer",
      permissions: [],
      isSystem: true,
      isProtected: false
    }
  ];
}

function normalizePermissions(permissions) {
  const allowed = new Set(getPermissionsCatalog());
  return [...new Set((Array.isArray(permissions) ? permissions : []).map((p) => String(p || "").trim()).filter(Boolean))]
    .filter((permission) => allowed.has(permission));
}

function ensureGroupsAndAssignments() {
  const users = loadUsers();
  const groups = loadGroups();
  const userGroups = loadUserGroups();
  const defaultGroups = getDefaultGroups();
  let changed = false;

  if (!groups.length) {
    saveGroups(defaultGroups);
    changed = true;
  }

  const currentGroups = groups.length ? groups : defaultGroups;
  const groupIds = new Set(currentGroups.map((group) => group.id));

  users.forEach((user) => {
    if (!Array.isArray(userGroups[user.id])) {
      if (user.isOwner) userGroups[user.id] = ["group_owner_core"];
      else if (user.role === ROLE.ADMIN) userGroups[user.id] = ["group_admin"];
      else userGroups[user.id] = ["group_customer"];
      changed = true;
      return;
    }

    userGroups[user.id] = userGroups[user.id].filter((groupId) => groupIds.has(groupId));
    if (!userGroups[user.id].length) {
      if (user.isOwner) userGroups[user.id] = ["group_owner_core"];
      else if (user.role === ROLE.ADMIN) userGroups[user.id] = ["group_admin"];
      else userGroups[user.id] = ["group_customer"];
    }
  });

  if (changed) saveUserGroups(userGroups);
}

function getUserGroupIds(userId) {
  ensureGroupsAndAssignments();
  const map = loadUserGroups();
  return Array.isArray(map[userId]) ? map[userId] : [];
}

function getUserPermissions(userId) {
  const user = getUserByIdRaw(userId);
  if (!user) return [];
  if (user.isOwner) return getPermissionsCatalog();

  ensureGroupsAndAssignments();
  const groups = loadGroups();
  const groupMap = new Map(groups.map((group) => [group.id, group]));
  const groupIds = getUserGroupIds(userId);
  const permissions = new Set();

  groupIds.forEach((groupId) => {
    const group = groupMap.get(groupId);
    (group?.permissions || []).forEach((permission) => permissions.add(permission));
  });

  // Backward compatibility with role-based users.
  if (user.role === ROLE.ADMIN) {
    [
      PERMISSION.PRODUCTS_CREATE,
      PERMISSION.PRODUCTS_UPDATE,
      PERMISSION.PRODUCTS_DELETE,
      PERMISSION.FILTERS_MANAGE,
      PERMISSION.ORDERS_VIEW,
      PERMISSION.ORDERS_UPDATE,
      PERMISSION.USERS_VIEW,
      PERMISSION.USERS_BLOCK,
      PERMISSION.MESSAGES_REPLY,
      PERMISSION.ADDRESS_VIEW_PRIVATE
    ].forEach((permission) => permissions.add(permission));
  }

  return Array.from(permissions);
}

function currentUserHasPermission(permission) {
  const actor = getCurrentUser();
  if (!actor) return false;
  if (actor.isOwner) return true;
  return getUserPermissions(actor.id).includes(permission);
}

function requirePermission(permission) {
  const actor = requireAuth();
  if (actor.isOwner) return actor;
  if (!getUserPermissions(actor.id).includes(permission)) throw new Error("Permission denied.");
  return actor;
}

function register({ name, surname, email, password, avatarUrl = "", birthDate = "", phone = "", gender = "", newsletterOptIn = false }) {
  const safeName = cleanName(name);
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "").trim();
  const safeBirthDate = normalizeBirthDate(birthDate);
  const safePhone = normalizePhone(phone);
  const safeGender = String(gender || "").trim();
  const safeOptIn = Boolean(newsletterOptIn);

  if (!safeName || safeName.length < 2) throw new Error("Name must be at least 2 characters.");
  if (!safeEmail || !/^\S+@\S+\.\S+$/.test(safeEmail)) throw new Error("Enter a valid email.");
  if (!safePassword || safePassword.length < 6) throw new Error("Password must be at least 6 characters.");
  if (!safePhone || !/^\+?[0-9][0-9\s\-()]{6,}$/.test(safePhone)) throw new Error("Enter a valid mobile number.");
  if (!safeBirthDate) throw new Error("Birth date is required.");

  const users = loadUsers();
  if (users.some((user) => user.email === safeEmail)) throw new Error("User with this email already exists.");

  const newUser = {
    id: uid("user"),
    name: safeName,
    surname: cleanName(surname),
    email: safeEmail,
    password: safePassword,
    isOwner: false,
    isBlocked: false,
    avatarUrl: String(avatarUrl || "").trim(),
    phone: safePhone,
    gender: safeGender,
    newsletterOptIn: safeOptIn,
    bio: "",
    birthDate: safeBirthDate,
    createdAt: Date.now(),
    lastLoginAt: null
  };

  users.push(newUser);
  saveUsers(users);
  logAction("register", { actorUserId: newUser.id, details: { email: newUser.email } });

  return sanitizeUser(newUser);
}

function createUserByAdmin({ name, surname, email, password, role = ROLE.CUSTOMER, birthDate = "", phone = "" }) {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Only owner can create users manually.");
  if (![ROLE.CUSTOMER, ROLE.ADMIN].includes(role)) throw new Error("Invalid role.");

  const created = register({ name, surname, email, password, birthDate, phone });
  if (role !== ROLE.CUSTOMER) {
    changeUserRole(created.id, role);
  }
  logAction("user_created_by_owner", { actorUserId: actor.id, targetUserId: created.id, details: { role } });
  return sanitizeUser(getUserByIdRaw(created.id));
}

function login({ email, password }) {
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");

  // Rate Limiting Check
  const attemptsKey = "watchtopia-login-attempts";
  const attempts = JSON.parse(localStorage.getItem(attemptsKey) || "{}");
  const now = Date.now();
  const userAttempt = attempts[safeEmail] || { count: 0, lastAttemp: 0 };

  if (userAttempt.count >= 5 && now - userAttempt.lastAttempt < 15 * 60 * 1000) {
    const remaining = Math.ceil((15 * 60 * 1000 - (now - userAttempt.lastAttempt)) / 60000);
    throw new Error(`Too many attempts. Please try again in ${remaining} minutes.`);
  }

  const users = loadUsers();
  const user = users.find((item) => item.email === safeEmail && item.password === safePassword);

  if (!user) {
    userAttempt.count++;
    userAttempt.lastAttempt = now;
    attempts[safeEmail] = userAttempt;
    localStorage.setItem(attemptsKey, JSON.stringify(attempts));
    throw new Error("Invalid email or password.");
  }

  if (user.isBlocked) throw new Error("This account is blocked.");

  // Reset attempts on success
  delete attempts[safeEmail];
  localStorage.setItem(attemptsKey, JSON.stringify(attempts));

  user.lastLoginAt = Date.now();
  saveUsers(users);
  setSessionUserId(user.id);
  logAction("login", { actorUserId: user.id });
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));

  return sanitizeUser(user);
}

function logout() {
  const user = getCurrentUser();
  setSessionUserId("");
  if (user) {
    logAction("logout", { actorUserId: user.id });
  }
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));
}

function getCurrentUser() {
  const sessionUserId = getSessionUserId();
  if (!sessionUserId) return null;
  return sanitizeUser(getUserByIdRaw(sessionUserId));
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) throw new Error("Login required.");
  if (user.isBlocked) throw new Error("Your account is blocked.");
  return user;
}

function hasRole(user, roles) {
  if (!user || !Array.isArray(roles)) return false;
  return roles.includes(user.role);
}

function canManageProducts(user) {
  if (!user) return false;
  if (user.role === ROLE.ADMIN || user.role === ROLE.OWNER) return true;
  const permissions = getUserPermissions(user.id);
  return (
    permissions.includes(PERMISSION.PRODUCTS_CREATE) ||
    permissions.includes(PERMISSION.PRODUCTS_UPDATE) ||
    permissions.includes(PERMISSION.PRODUCTS_DELETE)
  );
}

function requireProductAccess() {
  const user = requireAuth();
  if (!canManageProducts(user)) throw new Error("Only admin can manage products.");
  return user;
}

function getCartItems(userId) {
  const carts = loadCarts();
  const items = carts[userId] || [];
  return Array.isArray(items) ? items : [];
}

function saveCartItems(userId, items) {
  const carts = loadCarts();
  carts[userId] = items;
  saveCarts(carts);
}

function addToCart(sku, qty = 1, options = {}) {
  const user = requireAuth();
  const safeSku = String(sku || "").trim();
  const safeQty = Math.max(1, Number(qty) || 1);
  const safeVariantId = String(options?.variantId || "").trim();
  const safeVariantLabel = String(options?.variantLabel || "").trim();
  const safeUnitType = String(options?.unitType || "").trim();
  const safeUnitPrice = Number(options?.unitPrice);

  if (!safeSku) throw new Error("Product SKU is required.");

  const items = getCartItems(user.id);
  const existing = items.find((item) => item.sku === safeSku && String(item.variantId || "") === safeVariantId);

  if (existing) {
    existing.qty += safeQty;
  } else {
    items.push({
      id: uid("cartitem"),
      sku: safeSku,
      variantId: safeVariantId || null,
      variantLabel: safeVariantLabel || null,
      unitType: safeUnitType || null,
      unitPrice: Number.isFinite(safeUnitPrice) && safeUnitPrice > 0 ? safeUnitPrice : null,
      qty: safeQty,
      addedAt: Date.now()
    });
  }

  saveCartItems(user.id, items);
  logAction("cart_add", { actorUserId: user.id, details: { sku: safeSku, variantId: safeVariantId || null, qty: safeQty } });
  window.dispatchEvent(new CustomEvent("watchtopia:cart-changed"));

  return items;
}

function updateCartItem(itemId, qty) {
  const user = requireAuth();
  const items = getCartItems(user.id);
  const index = items.findIndex((item) => item.id === itemId);
  if (index < 0) throw new Error("Cart item not found.");

  const safeQty = Number(qty);
  if (!Number.isFinite(safeQty) || safeQty < 1) {
    items.splice(index, 1);
    saveCartItems(user.id, items);
    logAction("cart_remove", { actorUserId: user.id, details: { itemId } });
    window.dispatchEvent(new CustomEvent("watchtopia:cart-changed"));
    return items;
  }

  items[index].qty = Math.floor(safeQty);
  saveCartItems(user.id, items);
  logAction("cart_update", { actorUserId: user.id, details: { itemId, qty: Math.floor(safeQty) } });
  window.dispatchEvent(new CustomEvent("watchtopia:cart-changed"));
  return items;
}

function clearCart() {
  const user = requireAuth();
  saveCartItems(user.id, []);
  logAction("cart_clear", { actorUserId: user.id });
  window.dispatchEvent(new CustomEvent("watchtopia:cart-changed"));
}

function getCurrentCart() {
  const user = getCurrentUser();
  if (!user) return [];
  return getCartItems(user.id);
}

function getCartCount() {
  return getCurrentCart().reduce((total, item) => total + (Number(item.qty) || 0), 0);
}

function normalizeOrderStatus(status) {
  const raw = String(status || "").trim().toLowerCase();
  if (raw === "new") return ORDER_STATUS.PENDING;
  if (raw === "done") return ORDER_STATUS.DELIVERED;
  if (raw === "processing") return ORDER_STATUS.PROCESSING;
  if (raw === "cancelled") return ORDER_STATUS.CANCELLED;
  if (Object.values(ORDER_STATUS).includes(raw)) return raw;
  return ORDER_STATUS.PENDING;
}

function normalizeOrderCustomer(customer = {}, actor = null) {
  const parseCoord = (value) => {
    if (value === null || value === undefined) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  };
  const lat = parseCoord(customer?.lat);
  const lng = parseCoord(customer?.lng);
  return {
    name: String(customer?.name || actor?.name || "").trim(),
    email: String(customer?.email || actor?.email || "").trim(),
    phone: String(customer?.phone || "").trim(),
    city: String(customer?.city || "").trim(),
    addressLine: String(customer?.addressLine || "").trim(),
    lat,
    lng
  };
}

function createOrderFromCart(payload = {}) {
  const user = requireAuth();
  const items = getCartItems(user.id);
  if (!items.length) throw new Error("Cart is empty.");
  const note = typeof payload === "string" ? payload : String(payload?.note || "").trim();
  const customer = normalizeOrderCustomer(payload?.customer, user);
  if (!customer.name || !customer.phone || !customer.addressLine) {
    throw new Error("Customer name, phone and address are required.");
  }

  const orders = loadOrders();
  const order = {
    id: uid("order"),
    userId: user.id,
    items,
    status: ORDER_STATUS.PENDING,
    note,
    customer,
    totalAmount: payload.totalAmount || 0,
    promoCode: payload.promoCode || null,
    loyaltyDiscount: payload.loyaltyDiscount || 0,
    createdAt: Date.now()
  };
  orders.unshift(order);
  saveOrders(orders);
  saveCartItems(user.id, []);
  logAction("order_created", { actorUserId: user.id, details: { orderId: order.id, itemsCount: items.length } });
  window.dispatchEvent(new CustomEvent("watchtopia:cart-changed"));
  return order;
}

function listOrdersForCurrentUser() {
  const user = requireAuth();
  return loadOrders()
    .filter((order) => order.userId === user.id)
    .map((order) => ({
      ...order,
      status: normalizeOrderStatus(order.status),
      customer: normalizeOrderCustomer(order.customer)
    }));
}

function listAllOrders() {
  requirePermission(PERMISSION.ORDERS_VIEW);
  return loadOrders().map((order) => ({
    ...order,
    status: normalizeOrderStatus(order.status),
    customer: normalizeOrderCustomer(order.customer)
  }));
}

function setOrderStatus(orderId, status) {
  const actor = requirePermission(PERMISSION.ORDERS_UPDATE);
  const orders = loadOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found.");
  order.status = normalizeOrderStatus(status);
  saveOrders(orders);
  logAction("order_status_changed", { actorUserId: actor.id, targetUserId: order.userId, details: { orderId, status: order.status } });
}

function deleteOrder(orderId) {
  const actor = requirePermission(PERMISSION.ORDERS_UPDATE);
  const orders = loadOrders();
  const index = orders.findIndex((item) => item.id === orderId);
  if (index === -1) throw new Error("Order not found.");
  const order = orders[index];
  orders.splice(index, 1);
  saveOrders(orders);
  logAction("order_deleted", { actorUserId: actor.id, targetUserId: order.userId, details: { orderId } });
}

function getFavoritesUserMap() {
  return loadFavorites();
}

function getFavoritesForUser(userId) {
  const map = getFavoritesUserMap();
  const list = map[userId] || [];
  return Array.isArray(list) ? list : [];
}

function getCurrentFavorites() {
  const user = getCurrentUser();
  if (!user) return [];
  return getFavoritesForUser(user.id);
}

function toggleFavorite(sku) {
  const user = requireAuth();
  const safeSku = String(sku || "").trim();
  if (!safeSku) throw new Error("SKU is required.");

  const map = getFavoritesUserMap();
  const list = new Set(getFavoritesForUser(user.id));
  let liked;
  if (list.has(safeSku)) {
    list.delete(safeSku);
    liked = false;
  } else {
    list.add(safeSku);
    liked = true;
  }
  map[user.id] = Array.from(list);
  saveFavorites(map);
  logAction(liked ? "favorite_add" : "favorite_remove", { actorUserId: user.id, details: { sku: safeSku } });
  window.dispatchEvent(new CustomEvent("watchtopia:favorites-changed"));
  return liked;
}

function subscribeNewsletter(email) {
  const safeEmail = String(email || "").trim().toLowerCase();
  if (!safeEmail) throw new Error("Email is required.");
  const list = JSON.parse(localStorage.getItem("watchtopia-newsletter") || "[]");
  if (!list.find(item => item.email === safeEmail)) {
    list.push({ email: safeEmail, date: Date.now() });
    localStorage.setItem("watchtopia-newsletter", JSON.stringify(list));
  }
}

function listNewsletters() {
  requirePermission(PERMISSION.USERS_MANAGE);
  return JSON.parse(localStorage.getItem("watchtopia-newsletter") || "[]");
}

function getFavoriteStatsBySku() {
  const favoriteMap = loadFavorites();
  const counts = {};
  Object.values(favoriteMap || {}).forEach((list) => {
    if (!Array.isArray(list)) return;
    list.forEach((sku) => {
      const safeSku = String(sku || "").trim();
      if (!safeSku) return;
      counts[safeSku] = (counts[safeSku] || 0) + 1;
    });
  });
  return counts;
}

function getSettings() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.settings);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function updateSettings(key, value) {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Only owner can update settings.");
  const settings = getSettings();
  settings[key] = value;
  localStorage.setItem(AUTH_KEYS.settings, JSON.stringify(settings));
  logAction("settings_updated", { actorUserId: actor.id, details: { key } });
  return settings;
}

function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem("watchtopia-history");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function getPromoCodes() {
  const settings = getSettings();
  const promos = settings.promoCodes;
  return Array.isArray(promos) ? promos : [];
}

function addPromoCode(code, discountPercent) {
  const safeCode = String(code || "").trim().toUpperCase();
  const numDiscount = Number(discountPercent);
  if (!safeCode || !Number.isFinite(numDiscount) || numDiscount <= 0 || numDiscount > 100) {
    throw new Error("Invalid promo code format.");
  }
  const promos = getPromoCodes();
  if (promos.some(p => p.code === safeCode)) throw new Error("Promo code already exists.");
  promos.push({ code: safeCode, discount: numDiscount });
  updateSettings("promoCodes", promos);
}

function deletePromoCode(code) {
  const safeCode = String(code || "").trim().toUpperCase();
  let promos = getPromoCodes();
  promos = promos.filter(p => p.code !== safeCode);
  updateSettings("promoCodes", promos);
}

function validatePromoCode(code) {
  const safeCode = String(code || "").trim().toUpperCase();
  if (!safeCode) return null;
  const promos = getPromoCodes();
  return promos.find(p => p.code === safeCode) || null;
}

function trackRecentlyViewed(sku) {
  const safeSku = String(sku || "").trim();
  if (!safeSku) return;
  const history = getRecentlyViewed().filter(s => s !== safeSku);
  history.unshift(safeSku);
  const trimmed = history.slice(0, 10);
  localStorage.setItem("watchtopia-history", JSON.stringify(trimmed));
}

function trackProductView(sku) {
  const safeSku = String(sku || "").trim();
  if (!safeSku) return;
  const stats = loadProductStats();
  const current = stats[safeSku] || {};
  current.views = Math.max(0, Number(current.views) || 0) + 1;
  current.updatedAt = Date.now();
  stats[safeSku] = current;
  saveProductStats(stats);
}

function getProductViewCounts() {
  const stats = loadProductStats();
  const counts = {};
  Object.keys(stats || {}).forEach((sku) => {
    counts[sku] = Math.max(0, Number(stats[sku]?.views) || 0);
  });
  return counts;
}

function isFavorite(sku) {
  return getCurrentFavorites().includes(String(sku || ""));
}

function addAddressForCurrentUser(address) {
  const actor = requireAuth();
  const addresses = loadAddresses();
  if (!Array.isArray(addresses[actor.id])) {
    const existing = addresses[actor.id];
    addresses[actor.id] = existing && typeof existing === 'object' ? [existing] : [];
  }
  const newAddr = {
    id: uid("addr"),
    label: String(address?.label || "").trim(),
    addressLine: String(address?.addressLine || "").trim(),
    lat: Number(address?.lat) || null,
    lng: Number(address?.lng) || null,
    createdAt: Date.now()
  };
  addresses[actor.id].push(newAddr);
  saveAddresses(addresses);
  logAction("address_add", { actorUserId: actor.id });
  return newAddr;
}

function removeAddressForCurrentUser(id) {
  const actor = requireAuth();
  const addresses = loadAddresses();
  if (!Array.isArray(addresses[actor.id])) return false;
  const initialLen = addresses[actor.id].length;
  addresses[actor.id] = addresses[actor.id].filter(a => a.id !== id);
  if (addresses[actor.id].length !== initialLen) {
    saveAddresses(addresses);
    logAction("address_remove", { actorUserId: actor.id, details: { id } });
    return true;
  }
  return false;
}

function getAddressesForUser(userId) {
  const actor = requireAuth();
  const targetUserId = String(userId || actor.id);
  const target = getUserByIdRaw(targetUserId);
  if (!target) return [];
  const allowed =
    actor.id === targetUserId || actor.isOwner || getUserPermissions(actor.id).includes(PERMISSION.ADDRESS_VIEW_PRIVATE);
  if (!allowed) return [];
  const addresses = loadAddresses();
  const list = addresses[targetUserId];
  if (Array.isArray(list)) return list;
  if (list && typeof list === 'object') return [list];
  return [];
}

function updateCurrentUserProfile({ name, surname, phone, avatarUrl, bio, birthDate, gender, newsletterOptIn }) {
  const actor = requireAuth();
  const users = loadUsers();
  const target = users.find((user) => user.id === actor.id);
  if (!target) throw new Error("User not found.");
  if (String(name || "").trim().length >= 2) target.name = cleanName(name);
  if (surname !== undefined) target.surname = cleanName(surname);
  if (phone !== undefined) {
    const safePhone = normalizePhone(phone);
    if (!safePhone || !/^\+?[0-9][0-9\s\-()]{6,}$/.test(safePhone)) throw new Error("Enter a valid mobile number.");
    target.phone = safePhone;
  }
  if (birthDate !== undefined) {
    const safeDate = normalizeBirthDate(birthDate);
    if (!safeDate) throw new Error("Birth date is required.");
    target.birthDate = safeDate;
  }
  if (gender !== undefined) {
    target.gender = String(gender || "").trim();
  }
  if (newsletterOptIn !== undefined) {
    target.newsletterOptIn = Boolean(newsletterOptIn);
  }

  target.avatarUrl = String(avatarUrl || "").trim().replace(/[<>]/g, "");
  target.bio = cleanName(bio);
  saveUsers(users);
  logAction("profile_updated", { actorUserId: actor.id });
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));
  return sanitizeUser(target);
}

function listUsers() {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Owner access required.");
  return loadUsers().map(sanitizeUser);
}

function listPublicUsers() {
  return loadUsers().map((user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: String(user.avatarUrl || "").trim(),
    role: user.role
  }));
}

function getPublicUserProfile(userId) {
  const user = getUserByIdRaw(userId);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    avatarUrl: String(user.avatarUrl || "").trim(),
    role: user.role,
    bio: String(user.bio || "").trim(),
    favorites: getFavoritesForUser(user.id)
  };
}

function listLogs() {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Owner access required.");
  return loadLogs();
}

function changeUserRole(targetUserId, nextRole) {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Only owner can change roles.");

  if (![ROLE.ADMIN, ROLE.CUSTOMER].includes(nextRole)) {
    throw new Error("Role is not allowed.");
  }

  const users = loadUsers();
  const target = users.find((user) => user.id === targetUserId);
  if (!target) throw new Error("User not found.");
  if (target.isOwner) throw new Error("Owner role cannot be changed.");

  const prevRole = target.role;
  target.role = nextRole;
  saveUsers(users);

  logAction("role_change", {
    actorUserId: actor.id,
    targetUserId: target.id,
    details: { prevRole, nextRole }
  });

  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));

  return sanitizeUser(target);
}

function setUserBlocked(targetUserId, blocked) {
  const actor = requireAuth();
  if (!actor.isOwner) throw new Error("Only owner can block users.");
  const users = loadUsers();
  const target = users.find((user) => user.id === targetUserId);
  if (!target) throw new Error("User not found.");
  if (target.isOwner) throw new Error("Owner cannot be blocked.");
  target.isBlocked = Boolean(blocked);
  saveUsers(users);
  logAction(target.isBlocked ? "user_blocked" : "user_unblocked", {
    actorUserId: actor.id,
    targetUserId,
    details: { blocked: target.isBlocked }
  });
  if (target.id === getSessionUserId() && target.isBlocked) setSessionUserId("");
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));
}

function sendMessage(toUserId, text) {
  const from = requireAuth();
  const to = getUserByIdRaw(toUserId);
  if (!to) throw new Error("Recipient not found.");

  const safeText = String(text || "").trim();
  if (!safeText) throw new Error("Message is empty.");

  if (!from.isOwner && from.role !== ROLE.ADMIN) {
    const allowedRecipient = to.isOwner || to.role === ROLE.ADMIN;
    if (!allowedRecipient) throw new Error("Customers can message only support/admin.");
  }

  const messages = loadMessages();
  messages.push({
    id: uid("msg"),
    fromUserId: from.id,
    toUserId: to.id,
    text: safeText,
    createdAt: Date.now()
  });
  saveMessages(messages);
  logAction("message_sent", { actorUserId: from.id, targetUserId: to.id });
  return true;
}

function getConversation(withUserId) {
  const actor = requireAuth();
  return loadMessages().filter(
    (msg) =>
      (msg.fromUserId === actor.id && msg.toUserId === withUserId) ||
      (msg.fromUserId === withUserId && msg.toUserId === actor.id)
  );
}

function getInboxContacts() {
  const actor = requireAuth();
  const users = loadUsers();
  if (actor.isOwner || actor.role === ROLE.ADMIN) {
    return users
      .filter((user) => user.id !== actor.id)
      .map((user) => sanitizeUser(user));
  }
  return users.filter((user) => user.isOwner || user.role === ROLE.ADMIN).map((user) => sanitizeUser(user));
}

function listGroups() {
  requirePermission(PERMISSION.USERS_VIEW);
  ensureGroupsAndAssignments();
  return loadGroups().map((group) => ({
    id: group.id,
    name: group.name,
    permissions: normalizePermissions(group.permissions),
    isSystem: Boolean(group.isSystem),
    isProtected: Boolean(group.isProtected)
  }));
}

function createGroup({ name, permissions = [] }) {
  const actor = requirePermission(PERMISSION.ROLES_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can manage roles/groups.");
  const safeName = cleanName(name);
  if (!safeName || safeName.length < 2) throw new Error("Group name is too short.");
  const groups = loadGroups();
  if (groups.some((group) => group.name.toLowerCase() === safeName.toLowerCase())) throw new Error("Group name already exists.");

  const normalizedPermissions = normalizePermissions(permissions);
  if (!actor.isOwner && normalizedPermissions.some((permission) => SENSITIVE_PERMISSIONS.includes(permission))) {
    throw new Error("Sensitive permissions can be managed only by owner.");
  }

  const group = {
    id: uid("group"),
    name: safeName,
    permissions: normalizedPermissions,
    isSystem: false,
    isProtected: false
  };
  groups.push(group);
  saveGroups(groups);
  logAction("group_created", { actorUserId: actor.id, details: { groupId: group.id, name: group.name } });
  return group;
}

function updateGroup(groupId, { name, permissions }) {
  const actor = requirePermission(PERMISSION.ROLES_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can manage roles/groups.");
  const groups = loadGroups();
  const group = groups.find((item) => item.id === groupId);
  if (!group) throw new Error("Group not found.");
  if (group.isProtected) throw new Error("Protected group cannot be modified.");

  const safeName = cleanName(name);
  if (!safeName || safeName.length < 2) throw new Error("Group name is too short.");
  if (groups.some((item) => item.id !== groupId && item.name.toLowerCase() === safeName.toLowerCase())) {
    throw new Error("Group name already exists.");
  }

  const normalizedPermissions = normalizePermissions(permissions);
  if (!actor.isOwner && normalizedPermissions.some((permission) => SENSITIVE_PERMISSIONS.includes(permission))) {
    throw new Error("Sensitive permissions can be managed only by owner.");
  }

  group.name = safeName;
  group.permissions = normalizedPermissions;
  saveGroups(groups);
  logAction("group_updated", { actorUserId: actor.id, details: { groupId: group.id, name: group.name } });
  return group;
}

function deleteGroup(groupId) {
  const actor = requirePermission(PERMISSION.ROLES_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can manage roles/groups.");
  const groups = loadGroups();
  const target = groups.find((group) => group.id === groupId);
  if (!target) throw new Error("Group not found.");
  if (target.isProtected || target.isSystem) throw new Error("System group cannot be deleted.");

  const next = groups.filter((group) => group.id !== groupId);
  saveGroups(next);

  const userGroups = loadUserGroups();
  Object.keys(userGroups).forEach((userId) => {
    userGroups[userId] = (userGroups[userId] || []).filter((id) => id !== groupId);
    if (!userGroups[userId].length) {
      const user = getUserByIdRaw(userId);
      if (user?.isOwner) userGroups[userId] = ["group_owner_core"];
      else if (user?.role === ROLE.ADMIN) userGroups[userId] = ["group_admin"];
      else userGroups[userId] = ["group_customer"];
    }
  });
  saveUserGroups(userGroups);

  logAction("group_deleted", { actorUserId: actor.id, details: { groupId } });
}

function assignUserGroups(targetUserId, groupIds) {
  const actor = requirePermission(PERMISSION.ROLES_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can manage roles/groups.");
  const users = loadUsers();
  const target = users.find((user) => user.id === targetUserId);
  if (!target) throw new Error("User not found.");
  if (target.isOwner) throw new Error("Owner groups cannot be changed.");

  const groups = loadGroups();
  const allowedIds = new Set(groups.map((group) => group.id));
  const normalized = [...new Set((Array.isArray(groupIds) ? groupIds : []).map((id) => String(id || "").trim()).filter(Boolean))]
    .filter((id) => allowedIds.has(id));
  if (!normalized.length) normalized.push("group_customer");

  const assignedGroups = groups.filter((group) => normalized.includes(group.id));
  const assignedPermissions = new Set();
  assignedGroups.forEach((group) => (group.permissions || []).forEach((permission) => assignedPermissions.add(permission)));
  if (!actor.isOwner && [...assignedPermissions].some((permission) => SENSITIVE_PERMISSIONS.includes(permission))) {
    throw new Error("Sensitive permissions can be assigned only by owner.");
  }

  const userGroups = loadUserGroups();
  userGroups[targetUserId] = normalized;
  saveUserGroups(userGroups);
  target.role = normalized.includes("group_admin") ? ROLE.ADMIN : ROLE.CUSTOMER;
  saveUsers(users);

  logAction("user_groups_assigned", { actorUserId: actor.id, targetUserId, details: { groupIds: normalized } });
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));
  return sanitizeUser(target);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function defaultGroupForUser(user) {
  if (user?.isOwner) return "group_owner_core";
  if (user?.role === ROLE.ADMIN) return "group_admin";
  return "group_customer";
}

function exportAccessConfig() {
  const actor = requirePermission(PERMISSION.SETTINGS_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can export access config.");
  ensureGroupsAndAssignments();

  const groups = loadGroups().map((group) => ({
    id: String(group.id || "").trim(),
    name: String(group.name || "").trim(),
    permissions: normalizePermissions(group.permissions),
    isSystem: Boolean(group.isSystem),
    isProtected: Boolean(group.isProtected)
  }));

  const users = loadUsers();
  const userGroups = loadUserGroups();
  const assignments = {};

  users.forEach((user) => {
    if (!user || user.isOwner) return;
    const email = normalizeEmail(user.email);
    if (!email) return;
    assignments[email] = [...new Set((userGroups[user.id] || []).map((id) => String(id || "").trim()).filter(Boolean))];
  });

  const config = {
    version: 1,
    exportedAt: Date.now(),
    groups,
    assignments
  };

  logAction("access_config_exported", {
    actorUserId: actor.id,
    details: { groups: groups.length, assignments: Object.keys(assignments).length }
  });
  return config;
}

function importAccessConfig(payload) {
  const actor = requirePermission(PERMISSION.SETTINGS_MANAGE);
  if (!actor.isOwner) throw new Error("Only owner can import access config.");
  if (!isPlainObject(payload)) throw new Error("Import payload must be an object.");

  const version = Number(payload.version);
  if (!Number.isFinite(version) || version < 1) throw new Error("Unsupported config version.");

  const importedGroups = Array.isArray(payload.groups) ? payload.groups : null;
  if (!importedGroups) throw new Error("Config must contain groups array.");

  const defaultGroups = getDefaultGroups();
  const defaultIds = new Set(defaultGroups.map((group) => group.id));
  const finalGroups = [...defaultGroups];
  const usedIds = new Set(defaultGroups.map((group) => group.id));
  const usedNames = new Set(defaultGroups.map((group) => group.name.toLowerCase()));

  importedGroups.forEach((item) => {
    if (!isPlainObject(item)) throw new Error("Each group must be an object.");
    const id = String(item.id || "").trim();
    const name = cleanName(item.name);
    if (!id || id.length < 3 || id.length > 80) throw new Error("Invalid group id.");
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error("Group id has unsupported characters.");
    if (!name || name.length < 2 || name.length > 80) throw new Error("Invalid group name.");
    if (defaultIds.has(id)) return;
    if (usedIds.has(id)) throw new Error(`Duplicate group id: ${id}`);
    const lowName = name.toLowerCase();
    if (usedNames.has(lowName)) throw new Error(`Duplicate group name: ${name}`);

    usedIds.add(id);
    usedNames.add(lowName);
    finalGroups.push({
      id,
      name,
      permissions: normalizePermissions(item.permissions),
      isSystem: false,
      isProtected: false
    });
  });

  const assignmentsRaw = payload.assignments;
  if (!isPlainObject(assignmentsRaw) && !Array.isArray(assignmentsRaw) && assignmentsRaw != null) {
    throw new Error("Assignments must be an object or array.");
  }
  const assignmentByEmail = {};

  if (Array.isArray(assignmentsRaw)) {
    assignmentsRaw.forEach((entry) => {
      if (!isPlainObject(entry)) throw new Error("Invalid assignment entry.");
      const email = normalizeEmail(entry.email);
      if (!email) return;
      assignmentByEmail[email] = Array.isArray(entry.groupIds) ? entry.groupIds : [];
    });
  } else if (isPlainObject(assignmentsRaw)) {
    Object.keys(assignmentsRaw).forEach((emailKey) => {
      const email = normalizeEmail(emailKey);
      if (!email) return;
      assignmentByEmail[email] = Array.isArray(assignmentsRaw[emailKey]) ? assignmentsRaw[emailKey] : [];
    });
  }

  const allowedGroupIds = new Set(finalGroups.map((group) => group.id));
  const users = loadUsers();
  const nextUserGroups = {};

  users.forEach((user) => {
    if (!user) return;
    if (user.isOwner) {
      nextUserGroups[user.id] = ["group_owner_core"];
      return;
    }

    const email = normalizeEmail(user.email);
    const imported = assignmentByEmail[email];
    const normalized = [...new Set((Array.isArray(imported) ? imported : []).map((id) => String(id || "").trim()).filter(Boolean))]
      .filter((id) => allowedGroupIds.has(id) && id !== "group_owner_core");

    nextUserGroups[user.id] = normalized.length ? normalized : [defaultGroupForUser(user)];
  });

  saveGroups(finalGroups);
  saveUserGroups(nextUserGroups);

  logAction("access_config_imported", {
    actorUserId: actor.id,
    details: { groups: finalGroups.length, assignments: Object.keys(nextUserGroups).length }
  });
  window.dispatchEvent(new CustomEvent("watchtopia:auth-changed"));
  return { groups: finalGroups.length, assignments: Object.keys(nextUserGroups).length };
}

function getRoleLabel(role) {
  if (role === ROLE.OWNER) return "OWNER";
  if (role === ROLE.ADMIN) return "ADMIN";
  return "CUSTOMER";
}

function getOrderStatuses() {
  return Object.values(ORDER_STATUS);
}

ensureOwnerUser();
ensureGroupsAndAssignments();

function loadComments() {
  try {
    const data = localStorage.getItem("watchtopia-comments");
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveComments(comments) {
  try {
    localStorage.setItem("watchtopia-comments", JSON.stringify(comments));
  } catch (error) {
    console.warn("Failed to save comments", error);
  }
}

function getProductComments(sku) {
  const safeSku = String(sku || "").trim();
  const all = loadComments();
  const user = getCurrentUser();
  const isAdmin = hasRole(ROLE.ADMIN);
  return all
    .filter((c) => c.sku === safeSku && (!c.status || c.status === "approved" || isAdmin || (user && c.userId === user.id)))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function getAllComments() {
  return loadComments().sort((a, b) => b.createdAt - a.createdAt);
}

function addProductComment(sku, text) {
  const user = getCurrentUser();
  if (!user) throw new Error("Must be logged in to comment.");
  const safeSku = String(sku || "").trim();
  const safeText = String(text || "").trim();
  if (!safeSku || !safeText) throw new Error("SKU and text are required explicitly.");

  const all = loadComments();
  const comment = {
    id: "comment_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
    sku: safeSku,
    userId: user.id,
    userName: user.name,
    text: safeText,
    status: "approved", // default to approved for now as per simple mode, but we can change to "pending"
    createdAt: Date.now()
  };
  all.push(comment);
  saveComments(all);
  logAction("product_comment_add", { actorUserId: user.id, details: { sku: safeSku, commentId: comment.id } });
  return comment;
}

function setCommentStatus(commentId, status) {
  requirePermission("manage_products");
  const all = loadComments();
  const comment = all.find((c) => c.id === commentId);
  if (!comment) throw new Error("Comment not found.");
  comment.status = status; // approved / hidden
  saveComments(all);
  logAction("product_comment_status_change", { details: { commentId, status } });
}

function deleteProductComment(commentId) {
  requirePermission("manage_products");
  const all = loadComments();
  const filtered = all.filter(c => c.id !== commentId);
  saveComments(filtered);
  logAction("product_comment_delete", { details: { commentId } });
}

window.WatchtopiaAuth = {
  ROLE,
  PERMISSION,
  getPermissionsCatalog,
  register,
  createUserByAdmin,
  login,
  logout,
  getCurrentUser,
  requireAuth,
  hasRole,
  canManageProducts,
  requireProductAccess,
  addToCart,
  updateCartItem,
  clearCart,
  getCurrentCart,
  getCartCount,
  createOrderFromCart,
  listOrdersForCurrentUser,
  listAllOrders,
  setOrderStatus,
  deleteOrder,
  getOrderStatuses,
  toggleFavorite,
  isFavorite,
  getCurrentFavorites,
  getFavoriteStatsBySku,
  subscribeNewsletter,
  listNewsletters,
  getRecentlyViewed,
  trackRecentlyViewed,
  trackProductView,
  getProductViewCounts,
  getSettings,
  updateSettings,
  getPromoCodes,
  addPromoCode,
  deletePromoCode,
  validatePromoCode,
  addAddressForCurrentUser,
  removeAddressForCurrentUser,
  getAddressesForUser,
  updateCurrentUserProfile,
  listUsers,
  listPublicUsers,
  getPublicUserProfile,
  listLogs,
  changeUserRole,
  setUserBlocked,
  sendMessage,
  getConversation,
  getInboxContacts,
  getRoleLabel,
  listGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  assignUserGroups,
  exportAccessConfig,
  importAccessConfig,
  getUserGroupIds,
  getUserPermissions,
  currentUserHasPermission,
  requirePermission,
  logAction,
  getOwnerUser,
  getOwnerCredentials: () => ({ email: OWNER_SEED.email, password: OWNER_SEED.password }),

  getProductComments,
  getAllComments,
  addProductComment,
  deleteProductComment,
  setCommentStatus
};

// Initialize essential data
if (typeof ensureOwnerUser === 'function') ensureOwnerUser();
if (typeof ensureGroupsAndAssignments === 'function') ensureGroupsAndAssignments();

