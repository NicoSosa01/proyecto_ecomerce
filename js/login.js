const savedEmail = localStorage.getItem('email');
const savedPassword = localStorage.getItem('password');
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");

window.addEventListener("load", () => {
  if (savedEmail !== null && savedPassword != null) {
    password.value = savedPassword;
    email.value = savedEmail;
    location.assign("index.html");
  } loginForm.addEventListener("submit", () => {
      localStorage.setItem('email', email.value);
      localStorage.setItem('password', password.value);
    }
  )});

  




