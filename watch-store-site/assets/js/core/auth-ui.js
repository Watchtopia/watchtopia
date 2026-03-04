(function initAuthUi() {
  const auth = window.WatchtopiaAuth;
  if (!auth) return;

  // Determine path prefix based on current page location
  const _ROOT = location.pathname.includes('/pages/') ? '' : 'pages/';
  const _UP = location.pathname.includes('/pages/') ? '../' : '';

  const labels = {
    az: {
      login: "Giris",
      register: "Qeydiyyat",
      profileMenu: "Profil",
      cart: "Sebet",
      favorites: "Beyenilenler",
      profile: "Profil sehifesi",
      messages: "Mesajlar",
      admin: "Admin",
      logout: "Cixis"
    },
    ru: {
      login: "Вход",
      register: "Регистрация",
      profileMenu: "Профиль",
      cart: "Корзина",
      favorites: "Избранное",
      profile: "Профиль",
      messages: "Сообщения",
      admin: "Админ",
      logout: "Выход"
    },
    en: {
      login: "Login",
      register: "Register",
      profileMenu: "Profile",
      cart: "Cart",
      favorites: "Favorites",
      profile: "Profile",
      messages: "Messages",
      admin: "Admin",
      logout: "Logout"
    }
  };

  const nav = document.getElementById("main-nav");
  if (nav && !nav.querySelector("[data-auth-nav='true']")) {
    const authItems = [
      `<a href="${_ROOT}login.html" data-auth-item="login" data-auth-nav="true">Login</a>`,
      `<a href="${_ROOT}register.html" data-auth-item="register" data-auth-nav="true">Register</a>`,
      '<div class="nav-profile-dropdown" data-auth-item="profile-menu" data-auth-nav="true">' +
      '<button type="button" class="nav-profile-toggle" data-auth-item="profile-menu-toggle" aria-expanded="false"><span data-auth-item="profile-menu-label">Profile</span><span class="nav-profile-caret">▾</span></button>' +
      '<div class="nav-profile-menu" data-auth-item="profile-menu-list">' +
      `<a href="${_ROOT}cart.html" data-auth-item="cart">Cart (0)</a>` +
      `<a href="${_ROOT}favorites.html" data-auth-item="favorites">Favorites</a>` +
      `<a href="${_ROOT}profile.html" data-auth-item="profile">Profile</a>` +
      `<a href="${_ROOT}messages.html" data-auth-item="messages">Messages</a>` +
      `<a href="${_ROOT}admin.html" data-auth-item="admin">Admin</a>` +
      '<a href="#" data-auth-item="logout">Logout</a>' +
      '</div>' +
      '</div>'
    ];
    nav.insertAdjacentHTML("beforeend", authItems.join(""));
  }

  function closeProfileMenu() {
    const list = document.querySelector("[data-auth-item='profile-menu-list']");
    const toggle = document.querySelector("[data-auth-item='profile-menu-toggle']");
    const dropdown = document.querySelector(".nav-profile-dropdown");
    if (dropdown) dropdown.classList.remove("is-open");
    if (list) list.setAttribute("aria-hidden", "true");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function toggleProfileMenu() {
    const list = document.querySelector("[data-auth-item='profile-menu-list']");
    const toggle = document.querySelector("[data-auth-item='profile-menu-toggle']");
    const dropdown = document.querySelector(".nav-profile-dropdown");
    if (!list || !toggle || !dropdown) return;
    const next = !dropdown.classList.contains("is-open");
    dropdown.classList.toggle("is-open", next);
    list.setAttribute("aria-hidden", String(!next));
    toggle.setAttribute("aria-expanded", String(next));
  }

  function updateNav() {
    const lang = localStorage.getItem("watchtopia-language") || "az";
    const t = labels[lang] || labels.az;
    const user = auth.getCurrentUser();
    const canManageProducts = user ? auth.canManageProducts(user) : false;

    document.querySelectorAll("[data-auth-item='login'], [data-auth-item='register']").forEach((el) => {
      el.hidden = Boolean(user);
    });

    const profileMenu = document.querySelector("[data-auth-item='profile-menu']");
    if (profileMenu) profileMenu.hidden = !user;

    document.querySelectorAll("a[href$='add-product.html']").forEach((el) => {
      el.hidden = !canManageProducts;
    });

    document.querySelectorAll("[data-auth-item='admin']").forEach((el) => {
      el.hidden = !(user && (user.isOwner || user.role === "ADMIN"));
    });
    document.querySelectorAll("a[href$='admin.html']").forEach((el) => {
      if (!el.hasAttribute("data-auth-item")) el.hidden = !(user && (user.isOwner || user.role === "ADMIN"));
    });

    const textByKey = {
      login: t.login,
      register: t.register,
      favorites: t.favorites,
      profile: t.profile,
      messages: t.messages,
      admin: t.admin,
      logout: t.logout,
      "profile-menu-label": t.profileMenu
    };

    Object.keys(textByKey).forEach((key) => {
      const link = document.querySelector(`[data-auth-item='${key}']`);
      if (link) link.textContent = textByKey[key];
    });

    const cartLink = document.querySelector("[data-auth-item='cart']");
    if (cartLink) cartLink.textContent = `${t.cart} (${auth.getCartCount()})`;

    if (!user) closeProfileMenu();
  }

  function protectRoute() {
    const body = document.body;
    if (!body) return;

    const requiresAuth = body.dataset.requireAuth === "true";
    const requiresOwner = body.dataset.requireOwner === "true";
    const requiresProductAccess = body.dataset.requireProductAccess === "true";
    const requiresAdminSupport = body.dataset.requireAdminSupport === "true";

    const user = auth.getCurrentUser();

    if (requiresAuth && !user) {
      window.location.href = `${_ROOT}login.html`;
      return;
    }

    if (requiresOwner && (!user || !user.isOwner)) {
      // If it only requires owner, but we might want to allow admin too if specific flags are set
      // For now, let's keep it but ensure admin.html uses requiresAdminSupport instead
      window.location.href = `${_UP}index.html`;
      return;
    }

    if (requiresAdminSupport && (!user || (!user.isOwner && user.role !== "ADMIN"))) {
      window.location.href = `${_UP}index.html`;
      return;
    }

    if (requiresProductAccess && (!user || !auth.canManageProducts(user))) {
      window.location.href = `${_UP}index.html`;
    }
  }

  document.addEventListener("click", (event) => {
    const logoutLink = event.target.closest("[data-auth-item='logout']");
    if (logoutLink) {
      event.preventDefault();
      auth.logout();
      window.location.href = `${_UP}index.html`;
      return;
    }

    const toggle = event.target.closest("[data-auth-item='profile-menu-toggle']");
    if (toggle) {
      event.preventDefault();
      toggleProfileMenu();
      return;
    }

    const dropdown = event.target.closest(".nav-profile-dropdown");
    if (!dropdown) {
      closeProfileMenu();
      return;
    }

    const menuLink = event.target.closest(".nav-profile-menu a");
    if (menuLink) closeProfileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProfileMenu();
  });

  window.addEventListener("watchtopia:auth-changed", updateNav);
  window.addEventListener("watchtopia:cart-changed", updateNav);
  window.addEventListener("watchtopia:lang-changed", updateNav);

  protectRoute();
  updateNav();
})();
