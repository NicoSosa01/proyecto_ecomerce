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












const userEmailInput = document.querySelector("#userEmail");
const imageUser = document.querySelector("#userImgInput");
const firstNameInput = document.querySelector("#firstName");
const secondNameInput = document.querySelector("#secondName");
const firstLastNameInput = document.querySelector("#firstLastName");
const secondLastNameInput = document.querySelector("#secondLastName");
const contactCelInput = document.querySelector("#contactCel");
const btnSave = document.querySelector("#modalInfoSave");
const img = document.querySelector("#imgUser");

let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

// Función para validar los campos obligatorios
function validateFields() {
    const requiredFields = [firstNameInput, firstLastNameInput];
    let isValid = true;

    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            isValid = false;
            field.classList.remove("is-valid");
            field.classList.add("is-invalid");
        } else {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
        }
    });

    return isValid;
}

// Función para cargar la información del usuario
function loadUserInfo() {
    const savedEmail = localStorage.getItem('email');

    userEmailInput.value = savedEmail || "";

    if (userInfo) {
        firstNameInput.value = userInfo.name || "";
        firstLastNameInput.value = userInfo.lastName || "";
        secondNameInput.value = userInfo.secondName || "";
        secondLastNameInput.value = userInfo.secondLastName || "";
        contactCelInput.value = userInfo.tel || "";

        // Muestra el número de teléfono en el perfil
        document.querySelector("#tel").textContent = userInfo.tel || "Opcional";
    }

    if (userInfo.name && userInfo.lastName) {
        const fullName = `${userInfo.name} ${userInfo.secondName || ''} ${userInfo.lastName} ${userInfo.secondLastName || ''}`;
        document.querySelector("#userName").textContent = fullName;
    }

    // Muestra el email en el perfil
    const email = userEmailInput.value || "N/A";
    document.querySelector("#email").textContent = email;

    // Muestra la foto de perfil
    if (localStorage.getItem("userPic")) {
        img.src = localStorage.getItem("userPic");
    } else {
        img.src = "img/img_perfil.png";
    }
}

// Llama a la función para cargar la información del usuario
loadUserInfo();

// Habilita la edición al pulsar el botón "Modificar Info".
btnSave.addEventListener("click", () => {
    if (btnSave.textContent === "Modificar Info") {
        // Habilita edición
        [firstNameInput, firstLastNameInput, secondNameInput, secondLastNameInput, contactCelInput].forEach(field => {
            field.removeAttribute("readonly");
        });
        btnSave.textContent = "Guardar";
    } else {
        // Guarda la información del usuario
        if (validateFields()) {
            userInfo.name = firstNameInput.value;
            userInfo.lastName = firstLastNameInput.value;
            userInfo.secondName = secondNameInput.value;
            userInfo.secondLastName = secondLastNameInput.value;
            userInfo.tel = contactCelInput.value;

            const fullName = `${userInfo.name} ${userInfo.secondName || ''} ${userInfo.lastName} ${userInfo.secondLastName || ''}`;
            document.querySelector("#userName").textContent = fullName;

            // Muestra el número de teléfono en el perfil
            document.querySelector("#tel").textContent = userInfo.tel || "Opcional";

            // Guarda la información del usuario en el almacenamiento local
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            // Desactiva la edición y vuelve a cambiar el texto del botón a "Modificar Info"
            [firstNameInput, firstLastNameInput, secondNameInput, secondLastNameInput, contactCelInput].forEach(field => {
                field.setAttribute("readonly", true);
            });
            btnSave.textContent = "Modificar Info";
        }
    }
});

// Agrega un evento 'input' al campo contactCel
contactCelInput.addEventListener("input", function (e) {
    // Obteine el valor actual del campo
    let inputValue = e.target.value;

    // Quita cualquier carácter que no sea un número
    let numericValue = inputValue.replace(/\D/g, "");

    // Actualiza el valor del campo con solo números
    e.target.value = numericValue;
});



// Cambia la imagen de perfil al seleccionar una imagen
imageUser.addEventListener("change", () => {
    const files = imageUser.files;
    if (!files || !files.length) {
        if (localStorage.getItem("userPic")) {
            img.src = localStorage.getItem("userPic");
        } else {
            img.src = "img/img_perfil.png";
        }
        return;
    }
    

    const firstFile = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(firstFile);
    reader.addEventListener("load", () => {
        img.src = reader.result;

        // Guarda la imagen de perfil en el almacenamiento local
        localStorage.setItem("userPic", reader.result);
    });
});




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

