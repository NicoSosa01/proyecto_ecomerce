// Obtiene el ID del producto seleccionado del almacenamiento local
const selectedProductId = localStorage.getItem("selectedProductId");

// URL para obtener información del producto utilizando el ID
const productUrl = `${PRODUCT_INFO_URL}${selectedProductId}${EXT_TYPE}`;

// URL para obtener los comentarios del producto
const productCommentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${selectedProductId}.json`;

// Función asincrónica para obtener y mostrar la información del producto
async function fetchProductInfo() {
  const productResponse = await fetch(productUrl);
  const productData = await productResponse.json();

  // Muestra la información del producto
  displayProductInfo(productData);

  // Muestra los productos relacionados
  displayRelatedProducts(productData.relatedProducts);


  // Llama a la función para obtener y mostrar los comentarios
  fetchProductComments();
}

// Función para mostrar la información del producto en la página
function displayProductInfo(product) {
  const productInfoContainer = document.getElementById("product-info-container");
  productInfoContainer.className = "mb-2";
  productInfoContainer.innerHTML = `
    <h2 class="mb-5 mt-5">${product.name}
    <button type="button" class="btn btn-pay float-end m-2">Comprar</button>
    </h2><hr>
    <div>
      <strong>Descripción</strong>
      <a class="float-end m-2 text-reset text-decoration-none" href="products.html">
      <button class="cssbuttons-io-button">
  Volver
  <div class="icon">
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
</button>
</a>
      <p>${product.description}</p>
    </div>
    <div>
      <strong>Categoría</strong>
      <p>${product.category}</p>
    </div>
    <div>
      <strong>Precio</strong>
      <p>${product.currency} ${product.cost}</p>
    </div>
    <div>
      <strong>Cantidad de vendidos</strong>
      <p>${product.soldCount}</p>
    </div>
    <p><strong>Imágenes ilustrativas</strong></p>
  `;

  // Botón comprar
const buyButton = productInfoContainer.querySelector(".btn.btn-pay.float-end");
buyButton.addEventListener("click", () => {
  // Obtiene la información del producto
  const productId = product.id;
  const productName = product.name;
  const productCost = product.cost;
  const productCurrency = product.currency;
  const productCount = 1;
  const productImage = product.images[0];

  // Objeto que representa el producto
  const productToAdd = {
    id: productId,
    name: productName,
    unitCost: productCost,
    currency: productCurrency,
    count: productCount,
    images: productImage
  };

  // Obtiene el carrito de compras actual desde localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Verifica si el producto ya está en el carrito
  const existingProduct = cart.find(item => item.name === productToAdd.name);

  if (existingProduct) {
    // Muestra un modal SweetAlert personalizado con la imagen del producto
    Swal.fire({
      title: 'Producto ya agregado',
      text: 'Este producto ya está en tu carrito.',
      imageUrl: productToAdd.images,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Imagen del producto',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  } else {
    // Agrega el producto al carrito
    cart.push(productToAdd);

    // Actualiza el carrito en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notifica al usuario que el producto se agregó al carrito
    Swal.fire({
      title: '¡Producto agregado!',
      text: 'El producto se ha agregado al carrito de compras.',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    });
  }
});

  // Obtiene el contenedor del carrusel
  const carouselInner = document.getElementById("carousel-inner");

  // Recorre el array de imágenes y crea elementos de carrusel para cada una
  product.images.forEach((imageURL, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    
    // Marca la primera imagen como activa
    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const image = document.createElement("img");
    image.src = imageURL;
    image.classList.add("d-block", "img-fluid", "w-100");
    image.alt = `${product.name} - Imagen ${index + 1}`;

    carouselItem.appendChild(image);
    carouselInner.appendChild(carouselItem);
  });
}

// Función para mostrar los productos relacionados
function displayRelatedProducts(relatedProducts) {
  const relatedProductsContainer = document.getElementById("prodRel");

  relatedProducts.forEach((relatedProduct) => {
    const relatedProductCard = document.createElement("div");
    relatedProductCard.classList.add("col-md-4");

    relatedProductCard.innerHTML = `
      <div class="card mb-4 shadow-sm related-product-card">
        <img src="${relatedProduct.image}" class="img-fluid product-image">
        <div class="card-body">
          <h6 class="card-title">${relatedProduct.name}</h6>
        </div>
      </div>
    `;

    relatedProductsContainer.appendChild(relatedProductCard);

    // Agrega un evento de clic a cada tarjeta de producto relacionado
    relatedProductCard.addEventListener("click", () => {
        // Guarda el ID del producto relacionado en el almacenamiento local
        localStorage.setItem("selectedProductId", relatedProduct.id);
        // Redirige a la página del producto
        window.location.href = "product-info.html";
    });
  });
}

// Llama a la función para obtener y mostrar la información del producto cuando la página se carga
fetchProductInfo();

// Función asincrónica para obtener y mostrar los comentarios del producto
async function fetchProductComments() {
  const commentsResponse = await fetch(productCommentsUrl);
  const commentsData = await commentsResponse.json();

  commentsData.sort((a, b) => {
    const dateA = new Date(a.dateTime);
    const dateB = new Date(b.dateTime);
    return dateA - dateB;
  });

  const commentsContainer = document.getElementById("comments"); 
  
  commentsContainer.innerHTML = `<h3 class="mb-3 mt-4">Comentarios</h3>`; 

  
  commentsData.forEach((comment) => {
    const commentItem = document.createElement("li");
    commentItem.className = "list-group-item";
    
    
    commentItem.innerHTML = `
      <p class="mb-1"><span class="fw-bold">${comment.user}</span> . ${comment.dateTime} . ${showStars(comment.score)}</p>
      <p class="mb-1">${comment.description}</p>
    `;
    
    
    commentsContainer.appendChild(commentItem);
  });
}

// Función para mostrar estrellas
function showStars(rating) {
  let fullStars = '<span class="fa fa-star checked"></span>';
  let emptyStars = '<span class="fa fa-star"></span>';
  let starRating = fullStars.repeat(rating) + emptyStars.repeat(5 - rating);

  return starRating;
}


//Desafiate
const submitButton = document.getElementById("submitComment");

submitButton.addEventListener("click", submitComment);

function submitComment() {
  // Obtiene el texto del comentario y la puntuación ingresados por el usuario
  const commentText = document.getElementById("commentText").value;
  const rating = document.getElementById("rating").value;
  const selectedProductId = localStorage.getItem("selectedProductId");

  // Valida que se haya ingresado un comentario y una puntuación
  if (commentText.trim() === "" || rating < 1 || rating > 5) {
    alert("Por favor, ingresa un comentario y una puntuación válida (entre 1 y 5).");
    return;
  }

  // Crea un nuevo comentario como objeto
  const comment = {
    user: localStorage.getItem('email'),
    dateTime: getCurrentDateTime(),
    score: rating,
    description: commentText
  };

  // Obtiene los comentarios existentes del localStorage o crea un nuevo objeto
  const storedComments = JSON.parse(localStorage.getItem('productComments')) || {};

  // Obtiene la lista de comentarios para el producto seleccionado
  const productComments = storedComments[selectedProductId] || [];

  // Agrega el nuevo comentario a la lista de comentarios del producto
  productComments.push(comment);

  // Asocia la lista de comentarios actualizada con el producto seleccionado
  storedComments[selectedProductId] = productComments;

  // Guarda el objeto de comentarios en el localStorage
  localStorage.setItem('productComments', JSON.stringify(storedComments));

  // Limpia el formulario después de enviar el comentario
  document.getElementById("commentText").value = "";
  document.getElementById("rating").value = "";

  // Agrega el comentario del usuario al contenedor de comentarios de usuarios
  const userCommentsContainer = document.getElementById("userComments");
  userCommentsContainer.appendChild(createCommentElement(comment));
}

// Función para crear un elemento de comentario
function createCommentElement(comment) {
  const userCommentItem = document.createElement("div");
  userCommentItem.className = "list-group-item";
  userCommentItem.innerHTML = `
    <p class="mb-1"><span class="fw-bold">${comment.user}</span> . ${comment.dateTime} . ${showStars(comment.score)}</p>
    <p class="mb-1">${comment.description}</p>
  `;
  return userCommentItem;
}

function loadCommentsFromLocalStorage() {
  const selectedProductId = localStorage.getItem("selectedProductId");
  const storedComments = JSON.parse(localStorage.getItem('productComments')) || {};
  const productComments = storedComments[selectedProductId] || [];
  const userCommentsContainer = document.getElementById("userComments");
  
  
  productComments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    userCommentsContainer.appendChild(commentElement);
  });
}

// Función para obtener la fecha y hora actual
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Suma 1 porque los meses comienzan desde 0
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Llama a la función para cargar los comentarios del localStorage cuando la página se carga
loadCommentsFromLocalStorage();

 
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