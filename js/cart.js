
//Visualización del mail en el navbar
const logUser = localStorage.getItem('email');
const emailDropdown = document.getElementById('emailDropdown');

if (logUser && emailDropdown) {
    emailDropdown.textContent = logUser;
}


//Para cerrar sesion
const isLoggedIn = localStorage.getItem("password") !== null && localStorage.getItem("email") !== null;
window.addEventListener("load", () => {
  if (!isLoggedIn) {
    window.location.href = "login.html";
  }
});

// Agrega un evento de escucha al botón "Cerrar sesión"
const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    // Elimina las credenciales almacenadas en el almacenamiento local
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    // Redirige al usuario a la página de inicio de sesión
    window.location.href = "login.html";
  });
}