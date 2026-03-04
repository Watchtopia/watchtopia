const auth = window.WatchtopiaAuth;
const contactsWrap = document.getElementById("messages-contacts");
const threadWrap = document.getElementById("messages-thread");
const sendForm = document.getElementById("messages-send-form");
const messageEl = document.getElementById("messages-message");
const titleEl = document.getElementById("messages-title");
const introEl = document.getElementById("messages-intro");
const textEl = document.getElementById("messages-text");
const sendBtn = document.getElementById("messages-send-btn");

let selectedContactId = "";
const preselectedContactId = new URLSearchParams(window.location.search).get("contact") || "";

const i18n = {
  az: { title: "Mesajlar", intro: "Destek ve adminle sexsi cat.", placeholder: "Mesaj yazin", send: "Gonder", select: "Elaqe secin.", sent: "Mesaj gonderildi.", fail: "Mesaj gonderilmedi." },
  ru: { title: "Сообщения", intro: "Личный чат с поддержкой и админом.", placeholder: "Введите сообщение", send: "Отправить", select: "Сначала выберите контакт.", sent: "Сообщение отправлено.", fail: "Не удалось отправить сообщение." },
  en: { title: "Messages", intro: "Private chat with support/admin.", placeholder: "Type a message", send: "Send", select: "Select contact first.", sent: "Message sent.", fail: "Failed to send message." }
};

function t() {
  const lang = localStorage.getItem("watchtopia-language") || "az";
  return i18n[lang] || i18n.az;
}

function setMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.classList.remove("is-error", "is-success");
  if (type === "error") messageEl.classList.add("is-error");
  if (type === "success") messageEl.classList.add("is-success");
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
}

function renderUiText() {
  const dict = t();
  titleEl.textContent = dict.title;
  introEl.textContent = dict.intro;
  textEl.placeholder = dict.placeholder;
  sendBtn.textContent = dict.send;
}

function renderContacts() {
  const contacts = auth.getInboxContacts();
  if (!selectedContactId && preselectedContactId && contacts.some((user) => user.id === preselectedContactId)) {
    selectedContactId = preselectedContactId;
  }
  contactsWrap.innerHTML = contacts
    .map((user) => `<button class="admin-contact${selectedContactId === user.id ? " is-active" : ""}" type="button" data-contact-id="${user.id}">${user.name}</button>`)
    .join("");
}

function renderThread() {
  if (!selectedContactId) {
    threadWrap.innerHTML = `<p>${t().select}</p>`;
    return;
  }

  const me = auth.getCurrentUser();
  const thread = auth.getConversation(selectedContactId);
  threadWrap.innerHTML = thread
    .map((msg) => {
      const mine = msg.fromUserId === me.id;
      return `<div class="chat-msg${mine ? " is-mine" : ""}"><p>${msg.text}</p><span>${formatDate(msg.createdAt)}</span></div>`;
    })
    .join("");
}

contactsWrap?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-contact-id]");
  if (!btn) return;
  selectedContactId = btn.dataset.contactId;
  renderContacts();
  renderThread();
});

sendForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedContactId) {
    setMessage(t().select, "error");
    return;
  }
  const formData = new FormData(sendForm);
  try {
    auth.sendMessage(selectedContactId, String(formData.get("text") || ""));
    sendForm.reset();
    renderThread();
    setMessage(t().sent, "success");
  } catch (error) {
    setMessage(error?.message || t().fail, "error");
  }
});

function renderAll() {
  renderUiText();
  renderContacts();
  renderThread();
}

window.addEventListener("watchtopia:lang-changed", renderAll);
renderAll();
