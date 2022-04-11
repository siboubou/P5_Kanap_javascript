//------------------- On récupère les données de l'API -----------------
const getProducts = async () => {
  let result = await fetch(`http://localhost:3000/api/products/`);
  return await result.json();
};

//---------------  On récupère les données du LocalStorage -------------
const cart = JSON.parse(localStorage.getItem("panier"));

//---------------- AFFICHAGE DES PRODUITS DANS LE PANIER --------------------

//----- Création Emplacement DOM
const panierPosition = document.querySelector("#cart__items");

async function afficheProductCard() {
  let products = await getProducts();

  //pour chaque produit dans le localStorage
  for (let product = 0 ; product < cart.length ; product++) {
  
  //on va chercher le produit dans l'API qui a le même id pour récupérer ses infos qui ne sont pas dans le Storage (nom, prix, image…)
    let foundProduct = products.find((p) => p._id == cart[product].id);

  // on crée son <article>
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${cart[product].id}`);
    article.setAttribute("data-color", `${cart[product].color}`);

    panierPosition.appendChild(article);

  // On crée sa div image
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

      //------------- Gestion de l'input quantité --------------------
      itemQuantity.addEventListener("change", function (e) {
        changeQuantity(cart, product, e);
      });
      //-------------------------------------------------------------

      divSettingsQuantity.appendChild(quantityProduct);
      divSettingsQuantity.appendChild(itemQuantity);
      divSettings.appendChild(divSettingsQuantity);

      const divSettingsDelete = document.createElement("div");
      divSettingsDelete.classList.add("cart__item__content__settings__delete");
      const deleteProduct = document.createElement("p");
      deleteProduct.classList.add("deleteItem");
      deleteProduct.textContent = "Supprimer";

      /*------------ Gestion du bouton supprimer --------------------
      * Au click sur "supprimer"
      * Une alerte de confirmation s'ouvre
      * si ok la fonction removeProduct est appelée (supression du produit)
      * si annuler on reste sur la page panier
      * Si le panier se retrouve vide à la suite de cette opération alertEmptycart est appelée
      */

      deleteProduct.addEventListener("click", function (e) {
        let article = e.target.closest(".cart__item");
        if (
          confirm(
            `Votre article ${foundProduct.name} ${article.dataset.color} va être supprimé du panier`
          )
        ) {
          removeProduct(e);
        } else {
          window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
        }

        if (cart == 0) {
          AlertEmptyCart();
        }
      });
      //-------------------------------------------------------------

      divSettingsDelete.appendChild(deleteProduct);
      divSettings.appendChild(divSettingsDelete);
      divContent.appendChild(divSettings);
      article.appendChild(divContent);
    
  }
}

afficheProductCard();

/*--------------------- Affichage de la quantité totale ------------------
* On parcourt le storage
* Pour chaque article on ajoute sa quantité à la quantité totale
* La quantité totale est intégrée au html
*/

let totalQuantity;
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

/*--------------------- Affichage du prix total ------------------
* On parcourt le storage
* Pour chaque article on ajoute son (prix * quantité) au prix total
* Comme le prix n'est pas conservé dans le localstorage on va chercher le prix de l'article qui a le même id dans l'API
* Le prix total est intégré au html
*/
//-------------------------------------------------------

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

//----------------------------------------------------------------------------
//-------------------------- MODIFICATION DU PANIER --------------------------

function savePanier(cart) {
  localStorage.setItem("panier", JSON.stringify(cart));
}

/*----------------------- Modification des quantités  ------------------------
* Fonction appelée lorsqu'on modifie l'input quantité cf itemQuantity
* LocalStorage mis à jour
* Quantité totale et Prix total mis à jours
*/

function changeQuantity(cart, product, e) {
  cart[product].quantity = e.target.value;
  savePanier(cart);
  displayTotalQuantity(cart);
  displayTotalPrice(cart);
}

/*------------------------ Supression de l'article ------------------------
* Fonction appelée lorsqu'on clique sur "supprimer" cf deleteItem
* Pour chaque article du localStorage on retire l'article qui a l'index sur le

* LocalStorage mis à jour
* Quantité totale et Prix total mis à jours
*/
async function removeProduct(e) {
  let article = e.target.closest(".cart__item");

  for (let index = 0; index < cart.length; index++) {
  let product = cart[index];

    if (
      product["id"] == article.dataset.id &&
      product["color"] == article.dataset.color
    ) {
      cart.splice(product, 1); //supprime l'article du localStorage
      //cart = cart.filter((p) => p.id != product.id || p.color != product.color);
      panierPosition.removeChild(article); // supprime l'article du html
    }
 }

  savePanier(cart);
  displayTotalQuantity(cart);
  displayTotalPrice(cart);
}

//--------------------- Alerte lorsque le panier vide --------------------
// Redirige vers la page accueil dès que localStorage est vide

function AlertEmptyCart() {
  alert("Votre panier est vide, vous allez être redirigé vers la page accueil");
  window.location.href = "http://127.0.0.1:5500/front/html/index.html";
}

if (cart == 0 ) {
  AlertEmptyCart();
}
//----------------------------------------------------------------------

//-------------------------------------------------------------------
//--------------------------- FORMULAIRE ---------------------------

let form = document.querySelector(".cart__order__form");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
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

//Écouter la modification de l'adresse
lastName.addEventListener("change", function () {});

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

//---- Tableau des produits du panier

let productTab = [];
for (i = 0; i < cart.length; i++) {
  productTab.push(cart[i].id);
}

//---- objet à envoyer
let objectToSend = {};
objectToSend.products = productTab;

//-------
let btnSubmit = document.getElementById("order");

function submitOrder(objectToSend) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objectToSend),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?orderId=${data.orderId}`;
    })

    .catch((error) => console.log("erreur POST : ", error));
}

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();

  let contactObj = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };
  objectToSend.contact = contactObj;

  if (
    firstName.value !== "" &&
    lastName.value !== "" &&
    address.value !== "" &&
    city.value !== "" &&
    email.value !== ""
  ) {
    submitOrder(objectToSend);
    localStorage.clear();
    form.reset();
  } else {
    alert(
      `Merci de remplir tous les champs du formulaire pour que l'on puisse vous envoyer votre commande`
    );
  }
});




