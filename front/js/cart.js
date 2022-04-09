const getProducts = async () => {
  let result = await fetch(`http://localhost:3000/api/products/`);
  return await result.json();
}

/*async function getProducts() {
  await fetch(`http://localhost:3000/api/products/`)
    .then((res) => res.json())
    .then((response) => {
      products = response;
    })
    .catch((err) => console.log("erreur GET api", err));
}
*/

//---------- On récupère les données du panier dans l'objet cart ---------
let cart = localStorage.getItem("panier");
console.log(typeof cart);

cart = JSON.parse(cart);

console.log(typeof cart);
console.log(cart);

//fonction qui vérifie ce qui est déja dans le panier
function getPanier(){
  let productsIn = localStorage.getItem('panier') ;
  console.log(typeof productsIn)
  if(productsIn == null){
      return [];
  } else {
      return JSON.parse(productsIn);
      
  }   
}



//------------------- Création Emplacement DOM  -----------------------------

const panierPosition = document.querySelector("#cart__items");

//------- Carte du produit dans le panier

async function afficheProductCard() {
  let products = await getProducts();

  //pour chaque produit dans le localStorage on crée son <article> html
  for (let product = 0; product < cart.length; product++) {
    
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${cart[product].id}`);
    article.setAttribute("data-color", `${cart[product].color}`);

    panierPosition.appendChild(article);

  //on va chercher le produit dans l'API qui a le même id pour récupérer toutes ses données
    let foundProduct = products.find((p) => p._id == cart[product].id);

    if (foundProduct != undefined) {
      //div image
      const divImage = document.createElement("div");
      divImage.classList.add("cart__item__img");

      const img = document.createElement("img");
      img.setAttribute("src", `${foundProduct.imageUrl}`);
      img.setAttribute("alt", `${foundProduct.altTxt}`);

      divImage.appendChild(img);
      article.appendChild(divImage);

      //div content

      const divContent = document.createElement("div");
      divContent.classList.add("cart__item__content");

      //div content description

      const divContentDescription = document.createElement("div");
      divContentDescription.classList.add("cart__item__content__description");

      const nameProduct = document.createElement("h2");
      nameProduct.textContent = `${foundProduct.name}`;

      const colorProduct = document.createElement("p");
      colorProduct.textContent = `${cart[product].color}`;

      const priceProduct = document.createElement("p");
      priceProduct.textContent = `${foundProduct.price} €`;

      divContentDescription.appendChild(nameProduct);
      divContentDescription.appendChild(colorProduct);
      divContentDescription.appendChild(priceProduct);
      divContent.appendChild(divContentDescription);

      //div content settings
      const divSettings = document.createElement("div");
      divSettings.classList.add("cart__item__content__settings");

      const divSettingsQuantity = document.createElement("div");
      divSettingsQuantity.classList.add(
        "cart__item__content__settings__quantity"
      );

      const quantityProduct = document.createElement("p");
      quantityProduct.textContent = `Qté : `;

      let itemQuantity = document.createElement("input");

      itemQuantity.classList.add("itemQuantity");
      itemQuantity.setAttribute("type", "number");
      itemQuantity.setAttribute("name", "itemQuantity");
      itemQuantity.setAttribute("min", "1");
      itemQuantity.setAttribute("max", "100");
      itemQuantity.setAttribute("value", `${cart[product].quantity}`);

      //  Gestion de l'input quantité
      itemQuantity.addEventListener("change", function (e) {
        changeProductQuantityInLocalStorage(cart, product, e);
        console.log(e.target.value);
      });

      divSettingsQuantity.appendChild(quantityProduct);
      divSettingsQuantity.appendChild(itemQuantity);

      divSettings.appendChild(divSettingsQuantity);

      const divSettingsDelete = document.createElement("div");
      divSettingsDelete.classList.add("cart__item__content__settings__delete");
      const deleteProduct = document.createElement("p");
      deleteProduct.classList.add("deleteItem");
      deleteProduct.textContent = "Supprimer";

      //Gestion du bouton supprimer //ajouter e dans paramètre
      deleteProduct.addEventListener("click", function (e) { 
          removeHtml(e);
          removeProductFromLocalStorage(product, foundProduct)
      })

      divSettingsDelete.appendChild(deleteProduct);
      divSettings.appendChild(divSettingsDelete);

      divContent.appendChild(divSettings);
      article.appendChild(divContent);
    }
  }

}

afficheProductCard();

/*function removeProductFromLocalStorage (product){

    

  cart.splice(product, 1) ;
  product--;


  savePanier(cart);
  displayTotalQuantity(cart);
  displayTotalPrice(cart);

}
*/


//---------- Afficher la quantité totale --------------------------
let totalQuantity ;
let totalQuantityPosition = document.getElementById("totalQuantity");

function displayTotalQuantity(cart) {
  totalQuantity = 0;

  for (let i = 0; i < cart.length; i++) {
    let productQuantityInCart = JSON.parse(cart[i].quantity);
    totalQuantity += productQuantityInCart;
  }

  totalQuantityPosition.innerHTML = totalQuantity;
}

displayTotalQuantity(cart);

//---------- Afficher le prix total --------------------------------

let totalPrice;
let totalPricePosition = document.getElementById("totalPrice");

async function displayTotalPrice(cart) {
  totalPrice = 0;

  let products = await getProducts();

  for (let i = 0; i < cart.length; i++) {
    let foundProduct = products.find((p) => p._id == cart[i].id);
    let productPriceInCart = foundProduct.price * cart[i].quantity;
    totalPrice += productPriceInCart;
  }

  totalPricePosition.innerHTML = totalPrice;
}

displayTotalPrice(cart);


//------------------- Modification du Panier ---------------------

function savePanier(cart) {
  localStorage.setItem("panier", JSON.stringify(cart));
}

//-------- Modification des quantités dans le localStorage  ----------
// Fonction appelée lorsqu'on modifie l'input quantité

function changeProductQuantityInLocalStorage(cart, product, e) {
    cart[product].quantity = e.target.value;
    savePanier(cart);
    displayTotalQuantity(cart);
    displayTotalPrice(cart);
}

//---------- Supression de l'article sur la page panier ------

function removeHtml(e){             //----------------------------------- OK
  let htmlProduct = e.target.closest('article');
  panierPosition.removeChild(htmlProduct);
}


//---------- Supression de l'article du Localstorage ------

function removeProductFromLocalStorage (product, foundProduct){
 
  if (confirm (`Votre article ${foundProduct.name} ${cart[product].color} va être supprimé du panier`)){
    cart = cart.filter (p => p.id != cart[product].id || p.color != cart[product].color);
  

  savePanier(cart);
  displayTotalQuantity(cart);
  displayTotalPrice(cart);

  } else{
    window.location.href='http://127.0.0.1:5500/front/html/cart.html'
  }
  
}

//--------- Alerte lorsque le panier vide -----

function AlertEmptyCart(){
  if ( cart == 0){
    if(confirm('Votre panier est vide, vous allez être rediriger vers la page accueil')){
      window.location.href='http://127.0.0.1:5500/front/html/index.html'
    }
  }
}
AlertEmptyCart();

/*
function removeFromLocalStorage(product) {

  let productsIn = getPanier();
  console.log(typeof productsIn)
  console.log(productsIn)

    productsIn.splice(product, 1);
    product--;

    console.log('productsIn apres supression :', productsIn)
    savePanier(productsIn)
  
}

/*
  console.log(deleteBtnList)

  for (let i = 0 ; i< deleteBtnList.length ; i++){
    deleteBtnList[i].addEventListener("click", function(){
      console.log('on a supprimé')

      /*if ( i = product){
        cart = cart.filter(p => p.id != cart[product])
      }
    }) 
  }
}  
appuieDelete();
*/




/*function removeCostStorage(product){
  
  let foundProductId = panier.find(p => p.id == product.id)
  let foundColor = panier.find(p => p.color == product.color)
  let costPanier = JSON.parse(localStorage.getItem('totalCost'));


  if (foundProductId == undefined && foundColor == undefined) {
    costPanier = costPanier - (foundProduct.price * product.quantity) ;
    
    localStorage.setItem('totalCost', JSON.stringify(costPanier));
  }   
}
*/






/*
let totalPrice = document.getElementById('totalPrice')
let priceStorage = localStorage.getItem('totalCost')
priceStorage = JSON.parse(priceStorage)

totalPrice.textContent = priceStorage
*/

//Modifier quantité


//-------------------------------------
//FORMULAIRE

let form = document.querySelector(".cart__order__form");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let adress = document.getElementById("adress");
let city = document.getElementById("city");
let email = document.getElementById("email");

//Écouter la modification du prénom
firstName.addEventListener("change", function () {
  validFirstName(this);
});

//Écouter la modification du prénom
lastName.addEventListener("change", function () {
  validLastname(this);
});

//Écouter la modification de la ville
city.addEventListener("change", function () {
  validCity(this);
});

//Écouter la modification de l'email
email.addEventListener("change", function () {
  validEmail(this);
});

//Fonction de validation de l'email
const validEmail = function (inputEmail) {
  let emailRegexp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );

  let testEmail = emailRegexp.test(inputEmail.value);
  let emailMsg = document.getElementById("emailErrorMsg");

  if (testEmail == true) {
    emailMsg.innerText = "email valide";
    emailMsg.style.color = "#3FFF00";

    return true;
  } else {
    emailMsg.innerText = "email non valide";
    emailMsg.style.color = "red";

    return false;
  }
};

const validFirstName = function (inputFirstName) {
  let firstNameRegexp = /^[çñ\s\-a-zA-Z]+$/g;
  let testFirstName = firstNameRegexp.test(inputFirstName.value);
  let firstNameMsg = document.getElementById("firstNameErrorMsg");

  if (testFirstName == true) {
    firstNameMsg.innerText = "prénom valide";
    firstNameMsg.style.color = "#3FFF00";
    return true;
  } else {
    firstNameMsg.innerText = "seules les lettres sont autorisées";
    firstNameMsg.style.color = "red";
    return false;
  }
};

const validLastname = function (inputLastName) {
  let lastNameRegexp = /^[çñ\s\-a-zA-Z]+$/g;
  let testLastName = lastNameRegexp.test(inputLastName.value);
  let lastNameMsg = document.getElementById("lastNameErrorMsg");

  if (testLastName == true) {
    lastNameMsg.innerText = "nom valide";
    lastNameMsg.style.color = "#3FFF00";
    return true;
  } else {
    lastNameMsg.innerText = "seules les lettres sont autorisées";
    lastNameMsg.style.color = "red";
    return false;
  }
};

const validCity = function (inputCity) {
  let cityRegexp = /^[\s\-a-zA-Z]+\s{1}[0-9]{5}$/g;
  let testCity = cityRegexp.test(inputCity.value);
  let cityMsg = document.getElementById("cityErrorMsg");

  if (testCity == true) {
    cityMsg.innerText = "ville valide";
    cityMsg.style.color = "#3FFF00";
    return true;
  } else {
    cityMsg.innerText = `merci d'entrer le nom de la ville suivi du code postal, ex : Créteil 94000  `;
    cityMsg.style.color = "red";
    return false;
  }
};

function send(e) {
  e.preventDefault();

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
    }),
  });
}
