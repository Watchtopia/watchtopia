const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");
const auth = window.WatchtopiaAuth;

function setRegisterMessage(text, type = "info") {
  if (!registerMessage) return;
  registerMessage.textContent = text;
  registerMessage.classList.remove("is-error", "is-success");
  if (type === "error") registerMessage.classList.add("is-error");
  if (type === "success") registerMessage.classList.add("is-success");
}

if (auth?.getCurrentUser()) {
  window.location.href = "../index.html";
}

if (registerForm && auth) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);

    try {
      auth.register({
        name: String(formData.get("name") || ""),
        surname: String(formData.get("surname") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        phone: String(formData.get("phone") || ""),
        birthDate: String(formData.get("birthDate") || ""),
        gender: String(formData.get("gender") || ""),
        newsletterOptIn: formData.get("newsletterOptIn") === "on"
      });

      auth.login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      });

      setRegisterMessage("Account created.", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 450);
    } catch (error) {
      setRegisterMessage(error?.message || "Registration failed.", "error");
    }
  });
}

