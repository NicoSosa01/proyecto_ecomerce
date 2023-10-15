// Función para cargar y mostrar los productos en el carrito
async function loadCart() {
  try {
    // Obtiene el carrito de compras desde el almacenamiento local
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Obtiene el tbody de la tabla en la página del carrito
    const tbody = document.getElementById("addNewProducts");

    const userId = 25801;
    const cartUrl = `https://japceibal.github.io/emercado-api/user_cart/${userId}.json`;
    const response = await fetch(cartUrl);
    const data = await response.json();

    const articles = data.articles;

    articles.forEach((article) => {
      const { id, name, unitCost, count, currency, image } = article;
      const subtotal = unitCost * count;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${image}" alt="${name}" class="img-thumbnail" width="150"></td>
        <td>${name}</td>
        <td>${unitCost} ${currency}</td>
        <td><input type="number" value="${count}" min="1" data-id="${id}" data-unitcost="${unitCost}" data-currency="${currency}"></td>
        <td class="subtotal">${subtotal} ${currency}</td>
      `;

      tbody.appendChild(row);

      // Evento input para actualizar el subtotal en tiempo real
      const inputElement = row.querySelector("input");
      inputElement.addEventListener("input", () => {
        const newCount = parseInt(inputElement.value, 10);
        const newSubtotal = newCount * unitCost;
        const subtotalElement = row.querySelector(".subtotal");
        subtotalElement.textContent = `${newSubtotal} ${currency}`;
      });
    });

    // Recorre los productos en el carrito almacenados en el almacenamiento local
    cart.forEach((product) => {
      const { id, name, unitCost, count, currency, images } = product;
      const subtotal = unitCost * count;

      const row = document.createElement("tr");
      row.innerHTML = `
      <td><img src="${images}" alt="${name}" class="img-thumbnail" width="150"></td>
      <td>${name}</td>
      <td>${unitCost} ${currency}</td>
      <td><input type="number" value="${count}" min="1" data-id="${id}" data-unitcost="${unitCost}" data-currency="${currency}"></td>
      <td class="subtotal">${subtotal} ${currency}</td>
      `;

      tbody.appendChild(row);
    
    const inputElement = row.querySelector("input");
    inputElement.addEventListener("input", () => {
    const newCount = parseInt(inputElement.value, 10);
    const newSubtotal = newCount * unitCost;
    const subtotalElement = row.querySelector(".subtotal");
    subtotalElement.textContent = `${newSubtotal} ${currency}`;
  });
  });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
}

// Llama a la función para cargar y mostrar los productos en el carrito
loadCart();


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