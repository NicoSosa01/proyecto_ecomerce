// Función para cargar y mostrar los productos en el carrito
async function loadCart() {
  try {
    // Obtiene el carrito de compras desde el almacenamiento local
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Obtiene el tbody de la tabla en la página del carrito
    const tbody = document.getElementById("addNewProducts");

    // Limpia el contenido de la tabla antes de agregar los productos
    tbody.innerHTML = '';

    // Recorre los productos en el carrito almacenados en el almacenamiento local
    cart.forEach((product) => {
      const { id, name, unitCost, count, currency, images } = product;
      const subtotal = unitCost * count;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${images}" alt="${name}" class="img-thumbnail img-max-width img-min-width" width="150"></td>
        <td>${name}</td>
        <td>${unitCost} ${currency}</td>
        <td><input type="number" value="${count}" min="1" data-id="${id}" data-unitcost="${unitCost}" data-currency="${currency}"></td>
        <td class="subtotal">${subtotal} ${currency}</td>
        <td><button class="delete-row"><svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
        </button></td>
      `;

      tbody.appendChild(row);

      const inputElement = row.querySelector("input");
      inputElement.addEventListener("input", () => {
      const newCount = parseInt(inputElement.value, 10);

      // Actualiza la cantidad solo para el producto específico que se está modificando
      product.count = newCount;

      // Actualiza el carrito en el almacenamiento local
      localStorage.setItem("cart", JSON.stringify(cart));
        
      const newSubtotal = newCount * unitCost;
      const subtotalElement = row.querySelector(".subtotal");
      subtotalElement.textContent = `${newSubtotal} ${currency}`;
      updateTotals(); // Llamada a la función para actualizar totales
      });
      // Agrega el evento de clic para eliminar la fila
      const deleteButton = row.querySelector(".delete-row");
      deleteButton.addEventListener("click", () => {
        tbody.removeChild(row); // Elimina la fila del DOM
        updateTotals(); // Llamada a la función para actualizar totales
        // Elimina el producto del carrito en el almacenamiento local
        const updatedCart = cart.filter((p) => p.id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      });
    });

    // Llama a la función para actualizar totales al cargar el carrito
    updateTotals();
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
}

// PAUTA 1
// Evento para escuchar cambios en la cantidad de productos
const quantityInputs = document.querySelectorAll("input[type='number']");
quantityInputs.forEach((input) => {
  input.addEventListener("input", updateTotals);
});

// Evento para escuchar cambios en el tipo de envío
const shippingOptions = document.querySelectorAll('input[name="flexRadioDefault"]');
shippingOptions.forEach((option) => {
  option.addEventListener("change", updateTotals);
});

// Función para calcular y actualizar los totales
function updateTotals() {
  const items = document.querySelectorAll("tbody tr");
  let subtotal = 0;

  // Calcula el subtotal general
  items.forEach((item) => {
    const priceCell = item.querySelector("td:nth-child(3)");
    const priceText = priceCell.textContent;
    
    // Verifica si el precio contiene la información de la moneda
    if (priceText.includes("USD")) {
      // Si la moneda es dólares, extrae el valor numérico
      const priceValue = parseFloat(priceText.replace("USD", "").trim());
      const quantity = parseInt(item.querySelector("input").value, 10);
      subtotal += priceValue * quantity;
    } else if (priceText.includes("UYU")) {
      // Si la moneda es pesos uruguayos, realiza la conversión a dólares
      const conversionRate = 0.025; // Tasa de conversión (ajusta según la tasa actual)
      const priceValueInPesos = parseFloat(priceText.replace("UYU", "").trim());
      const priceValueInDollars = priceValueInPesos * conversionRate;
      const quantity = parseInt(item.querySelector("input").value, 10);
      subtotal += priceValueInDollars * quantity;
    }
  });

  // Obtiene el valor del costo de envío seleccionado
  const shippingOptions = document.querySelectorAll('input[name="flexRadioDefault"]');
  let shippingType = 0;

  shippingOptions.forEach((option) => {
    if (option.checked) {
      shippingType = parseFloat(option.value);
    }
  });

  // Calcula el costo de envío
  const shippingCost = Math.round(subtotal * (shippingType / 100));
  // Calcula el total a pagar
  const total = subtotal + shippingCost;

  // Actualiza los elementos en el HTML
  document.getElementById("priceSubtotal").textContent = `USD ${Math.round(subtotal)}`;
  document.getElementById("priceShipping").textContent = `USD ${shippingCost}`;
  document.getElementById("priceTotal").textContent = `USD ${Math.round(total)}`;
}

// Llama a la función para cargar y mostrar los productos en el carrito
loadCart();



// PAUTA 2
document.addEventListener("DOMContentLoaded", function() {
  // Obtiene referencias a los elementos relevantes
  const paymentByCredit = document.getElementById("paymentByCredit");
  const paymentByDebit = document.getElementById("paymentByDebit");
  const dataCredit1 = document.getElementById("dataCredit1");
  const dataCredit2 = document.getElementById("dataCredit2");
  const dataCredit3 = document.getElementById("dataCredit3");
  const dataDebit = document.getElementById("dataDebit");

  // Agrega eventos de cambio para las opciones de pago
  paymentByCredit.addEventListener("change", function() {
    // Si se selecciona tarjeta de crédito, se habilitan los campos de tarjeta de crédito
    if (paymentByCredit.checked) {
      dataCredit1.disabled = false;
      dataCredit2.disabled = false;
      dataCredit3.disabled = false;
      dataDebit.disabled = true;
    }
  });

  paymentByDebit.addEventListener("change", function() {
    // Si se selecciona transferecnia bancaria, habilitamos el campo de transferencia bancaria
    if (paymentByDebit.checked) {
      dataDebit.disabled = false;
      dataCredit1.disabled = true;
      dataCredit2.disabled = true;
      dataCredit3.disabled = true;
    }
  });
});


// PAUTA 3
(() => {
  'use strict';

  const form = document.getElementById('form');
  const selectedShipping = document.querySelectorAll('input[name="flexRadioDefault"]');
  const shippingFeedback = document.querySelector('.invalid-feedback');

  // Función para manejar cambios en la selección del tipo de envío
  function handleShippingChange() {
    // Itera sobre los elementos para verificar si al menos uno está seleccionado
    const isChecked = Array.from(selectedShipping).some(input => input.checked);

    if (isChecked) {
      shippingFeedback.style.display = 'none';
    } else {
      shippingFeedback.style.display = 'block';
    }
  }

  // Escucha cambios en la selección del formulario de tipo de envío
  selectedShipping.forEach(input => {
    input.addEventListener('change', handleShippingChange);
  });

  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, completa los campos obligatorios.',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    } else {
      event.preventDefault();
  
      Swal.fire({
        title: '¡Compra realizada!',
        text: 'Gracias por su compra',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Limpia el formulario
          form.reset();
          // Recarga la página
          location.reload();
        }
      });
    }

    const selectedPayment = document.querySelector('input[name="flexRadioDefault1"]:checked');
    const paymentMethodFeedback = document.getElementById('paymentMethodFeedback');
    const selectedPaymentMethod = document.getElementById('selectedPaymentMethod');

    // Valida selección de tipo de envío
    handleShippingChange(); // Valida nuevamente en el envío del formulario

    // Valida selección de forma de pago
    if (!selectedPayment) {
      event.preventDefault();
      event.stopPropagation();
      paymentMethodFeedback.style.display = 'block';
      selectedPaymentMethod.textContent = ''; // Borra el contenido si no se seleccionó un método
    } else {
      paymentMethodFeedback.style.display = 'none';
    }

    form.classList.add('was-validated');

    // Valida campos en el modal
    const cardNumber = document.getElementById('dataCredit1');
    const cardSecurityCode = document.getElementById('dataCredit2');
    const cardExpiration = document.getElementById('dataCredit3');
    const debitNumber = document.getElementById('dataDebit');

    if (selectedPayment && selectedPayment.id === 'paymentByCredit') {
      if (!cardNumber.value || !cardSecurityCode.value || !cardExpiration.value) {
        event.preventDefault();
        event.stopPropagation();
        cardNumber.classList.add('is-invalid');
        cardSecurityCode.classList.add('is-invalid');
        cardExpiration.classList.add('is-invalid');
      } else {
        cardNumber.classList.remove('is-invalid');
        cardSecurityCode.classList.remove('is-invalid');
        cardExpiration.classList.remove('is-invalid');
      }
    } else if (selectedPayment && selectedPayment.id === 'paymentByDebit') {
      if (!debitNumber.value) {
        event.preventDefault();
        event.stopPropagation();
        debitNumber.classList.add('is-invalid');
      } else {
        debitNumber.classList.remove('is-invalid');
      }
    }
  });

  // Escucha cambios en la selección del formulario de forma de pago
  const paymentRadioButtons = document.querySelectorAll('input[name="flexRadioDefault1"]');
  paymentRadioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
      const selectedPayment = document.querySelector('input[name="flexRadioDefault1"]:checked');
      const selectedPaymentMethod = document.getElementById('selectedPaymentMethod');
      const paymentMethodFeedback = document.getElementById('paymentMethodFeedback');
      if (selectedPayment) {
        selectedPaymentMethod.textContent = (selectedPayment.id === 'paymentByCredit') ? 'Tarjeta de crédito' : 'Transferencia bancaria';
        paymentMethodFeedback.style.display = 'none';
      }
    });
  });
})();




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

/*!
 Inicio del codigo darkmode/light/auto
 */

 (() => {
  'use strict'

  const storedTheme = localStorage.getItem('theme')

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = function (theme) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active use')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          localStorage.setItem('theme', theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()

/*!
Fin del codigo darkmode/light/auto
*/