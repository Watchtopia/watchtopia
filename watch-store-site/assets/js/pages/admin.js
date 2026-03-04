const auth = window.WatchtopiaAuth;
const store = window.WatchtopiaProducts;

const adminMessage = document.getElementById("admin-message");
const usersWrap = document.getElementById("admin-users");
const usersAssignWrap = document.getElementById("admin-users-assign");
const productsWrap = document.getElementById("admin-products");
const ordersWrap = document.getElementById("admin-orders");
const logsWrap = document.getElementById("admin-logs");

const contactsWrap = document.getElementById("admin-contacts");
const chatWrap = document.getElementById("admin-chat");
const sendForm = document.getElementById("admin-send-form");
const editProductForm = document.getElementById("admin-edit-product-form");
const editCancelBtn = document.getElementById("admin-edit-cancel");
const createProductForm = document.getElementById("admin-create-product-form");
const filterCategoriesForm = document.getElementById("admin-filter-categories-form");
const filterMechanismsForm = document.getElementById("admin-filter-mechanisms-form");
const filterBrandsForm = document.getElementById("admin-filter-brands-form");
const filterCategoriesList = document.getElementById("admin-filter-categories-list");
const filterMechanismsList = document.getElementById("admin-filter-mechanisms-list");
const filterBrandsList = document.getElementById("admin-filter-brands-list");
const productsSubtabs = document.getElementById("admin-products-subtabs");
const usersSubtabs = document.getElementById("admin-users-subtabs");
const groupsSubtabs = document.getElementById("admin-groups-subtabs");
const groupsWrap = document.getElementById("admin-groups");
const groupsModeTitle = document.getElementById("admin-groups-mode-title");
const createGroupForm = document.getElementById("admin-create-group-form");
const editGroupForm = document.getElementById("admin-edit-group-form");
const groupPermissionsWrap = document.getElementById("admin-group-permissions");
const groupEditPermissionsWrap = document.getElementById("admin-group-edit-permissions");
const userGroupsForm = document.getElementById("admin-user-groups-form");
const userGroupsListWrap = document.getElementById("admin-user-groups-list");
const userGroupsTitle = document.getElementById("admin-user-groups-title");
const accessForm = document.getElementById("admin-access-form");
const accessJsonInput = document.getElementById("admin-access-json");
const accessFileInput = document.getElementById("admin-access-file");
const accessExportBtn = document.getElementById("admin-access-export-btn");
const usersFiltersForm = document.getElementById("admin-users-filters");
const productsFiltersForm = document.getElementById("admin-products-filters");
const ordersFiltersForm = document.getElementById("admin-orders-filters");
const logsFiltersForm = document.getElementById("admin-logs-filters");
const messagesFiltersForm = document.getElementById("admin-messages-filters");
let selectedContactId = "";
const searchState = {
  users: { q: "", id: "", name: "", email: "", role: "", status: "", group: "", birthFrom: "", birthTo: "" },
  products: { q: "", sku: "", name: "", brand: "", category: "" },
  orders: { q: "", id: "", user: "", status: "", dateFrom: "", dateTo: "" },
  logs: { q: "", type: "", actor: "", target: "", dateFrom: "", dateTo: "" },
  messages: { q: "" }
};

const I18N = {
  az: {
    title: "Admin paneli",
    intro: "Istifadeciler, rollar, mehsullar, sifarisler, mesajlar ve audit log.",
    tabs: { dashboard: "Icmal", users: "İstifadəçilər", products: "Məhsullar", orders: "Sifarişlər", messages: "Mesajlar", logs: "Loglar", comments: "Rəylər", promos: "Promokodlar", settings: "Tənzimləmələr" },
    static: {
      usersCreateTitle: "Istifadeci yarat",
      usersListTitle: "Istifadeciler",
      usersRolesTitle: "Rollarin idaresi",
      usersBlockTitle: "Bloklama idaresi",
      usersAssignTitle: "Qrup teyinati",
      productsCreateTitle: "Mehsul yarat",
      productsEditTitle: "Mehsulu redakte et",
      productsListTitle: "Mehsullar",
      ordersTitle: "Sifarisler",
      messagesTitle: "Mesajlar",
      logsTitle: "Son emeliyyatlar",
      createUser: "Istifadeci yarat",
      createProduct: "Mehsul yarat",
      saveChanges: "Deyisiklikleri saxla",
      cancel: "Legv et",
      send: "Gonder",
      userName: "Ad",
      userEmail: "Email",
      userPassword: "Sifre",
      userPhone: "Telefon",
      userRole: "Rol",
      productName: "Ad",
      productSku: "SKU",
      productBrand: "Brend",
      productPrice: "Qiymet",
      productCategory: "Kateqoriya",
      productType: "Mehsul novu",
      productUnitType: "Olcu novu",
      productMechanism: "Mexanizm",
      productStatus: "Status",
      productImage: "Sekil URL",
      productVariants: "Variantlar (her setirde: ad | qiymet)",
      productShort: "Qisa tesvir",
      productFull: "Tam tesvir",
      productShortAz: "Qisa tesvir AZ",
      productShortRu: "Qisa tesvir RU",
      productShortEn: "Qisa tesvir EN",
      productFullAz: "Tam tesvir AZ",
      productFullRu: "Tam tesvir RU",
      productFullEn: "Tam tesvir EN",
      productFeaturesAz: "Xususiyyetler AZ (her setirde bir dene)",
      productFeaturesRu: "Xususiyyetler RU (her setirde bir dene)",
      productFeaturesEn: "Xususiyyetler EN (her setirde bir dene)",
      productImages: "Sekil URL-leri (her setirde bir dene)",
      productVideos: "Video URL-leri (her setirde bir dene)",
      productInstagram: "Instagram post URL",
      filtersTitle: "Kataloq filterleri",
      filterCategory: "Kateqoriya",
      filterMechanism: "Mexanizm",
      filterBrand: "Brend",
      addCategory: "Kateqoriya elave et",
      addMechanism: "Mexanizm elave et",
      addBrand: "Brend elave et",
      subtabCreate: "Elave et",
      subtabEdit: "Redakte et",
      subtabFilters: "Filterler",
      subtabList: "Siyahi",
      groupsTitle: "Qruplar",
      groupName: "Qrup adi",
      groupCreate: "Qrup yarat",
      groupSave: "Qrupu saxla",
      groupCancel: "Legv et",
      groupAssignTitle: "Qruplari teyin et",
      groupAssignSave: "Teyinati saxla",
      usersSubtabCreate: "Istifadeci yarat",
      usersSubtabUsers: "Istifadeciler",
      usersSubtabRoles: "Rollar",
      usersSubtabBlock: "Bloklama",
      usersSubtabAssign: "Qrup teyinati",
      usersSubtabGroups: "Qruplar",
      usersSubtabAccess: "Huquqlar",
      groupsSubtabCreate: "Yarat",
      groupsSubtabEdit: "Redakte et",
      groupsSubtabDelete: "Sil",
      groupsSubtabMatrix: "Icazeler matrisi",
      groupsModeEdit: "Qrup redaktesi",
      groupsModeDelete: "Qrup silinmesi",
      groupsModeMatrix: "Qrup icazeleri matrisi",
      accessTitle: "Girish huquqlari konfiqi",
      accessJson: "Huquqlar JSON",
      accessImport: "JSON idxal et",
      accessLoadFile: "Fayldan yukle",
      messagePlaceholder: "Mesaj yazin",
      dashboardOverview: "Magaza icmali",
      totalRevenue: "Umumi Gelir",
      totalOrders: "Umumi Sifaris",
      totalUsers: "Umumi Istifadeci",
      topProducts: "En Cox Baxilan 5 Mehsul",
      loadingViews: "Baxışlar yüklənir...",
      noViewsYet: "Hələ baxış yoxdur.",
      commentsTitle: "Rəylərin Moderasiyası",
      commentsIntro: "Müştəri rəylərini idarə edin.",
      approve: "Təsdiqlə",
      hide: "Gizlət"
    },
    headers: {
      user: { name: "Ad", email: "Email", role: "Rol", status: "Status", created: "Yaradılıb", actions: "Əməliyyat" },
      product: { sku: "SKU", name: "Ad", price: "Qiymət", category: "Kateqoriya", actions: "Əməliyyat" },
      order: { id: "ID", user: "İstifadəçi", items: "Məhsullar", status: "Status", date: "Tarix", actions: "Əməliyyat" },
      logs: { date: "Tarix", action: "Əməliyyat", actor: "İcra edən", target: "Hədəf", details: "Detallar" },
      comment: { user: "İstifadəçi / Tarix", product: "Məhsul", text: "Mətn", status: "Status", actions: "Əməliyyat" }
    },
    statusBlocked: "Blokda",
    statusActive: "Aktiv",
    owner: "Owner",
    makeCustomer: "CUSTOMER et",
    makeAdmin: "ADMIN et",
    unblock: "Bloku ac",
    block: "Blokla",
    edit: "Redakte et",
    del: "Sil",
    userCreated: "Istifadeci yaradildi.",
    userCreateFail: "Istifadeci yaradilmadi.",
    productCreated: "Mehsul yaradildi.",
    productCreateFail: "Mehsul yaradilmadi.",
    productUpdated: "Mehsul yenilendi.",
    productUpdateFail: "Mehsul yenilenmedi.",
    roleUpdated: "Rol yenilendi.",
    blocked: "Istifadeci bloklandi.",
    unblocked: "Istifadeci blokdan cixarildi.",
    operationFail: "Emeliyyat ugursuz oldu.",
    productDeleted: "Mehsul silindi.",
    productActionFail: "Mehsul emeliyyati ugursuz oldu.",
    orderStatusUpdated: "Sifaris statusu yenilendi.",
    orderStatusFail: "Sifaris statusu yenilenmedi.",
    selectContact: "Evvelce elaqe secin.",
    messageSent: "Mesaj gonderildi.",
    messageFail: "Mesaj gonderilmedi.",
    accessExported: "Huquqlar konfiqi ixrac edildi.",
    accessImported: "Huquqlar konfiqi idxal edildi.",
    accessLoaded: "JSON fayldan yuklendi.",
    accessImportFail: "Huquqlar konfiqini idxal etmek olmadi.",
    accessInvalidJson: "JSON duzgun deyil."
  },
  ru: {
    title: "Админ панель",
    intro: "Пользователи, роли, товары, заказы, сообщения и аудит лог.",
    tabs: { dashboard: "Обзор", users: "Пользователи", products: "Товары", orders: "Заказы", messages: "Сообщения", logs: "Логи", comments: "Отзывы", promos: "Промокоды", settings: "Настройки" },
    static: {
      usersCreateTitle: "Создать пользователя",
      usersListTitle: "Пользователи",
      usersRolesTitle: "Управление ролями",
      usersBlockTitle: "Управление блокировкой",
      usersAssignTitle: "Назначение групп",
      productsCreateTitle: "Создать товар",
      productsEditTitle: "Редактировать товар",
      productsListTitle: "Товары",
      ordersTitle: "Заказы",
      messagesTitle: "Сообщения",
      logsTitle: "Последние действия",
      createUser: "Создать пользователя",
      createProduct: "Создать товар",
      saveChanges: "Сохранить изменения",
      cancel: "Отмена",
      send: "Отправить",
      userName: "Имя",
      userEmail: "Email",
      userPassword: "Пароль",
      userPhone: "Телефон",
      userRole: "Роль",
      productName: "Название",
      productSku: "SKU",
      productBrand: "Бренд",
      productPrice: "Цена",
      productCategory: "Категория",
      productType: "Тип товара",
      productUnitType: "Тип единицы",
      productMechanism: "Механизм",
      productStatus: "Статус",
      productImage: "URL изображения",
      productVariants: "Варианты (в строке: название | цена)",
      productShort: "Короткое описание",
      productFull: "Полное описание",
      productShortAz: "Короткое описание AZ",
      productShortRu: "Короткое описание RU",
      productShortEn: "Короткое описание EN",
      productFullAz: "Полное описание AZ",
      productFullRu: "Полное описание RU",
      productFullEn: "Полное описание EN",
      productFeaturesAz: "Характеристики AZ (по одному в строке)",
      productFeaturesRu: "Характеристики RU (по одному в строке)",
      productFeaturesEn: "Характеристики EN (по одному в строке)",
      productImages: "URL фото (по одному в строке)",
      productVideos: "URL видео (по одному в строке)",
      productInstagram: "URL поста Instagram",
      filtersTitle: "Фильтры каталога",
      filterCategory: "Категория",
      filterMechanism: "Механизм",
      filterBrand: "Бренд",
      addCategory: "Добавить категорию",
      addMechanism: "Добавить механизм",
      addBrand: "Добавить бренд",
      subtabCreate: "Добавить",
      subtabEdit: "Редактировать",
      subtabFilters: "Фильтры",
      subtabList: "Список",
      groupsTitle: "Группы",
      groupName: "Название группы",
      groupCreate: "Создать группу",
      groupSave: "Сохранить группу",
      groupCancel: "Отмена",
      groupAssignTitle: "Назначить группы",
      groupAssignSave: "Сохранить назначение",
      usersSubtabCreate: "Создать пользователя",
      usersSubtabUsers: "Пользователи",
      usersSubtabRoles: "Роли",
      usersSubtabBlock: "Блокировка",
      usersSubtabAssign: "Назначение групп",
      usersSubtabGroups: "Группы",
      usersSubtabAccess: "Права",
      groupsSubtabCreate: "Создать",
      groupsSubtabEdit: "Редактировать",
      groupsSubtabDelete: "Удалить",
      groupsSubtabMatrix: "Матрица прав",
      groupsModeEdit: "Редактирование групп",
      groupsModeDelete: "Удаление групп",
      groupsModeMatrix: "Матрица прав групп",
      accessTitle: "Конфиг доступа",
      accessJson: "JSON доступа",
      accessImport: "Импорт JSON",
      accessLoadFile: "Загрузить из файла",
      messagePlaceholder: "Введите сообщение",
      dashboardOverview: "Обзор магазина",
      totalRevenue: "Общий доход",
      totalOrders: "Всего заказов",
      totalUsers: "Всего пользователей",
      topProducts: "Топ 5 просматриваемых товаров",
      loadingViews: "Загрузка просмотров...",
      noViewsYet: "Пока нет просмотров.",
      commentsTitle: "Модерация отзывов",
      commentsIntro: "Управляйте отзывами и обратной связью.",
      approve: "Одобрить",
      hide: "Скрыть"
    },
    headers: {
      user: { name: "Имя", email: "Email", role: "Роль", status: "Статус", created: "Создан", actions: "Действия" },
      product: { sku: "SKU", name: "Название", price: "Цена", category: "Категория", actions: "Действия" },
      order: { id: "ID", user: "Пользователь", items: "Товары", status: "Статус", date: "Дата", actions: "Действия" },
      logs: { date: "Дата", action: "Действие", actor: "Кто", target: "Кому", details: "Детали" },
      comment: { user: "Пользователь / Дата", product: "Товар", text: "Текст", status: "Статус", actions: "Действия" }
    },
    statusBlocked: "Заблокирован",
    statusActive: "Активен",
    owner: "Owner",
    makeCustomer: "Сделать CUSTOMER",
    makeAdmin: "Сделать ADMIN",
    unblock: "Разблокировать",
    block: "Блокировать",
    edit: "Редактировать",
    del: "Удалить",
    userCreated: "Пользователь создан.",
    userCreateFail: "Не удалось создать пользователя.",
    productCreated: "Товар создан.",
    productCreateFail: "Не удалось создать товар.",
    productUpdated: "Товар обновлен.",
    productUpdateFail: "Не удалось обновить товар.",
    roleUpdated: "Роль обновлена.",
    blocked: "Пользователь заблокирован.",
    unblocked: "Пользователь разблокирован.",
    operationFail: "Операция не выполнена.",
    productDeleted: "Товар удален.",
    productActionFail: "Ошибка операции с товаром.",
    orderStatusUpdated: "Статус заказа обновлен.",
    orderStatusFail: "Не удалось обновить статус заказа.",
    selectContact: "Сначала выберите контакт.",
    messageSent: "Сообщение отправлено.",
    messageFail: "Не удалось отправить сообщение.",
    accessExported: "Конфиг доступа экспортирован.",
    accessImported: "Конфиг доступа импортирован.",
    accessLoaded: "JSON загружен из файла.",
    accessImportFail: "Не удалось импортировать конфиг доступа.",
    accessInvalidJson: "Некорректный JSON."
  },
  en: {
    title: "Admin Panel",
    intro: "Users, roles, products, orders, support messages, audit log.",
    tabs: { dashboard: "Dashboard", users: "Users", products: "Products", orders: "Orders", messages: "Messages", logs: "Logs", comments: "Comments", promos: "Promos", settings: "Settings" },
    static: {
      usersCreateTitle: "Create user",
      usersListTitle: "Users",
      usersRolesTitle: "Role management",
      usersBlockTitle: "Blocking management",
      usersAssignTitle: "Group assignments",
      productsCreateTitle: "Create product",
      productsEditTitle: "Edit product",
      productsListTitle: "Products",
      ordersTitle: "Orders",
      messagesTitle: "Messages",
      logsTitle: "Recent actions",
      createUser: "Create user",
      createProduct: "Create product",
      saveChanges: "Save changes",
      cancel: "Cancel",
      send: "Send",
      userName: "Name",
      userEmail: "Email",
      userPassword: "Password",
      userPhone: "Phone",
      userRole: "Role",
      productName: "Name",
      productSku: "SKU",
      productBrand: "Brand",
      productPrice: "Price",
      productCategory: "Category",
      productType: "Product type",
      productUnitType: "Unit type",
      productMechanism: "Mechanism",
      productStatus: "Status",
      productImage: "Image URL",
      productVariants: "Variants (one line: label | price)",
      productShort: "Short Description",
      productFull: "Full Description",
      productShortAz: "Short Description AZ",
      productShortRu: "Short Description RU",
      productShortEn: "Short Description EN",
      productFullAz: "Full Description AZ",
      productFullRu: "Full Description RU",
      productFullEn: "Full Description EN",
      productFeaturesAz: "Features AZ (one line per item)",
      productFeaturesRu: "Features RU (one line per item)",
      productFeaturesEn: "Features EN (one line per item)",
      productImages: "Photo URLs (one URL per line)",
      productVideos: "Video URLs (one URL per line)",
      productInstagram: "Instagram post URL",
      filtersTitle: "Catalog filters",
      filterCategory: "Category",
      filterMechanism: "Mechanism",
      filterBrand: "Brand",
      addCategory: "Add category",
      addMechanism: "Add mechanism",
      addBrand: "Add brand",
      subtabCreate: "Create",
      subtabEdit: "Edit",
      subtabFilters: "Filters",
      subtabList: "List",
      groupsTitle: "Groups",
      groupName: "Group name",
      groupCreate: "Create group",
      groupSave: "Save group",
      groupCancel: "Cancel",
      groupAssignTitle: "Assign groups",
      groupAssignSave: "Save assignment",
      usersSubtabCreate: "Create user",
      usersSubtabUsers: "Users",
      usersSubtabRoles: "Roles",
      usersSubtabBlock: "Blocking",
      usersSubtabAssign: "Group assignments",
      usersSubtabGroups: "Groups",
      usersSubtabAccess: "Access",
      groupsSubtabCreate: "Create",
      groupsSubtabEdit: "Edit",
      groupsSubtabDelete: "Delete",
      groupsSubtabMatrix: "Permission matrix",
      groupsModeEdit: "Edit groups",
      groupsModeDelete: "Delete groups",
      groupsModeMatrix: "Group permission matrix",
      accessTitle: "Access config",
      accessJson: "Access JSON",
      accessImport: "Import JSON",
      accessLoadFile: "Load from file",
      messagePlaceholder: "Type a message",
      dashboardOverview: "Store Overview",
      totalRevenue: "Total Revenue",
      totalOrders: "Total Orders",
      totalUsers: "Total Users",
      topProducts: "Top 5 Most Viewed Products",
      loadingViews: "Loading views...",
      noViewsYet: "No views yet.",
      commentsTitle: "Comments Moderation",
      commentsIntro: "Manage user reviews and feedback.",
      approve: "Approve",
      hide: "Hide"
    },
    headers: {
      user: { name: "Name", email: "Email", role: "Role", status: "Status", created: "Created", actions: "Actions" },
      product: { sku: "SKU", name: "Name", price: "Price", category: "Category", actions: "Actions" },
      order: { id: "ID", user: "User", items: "Items", status: "Status", date: "Date", actions: "Actions" },
      logs: { date: "Date", action: "Action", actor: "Actor", target: "Target", details: "Details" },
      comment: { user: "User / Date", product: "Product", text: "Text", status: "Status", actions: "Actions" }
    },
    statusBlocked: "Blocked",
    statusActive: "Active",
    owner: "Owner",
    makeCustomer: "Make CUSTOMER",
    makeAdmin: "Make ADMIN",
    unblock: "Unblock",
    block: "Block",
    edit: "Edit",
    del: "Delete",
    userCreated: "User created.",
    userCreateFail: "Failed to create user.",
    productCreated: "Product created.",
    productCreateFail: "Failed to create product.",
    productUpdated: "Product updated.",
    productUpdateFail: "Product update failed.",
    roleUpdated: "Role updated.",
    blocked: "User blocked.",
    unblocked: "User unblocked.",
    operationFail: "Operation failed.",
    productDeleted: "Product deleted.",
    productActionFail: "Product action failed.",
    orderStatusUpdated: "Order status updated.",
    orderStatusFail: "Failed to update order.",
    selectContact: "Select contact first.",
    messageSent: "Message sent.",
    messageFail: "Message failed.",
    accessExported: "Access config exported.",
    accessImported: "Access config imported.",
    accessLoaded: "JSON loaded from file.",
    accessImportFail: "Failed to import access config.",
    accessInvalidJson: "Invalid JSON."
  }
};

const EXTRA_ADMIN_I18N = {
  az: {
    search: "Axtaris",
    userId: "Istifadeci ID",
    birthDate: "Dogum tarixi",
    name: "Ad",
    email: "Email",
    role: "Rol",
    status: "Status",
    group: "Qrup",
    birthFrom: "Dogum tarixi (den)",
    birthTo: "Dogum tarixi (qeder)",
    sku: "SKU",
    brand: "Brend",
    category: "Kateqoriya",
    orderId: "Sifaris ID",
    user: "Istifadeci",
    dateFrom: "Tarix (den)",
    dateTo: "Tarix (qeder)",
    actionType: "Emeliyyat novu",
    actor: "Icra eden",
    target: "Hedef",
    searchChats: "Catlarda axtar",
    contacts: "Elaqe",
    likes: "Beyenme",
    orders: "Sifaris",
    views: "Baxis",
    numberId: "ID",
    product: "Mehsul",
    type: "Nov",
    unit: "Olcu",
    noChats: "Cat tapilmadi.",
    note: "Qeyd"
  },
  ru: {
    search: "Поиск",
    userId: "ID пользователя",
    birthDate: "Дата рождения",
    name: "Имя",
    email: "Email",
    role: "Роль",
    status: "Статус",
    group: "Группа",
    birthFrom: "Дата рождения с",
    birthTo: "Дата рождения по",
    sku: "SKU",
    brand: "Бренд",
    category: "Категория",
    orderId: "ID заказа",
    user: "Пользователь",
    dateFrom: "Дата с",
    dateTo: "Дата по",
    actionType: "Тип действия",
    actor: "Кто",
    target: "Кому",
    searchChats: "Поиск по чатам",
    contacts: "Контакты",
    likes: "Лайки",
    orders: "Заказы",
    views: "Просмотры",
    numberId: "ID",
    product: "Товар",
    type: "Тип",
    unit: "Ед.",
    noChats: "Чаты не найдены.",
    note: "Комментарий"
  },
  en: {
    search: "Search",
    userId: "User ID",
    birthDate: "Birth date",
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    group: "Group",
    birthFrom: "Birth from",
    birthTo: "Birth to",
    sku: "SKU",
    brand: "Brand",
    category: "Category",
    orderId: "Order ID",
    user: "User",
    dateFrom: "Date from",
    dateTo: "Date to",
    actionType: "Action type",
    actor: "Actor",
    target: "Target",
    searchChats: "Search chats",
    contacts: "Contacts",
    likes: "Likes",
    orders: "Orders",
    views: "Views",
    numberId: "ID",
    product: "Product",
    type: "Type",
    unit: "Unit",
    noChats: "No chats found.",
    note: "Comment"
  }
};

function tt() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return I18N[lang] || I18N.az;
}

function xt() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return EXTRA_ADMIN_I18N[lang] || EXTRA_ADMIN_I18N.az;
}

function permissionLabel(permission) {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  const map = {
    az: {
      "products.create": "Mehsul yarat",
      "products.update": "Mehsul redakte et",
      "products.delete": "Mehsul sil",
      "filters.manage": "Filterleri idare et",
      "orders.view": "Sifarisleri gor",
      "orders.update": "Sifaris statusu deyis",
      "users.view": "Istifadecileri gor",
      "users.block": "Istifadecini blokla",
      "messages.reply": "Mesajlara cavab ver",
      "address.view_private": "Gizli unvanlara bax",
      "roles.manage": "Rollari idare et",
      "settings.manage": "Ayarlar idaresi"
    },
    ru: {
      "products.create": "Создание товаров",
      "products.update": "Редактирование товаров",
      "products.delete": "Удаление товаров",
      "filters.manage": "Управление фильтрами",
      "orders.view": "Просмотр заказов",
      "orders.update": "Изменение статуса заказов",
      "users.view": "Просмотр пользователей",
      "users.block": "Блокировка пользователей",
      "messages.reply": "Ответы в сообщениях",
      "address.view_private": "Просмотр приватных адресов",
      "roles.manage": "Управление ролями",
      "settings.manage": "Управление настройками"
    },
    en: {
      "products.create": "Create products",
      "products.update": "Update products",
      "products.delete": "Delete products",
      "filters.manage": "Manage filters",
      "orders.view": "View orders",
      "orders.update": "Update order status",
      "users.view": "View users",
      "users.block": "Block users",
      "messages.reply": "Reply messages",
      "address.view_private": "View private addresses",
      "roles.manage": "Manage roles",
      "settings.manage": "Manage settings"
    }
  };
  return map[lang]?.[permission] || permission;
}

function linesToArray(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value) {
  if (!Array.isArray(value)) return "";
  return value.filter(Boolean).join("\n");
}

function parseInstagramUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  return /^https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/.+/i.test(url) ? url : "";
}

function variantsFromLines(value) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines
    .map((line, index) => {
      const [labelRaw, priceRaw] = line.split("|");
      const label = String(labelRaw || "").trim();
      const price = Number(String(priceRaw || "").trim().replace(",", "."));
      if (!label || !Number.isFinite(price) || price <= 0) return null;
      return { id: `v-${index + 1}`, label, price };
    })
    .filter(Boolean);
}

function variantsToLines(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((variant) => {
      const label = String(variant?.label || "").trim();
      const price = Number(variant?.price);
      if (!label || !Number.isFinite(price) || price <= 0) return "";
      return `${label} | ${price}`;
    })
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeLower(value) {
  return String(value || "").toLowerCase();
}

function dateInRange(rawDate, fromDate, toDate) {
  const value = String(rawDate || "").slice(0, 10);
  if (!value) return false;
  if (fromDate && value < fromDate) return false;
  if (toDate && value > toDate) return false;
  return true;
}

function toIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function buildDisplayIdMap(items, keyName) {
  const sorted = [...(items || [])].sort((a, b) => (Number(a?.createdAt) || 0) - (Number(b?.createdAt) || 0));
  const map = {};
  sorted.forEach((item, index) => {
    const key = String(item?.[keyName] || "").trim();
    if (!key) return;
    map[key] = index + 1;
  });
  return map;
}

function getLocalizedTextObject(formData, keyBase, fallback = "") {
  const az = String(formData.get(`${keyBase}Az`) || fallback || "").trim();
  const ru = String(formData.get(`${keyBase}Ru`) || "").trim();
  const en = String(formData.get(`${keyBase}En`) || "").trim();
  return { az, ru, en };
}

function readProductForm(formEl) {
  const formData = new FormData(formEl);
  const shortDescription = getLocalizedTextObject(formData, "shortDescription");
  const longDescription = getLocalizedTextObject(formData, "description", shortDescription.az);

  return {
    sku: String(formData.get("sku") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    brand: String(formData.get("brand") || "").trim(),
    category: String(formData.get("category") || "original").trim(),
    productType: String(formData.get("productType") || "watch").trim(),
    unitType: String(formData.get("unitType") || "piece").trim(),
    mechanism: String(formData.get("mechanism") || "Quartz").trim(),
    status: String(formData.get("status") || "In stock").trim(),
    price: Number(formData.get("price") || 0),
    currency: "AZN",
    shortDescription,
    longDescription,
    description: longDescription,
    features: {
      az: linesToArray(formData.get("featuresAz")),
      ru: linesToArray(formData.get("featuresRu")),
      en: linesToArray(formData.get("featuresEn"))
    },
    images: linesToArray(formData.get("images") || formData.get("image")),
    videos: linesToArray(formData.get("videos")),
    variants: variantsFromLines(formData.get("variants")),
    instagramUrl: parseInstagramUrl(formData.get("instagramUrl"))
  };
}

function fillProductForm(formEl, product) {
  if (!formEl || !product) return;
  formEl.elements.name.value = product.name || "";
  if (formEl.elements.originalSku) formEl.elements.originalSku.value = product.sku || "";
  formEl.elements.sku.value = product.sku || "";
  formEl.elements.brand.value = product.brand || "";
  formEl.elements.price.value = String(product.price || "");
  formEl.elements.category.value = product.category || "original";
  if (formEl.elements.productType) formEl.elements.productType.value = product.productType || "watch";
  if (formEl.elements.unitType) formEl.elements.unitType.value = product.unitType || "piece";
  formEl.elements.mechanism.value = product.mechanism || "Quartz";
  formEl.elements.status.value = product.status || "";
  if (formEl.elements.image) formEl.elements.image.value = product.images?.[0] || "";
  if (formEl.elements.images) formEl.elements.images.value = arrayToLines(product.images);
  if (formEl.elements.videos) formEl.elements.videos.value = arrayToLines(product.videos);
  if (formEl.elements.variants) formEl.elements.variants.value = variantsToLines(product.variants);
  if (formEl.elements.instagramUrl) formEl.elements.instagramUrl.value = product.instagramUrl || "";

  formEl.elements.shortDescriptionAz.value = product.shortDescription?.az || "";
  formEl.elements.shortDescriptionRu.value = product.shortDescription?.ru || "";
  formEl.elements.shortDescriptionEn.value = product.shortDescription?.en || "";
  formEl.elements.descriptionAz.value = product.longDescription?.az || product.description?.az || "";
  formEl.elements.descriptionRu.value = product.longDescription?.ru || product.description?.ru || "";
  formEl.elements.descriptionEn.value = product.longDescription?.en || product.description?.en || "";
  formEl.elements.featuresAz.value = arrayToLines(product.features?.az);
  formEl.elements.featuresRu.value = arrayToLines(product.features?.ru);
  formEl.elements.featuresEn.value = arrayToLines(product.features?.en);
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
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

function setAdminMessage(text, type = "info") {
  if (!adminMessage) return;
  adminMessage.textContent = text;
  adminMessage.classList.remove("is-error", "is-success");
  if (type === "error") adminMessage.classList.add("is-error");
  if (type === "success") adminMessage.classList.add("is-success");
}

function getUsersActionMode() {
  const active = document.querySelector("[data-users-subtab].is-active");
  const key = active?.dataset?.usersSubtab || "users";
  if (key === "roles") return "roles";
  if (key === "block") return "block";
  if (key === "assign") return "assign";
  return "users";
}

function buildUsersTable(mode) {
  const t = tt();
  const ex = xt();
  const filters = searchState.users;
  const userDisplayIds = buildDisplayIdMap(auth.listUsers(), "id");
  const orderCounts = {};
  auth.listAllOrders().forEach((order) => {
    orderCounts[order.userId] = (orderCounts[order.userId] || 0) + 1;
  });
  const users = auth
    .listUsers()
    .map((user) => ({
      ...user,
      favoritesCount: (auth.getPublicUserProfile(user.id)?.favorites || []).length,
      ordersCount: orderCounts[user.id] || 0
    }))
    .filter((user) => {
      const groupsText = (user.groupIds || []).join(" ").toLowerCase();
      const rowText = [
        userDisplayIds[user.id],
        user.name,
        user.email,
        user.phone,
        user.role,
        groupsText,
        user.birthDate,
        user.favoritesCount,
        user.ordersCount,
        user.isBlocked ? "blocked" : "active"
      ]
        .join(" ")
        .toLowerCase();
      if (filters.q && !rowText.includes(filters.q)) return false;
      if (filters.id && !safeLower(userDisplayIds[user.id]).includes(filters.id)) return false;
      if (filters.name && !safeLower(user.name).includes(filters.name)) return false;
      if (filters.email && !safeLower(user.email).includes(filters.email)) return false;
      if (filters.role && safeLower(user.role) !== filters.role) return false;
      if (filters.status) {
        const currentStatus = user.isBlocked ? "blocked" : "active";
        if (currentStatus !== filters.status) return false;
      }
      if (filters.group && !groupsText.includes(filters.group)) return false;
      if (filters.birthFrom || filters.birthTo) {
        if (!dateInRange(user.birthDate, filters.birthFrom, filters.birthTo)) return false;
      }
      return true;
    });
  return `
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th><th>${t.headers.user.name}</th><th>${t.headers.user.email}</th><th>${t.headers.user.role}</th><th>${t.static.groupsTitle}</th><th>${ex.birthDate}</th><th>${ex.likes}</th><th>${ex.orders}</th><th>${t.headers.user.status}</th><th>${t.headers.user.created}</th><th>${t.headers.user.actions}</th>
        </tr>
      </thead>
      <tbody>
        ${users
      .map((user) => {
        const blockedLabel = user.isBlocked ? t.statusBlocked : t.statusActive;
        const safeName = escapeHtml(user.name);
        const safeEmail = escapeHtml(user.email);
        const safeRole = escapeHtml(auth.getRoleLabel(user.role));
        const roleAction = user.isOwner
          ? t.owner
          : `<button class="btn btn-ghost" type="button" data-user-groups="${user.id}" data-user-name="${encodeURIComponent(user.name || "")}">${t.static.usersSubtabAssign}</button>`;
        const blockAction = user.isOwner
          ? ""
          : `<button class="btn btn-ghost" type="button" data-user-block="${user.id}" data-current-blocked="${user.isBlocked}">${user.isBlocked ? t.unblock : t.block}</button>`;
        const groupsText = (user.groupIds || []).map((groupId) => escapeHtml(groupId)).join(", ");
        const groupsAction = user.isOwner
          ? ""
          : `<button class="btn btn-ghost" type="button" data-user-groups="${user.id}" data-user-name="${encodeURIComponent(user.name || "")}">${t.static.usersSubtabAssign}</button>`;
        const actionByMode =
          mode === "roles"
            ? roleAction
            : mode === "block"
              ? blockAction
              : mode === "assign"
                ? groupsAction
                : "-";
        return `
              <tr>
                <td>${userDisplayIds[user.id] || "-"}</td>
                <td><a href="user.html?id=${encodeURIComponent(user.id)}">${safeName}</a></td>
                <td>${safeEmail}</td>
                <td>${safeRole}</td>
                <td>${groupsText || "-"}</td>
                <td>${escapeHtml(user.birthDate || "-")}</td>
                <td>${user.favoritesCount}</td>
                <td>${user.ordersCount}</td>
                <td>${escapeHtml(blockedLabel)}</td>
                <td>${formatDate(user.createdAt)}</td>
                <td class="admin-actions">${actionByMode}</td>
              </tr>
            `;
      })
      .join("")}
      </tbody>
    </table>
  `;
}

function renderUsers() {
  const mode = getUsersActionMode();
  if (usersWrap) usersWrap.innerHTML = buildUsersTable(mode);
  if (usersAssignWrap) usersAssignWrap.innerHTML = buildUsersTable("assign");
}

function renderProducts() {
  const t = tt();
  const ex = xt();
  const filters = searchState.products;
  const viewCounts = auth.getProductViewCounts ? auth.getProductViewCounts() : {};
  const likeCounts = auth.getFavoriteStatsBySku ? auth.getFavoriteStatsBySku() : {};
  const allProducts = store.getAllProducts();
  const productDisplayIds = buildDisplayIdMap(allProducts, "sku");
  const orderCounts = {};
  auth.listAllOrders().forEach((order) => {
    (order.items || []).forEach((item) => {
      const sku = String(item?.sku || "").trim();
      if (!sku) return;
      orderCounts[sku] = (orderCounts[sku] || 0) + Math.max(1, Number(item.qty) || 1);
    });
  });
  const products = allProducts.filter((item) => {
    const rowText = [productDisplayIds[item.sku], item.sku, item.name, item.brand, item.category, item.status].join(" ").toLowerCase();
    if (filters.q && !rowText.includes(filters.q)) return false;
    if (filters.sku && !safeLower(item.sku).includes(filters.sku)) return false;
    if (filters.name && !safeLower(item.name).includes(filters.name)) return false;
    if (filters.brand && !safeLower(item.brand).includes(filters.brand)) return false;
    if (filters.category && safeLower(item.category) !== filters.category) return false;
    return true;
  });
  productsWrap.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>${ex.numberId}</th><th>${t.headers.product.sku}</th><th>${t.headers.product.name}</th><th>${ex.type}</th><th>${ex.unit}</th><th>${t.headers.product.price}</th><th>${t.headers.product.category}</th><th>${ex.views}</th><th>${ex.orders}</th><th>${ex.likes}</th><th>${t.headers.product.actions}</th>
        </tr>
      </thead>
      <tbody>
        ${products
      .map(
        (item) => `
          <tr>
            <td>${productDisplayIds[item.sku] || "-"}</td>
            <td>${escapeHtml(item.sku)}</td>
            <td><a href="product.html?sku=${encodeURIComponent(item.sku)}">${escapeHtml(item.name)}</a></td>
            <td>${escapeHtml(item.productType || "watch")}</td>
            <td>${escapeHtml(item.unitType || "piece")}</td>
            <td>${escapeHtml(item.price)} ${escapeHtml(item.currency || "AZN")}</td>
            <td>${escapeHtml(item.category)}</td>
            <td>${Math.max(0, Number(viewCounts[item.sku]) || 0)}</td>
            <td>${Math.max(0, Number(orderCounts[item.sku]) || 0)}</td>
            <td>${Math.max(0, Number(likeCounts[item.sku]) || 0)}</td>
            <td class="admin-actions">
              <button class="btn btn-ghost" type="button" data-product-edit="${item.sku}">${t.edit}</button>
              <button class="btn btn-ghost btn-danger" type="button" data-product-delete="${item.sku}">${t.del}</button>
            </td>
          </tr>
        `
      )
      .join("")}
      </tbody>
    </table>
  `;
}

function renderPermissionCheckboxes(targetWrap, selected = []) {
  if (!targetWrap) return;
  const selectedSet = new Set(selected);
  const permissions = auth.getPermissionsCatalog ? auth.getPermissionsCatalog() : [];
  targetWrap.innerHTML = permissions
    .map(
      (permission) => `
      <label class="permission-item">
        <input type="checkbox" name="permissions" value="${permission}" ${selectedSet.has(permission) ? "checked" : ""}>
        <span>${permissionLabel(permission)}</span>
      </label>
    `
    )
    .join("");
}

function getCheckedPermissions(formEl) {
  return Array.from(formEl.querySelectorAll('input[name="permissions"]:checked')).map((input) => input.value);
}

function getGroupsMode() {
  const active = document.querySelector("[data-groups-subtab].is-active");
  const key = active?.dataset?.groupsSubtab || "create";
  if (key === "edit") return "edit";
  if (key === "delete") return "delete";
  if (key === "matrix") return "matrix";
  return "create";
}

function renderGroups() {
  if (!groupsWrap || !auth.listGroups) return;
  const mode = getGroupsMode();
  const groups = auth.listGroups();
  if (groupsModeTitle) {
    const t = tt();
    groupsModeTitle.textContent =
      mode === "edit" ? t.static.groupsModeEdit : mode === "delete" ? t.static.groupsModeDelete : t.static.groupsModeMatrix;
  }
  groupsWrap.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Name</th><th>Permissions</th><th>Actions</th></tr></thead>
      <tbody>
        ${groups
      .map((group) => {
        const perms = (group.permissions || []).map(permissionLabel).map((item) => escapeHtml(item)).join(", ");
        const actions = group.isProtected
          ? "System"
          : mode === "edit"
            ? `<button class="btn btn-ghost" type="button" data-group-edit="${group.id}">${tt().edit}</button>`
            : mode === "delete"
              ? `<button class="btn btn-danger" type="button" data-group-delete="${group.id}">${tt().del}</button>`
              : "-";
        return `<tr><td>${escapeHtml(group.id)}</td><td>${escapeHtml(group.name)}</td><td>${perms || "-"}</td><td class="admin-actions">${actions}</td></tr>`;
      })
      .join("")}
      </tbody>
    </table>
  `;
}

function renderFilterSettings() {
  const settings = store?.getFilterSettings ? store.getFilterSettings() : { categories: [], mechanisms: [], brands: [] };
  const fillSelect = (formEl, name, values, fallback) => {
    const select = formEl?.querySelector(`[name="${name}"]`);
    if (!select) return;
    const current = select.value;
    const merged = [...new Set([...(values || []), ...(fallback || [])])].filter(Boolean);
    select.innerHTML = merged.map((value) => `<option value="${value}">${value}</option>`).join("");
    if (merged.includes(current)) select.value = current;
  };

  const renderGroup = (wrap, groupKey, values) => {
    if (!wrap) return;
    wrap.innerHTML = values
      .map(
        (value, index) =>
          `<span class="chip admin-filter-chip">
            <span>${value}</span>
            <button type="button" class="chip-mini" data-filter-move="${groupKey}" data-filter-value="${value}" data-filter-direction="up" ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="chip-mini" data-filter-move="${groupKey}" data-filter-value="${value}" data-filter-direction="down" ${index === values.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="chip-mini" data-filter-remove="${groupKey}" data-filter-value="${value}" title="Remove">×</button>
          </span>`
      )
      .join("");
  };

  renderGroup(filterCategoriesList, "categories", settings.categories || []);
  renderGroup(filterMechanismsList, "mechanisms", settings.mechanisms || []);
  renderGroup(filterBrandsList, "brands", settings.brands || []);
  fillSelect(createProductForm, "category", settings.categories, ["original", "design"]);
  fillSelect(editProductForm, "category", settings.categories, ["original", "design"]);
}

function setProductsSubtab(target) {
  const key = String(target || "create");
  document.querySelectorAll("[data-products-subtab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.productsSubtab === key);
  });
  document.querySelectorAll("[data-products-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.productsPanel !== key;
  });
}

function setUsersSubtab(target) {
  const key = String(target || "create");
  const panelKey = key === "roles" || key === "block" ? "users" : key;
  document.querySelectorAll("[data-users-subtab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.usersSubtab === key);
  });
  document.querySelectorAll("[data-users-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.usersPanel !== panelKey;
  });
  if (key !== "groups" && editGroupForm) editGroupForm.hidden = true;
  if (key !== "assign" && userGroupsForm) userGroupsForm.hidden = true;
  renderUsers();
}

function setGroupsSubtab(target) {
  const key = String(target || "create");
  const panelKey = key === "create" ? "create" : "manage";
  document.querySelectorAll("[data-groups-subtab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.groupsSubtab === key);
  });
  document.querySelectorAll("[data-groups-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.groupsPanel !== panelKey;
  });
  if (key !== "edit" && editGroupForm) editGroupForm.hidden = true;
  renderGroups();
}

function renderOrders() {
  const t = tt();
  const ex = xt();
  const filters = searchState.orders;
  const allOrders = auth.listAllOrders();
  const orderDisplayIds = buildDisplayIdMap(allOrders, "id");
  const orders = allOrders.filter((order) => {
    const publicUser = auth.getPublicUserProfile(order.userId);
    const rowText = [
      orderDisplayIds[order.id],
      order.status,
      publicUser?.name,
      publicUser?.role,
      order.customer?.name,
      order.customer?.email,
      order.customer?.phone,
      order.customer?.city,
      order.customer?.addressLine,
      order.note
    ]
      .join(" ")
      .toLowerCase();
    if (filters.q && !rowText.includes(filters.q)) return false;
    if (filters.id && !safeLower(orderDisplayIds[order.id]).includes(filters.id)) return false;
    if (filters.user) {
      const userText = [publicUser?.name, publicUser?.role, order.customer?.name, order.customer?.email, order.customer?.phone]
        .join(" ")
        .toLowerCase();
      if (!userText.includes(filters.user)) return false;
    }
    if (filters.status && safeLower(order.status) !== filters.status) return false;
    if ((filters.dateFrom || filters.dateTo) && !dateInRange(toIsoDate(order.createdAt), filters.dateFrom, filters.dateTo)) {
      return false;
    }
    return true;
  });
  const products = new Map(store.getAllProducts().map((p) => [p.sku, p]));
  const statuses = auth.getOrderStatuses ? auth.getOrderStatuses() : ["pending", "processing", "shipped", "delivered", "cancelled"];
  ordersWrap.innerHTML = `
    <div class="cards admin-orders-grid">
      ${orders
      .map((order) => {
        const publicUser = auth.getPublicUserProfile(order.userId);
        const items = (order.items || [])
          .map((i) => {
            const product = products.get(i.sku);
            const image = product?.images?.[0] || "";
            const productName = product?.name || i.sku;
            const variantText = i.variantLabel ? ` (${i.variantLabel})` : "";
            return `
                <div class="order-item-row">
                  ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(productName)}" class="order-item-img">` : ""}
                  <div>
                    <a href="product.html?sku=${encodeURIComponent(i.sku)}" class="order-item-name">${escapeHtml(productName)}</a>${escapeHtml(variantText)}
                    <span class="order-item-qty">x${Math.max(1, Number(i.qty) || 1)} ${unitLabel(i.unitType)}</span>
                  </div>
                </div>
              `;
          })
          .join("");
        const mapUrl = order.customer?.lat && order.customer?.lng
          ? `https://maps.google.com/?q=${order.customer.lat},${order.customer.lng}`
          : `https://maps.google.com/?q=${encodeURIComponent(order.customer?.addressLine || order.customer?.city || "")}`;

        const contactHtml = `
            ${order.customer?.phone ? `<div class="contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> <span>${escapeHtml(order.customer.phone)}</span></div>` : ""}
            ${order.customer?.email ? `<div class="contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> <span><a href="mailto:${escapeHtml(order.customer.email)}">${escapeHtml(order.customer.email)}</a></span></div>` : ""}
            ${(order.customer?.addressLine || order.customer?.city) ? `<div class="contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span><a href="${mapUrl}" target="_blank" class="address-link">${escapeHtml([order.customer.city, order.customer.addressLine].filter(Boolean).join(", "))}</a></span></div>` : ""}
          `;

        return `
      <article class="order-card" data-order-id="${order.id}">
        <div class="order-card-head">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" class="admin-order-select" data-order-id="${order.id}">
            <strong>#${orderDisplayIds[order.id] || "-"}</strong>
          </div>
          <span class="order-card-date">${formatDate(order.createdAt)}</span>
        </div>
              <div class="order-card-body">
                <div class="order-section order-user-profile">
                  <div class="order-user-details">
                    <div class="order-user-firstname">${escapeHtml(publicUser ? publicUser.name : (order.customer?.name || order.userId))}</div>
                    <div class="order-user-lastname">${escapeHtml(publicUser?.surname || order.customer?.surname || "")}</div>
                  </div>
                  ${publicUser?.avatarUrl ? `<img src="${escapeHtml(publicUser.avatarUrl)}" class="order-user-avatar" alt="">` : `<div class="order-user-avatar-empty"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`}
                </div>
                <div class="order-section">
                  <div class="order-contact-list">${contactHtml || "-"}</div>
                </div>
                <div class="order-section">
                  <span class="order-section-lbl">${ex.product}</span>
                  <div class="order-items-list">${items || "-"}</div>
                </div>
                ${order.promoCode ? `
                <div class="order-section order-note-section">
                  <span class="order-section-lbl">Promo Applied</span>
                  <div class="order-note">${escapeHtml(order.promoCode)} (-${escapeHtml(String(order.promoDiscount))}%)</div>
                </div>` : ""}
                ${order.note ? `
                <div class="order-section order-note-section">
                  <span class="order-section-lbl">${ex.note}</span>
                  <div class="order-note">${escapeHtml(order.note)}</div>
                </div>` : ""}
              </div>
              <div class="order-card-foot">
                <select class="order-status-select" data-order-status="${order.id}">
                  ${statuses
            .map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`)
            .join("")}
                </select>
                <button class="btn btn-danger btn-sm" type="button" data-order-delete="${order.id}" aria-label="${t.del}">🗑</button>
              </div>
            </article>
          `;
      })
      .join("")}
    </div>
  `;
}

function renderLogs() {
  const t = tt();
  const filters = searchState.logs;
  const users = auth.listUsers();
  const userMap = new Map(users.map((user) => [user.id, user]));
  const logs = auth
    .listLogs()
    .slice(0, 300)
    .filter((log) => {
      const actor = userMap.get(log.actorUserId);
      const target = userMap.get(log.targetUserId);
      const rowText = [
        log.type,
        actor?.name,
        actor?.email,
        target?.name,
        target?.email,
        JSON.stringify(log.details || {})
      ]
        .join(" ")
        .toLowerCase();
      if (filters.q && !rowText.includes(filters.q)) return false;
      if (filters.type && !safeLower(log.type).includes(filters.type)) return false;
      if (filters.actor) {
        const actorText = [actor?.name, actor?.email].join(" ").toLowerCase();
        if (!actorText.includes(filters.actor)) return false;
      }
      if (filters.target) {
        const targetText = [target?.name, target?.email].join(" ").toLowerCase();
        if (!targetText.includes(filters.target)) return false;
      }
      if ((filters.dateFrom || filters.dateTo) && !dateInRange(toIsoDate(log.createdAt), filters.dateFrom, filters.dateTo)) {
        return false;
      }
      return true;
    });

  logsWrap.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>${t.headers.logs.date}</th><th>${t.headers.logs.action}</th><th>${t.headers.logs.actor}</th><th>${t.headers.logs.target}</th><th>${t.headers.logs.details}</th></tr></thead>
      <tbody>
        ${logs
      .map((log) => {
        const actor = userMap.get(log.actorUserId);
        const target = userMap.get(log.targetUserId);
        return `
              <tr>
                <td>${formatDate(log.createdAt)}</td>
                <td>${escapeHtml(log.type)}</td>
                <td>${actor ? `${escapeHtml(actor.name)} (${escapeHtml(actor.email)})` : "-"}</td>
                <td>${target ? `${escapeHtml(target.name)} (${escapeHtml(target.email)})` : "-"}</td>
                <td>${escapeHtml(JSON.stringify(log.details || {}))}</td>
              </tr>
            `;
      })
      .join("")}
      </tbody>
    </table>
  `;
}

function renderContacts() {
  const filterQuery = searchState.messages.q;
  const contacts = auth.getInboxContacts().filter((user) => {
    if (!filterQuery) return true;
    const thread = auth.getConversation(user.id);
    const content = [user.name, user.email, ...thread.map((msg) => msg.text)].join(" ").toLowerCase();
    return content.includes(filterQuery);
  });
  if (selectedContactId && !contacts.some((contact) => contact.id === selectedContactId)) selectedContactId = "";
  contactsWrap.innerHTML = contacts
    .map(
      (user) =>
        `<a class="admin-contact" href="messages.html?contact=${encodeURIComponent(user.id)}">${escapeHtml(user.name)}</a>`
    )
    .join("");
  if (!contacts.length) contactsWrap.innerHTML = `<p>${escapeHtml(xt().noChats)}</p>`;
}

function renderChat() {
  const t = tt();
  if (!selectedContactId) {
    chatWrap.innerHTML = `<p>${t.selectContact}</p>`;
    return;
  }

  const me = auth.getCurrentUser();
  const thread = auth.getConversation(selectedContactId);
  chatWrap.innerHTML = thread
    .map((msg) => {
      const mine = msg.fromUserId === me.id;
      return `<div class="chat-msg${mine ? " is-mine" : ""}"><p>${escapeHtml(msg.text)}</p><span>${formatDate(msg.createdAt)}</span></div>`;
    })
    .join("");
}

let adminRevChart = null;
let adminUsrChart = null;

function renderDashboard() {
  const t = tt();
  const summaryTitle = document.querySelector("#admin-tab-dashboard h2");
  const revLabel = document.querySelector("#admin-stat-revenue + span");
  const ordLabel = document.querySelector("#admin-stat-orders + span");
  const usrLabel = document.querySelector("#admin-stat-users + span");
  const prodLabel = document.querySelector("#admin-stat-products + span");
  const visLabel = document.querySelector("#admin-stat-visits + span");
  const topProdTitle = document.querySelector("#admin-tab-dashboard h3");

  if (summaryTitle) summaryTitle.textContent = t.static.dashboardOverview || "Store Overview";
  if (revLabel) revLabel.textContent = t.static.totalRevenue || "Total Revenue";
  if (ordLabel) ordLabel.textContent = t.static.totalOrders || "Total Orders";
  if (usrLabel) usrLabel.textContent = t.static.totalUsers || "Total Users";

  const isRu = (t.static.totalOrders === "Всего заказов");
  const isAz = (t.static.totalOrders === "Umumi Sifaris");

  if (prodLabel) prodLabel.textContent = t.static.totalProducts || (isAz ? "Bütün Məhsullar" : (isRu ? "Все товары" : "Total Products"));
  if (visLabel) visLabel.textContent = t.static.totalVisits || (isAz ? "Bütün Baxışlar" : (isRu ? "Все просмотры" : "Total Visits"));
  if (topProdTitle) topProdTitle.textContent = t.static.topProducts || "Top Products";

  const revEl = document.getElementById("admin-stat-revenue");
  const ordEl = document.getElementById("admin-stat-orders");
  const usrEl = document.getElementById("admin-stat-users");
  const prodEl = document.getElementById("admin-stat-products");
  const visEl = document.getElementById("admin-stat-visits");
  const topProductsEl = document.getElementById("admin-stat-top-products");

  if (!revEl || !ordEl || !usrEl || !prodEl || !visEl) return;

  const orders = auth.listAllOrders();
  const users = auth.listUsers();
  const products = store.getAllProducts ? store.getAllProducts() : [];

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status === "cancelled") return sum;
    const orderTotal = (order.items || []).reduce((s, item) => s + (Number(item.qty) * Number(item.unitPrice)), 0);
    return sum + orderTotal;
  }, 0);

  revEl.textContent = `${totalRevenue.toFixed(2)} AZN`;
  ordEl.textContent = String(orders.length);
  usrEl.textContent = String(users.length);
  prodEl.textContent = String(products.length);

  const viewCounts = auth.getProductViewCounts ? auth.getProductViewCounts() : {};
  const totalVisits = Object.values(viewCounts).reduce((sum, count) => sum + count, 0);
  visEl.textContent = String(totalVisits);

  if (topProductsEl) {
    const sortedSkus = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sortedSkus.length === 0) {
      topProductsEl.innerHTML = `<li>${t.noViewsYet || "No views yet."}</li>`;
    } else {
      const maxViews = Math.max(...sortedSkus.map(s => s[1]), 1);
      topProductsEl.innerHTML = sortedSkus.map(([sku, count]) => {
        const product = store.getProductBySku(sku);
        const name = product ? product.name : sku;
        const pct = Math.max(5, (count / maxViews) * 100);
        return `<li style="display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--line); border-radius: 8px; position: relative; overflow: hidden; background: #fafafa; min-height: 48px; justify-content: center;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; background: rgba(0, 123, 255, 0.1); width: ${pct}%; z-index: 0; transition: width 0.3s ease;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <span style="font-weight: 500">${escapeHtml(name)}</span>
            <span class="chip" style="background: rgba(0,123,255,0.1); color: #007bff; border-color: transparent;">${count}</span>
          </div>
        </li>`;
      }).join("");
    }
  }

  /* CHARTS INJECTION */
  if (typeof Chart === "undefined") return;

  const revCtx = document.getElementById("admin-chart-revenue");
  const usrCtx = document.getElementById("admin-chart-users");

  if (revCtx) {
    if (adminRevChart) adminRevChart.destroy();

    // Aggregate past 6 months revenue
    const pOrders = orders.filter(o => o.status !== "cancelled");
    const mRev = {};
    const mNames = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
      mRev[mStr] = 0;
      mNames.push(mStr);
    }

    pOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const mStr = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
      if (mRev[mStr] !== undefined) {
        const orderTotal = (o.items || []).reduce((s, item) => s + (Number(item.qty) * Number(item.unitPrice)), 0);
        mRev[mStr] += orderTotal;
      }
    });

    adminRevChart = new Chart(revCtx, {
      type: "line",
      data: {
        labels: mNames,
        datasets: [{
          label: isAz ? "Gəlir (AZN)" : isRu ? "Доход (AZN)" : "Revenue (AZN)",
          data: mNames.map(m => mRev[m]),
          borderColor: "#c7aa79",
          backgroundColor: "rgba(199, 170, 121, 0.2)",
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (usrCtx) {
    if (adminUsrChart) adminUsrChart.destroy();
    const mUsr = {};
    const mNames = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
      mUsr[mStr] = 0;
      mNames.push(mStr);
    }
    users.forEach(u => {
      const d = new Date(u.createdAt);
      const mStr = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
      if (mUsr[mStr] !== undefined) mUsr[mStr]++;
    });

    adminUsrChart = new Chart(usrCtx, {
      type: "bar",
      data: {
        labels: mNames,
        datasets: [{
          label: isAz ? "Yeni İstifadəçilər" : isRu ? "Новые пользователи" : "New Users",
          data: mNames.map(m => mUsr[m]),
          backgroundColor: "#6f42c1",
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

function renderSettings() {
  const container = document.getElementById("admin-banners-list");
  if (!container || !auth.getSettings) return;

  const t = tt();
  const titleEl = document.querySelector("#admin-tab-settings h2");
  const heroEl = document.querySelector("#admin-tab-settings h3");
  const heroDescEl = document.querySelector("#admin-tab-settings p");
  const saveBtn = document.querySelector("#admin-banners-form button[type='submit']");

  const isRu = (t.static.totalOrders === "Всего заказов");
  const isAz = (t.static.totalOrders === "Umumi Sifaris");

  if (titleEl) titleEl.textContent = isAz ? "Mağaza Tənzimləmələri" : (isRu ? "Настройки магазина" : "Store Settings");
  if (heroEl) heroEl.textContent = isAz ? "Ana səhifə banerləri" : (isRu ? "Баннеры на главной (Слайдер)" : "Home Banners (Hero Slider)");
  if (heroDescEl) heroDescEl.textContent = isAz ? "Ana səhifə üçün 3 baner təyin edin. Mətni gizlətmək üçün başlığı boş saxlayın." : (isRu ? "Установите 3 баннера для главной страницы. Оставьте заголовок пустым, чтобы скрыть текст." : "Set 3 banners to display on the home page. Leave title empty to hide text.");
  if (saveBtn) saveBtn.textContent = isAz ? "Banerləri saxla" : (isRu ? "Сохранить баннеры" : "Save Banners");

  const settings = auth.getSettings();
  const banners = Array.isArray(settings.homeBanners) ? settings.homeBanners : [{}, {}, {}];

  const lblImg = isAz ? "Şəkil URL" : (isRu ? "URL изображения" : "Image URL");
  const lblTitle = isAz ? "Başlıq" : (isRu ? "Заголовок" : "Title");
  const lblSub = isAz ? "Alt başlıq" : (isRu ? "Подзаголовок" : "Subtitle");
  const lblLink = isAz ? "Keçid (Link)" : (isRu ? "Ссылка" : "Link");
  const bannerName = isAz ? "Baner" : (isRu ? "Баннер" : "Banner");

  container.innerHTML = [0, 1, 2].map(i => {
    const b = banners[i] || {};
    return `
      <div style="border: 1px solid var(--line); padding: 24px; border-radius: 12px; background: #fafafa; display: flex; flex-direction: column; gap: 16px;">
        <h4 style="margin: 0; font-size: 1.15rem; border-bottom: 2px solid var(--primary); padding-bottom: 8px; display: inline-block;">${bannerName} ${i + 1}</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 500; font-size: 0.95rem;">${lblImg}</span>
            <input type="text" name="b${i}_img" value="${escapeHtml(b.img || "")}" placeholder="../assets/images/banner_${i + 1}.webp" style="padding: 10px; border: 1px solid var(--line); border-radius: 8px;">
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 500; font-size: 0.95rem;">${lblTitle}</span>
            <input type="text" name="b${i}_title" value="${escapeHtml(b.title || "")}" placeholder="Optional Title" style="padding: 10px; border: 1px solid var(--line); border-radius: 8px;">
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 500; font-size: 0.95rem;">${lblSub}</span>
            <input type="text" name="b${i}_sub" value="${escapeHtml(b.sub || "")}" placeholder="Optional Subtitle" style="padding: 10px; border: 1px solid var(--line); border-radius: 8px;">
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 500; font-size: 0.95rem;">${lblLink}</span>
            <input type="text" name="b${i}_link" value="${escapeHtml(b.link || "")}" placeholder="pages/catalog.html" style="padding: 10px; border: 1px solid var(--line); border-radius: 8px;">
          </label>
        </div>
      </div>
    `;
  }).join("");
}

function renderAll() {
  const t = tt();
  const ex = xt();
  const map = {
    "admin-title": t.title,
    "admin-intro": t.intro,
    "admin-tab-dashboard-btn": t.tabs.dashboard,
    "admin-tab-users-btn": t.tabs.users,
    "admin-tab-products-btn": t.tabs.products,
    "admin-tab-orders-btn": t.tabs.orders,
    "admin-tab-messages-btn": t.tabs.messages,
    "admin-tab-logs-btn": t.tabs.logs,
    "admin-tab-promos-btn": t.tabs.promos,
    "admin-tab-settings-btn": t.tabs.settings,
    "admin-users-create-title": t.static.usersCreateTitle,
    "admin-users-list-title": t.static.usersListTitle,
    "admin-users-assign-title": t.static.usersAssignTitle,
    "admin-users-subtab-create-btn": t.static.usersSubtabCreate,
    "admin-users-subtab-users-btn": t.static.usersSubtabUsers,
    "admin-users-subtab-roles-btn": t.static.usersSubtabRoles,
    "admin-users-subtab-block-btn": t.static.usersSubtabBlock,
    "admin-users-subtab-assign-btn": t.static.usersSubtabAssign,
    "admin-users-subtab-groups-btn": t.static.usersSubtabGroups,
    "admin-users-subtab-access-btn": t.static.usersSubtabAccess,
    "admin-groups-subtab-create-btn": t.static.groupsSubtabCreate,
    "admin-groups-subtab-edit-btn": t.static.groupsSubtabEdit,
    "admin-groups-subtab-delete-btn": t.static.groupsSubtabDelete,
    "admin-groups-subtab-matrix-btn": t.static.groupsSubtabMatrix,
    "admin-groups-title": t.static.groupsTitle,
    "admin-group-name-label": t.static.groupName,
    "admin-group-edit-name-label": t.static.groupName,
    "admin-group-create-btn": t.static.groupCreate,
    "admin-group-save-btn": t.static.groupSave,
    "admin-group-cancel-btn": t.static.groupCancel,
    "admin-user-groups-title": t.static.groupAssignTitle,
    "admin-user-groups-save-btn": t.static.groupAssignSave,
    "admin-user-groups-cancel-btn": t.static.groupCancel,
    "admin-access-title": t.static.accessTitle,
    "admin-access-json-label": t.static.accessJson,
    "admin-access-export-btn": t.static.accessExport,
    "admin-access-import-btn": t.static.accessImport,
    "admin-access-file-label": t.static.accessLoadFile,
    "admin-products-create-title": t.static.productsCreateTitle,
    "admin-products-edit-title": t.static.productsEditTitle,
    "admin-products-list-title": t.static.productsListTitle,
    "admin-filters-title": t.static.filtersTitle,
    "admin-orders-title": t.static.ordersTitle,
    "admin-messages-title": t.static.messagesTitle,
    "admin-logs-title": t.static.logsTitle,
    "admin-create-user-btn": t.static.createUser,
    "admin-create-product-btn": t.static.createProduct,
    "admin-edit-save-btn": t.static.saveChanges,
    "admin-edit-cancel": t.static.cancel,
    "admin-send-btn": t.static.send,
    "admin-label-user-name": t.static.userName,
    "admin-label-user-email": t.static.userEmail,
    "admin-label-user-password": t.static.userPassword,
    "admin-label-user-phone": t.static.userPhone,
    "admin-label-user-birth-date": ex.birthDate,
    "admin-label-user-role": t.static.userRole,
    "admin-users-search-label": ex.search,
    "admin-users-filter-id-label": ex.userId,
    "admin-users-filter-name-label": ex.name,
    "admin-users-filter-email-label": ex.email,
    "admin-users-filter-role-label": ex.role,
    "admin-users-filter-status-label": ex.status,
    "admin-users-filter-group-label": ex.group,
    "admin-users-filter-birth-from-label": ex.birthFrom,
    "admin-users-filter-birth-to-label": ex.birthTo,
    "admin-products-search-label": ex.search,
    "admin-products-filter-sku-label": ex.sku,
    "admin-products-filter-name-label": ex.name,
    "admin-products-filter-brand-label": ex.brand,
    "admin-products-filter-category-label": ex.category,
    "admin-orders-search-label": ex.search,
    "admin-orders-filter-id-label": ex.orderId,
    "admin-orders-filter-user-label": ex.user,
    "admin-orders-filter-status-label": ex.status,
    "admin-orders-filter-date-from-label": ex.dateFrom,
    "admin-orders-filter-date-to-label": ex.dateTo,
    "admin-messages-search-label": ex.searchChats,
    "admin-logs-search-label": ex.search,
    "admin-logs-filter-type-label": ex.actionType,
    "admin-logs-filter-actor-label": ex.actor,
    "admin-logs-filter-target-label": ex.target,
    "admin-logs-filter-date-from-label": ex.dateFrom,
    "admin-logs-filter-date-to-label": ex.dateTo,
    "admin-label-product-name": t.static.productName,
    "admin-label-product-sku": t.static.productSku,
    "admin-label-product-brand": t.static.productBrand,
    "admin-label-product-price": t.static.productPrice,
    "admin-label-product-category": t.static.productCategory,
    "admin-label-product-type": t.static.productType,
    "admin-label-product-unit-type": t.static.productUnitType,
    "admin-label-product-mechanism": t.static.productMechanism,
    "admin-label-product-status": t.static.productStatus,
    "admin-label-product-image": t.static.productImage,
    "admin-label-product-variants": t.static.productVariants,
    "admin-label-product-short": t.static.productShort,
    "admin-label-product-full": t.static.productFull,
    "admin-label-product-short-az": t.static.productShortAz,
    "admin-label-product-short-ru": t.static.productShortRu,
    "admin-label-product-short-en": t.static.productShortEn,
    "admin-label-product-full-az": t.static.productFullAz,
    "admin-label-product-full-ru": t.static.productFullRu,
    "admin-label-product-full-en": t.static.productFullEn,
    "admin-label-product-features-az": t.static.productFeaturesAz,
    "admin-label-product-features-ru": t.static.productFeaturesRu,
    "admin-label-product-features-en": t.static.productFeaturesEn,
    "admin-label-product-images": t.static.productImages,
    "admin-label-product-videos": t.static.productVideos,
    "admin-label-product-instagram": t.static.productInstagram,
    "admin-label-edit-name": t.static.productName,
    "admin-label-edit-sku": t.static.productSku,
    "admin-label-edit-brand": t.static.productBrand,
    "admin-label-edit-price": t.static.productPrice,
    "admin-label-edit-category": t.static.productCategory,
    "admin-label-edit-product-type": t.static.productType,
    "admin-label-edit-unit-type": t.static.productUnitType,
    "admin-label-edit-mechanism": t.static.productMechanism,
    "admin-label-edit-status": t.static.productStatus,
    "admin-label-edit-image": t.static.productImage,
    "admin-label-edit-variants": t.static.productVariants,
    "admin-label-edit-short": t.static.productShort,
    "admin-label-edit-full": t.static.productFull,
    "admin-label-edit-short-az": t.static.productShortAz,
    "admin-label-edit-short-ru": t.static.productShortRu,
    "admin-label-edit-short-en": t.static.productShortEn,
    "admin-label-edit-full-az": t.static.productFullAz,
    "admin-label-edit-full-ru": t.static.productFullRu,
    "admin-label-edit-full-en": t.static.productFullEn,
    "admin-label-edit-features-az": t.static.productFeaturesAz,
    "admin-label-edit-features-ru": t.static.productFeaturesRu,
    "admin-label-edit-features-en": t.static.productFeaturesEn,
    "admin-label-edit-images": t.static.productImages,
    "admin-label-edit-videos": t.static.productVideos,
    "admin-label-edit-instagram": t.static.productInstagram,
    "admin-filter-categories-label": t.static.filterCategory,
    "admin-filter-mechanisms-label": t.static.filterMechanism,
    "admin-filter-brands-label": t.static.filterBrand,
    "admin-filter-categories-btn": t.static.addCategory,
    "admin-filter-mechanisms-btn": t.static.addMechanism,
    "admin-filter-brands-btn": t.static.addBrand,
    "admin-products-subtab-create-btn": t.static.subtabCreate,
    "admin-products-subtab-edit-btn": t.static.subtabEdit,
    "admin-products-subtab-filters-btn": t.static.subtabFilters,
    "admin-products-subtab-list-btn": t.static.subtabList
  };
  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });
  const sendArea = document.querySelector("#admin-send-form textarea[name='text']");
  if (sendArea) sendArea.setAttribute("placeholder", t.static.messagePlaceholder);
  const placeholders = {
    "#admin-users-search": ex.search,
    "#admin-users-filter-id": ex.userId,
    "#admin-users-filter-name": ex.name,
    "#admin-users-filter-email": ex.email,
    "#admin-users-filter-group": ex.group,
    "#admin-products-search": ex.search,
    "#admin-products-filter-sku": ex.sku,
    "#admin-products-filter-name": ex.name,
    "#admin-products-filter-brand": ex.brand,
    "#admin-orders-search": ex.search,
    "#admin-orders-filter-id": ex.orderId,
    "#admin-orders-filter-user": ex.user,
    "#admin-messages-search": ex.searchChats,
    "#admin-logs-search": ex.search,
    "#admin-logs-filter-type": ex.actionType,
    "#admin-logs-filter-actor": ex.actor,
    "#admin-logs-filter-target": ex.target
  };
  Object.entries(placeholders).forEach(([selector, text]) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("placeholder", text);
  });
  const allText = { az: "Hamisi", ru: "Все", en: "All" }[localStorage.getItem("watchtopia-language") || "az"] || "All";
  document.querySelectorAll("select option[value='']").forEach((option) => {
    option.textContent = allText;
  });
  if (!document.querySelector("[data-users-subtab].is-active")) setUsersSubtab("create");
  if (!document.querySelector("[data-groups-subtab].is-active")) setGroupsSubtab("create");
  if (!document.querySelector("[data-products-subtab].is-active")) setProductsSubtab("create");
  const usersMode = getUsersActionMode();
  const usersTitle = document.getElementById("admin-users-list-title");
  if (usersTitle) {
    usersTitle.textContent =
      usersMode === "roles"
        ? t.static.usersRolesTitle
        : usersMode === "block"
          ? t.static.usersBlockTitle
          : t.static.usersListTitle;
  }
  renderPermissionCheckboxes(groupPermissionsWrap);
  renderUsers();
  renderGroups();
  renderProducts();
  renderFilterSettings();
  renderOrders();
  renderLogs();
  renderContacts();
  renderChat();
  renderDashboard();
  renderSettings();
  renderPromos();
  renderComments();
  renderNewsletter();
  renderFilterSettings();
  syncProductTypeAndUnitFields(createProductForm);
  syncProductTypeAndUnitFields(editProductForm);
}

document.getElementById("admin-tabs")?.addEventListener("click", (event) => {
  const tabBtn = event.target.closest("[data-admin-tab]");
  if (!tabBtn) return;
  const tab = tabBtn.dataset.adminTab;
  document.querySelectorAll("[data-admin-tab]").forEach((btn) => btn.classList.toggle("is-active", btn === tabBtn));
  document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.adminPanel !== tab;
  });
  if (tab === "comments") renderComments();
  if (tab === "newsletter") renderNewsletter();
});

productsSubtabs?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-products-subtab]");
  if (!btn) return;
  setProductsSubtab(btn.dataset.productsSubtab);
});

usersSubtabs?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-users-subtab]");
  if (!btn) return;
  setUsersSubtab(btn.dataset.usersSubtab);
});

groupsSubtabs?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-groups-subtab]");
  if (!btn) return;
  setGroupsSubtab(btn.dataset.groupsSubtab);
});

document.getElementById("admin-create-user-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  try {
    auth.createUserByAdmin({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      phone: String(formData.get("phone") || ""),
      role: String(formData.get("role") || "CUSTOMER"),
      birthDate: String(formData.get("birthDate") || "")
    });
    event.currentTarget.reset();
    setAdminMessage(tt().userCreated, "success");
    renderAll();
  } catch (error) {
    setAdminMessage(error?.message || tt().userCreateFail, "error");
  }
});

createGroupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    auth.createGroup({
      name: String(formData.get("name") || "").trim(),
      permissions: getCheckedPermissions(event.currentTarget)
    });
    event.currentTarget.reset();
    renderPermissionCheckboxes(groupPermissionsWrap);
    setGroupsSubtab("create");
    renderGroups();
    renderUsers();
    setUsersSubtab("groups");
    setAdminMessage(tt().groupCreate, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

editGroupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    auth.updateGroup(String(formData.get("groupId") || ""), {
      name: String(formData.get("name") || "").trim(),
      permissions: getCheckedPermissions(event.currentTarget)
    });
    editGroupForm.hidden = true;
    setGroupsSubtab("edit");
    setUsersSubtab("groups");
    renderGroups();
    renderUsers();
    setAdminMessage(tt().groupSave, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

document.getElementById("admin-group-cancel-btn")?.addEventListener("click", () => {
  if (editGroupForm) editGroupForm.hidden = true;
  setGroupsSubtab("edit");
  setUsersSubtab("groups");
});

userGroupsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const userId = String(formData.get("userId") || "");
    const groupIds = Array.from(event.currentTarget.querySelectorAll('input[name="groupIds"]:checked')).map((input) => input.value);
    auth.assignUserGroups(userId, groupIds);
    userGroupsForm.hidden = true;
    setUsersSubtab("assign");
    renderUsers();
    setAdminMessage(tt().groupAssignSave, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

document.getElementById("admin-user-groups-cancel-btn")?.addEventListener("click", () => {
  if (userGroupsForm) userGroupsForm.hidden = true;
  setUsersSubtab("assign");
});

createProductForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const created = store.addProduct(readProductForm(event.currentTarget));
    auth.logAction("product_created", { actorUserId: auth.getCurrentUser()?.id || null, details: { sku: created.sku } });
    event.currentTarget.reset();
    setAdminMessage(tt().productCreated, "success");
    renderProducts();
    renderFilterSettings();
    renderLogs();
  } catch (error) {
    setAdminMessage(error?.message || tt().productCreateFail, "error");
  }
});

editProductForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const originalSku = String(new FormData(event.currentTarget).get("originalSku") || "").trim();
    const updated = store.updateProduct(originalSku, readProductForm(event.currentTarget));
    auth.logAction("product_updated", { actorUserId: auth.getCurrentUser()?.id || null, details: { sku: updated.sku } });
    setAdminMessage(tt().productUpdated, "success");
    editProductForm.hidden = true;
    setProductsSubtab("list");
    renderProducts();
    renderFilterSettings();
    renderLogs();
  } catch (error) {
    setAdminMessage(error?.message || tt().productUpdateFail, "error");
  }
});

editCancelBtn?.addEventListener("click", () => {
  if (editProductForm) editProductForm.hidden = true;
  setProductsSubtab("list");
});

function bindFilterForm(formEl, groupKey) {
  formEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("value") || "").trim();
    if (!value) return;
    try {
      store.addFilterOption(groupKey, value);
      event.currentTarget.reset();
      setAdminMessage(tt().productUpdated, "success");
      renderFilterSettings();
    } catch (error) {
      setAdminMessage(error?.message || tt().operationFail, "error");
    }
  });
}

bindFilterForm(filterCategoriesForm, "categories");
bindFilterForm(filterMechanismsForm, "mechanisms");
bindFilterForm(filterBrandsForm, "brands");

document.addEventListener("click", (event) => {
  const moveBtn = event.target.closest("[data-filter-move]");
  if (moveBtn) {
    try {
      store.moveFilterOption(moveBtn.dataset.filterMove, moveBtn.dataset.filterValue, moveBtn.dataset.filterDirection);
      renderFilterSettings();
    } catch (error) {
      setAdminMessage(error?.message || tt().operationFail, "error");
    }
    return;
  }

  const removeBtn = event.target.closest("[data-filter-remove]");
  if (!removeBtn) return;
  try {
    store.removeFilterOption(removeBtn.dataset.filterRemove, removeBtn.dataset.filterValue);
    renderFilterSettings();
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

function bindSearchFilters(formEl, key, renderFn, mapping) {
  if (!formEl) return;
  const onUpdate = () => {
    Object.entries(mapping).forEach(([selector, targetKey]) => {
      const el = formEl.querySelector(selector);
      searchState[key][targetKey] = safeLower(el?.value || "").trim();
    });
    renderFn();
  };
  formEl.addEventListener("input", onUpdate);
  formEl.addEventListener("change", onUpdate);
}

function syncProductTypeAndUnitFields(formEl) {
  if (!formEl) return;
  const productTypeEl = formEl.elements.productType;
  const unitTypeEl = formEl.elements.unitType;
  const variantsEl = formEl.elements.variants;
  const featuresAzEl = formEl.elements.featuresAz;
  const featuresRuEl = formEl.elements.featuresRu;
  const featuresEnEl = formEl.elements.featuresEn;
  if (!productTypeEl || !unitTypeEl || !variantsEl) return;

  const apply = () => {
    const type = String(productTypeEl.value || "").toLowerCase();
    const lang = localStorage.getItem("watchtopia-language") || "az";
    const pieceWord = lang === "ru" ? "шт" : lang === "en" ? "pcs" : "ed";
    if (type === "perfume") {
      unitTypeEl.value = "gram";
      if (!String(variantsEl.value || "").trim()) {
        variantsEl.placeholder = "5 g | 19.9\n10 g | 34.9";
      }
      if (featuresAzEl) featuresAzEl.placeholder = "Qoxu notlari: sitrus, odun\nKonsentrasiya: EDP\nDavamlilik: 8 saat";
      if (featuresRuEl) featuresRuEl.placeholder = "Ноты: цитрус, древесные\nКонцентрация: EDP\nСтойкость: 8 часов";
      if (featuresEnEl) featuresEnEl.placeholder = "Notes: citrus, woody\nConcentration: EDP\nLongevity: 8 hours";
      return;
    }
    if (type === "glasses") {
      unitTypeEl.value = "piece";
      if (!String(variantsEl.value || "").trim()) {
        variantsEl.placeholder = `Standard ${pieceWord} | 59.9\nPremium ${pieceWord} | 89.9`;
      }
      if (featuresAzEl) featuresAzEl.placeholder = "Material: metal\nReng: qara\nUV qoruma: UV400";
      if (featuresRuEl) featuresRuEl.placeholder = "Материал: металл\nЦвет: черный\nUV защита: UV400";
      if (featuresEnEl) featuresEnEl.placeholder = "Material: metal\nColor: black\nUV protection: UV400";
      return;
    }
    if (type === "wallet") {
      unitTypeEl.value = "piece";
      if (!String(variantsEl.value || "").trim()) {
        variantsEl.placeholder = `Classic ${pieceWord} | 39.9\nPremium ${pieceWord} | 69.9`;
      }
      if (featuresAzEl) featuresAzEl.placeholder = "Material: deri\nKart bolmesi: 8\nReng: qehveyi";
      if (featuresRuEl) featuresRuEl.placeholder = "Материал: кожа\nОтделения для карт: 8\nЦвет: коричневый";
      if (featuresEnEl) featuresEnEl.placeholder = "Material: leather\nCard slots: 8\nColor: brown";
      return;
    }
    unitTypeEl.value = "piece";
    if (!String(variantsEl.value || "").trim()) {
      variantsEl.placeholder = `Standard ${pieceWord} | 49.9\nPremium ${pieceWord} | 79.9`;
    }
    if (featuresAzEl) featuresAzEl.placeholder = "Korpus: paslanmaz polad\nMexanizm: Quartz\nSu kecirmezlik: 3 ATM";
    if (featuresRuEl) featuresRuEl.placeholder = "Корпус: нерж. сталь\nМеханизм: Quartz\nВодозащита: 3 ATM";
    if (featuresEnEl) featuresEnEl.placeholder = "Case: stainless steel\nMovement: Quartz\nWater resistance: 3 ATM";
  };

  if (!formEl.dataset.typeSyncBound) {
    productTypeEl.addEventListener("change", apply);
    formEl.dataset.typeSyncBound = "1";
  }
  apply();
}

bindSearchFilters(usersFiltersForm, "users", renderUsers, {
  "#admin-users-search": "q",
  "#admin-users-filter-id": "id",
  "#admin-users-filter-name": "name",
  "#admin-users-filter-email": "email",
  "#admin-users-filter-role": "role",
  "#admin-users-filter-status": "status",
  "#admin-users-filter-group": "group",
  "#admin-users-filter-birth-from": "birthFrom",
  "#admin-users-filter-birth-to": "birthTo"
});

bindSearchFilters(productsFiltersForm, "products", renderProducts, {
  "#admin-products-search": "q",
  "#admin-products-filter-sku": "sku",
  "#admin-products-filter-name": "name",
  "#admin-products-filter-brand": "brand",
  "#admin-products-filter-category": "category"
});
bindSearchFilters(ordersFiltersForm, "orders", renderOrders, {
  "#admin-orders-search": "q",
  "#admin-orders-filter-id": "id",
  "#admin-orders-filter-user": "user",
  "#admin-orders-filter-status": "status",
  "#admin-orders-filter-date-from": "dateFrom",
  "#admin-orders-filter-date-to": "dateTo"
});
bindSearchFilters(logsFiltersForm, "logs", renderLogs, {
  "#admin-logs-search": "q",
  "#admin-logs-filter-type": "type",
  "#admin-logs-filter-actor": "actor",
  "#admin-logs-filter-target": "target",
  "#admin-logs-filter-date-from": "dateFrom",
  "#admin-logs-filter-date-to": "dateTo"
});
bindSearchFilters(messagesFiltersForm, "messages", () => {
  renderContacts();
  renderChat();
}, { "#admin-messages-search": "q" });

syncProductTypeAndUnitFields(createProductForm);
syncProductTypeAndUnitFields(editProductForm);

function handleUsersTableClick(event) {
  const blockBtn = event.target.closest("[data-user-block]");
  const groupsBtn = event.target.closest("[data-user-groups]");

  try {
    if (groupsBtn) {
      setUsersSubtab("assign");
      const userId = groupsBtn.dataset.userGroups;
      const userName = decodeURIComponent(groupsBtn.dataset.userName || "");
      const currentUser = auth.listUsers().find((user) => user.id === userId);
      const selected = new Set(currentUser?.groupIds || []);
      const groups = auth.listGroups();
      if (!userGroupsForm || !userGroupsListWrap || !userGroupsTitle) return;
      userGroupsForm.elements.userId.value = userId;
      userGroupsTitle.textContent = `${tt().groupAssignTitle}: ${userName}`;
      userGroupsListWrap.innerHTML = groups
        .map(
          (group) => `
            <label class="permission-item">
              <input type="checkbox" name="groupIds" value="${group.id}" ${selected.has(group.id) ? "checked" : ""} ${group.isProtected ? "disabled" : ""}>
              <span>${escapeHtml(group.name)}</span>
            </label>
          `
        )
        .join("");
      userGroupsForm.hidden = false;
      userGroupsForm.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (blockBtn) {
      const blocked = blockBtn.dataset.currentBlocked !== "true";
      auth.setUserBlocked(blockBtn.dataset.userBlock, blocked);
      setAdminMessage(blocked ? tt().blocked : tt().unblocked, "success");
      renderAll();
    }
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
}

usersWrap?.addEventListener("click", handleUsersTableClick);
usersAssignWrap?.addEventListener("click", handleUsersTableClick);

productsWrap?.addEventListener("click", (event) => {
  const editBtn = event.target.closest("[data-product-edit]");
  const deleteBtn = event.target.closest("[data-product-delete]");

  try {
    if (deleteBtn) {
      store.deleteProduct(deleteBtn.dataset.productDelete);
      auth.logAction("product_deleted", { actorUserId: auth.getCurrentUser()?.id || null, details: { sku: deleteBtn.dataset.productDelete } });
      setAdminMessage(tt().productDeleted, "success");
      renderProducts();
      renderFilterSettings();
      return;
    }

    if (editBtn) {
      const sku = editBtn.dataset.productEdit;
      const product = store.getProductBySku(sku);
      if (!product) throw new Error("Product not found.");
      if (!editProductForm) return;
      fillProductForm(editProductForm, product);
      editProductForm.hidden = false;
      setProductsSubtab("edit");
      editProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
      renderAdminProductComments(sku);
    }
  } catch (error) {
    setAdminMessage(error?.message || tt().productActionFail, "error");
  }
});

groupsWrap?.addEventListener("click", (event) => {
  const mode = getGroupsMode();
  const editBtn = event.target.closest("[data-group-edit]");
  const deleteBtn = event.target.closest("[data-group-delete]");
  try {
    if (deleteBtn) {
      if (mode !== "delete") return;
      setGroupsSubtab("delete");
      setUsersSubtab("groups");
      auth.deleteGroup(deleteBtn.dataset.groupDelete);
      renderGroups();
      renderUsers();
      setAdminMessage(tt().del, "success");
      return;
    }

    if (editBtn) {
      if (mode !== "edit") return;
      setGroupsSubtab("edit");
      setUsersSubtab("groups");
      const groups = auth.listGroups();
      const group = groups.find((item) => item.id === editBtn.dataset.groupEdit);
      if (!group || !editGroupForm) return;
      editGroupForm.elements.groupId.value = group.id;
      editGroupForm.elements.name.value = group.name;
      renderPermissionCheckboxes(groupEditPermissionsWrap, group.permissions || []);
      editGroupForm.hidden = false;
      editGroupForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

document.addEventListener("change", (event) => {
  const statusSelect = event.target.closest("[data-order-status]");
  if (!statusSelect) return;
  try {
    auth.setOrderStatus(statusSelect.dataset.orderStatus, statusSelect.value);
    setAdminMessage(tt().orderStatusUpdated, "success");
    renderOrders();
    renderLogs(); // Keep renderLogs from original
  } catch (error) {
    setAdminMessage(error?.message || tt().orderStatusFail, "error");
    renderOrders();
  }
});

document.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("[data-order-delete]");
  if (!deleteBtn) return;
  if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
  try {
    auth.deleteOrder(deleteBtn.dataset.orderDelete);
    setAdminMessage(tt().productDeleted, "success"); // Reuse existing success string
    renderOrders();
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

sendForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedContactId) {
    setAdminMessage(tt().selectContact, "error");
    return;
  }
  const formData = new FormData(sendForm);
  try {
    auth.sendMessage(selectedContactId, String(formData.get("text") || ""));
    sendForm.reset();
    renderChat();
    setAdminMessage(tt().messageSent, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().messageFail, "error");
  }
});

accessExportBtn?.addEventListener("click", () => {
  try {
    const config = auth.exportAccessConfig();
    const json = JSON.stringify(config, null, 2);
    if (accessJsonInput) accessJsonInput.value = json;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `watchtopia-access-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setAdminMessage(tt().accessExported, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().operationFail, "error");
  }
});

accessFileInput?.addEventListener("change", async (event) => {
  const file = event.target?.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    if (accessJsonInput) accessJsonInput.value = text;
    setAdminMessage(tt().accessLoaded, "success");
  } catch (error) {
    setAdminMessage(error?.message || tt().accessImportFail, "error");
  } finally {
    accessFileInput.value = "";
  }
});

accessForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const raw = String(new FormData(event.currentTarget).get("json") || "").trim();
    if (!raw) throw new Error(tt().accessInvalidJson);
    const payload = JSON.parse(raw);
    auth.importAccessConfig(payload);
    setAdminMessage(tt().accessImported, "success");
    renderAll();
  } catch (error) {
    const isParseError = error instanceof SyntaxError;
    setAdminMessage(isParseError ? tt().accessInvalidJson : error?.message || tt().accessImportFail, "error");
  }
});

const bannersForm = document.getElementById("admin-banners-form");
bannersForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const fd = new FormData(event.currentTarget);
    const banners = [0, 1, 2].map(i => ({
      img: String(fd.get(`b${i}_img`) || "").trim(),
      title: String(fd.get(`b${i}_title`) || "").trim(),
      sub: String(fd.get(`b${i}_sub`) || "").trim(),
      link: String(fd.get(`b${i}_link`) || "").trim()
    }));

    auth.updateSettings("homeBanners", banners);
    setAdminMessage(tt().productUpdated, "success");
    renderSettings();
  } catch (err) {
    setAdminMessage(err?.message || tt().operationFail, "error");
  }
});

function renderPromos() {
  const list = document.getElementById("admin-promos-list");
  const container = document.getElementById("admin-tab-promos");
  if (!list || !container || !auth.getPromoCodes) return;

  const t = tt();
  const isRu = (t.static.totalOrders === "Всего заказов");
  const isAz = (t.static.totalOrders === "Umumi Sifaris");

  const titleEl = container.querySelector("h2");
  const createTitleEl = container.querySelector("h3");
  const codeLabel = container.querySelector("label:nth-child(1) span");
  const discLabel = container.querySelector("label:nth-child(2) span");
  const createBtn = container.querySelector("form button");
  const thCode = container.querySelector("th:nth-child(1)");
  const thDisc = container.querySelector("th:nth-child(2)");
  const thActions = container.querySelector("th:nth-child(3)");

  if (titleEl) titleEl.textContent = isAz ? "Promokodlar" : (isRu ? "Промокоды" : "Promo Codes");
  if (createTitleEl) createTitleEl.textContent = isAz ? "Yeni Promokod Yarat" : (isRu ? "Создать новый промокод" : "Create New Promo Code");
  if (codeLabel) codeLabel.textContent = isAz ? "Kod" : (isRu ? "Код" : "Code");
  if (discLabel) discLabel.textContent = isAz ? "Endirim (%)" : (isRu ? "Скидка (%)" : "Discount (%)");
  if (createBtn) createBtn.textContent = isAz ? "Promokod Əlavə Et" : (isRu ? "Добавить промокод" : "Add Promo Code");
  if (thCode) thCode.textContent = isAz ? "Kod" : (isRu ? "Код" : "Code");
  if (thDisc) thDisc.textContent = isAz ? "Endirim" : (isRu ? "Скидка" : "Discount");
  if (thActions) thActions.textContent = isAz ? "Əməliyyatlar" : (isRu ? "Действия" : "Actions");

  const promos = auth.getPromoCodes();
  const emptyText = isAz ? "Promokod tapılmadı." : (isRu ? "Промокоды не найдены." : "No promo codes found.");

  if (!promos.length) {
    list.innerHTML = `<tr><td colspan='3'>${emptyText}</td></tr>`;
    return;
  }

  list.innerHTML = promos.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.code)}</strong></td>
      <td>${p.discount}%</td>
      <td class="admin-actions">
        <button class="btn btn-danger btn-sm" type="button" data-promo-delete="${escapeHtml(p.code)}">🗑</button>
      </td>
    </tr>
  `).join("");
}

const promosForm = document.getElementById("admin-promos-form");
promosForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fd = new FormData(event.currentTarget);
  try {
    auth.addPromoCode(fd.get("code"), fd.get("discount"));
    setAdminMessage("Promo code added.", "success");
    event.currentTarget.reset();
    renderPromos();
  } catch (err) {
    setAdminMessage(err?.message || "Failed to add promo code.", "error");
  }
});

document.addEventListener("click", (event) => {
  const delBtn = event.target.closest("[data-promo-delete]");
  if (delBtn) {
    try {
      auth.deletePromoCode(delBtn.dataset.promoDelete);
      setAdminMessage("Promo code deleted.", "success");
      renderPromos();
    } catch (err) {
      setAdminMessage(err?.message || "Failed to delete promo code.", "error");
    }
  }
});

function renderAdminProductComments(sku) {
  const wrap = document.getElementById("admin-product-comments-wrap");
  const list = document.getElementById("admin-product-comments-list");
  if (!wrap || !list || !auth.getProductComments) return;

  const comments = auth.getProductComments(sku);
  if (!comments.length) {
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "block";
  list.innerHTML = comments.map(c => `
    <div style="background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px; border: 1px solid var(--line); position: relative;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <strong style="font-size: 0.95rem;">${escapeHtml(c.userName || "Customer")}</strong>
        <span style="font-size: 0.8rem; color: var(--muted);">${new Date(c.createdAt).toLocaleDateString()}</span>
      </div>
      <p style="font-size: 0.9rem; margin: 0; padding-right: 40px;">${escapeHtml(c.text)}</p>
      <button class="btn btn-danger btn-sm" type="button" data-comment-delete="${c.id}" data-comment-sku="${sku}" style="position: absolute; right: 8px; bottom: 8px; padding: 4px 8px; font-size: 0.8rem;">Delete</button>
    </div>
  `).join("");
}

document.addEventListener("click", (event) => {
  const delBtn = event.target.closest("[data-comment-delete]");
  if (delBtn) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      auth.deleteProductComment(delBtn.dataset.commentDelete);
      setAdminMessage("Comment deleted", "success");
      renderAdminProductComments(delBtn.dataset.commentSku);
    } catch (err) {
      setAdminMessage(err?.message || "Failed to delete comment", "error");
    }
  }
});

function renderComments() {
  const list = document.getElementById("admin-comments-list");
  if (!list) return;
  const comments = auth.getAllComments();
  const t = I18N[currentLang];

  if (comments.length === 0) {
    list.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--muted);">No comments found.</td></tr>`;
    return;
  }

  list.innerHTML = comments
    .map((c) => {
      const statusColor = c.status === "approved" ? "#28a745" : (c.status === "hidden" ? "#dc3545" : "#ffc107");
      const dateStr = new Date(c.createdAt).toLocaleString(currentLang === "az" ? "az-AZ" : (currentLang === "ru" ? "ru-RU" : "en-US"));
      return `
      <tr>
        <td>
          <div style="font-weight: 600;">${c.userName}</div>
          <div style="font-size: 0.8rem; color: var(--muted);">${dateStr}</div>
        </td>
        <td><a href="../pages/product.html?sku=${c.sku}" target="_blank" style="color: var(--gold);">${c.sku}</a></td>
        <td style="max-width: 300px; white-space: normal; font-size: 0.9rem;">${c.text}</td>
        <td>
          <span style="color: ${statusColor}; font-weight: 600; font-size: 0.85rem; text-transform: uppercase;">
            ${c.status || "pending"}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            ${c.status !== "approved" ? `<button class="btn btn-primary btn-sm" onclick="handleCommentAction('${c.id}', 'approved')">${t.static.approve}</button>` : ""}
            ${c.status !== "hidden" ? `<button class="btn btn-ghost btn-sm" onclick="handleCommentAction('${c.id}', 'hidden')">${t.static.hide}</button>` : ""}
            <button class="btn btn-danger btn-sm" onclick="handleCommentAction('${c.id}', 'delete')">${t.del || "Delete"}</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

window.handleCommentAction = function (id, action) {
  try {
    if (action === "delete") {
      if (confirm("Are you sure you want to delete this comment?")) {
        auth.deleteProductComment(id);
        showAdminMessage("Comment deleted.", "success");
      } else return;
    } else {
      auth.setCommentStatus(id, action);
      showAdminMessage(`Comment ${action}.`, "success");
    }
    renderComments();
  } catch (error) {
    showAdminMessage(error.message, "error");
  }
};

/* BULK ACTIONS & EXPORTS */

document.getElementById("admin-orders-select-all")?.addEventListener("change", (e) => {
  const checked = e.target.checked;
  document.querySelectorAll(".admin-order-select").forEach((cb) => (cb.checked = checked));
});

document.getElementById("admin-orders-bulk-apply")?.addEventListener("click", () => {
  const status = document.getElementById("admin-orders-bulk-status").value;
  if (!status) return alert("Please select a status.");
  const selectedIds = Array.from(document.querySelectorAll(".admin-order-select:checked")).map((cb) => cb.dataset.orderId);
  if (selectedIds.length === 0) return alert("No orders selected.");

  if (confirm(`Change status to "${status}" for ${selectedIds.length} orders?`)) {
    try {
      selectedIds.forEach((id) => auth.updateOrderStatus(id, status));
      showAdminMessage(`Updated ${selectedIds.length} orders.`, "success");
      renderOrders();
    } catch (err) {
      showAdminMessage(err.message, "error");
    }
  }
});

function downloadCsv(filename, headers, rows) {
  const content = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("admin-export-users-csv")?.addEventListener("click", () => {
  const users = auth.listUsers();
  const headers = ["ID", "Name", "Surname", "Email", "Phone", "Role", "Status", "Created", "Total Spent"];
  const rows = users.map((u) => {
    const totalSpent = (u.orders || []).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return [u.id, u.name, u.surname || "", u.email, u.phone || "", u.role, u.status || "active", toIsoDate(u.createdAt), totalSpent.toFixed(2)];
  });
  downloadCsv("users_export.csv", headers, rows);
});

document.getElementById("admin-export-orders-csv")?.addEventListener("click", () => {
  const orders = auth.listAllOrders();
  const headers = ["Order#", "Date", "User", "Email", "Phone", "Status", "Items", "Total"];
  const itemsMap = buildDisplayIdMap(orders, "id");
  const rows = orders.map((o) => {
    const itemsText = (o.items || []).map((i) => `${i.sku} x${i.qty}`).join("; ");
    return [itemsMap[o.id], toIsoDate(o.createdAt), o.customer?.name || o.userId, o.customer?.email || "", o.customer?.phone || "", o.status, itemsText, (o.totalAmount || 0).toFixed(2)];
  });
  downloadCsv("orders_export.csv", headers, rows);
});

function renderNewsletter() {
  const list = document.getElementById("admin-newsletter-list");
  if (!list) return;
  // Assuming auth.getNewsletterSubscribers() exists or we fetch from localStorage
  const subscribers = JSON.parse(localStorage.getItem("watchtopia-newsletter") || "[]");
  if (subscribers.length === 0) {
    list.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 24px; color: var(--muted);">No subscribers yet.</td></tr>`;
    return;
  }
  list.innerHTML = subscribers.map(s => `
    <tr>
      <td>${escapeHtml(s.email)}</td>
      <td>${new Date(s.date).toLocaleString()}</td>
    </tr>
  `).join("");
}

document.getElementById("admin-export-newsletter-csv")?.addEventListener("click", () => {
  const subscribers = JSON.parse(localStorage.getItem("watchtopia-newsletter") || "[]");
  const headers = ["Email", "Date"];
  const rows = subscribers.map(s => [s.email, toIsoDate(s.date)]);
  downloadCsv("newsletter_export.csv", headers, rows);
});




function renderFilterSettings() {
  const categories = store.getCategories ? store.getCategories() : [];
  const mechanisms = store.getMechanisms ? store.getMechanisms() : [];
  const brands = store.getBrands ? store.getBrands() : [];

  if (filterCategoriesList) {
    filterCategoriesList.innerHTML = categories.map(c => `
      <div class="admin-widget-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--bg-soft); border-radius: 8px; margin-bottom: 4px;">
        <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(c)}</span>
        <button type="button" class="btn btn-sm btn-ghost" onclick="handleDeleteFilter('category', '${escapeHtml(c)}')" style="padding: 2px 8px; font-size: 0.75rem;">✕</button>
      </div>
    `).join("");
  }
  if (filterMechanismsList) {
    filterMechanismsList.innerHTML = mechanisms.map(m => `
      <div class="admin-widget-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--bg-soft); border-radius: 8px; margin-bottom: 4px;">
        <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(m)}</span>
        <button type="button" class="btn btn-sm btn-ghost" onclick="handleDeleteFilter('mechanism', '${escapeHtml(m)}')" style="padding: 2px 8px; font-size: 0.75rem;">✕</button>
      </div>
    `).join("");
  }
  if (filterBrandsList) {
    filterBrandsList.innerHTML = brands.map(b => `
      <div class="admin-widget-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--bg-soft); border-radius: 8px; margin-bottom: 4px;">
        <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(b)}</span>
        <button type="button" class="btn btn-sm btn-ghost" onclick="handleDeleteFilter('brand', '${escapeHtml(b)}')" style="padding: 2px 8px; font-size: 0.75rem;">✕</button>
      </div>
    `).join("");
  }
}

window.handleDeleteFilter = function (type, value) {
  if (!confirm(`Remove ${type} "${value}"?`)) return;
  try {
    if (type === 'category') store.deleteCategory?.(value);
    if (type === 'mechanism') store.deleteMechanism?.(value);
    if (type === 'brand') store.deleteBrand?.(value);
    showAdminMessage(`${type} removed.`, "success");
    renderFilterSettings();
    renderProducts();
  } catch (err) {
    showAdminMessage(err.message, "error");
  }
};

const handleFilterAdd = (form, type) => {
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = new FormData(form).get("value")?.trim();
    if (!val) return;
    try {
      if (type === 'category') store.addCategory?.(val);
      if (type === 'mechanism') store.addMechanism?.(val);
      if (type === 'brand') store.addBrand?.(val);
      form.reset();
      showAdminMessage(`${type} added.`, "success");
      renderFilterSettings();
      renderProducts();
    } catch (err) {
      showAdminMessage(err.message, "error");
    }
  });
};
handleFilterAdd(filterCategoriesForm, 'category');
handleFilterAdd(filterMechanismsForm, 'mechanism');
handleFilterAdd(filterBrandsForm, 'brand');

/* NOTIFICATIONS */
let notifications = JSON.parse(localStorage.getItem("admin-notifications") || "[]");

function updateNotificationsUI() {
  const badge = document.getElementById("admin-notifications-badge");
  if (!badge) return;
  const count = notifications.filter(n => !n.read).length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

document.getElementById("admin-notifications-btn")?.addEventListener("click", () => {
  if (notifications.length === 0) return alert("No notifications.");
  const list = notifications.map(n => `[${new Date(n.date).toLocaleTimeString()}] ${n.text}`).join("\n");
  alert("Notifications:\n\n" + list);
  notifications.forEach(n => n.read = true);
  localStorage.setItem("admin-notifications", JSON.stringify(notifications));
  updateNotificationsUI();
});

window.addAdminNotification = function (text) {
  notifications.unshift({ text, date: Date.now(), read: false });
  if (notifications.length > 20) notifications.pop();
  localStorage.setItem("admin-notifications", JSON.stringify(notifications));
  updateNotificationsUI();
  showToast(text);
};

function showToast(text) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; background: var(--text); color: var(--card);
    padding: 14px 24px; border-radius: 12px; box-shadow: var(--shadow); z-index: 10000;
    transform: translateY(100px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    font-weight: 600; border-left: 4px solid var(--gold);
  `;
  toast.textContent = text;
  document.body.appendChild(toast);
  // force reflow
  toast.offsetHeight;
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.transform = "translateY(150px)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Listen for new orders
window.addEventListener("watchtopia:order-created", (e) => {
  const orderId = e.detail?.id || "Unknown";
  window.addAdminNotification(`New Order created: #${orderId}`);
});

updateNotificationsUI();

renderAll();
window.addEventListener("watchtopia:auth-changed", renderAll);
window.addEventListener("watchtopia:lang-changed", renderAll);

