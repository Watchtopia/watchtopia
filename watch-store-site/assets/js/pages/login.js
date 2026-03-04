const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const auth = window.WatchtopiaAuth;

function setLoginMessage(text, type = "info") {
  if (!loginMessage) return;
  loginMessage.textContent = text;
  loginMessage.classList.remove("is-error", "is-success");
  if (type === "error") loginMessage.classList.add("is-error");
  if (type === "success") loginMessage.classList.add("is-success");
}

if (auth?.getCurrentUser()) {
  window.location.href = "../index.html";
}

if (loginForm && auth) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);

    try {
      auth.login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      });
      setLoginMessage("Logged in successfully.", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 450);
    } catch (error) {
      setLoginMessage(error?.message || "Login failed.", "error");
    }
  });
}

