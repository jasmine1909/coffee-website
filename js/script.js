const menuBtn = document.getElementById("menu-btn");
const navbar = document.querySelector(".navbar");
const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector("#search-btn");

const cartBtn = document.getElementById("cart-btn");
const cartContainer = document.querySelector(".cart-items-container");
menuBtn.onclick = () => {
  navbar.classList.toggle("active");

  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};

searchBtn.onclick = () => {
  searchForm.classList.toggle("active");
  navbar.classList.remove("active");
  cartItem.classList.remove("active");
};

window.onscroll = () => {
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};

//////cart

cartBtn.addEventListener("click", () => {
  cartContainer.classList.toggle("active");
  navbar.classList.remove("active");
});
const productList = document.querySelector(".menu-wrapper");
const cartList = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.querySelector(".cart-count-info");

eventListeners();
function eventListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    loadCart();
    productList.addEventListener("click", purchaseProduct);
    cartList.addEventListener("click", deleteProduct);
  });
}

// update cart info
function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}

// load product items content form JSON file
function loadJSON() {
  fetch("menu.json")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((product) => {
        html += `
              <div class = "menu-item">
                  
              <img src="${product.imgSrc}" alt="" />
              <h3 class="menu-name">${product.name}</h3>
              <div class="price">${product.price}</div>
              <button class="cart-add">add to cart</button>
              </div>
          `;
      });
      productList.innerHTML = html;
    })
    .catch((error) => {
      alert(`User live server or local server`);
      //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
    });
}

// purchase product
function purchaseProduct(e) {
  if (e.target.classList.contains("cart-add")) {
    let product = e.target.parentElement;
    getProductInfo(product);
  }
}

// get product info after add to cart button click
function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector(".menu-item img").src,
    name: product.querySelector(".menu-name").textContent,

    price: product.querySelector(".price").textContent,
  };
  cartItemID++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

// add the selected product to the cart list
function addToCartList(product) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.innerHTML = `

  <img src="${product.imgSrc}" alt="" />
  <div class="cart-item-info">
    <h3 class="cart-item-name">${product.name}</h3>
    <span class="cart-item-price">${product.price}</span>
  </div>

  
  <div class="del-btn"><i class="fas fa-times"></i></div>

  `;
  cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));
  updateCartInfo();
}

// get all the products info if there is any in the local storage
function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
  // returns empty array if there isn't any product info
}

// load carts product
function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1; // if there is no any product in the local storage
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
    // else get the id of the last product and increase it by 1
  }
  products.forEach((product) => addToCartList(product));

  // calculate and update UI of cart info
  updateCartInfo();
}

// calculate total price of the cart and other info
function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price); // removing dollar sign
    return (acc += price);
  }, 0); // adding all the prices

  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}

// delete product from cart list and local storage
function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove(); // this removes from the DOM only
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); // this removes from the DOM only
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts)); // updating the product list after the deletion
  updateCartInfo();
}

window.onscroll = () => {
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
};
