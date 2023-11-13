const catID = localStorage.getItem("catID"); // Se obtiene el ID de categoría de productos almacenado en el almacenamiento local bajo la clave (key) "catID".
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; // Se construye la URL para obtener los datos de productos de la categoría especificada 


let productsData = []; // Variable para almacenar los datos de los productos
let currentSortCriteria = "sortByCount"; // Criterio de orden actual
let searchQuery = ""; // Consulta de búsqueda actual


// Función asincrónica para obtener y mostrar los productos
async function fetchProducts() {
    const response = await fetch(url); // Se obtiene la respuesta de la URL
    const data = await response.json(); // Los datos JSON se convierten en un objeto

    productsData = data.products; // Se almacenan los datos de productos

    // Se actualiza el título de la sección con el nombre de la categoría
    const titleSection = document.getElementById("title-section");
    titleSection.innerHTML = ` 
    <h2 class="alert-heading">Productos</h2>
    <p>Verás aquí todos los productos de la categoría ${data.catName}</p>  
`;

    // Se filtran y muestran los productos
    filterAndDisplayProducts();

}


// Resto del código para mostrar los productos y la sección de filtros

// Función para filtrar y mostrar productos
function filterAndDisplayProducts() {
    // Se obtienen los valores actuales de los elementos de rango de precio y búsqueda
    const minPrice = parseFloat(document.getElementById("rangeFilterPriceMin").value) || 0;
    const maxPrice = parseFloat(document.getElementById("rangeFilterPriceMax").value) || Infinity;

    // Se filtran los productos en base a rango de precio y búsqueda
    const filteredProducts = productsData.filter(product => {   
        const productPrice = parseFloat(product.cost); 
        return productPrice >= minPrice && productPrice <= maxPrice && 
            (product.name.toLowerCase().includes(searchQuery) || 
                product.description.toLowerCase().includes(searchQuery));
    });


    // Los productos filtrados se ordenan según el criterio de orden actual
    const sortedProducts = sortProducts(filteredProducts, currentSortCriteria);

    
    const productsList = document.getElementById("products-list"); // Se obtiene el contenedor de lista de productos
    productsList.innerHTML = ""; // Se limpia la lista antes de agregar los productos ordenados y filtrados

    // Por cada producto en los productos ordenados, se crea y agrega una tarjeta de producto al contenedor
    sortedProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "card mb-3";
        productCard.innerHTML = ` 
        <a href="product-info.html" class="product-link" data-product-id="${product.id}">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="card-title">${product.name} - ${product.currency} ${product.cost}</h3>
                        <p class="card-text text-muted">${product.soldCount} vendidos</p>
                    </div>
                    <p class="card-text">${product.description}</p>
                </div>
            </div>
        </div>
    `;
        productsList.appendChild(productCard);
        
    const productLink = productCard.querySelector(".product-link");
    productLink.addEventListener("click", () => {
        // Guarda el identificador del producto en el almacenamiento local
        localStorage.setItem("selectedProductId", product.id);
    });
    });
}

// Función para ordenar productos según el criterio proporcionado
function sortProducts(productsArray, criteria) { 
    return productsArray.slice().sort((a, b) => {  
        if (criteria === "sortAscPrice") { 
            return parseFloat(a.cost) - parseFloat(b.cost);  
        } else if (criteria === "sortDescPrice") { 
            return parseFloat(b.cost) - parseFloat(a.cost); 
        } else if (criteria === "sortDescRelevance") { 
            return parseInt(b.soldCount) - parseInt(a.soldCount); 
        } else {
            return 0; 
        }
    });
}

// Evento que se activa cuando el DOM se ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Se obtienen y muestran los productos iniciales

    // Agrega listeners para los botones de ordenamiento y filtros
    document.getElementById("sortAscPrice").addEventListener("click", function () { 
        currentSortCriteria = "sortAscPrice";  
        filterAndDisplayProducts();   
    });

    document.getElementById("sortDescPrice").addEventListener("click", function () { 
        currentSortCriteria = "sortDescPrice";
        filterAndDisplayProducts();  
    });

    document.getElementById("sortDescRelevance").addEventListener("click", function () { 
        currentSortCriteria = "sortDescRelevance"; 
        filterAndDisplayProducts();  
    });

    // Escuchador de evento para la entrada de búsqueda
    document.getElementById("searchInput").addEventListener("input", function () {  
        searchQuery = this.value.toLowerCase(); 
        filterAndDisplayProducts();   
    });

    // Escuchadores de evento para los botones de limpieza y rango de precio
    document.getElementById("clearRangeFilter").addEventListener("click", function () { 
        document.getElementById("rangeFilterPriceMin").value = "";  
        document.getElementById("rangeFilterPriceMax").value = "";  
        filterAndDisplayProducts();  
    });

    // Cuando ocurre un evento de click en los elementos relacionados con el rango de precio
    document.getElementById("rangeFilterPrice").addEventListener("click", filterAndDisplayProducts);
    document.getElementById("rangeFilterPriceMin").addEventListener("click", filterAndDisplayProducts);
    document.getElementById("rangeFilterPriceMax").addEventListener("click", filterAndDisplayProducts);



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