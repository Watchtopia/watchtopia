const auth = window.WatchtopiaAuth;

const profileForm = document.getElementById("profile-form");
const addressForm = document.getElementById("address-form");
const messageEl = document.getElementById("profile-message");

const i18n = {
  az: {
    title: "Profili redakte et",
    addr: "Catdirilma unvani",
    labels: { name: "Ad", surname: "Soyad", email: "Email", phone: "Telefon", birthDate: "Dogum tarixi", gender: "Cins", avatar: "Avatar URL", public: "Aciq profil linki", bio: "Bio", addrLabel: "Etiket", lat: "Enlik", lng: "Uzunluq", addrLine: "Unvan setri" },
    placeholders: { avatar: "https://...", addrLabel: "Ev", addrLine: "Kucesi, ev nomresi" },
    buttons: { saveProfile: "Profili saxla", saveAddress: "Unvani saxla" },
    savedProfile: "Profil yenilendi.",
    savedAddress: "Unvan saxlanildi.",
    failProfile: "Profil yenilenmedi.",
    failAddress: "Unvan saxlanilmadi."
  },
  ru: {
    title: "Редактировать профиль",
    addr: "Адрес доставки",
    labels: { name: "Имя", surname: "Фамилия", email: "Email", phone: "Телефон", birthDate: "Дата рождения", gender: "Пол", avatar: "URL аватара", public: "Ссылка на профиль", bio: "О себе", addrLabel: "Метка", lat: "Широта", lng: "Долгота", addrLine: "Строка адреса" },
    placeholders: { avatar: "https://...", addrLabel: "Дом", addrLine: "Улица, дом" },
    buttons: { saveProfile: "Сохранить профиль", saveAddress: "Сохранить адрес" },
    savedProfile: "Профиль обновлен.",
    savedAddress: "Адрес сохранен.",
    failProfile: "Не удалось обновить профиль.",
    failAddress: "Не удалось сохранить адрес."
  },
  en: {
    title: "Edit profile",
    addr: "Delivery address",
    labels: { name: "Name", surname: "Surname", email: "Email", phone: "Phone", birthDate: "Birth Date", gender: "Gender", avatar: "Avatar URL", public: "Public profile link", bio: "Bio", addrLabel: "Label", lat: "Latitude", lng: "Longitude", addrLine: "Address line" },
    placeholders: { avatar: "https://...", addrLabel: "Home", addrLine: "Street, house" },
    buttons: { saveProfile: "Save profile", saveAddress: "Save address" },
    savedProfile: "Profile updated.",
    savedAddress: "Address saved.",
    failProfile: "Profile update failed.",
    failAddress: "Address save failed."
  }
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

function render() {
  const user = auth.getCurrentUser();
  if (!user) return;
  profileForm.elements.name.value = user.name || "";
  if (profileForm.elements.surname) profileForm.elements.surname.value = user.surname || "";
  profileForm.elements.email.value = user.email || "";
  profileForm.elements.phone.value = user.phone || "";
  if (profileForm.elements.birthDate) profileForm.elements.birthDate.value = user.birthDate || "";
  if (profileForm.elements.gender) profileForm.elements.gender.value = user.gender || "";
  if (profileForm.elements.newsletterOptIn) profileForm.elements.newsletterOptIn.checked = Boolean(user.newsletterOptIn);
  profileForm.elements.avatarUrl.value = user.avatarUrl || "";
  profileForm.elements.bio.value = user.bio || "";

  const dict = t();
  document.getElementById("edit-profile-title").textContent = dict.title;
  document.getElementById("address-title").textContent = dict.addr;
  document.getElementById("profile-edit-label-name").textContent = dict.labels.name;
  if (document.getElementById("profile-edit-label-surname")) document.getElementById("profile-edit-label-surname").textContent = dict.labels.surname;
  document.getElementById("profile-edit-label-email").textContent = dict.labels.email;
  document.getElementById("profile-edit-label-phone").textContent = dict.labels.phone;
  if (document.getElementById("profile-edit-label-birthdate")) document.getElementById("profile-edit-label-birthdate").textContent = dict.labels.birthDate;
  if (document.getElementById("profile-edit-label-gender")) document.getElementById("profile-edit-label-gender").textContent = dict.labels.gender;
  document.getElementById("profile-edit-label-avatar").textContent = dict.labels.avatar;
  document.getElementById("profile-edit-label-public").textContent = dict.labels.public;
  document.getElementById("profile-edit-label-bio").textContent = dict.labels.bio;
  document.getElementById("profile-edit-label-address-label").textContent = dict.labels.addrLabel;
  document.getElementById("profile-edit-label-lat").textContent = dict.labels.lat;
  document.getElementById("profile-edit-label-lng").textContent = dict.labels.lng;
  document.getElementById("profile-edit-label-address-line").textContent = dict.labels.addrLine;
  document.getElementById("profile-edit-save-btn").textContent = dict.buttons.saveProfile;
  document.getElementById("profile-edit-address-save-btn").textContent = dict.buttons.saveAddress;
  document.getElementById("profile-edit-avatar").setAttribute("placeholder", dict.placeholders.avatar);
  document.getElementById("profile-edit-address-label").setAttribute("placeholder", dict.placeholders.addrLabel);
  document.getElementById("profile-edit-address-line").setAttribute("placeholder", dict.placeholders.addrLine);

  const publicLink = `${window.location.origin}${window.location.pathname.replace("profile-edit.html", "user.html")}?id=${encodeURIComponent(user.id)}`;
  document.getElementById("public-profile-link").value = publicLink;

  const addresses = auth.getAddressesForUser(user.id);
  const addressListEl = document.getElementById("address-list");
  if (addressListEl) {
    if (addresses.length) {
      addressListEl.innerHTML = addresses.map(a => `
        <div style="background: var(--bg); padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--line);">
          <div>
            <strong>${String(a.label).replace(/</g, "&lt;")}</strong><br>
            <span style="font-size: 0.9em; color: var(--muted);">${String(a.addressLine).replace(/</g, "&lt;")}</span>
          </div>
          <button type="button" class="btn btn-ghost" data-remove-address="${a.id}" style="color: var(--danger, #ff4d4f); padding: 4px 8px; min-height: 0;">Sil</button>
        </div>
      `).join("");
    } else {
      addressListEl.innerHTML = `<p style="color: var(--muted); font-size: 0.9em;">Heç bir ünvan əlavə edilməyib.</p>`;
    }
  }
}

let map;
let marker;
function initMap() {
  const mapEl = document.getElementById("address-map");
  if (!mapEl || !window.L) return;

  const lat = Number(addressForm.elements.lat.value) || 40.4093;
  const lng = Number(addressForm.elements.lng.value) || 49.8671;

  map = window.L.map(mapEl).setView([lat, lng], 12);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
  marker = window.L.marker([lat, lng]).addTo(map);

  map.on("click", (e) => {
    const { lat: nextLat, lng: nextLng } = e.latlng;
    marker.setLatLng([nextLat, nextLng]);
    addressForm.elements.lat.value = nextLat.toFixed(6);
    addressForm.elements.lng.value = nextLng.toFixed(6);
  });
}

profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  try {
    auth.updateCurrentUserProfile({
      name: String(formData.get("name") || ""),
      surname: String(formData.get("surname") || ""),
      phone: String(formData.get("phone") || ""),
      birthDate: String(formData.get("birthDate") || ""),
      gender: String(formData.get("gender") || ""),
      newsletterOptIn: formData.get("newsletterOptIn") === "on",
      avatarUrl: String(formData.get("avatarUrl") || ""),
      bio: String(formData.get("bio") || "")
    });
    render();
    setMessage(t().savedProfile, "success");
  } catch (error) {
    setMessage(error?.message || t().failProfile, "error");
  }
});

addressForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addressForm);
  try {
    auth.addAddressForCurrentUser({
      label: String(formData.get("label") || ""),
      addressLine: String(formData.get("addressLine") || ""),
      lat: Number(formData.get("lat")),
      lng: Number(formData.get("lng"))
    });
    setMessage(t().savedAddress, "success");
    addressForm.reset();
    render();
  } catch (error) {
    setMessage(error?.message || t().failAddress, "error");
  }
});

document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-remove-address]");
  if (!removeBtn) return;
  const id = removeBtn.dataset.removeAddress;
  if (auth.removeAddressForCurrentUser(id)) {
    render();
    setMessage("Ünvan silindi.", "success");
  }
});

window.addEventListener("watchtopia:lang-changed", render);
render();
setTimeout(initMap, 0);
