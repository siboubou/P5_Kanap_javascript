//------------------- On récupère les données de l'API -----------------
const getProducts = async () => {
  let result = await fetch(`http://localhost:3000/api/products/`);
  return await result.json();
};

//---------------  On récupère les données du LocalStorage -------------
let cart = JSON.parse(localStorage.getItem("panier"));


//---------------- AFFICHAGE DES PRODUITS DANS LE PANIER --------------------

//----- Création Emplacement DOM
const panierPosition = document.querySelector("#cart__items");

async function afficheProductCard() {
  let products = await getProducts();

  //pour chaque produit dans le localStorage
  for (let product = 0; product < cart.length; product++) {
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

    /**
     */
    /**------------ Gestion du bouton supprimer --------------------
     * Au click sur "supprimer"
     * @function alertRemove(e) appelée :
     *** Une alerte de confirmation s'ouvre
     *** Si ok la fonction removeProduct sera appelée (supression du produit)
     *** Si annuler on reste sur la page panier
     *** Si le panier se retrouve vide à la suite de cette opération alertEmptycart est appelée
     * 
     */

    deleteProduct.addEventListener("click", function (e) {

      
      alertRemoveProduct.innerHTML = `<p>Votre article ${foundProduct.name} ${article.dataset.color} va être supprimé du panier</p>`;
      alertRemoveProduct.innerHTML +=
        "<button id='alert-close' class='custom-button'> Annuler </button> ";
      alertRemoveProduct.innerHTML +=
        "<button id='alert-ok' class='custom-button'> OK </button> ";

      alertRemove(e);

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

/** ------------------------ Supression de l'article ------------------------
 * Fonction appelée lorsqu'on clique sur "supprimer" cf deleteItem
 * Pour chaque article du localStorage on filtre le localStorage
 * Seuls les produits qui ont un id différent OU une couleur différente sont conservés
 * @param {event} e Dépend du bouton supprimer sur lequel on clique afin que la section correspondante dans le html soit supprimé
 * Le produit est retiré de la page (html)
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
      
      cart = cart.filter((p) => p.id != product.id || p.color != product.color);
      panierPosition.removeChild(article); 
    }
  }

  savePanier(cart);
  displayTotalQuantity(cart);
  displayTotalPrice(cart);
}

//--------------------------- PERSONNALISATION BOITE ALERTE ----------------

let alertContainer = document.createElement("div");
alertContainer.setAttribute("id", "modal");

let alertRemoveProduct = document.createElement("div");
alertRemoveProduct.className = "custom-box";

/**------------------- Alerte suppression produit --------------------
 * 
 * @param {event} e car contien @function removeProduct(e)
 * Ajoute au DOM les div qui créent l'alerte
 * Si click "ok" @function removeProduct est appelée (supression du produit) et @function alertClose est appelée pour fermer l'alerte
 * Si click "annuler" @function alertClose est appelée on reste sur la page panier 
 * Si le panier se retrouve vide à la suite de cette opération @function alertEmptycart est appelée 
 */

function alertRemove(e) {
  alertContainer.appendChild(alertRemoveProduct);
  document.body.prepend(alertContainer);

  document.getElementById("alert-close").addEventListener("click", function () {
    alertClose();
  });

  document.getElementById("alert-ok").addEventListener("click", function () {
    removeProduct(e);
    alertClose();
    if (cart == 0) {
      AlertEmptyCart();
    }
  });
}

/**------------------ Alerte lorsque Local Storage est vide ----------------
 * 
 * Si Localstorage vide cette fonction est appelée
 * Ajoute au DOM les div qui créent l'alerte
 * Force à cliquer "ok" et redirige vers l'accueil
 * On ne peut pas rester sur la page panier si le panier est vide
 */

function AlertEmptyCart() {
  let alertEmptycart = document.createElement("div");
  alertEmptycart.className = "custom-box";

  alertContainer.appendChild(alertEmptycart);
  document.body.prepend(alertContainer);

  alertEmptycart.innerHTML =
    "<p>Votre panier est vide, vous allez être redirigé vers la page accueil</p>";
  alertEmptycart.innerHTML +=
    "<button id='alert-refAccueil' class='custom-button'> OK </button> ";
  document
    .getElementById("alert-refAccueil")
    .addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:5500/front/html/index.html";
    });
}

if (cart == 0) {
  AlertEmptyCart();
}

//--------  Fermeture de la boite alerte
function alertClose(){
  while(alertContainer.hasChildNodes()){
    alertContainer.removeChild(alertContainer.firstChild)
  }
  document.body.removeChild(alertContainer);
}

//----------------------------------------------------------------------

//----------------------------------------------------------------------
//--------------------------- FORMULAIRE -------------------------------

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

//Écouter la modification du nom
lastName.addEventListener("change", function () {
  validLastname(this);
});

//Écouter la modification de l'adresse
address.addEventListener("change", function () {
  validAddress(this);
});

//Écouter la modification de la ville
city.addEventListener("change", function () {
  validCity(this);
});

//Écouter la modification de l'email
email.addEventListener("change", function () {
  validEmail(this);
});


/** --------------- REGEXP PRÉNOM et NOM
 * Commence par une lettre minuscule ou majuscule y compris les lettres avec accent, au moins une fois
* Peut être suivi de caractères alphabétiques séparés par un espace ou un tiret ou une apostrophe à la suite, et ceci le nombre de fois voulu 
 * Ceci le nombre de fois voulu
 * Se termine par un lettre
 */

const nameRegexp =
 /^[a-zA-ZçñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûÔÔŸÿ]+((\s)?(\'|\-)?([a-zA-ZçñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûŸÿ])+)*$/g;

 /**-----------REGEXP ADRESSE
  * Commence par un caractère alphanumérique
  * Peut être suivi de tous caractères alphanumériques séparés par un espace ou un tiret ou une apostrophe, un point, à la suite, et ceci le nombre de fois voulu 
  * Se termine par un caractère alphanumérique
  */
const addressRegexp = /^[a-zA-Z0-9çñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûÔÔŸÿ]+((\s)?(\'|\-|\.)?([a-zA-Z0-9çñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûÔÔŸÿ])+)*?$/g;

/**------------ REGEXP VILLE
 * Commence par une lettre minuscule ou majuscule y compris les lettres avec accent, au moins une fois
 * Peut être suivi de caractères alphabétiques séparés par un espace ou un tiret ou une apostrophe à la suite, et ceci le nombre de fois voulu
 * Se termine par un espace suivi de 5 chiffres (code postal)
 */
let cityRegexp = /^[a-zA-ZçñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûÔÔŸÿ]+((\s)?(\'|\-)?([a-zA-ZçñÄäËëÏïÖöÜüÁáÉéÍíÓóÚúÀàÈèÌìÒòÙùÂâÊêÔôÛûŸÿ])+)*\s{1}[0-9]{5}$/g;

/**--------------- REGEXP EMAIL
 * Tous les caracyères alphanumériques, un point ou tiret ou tiret-bas à la suite
 * Suvi de 1 @
 * Suivi de tous les caracyères alphanumériques,un point ou tiret ou tiret-bas à la suite
 * Se termine par un point et de deux à 20 lettres
 */
const emailRegexp = /^[a-zA-Z0-9]+((\'|\-|\_|\.)?([a-zA-Z0-9])+)*([@]{1})((\'|\-|\_|\.)?([a-zA-Z0-9])+)*([.]{1}[a-z]{2,20})$/




/**----------------- Fonctions de validation du formulaire --------------
 * Test les éléments renseignés avec les Regexp relatives
 * @param {object} input
 * @returns {true} si le test est validé
 */

const validFirstName = (inputFirstName) => {

  let testFirstName = nameRegexp.test(inputFirstName.value);
  let firstNameMsg = document.getElementById("firstNameErrorMsg");

  if (testFirstName == true) {
    firstNameMsg.innerText = "Prénom valide";
    firstNameMsg.style.color = "#3FFF00";
    return true;
  } else {
    firstNameMsg.innerText =
      "Veillez à ne renseigner qu'un espace, tiret ou apostrophe à la fois. Les caracères spéciaux et chiffres ne sont pas autorisés. Vous devez terminer par une lettre";
    firstNameMsg.style.color = "red";
    return false;
  }
};

const validLastname = (inputLastName) => {
  let testLastName = nameRegexp.test(inputLastName.value);
  let lastNameMsg = document.getElementById("lastNameErrorMsg");

  if (testLastName == true) {
    lastNameMsg.innerText = "Nom valide";
    lastNameMsg.style.color = "#3FFF00";
    return true;
  } else {
    lastNameMsg.innerText =
      "Veillez à ne renseigner qu'un espace, tiret ou apostrophe à la fois. Les caracères spéciaux et chiffres ne sont pas autorisés. Vous devez terminer par une lettre";
    lastNameMsg.style.color = "red";
    return false;
  }
};

const validAddress = (inputAddress) => {
  let testAddress = addressRegexp.test(inputAddress.value);
  let addressMsg = document.getElementById("addressErrorMsg");

  if (testAddress == true) {
    addressMsg.innerText = "Adresse valide";
    addressMsg.style.color = "#3FFF00";
    return true;
  } else {
    addressMsg.innerText = `Adresse non valide`;
    addressMsg.style.color = "red";
    return false;
  }
};

const validCity = (inputCity) => {
  let testCity = cityRegexp.test(inputCity.value);
  let cityMsg = document.getElementById("cityErrorMsg");

  if (testCity == true) {
    cityMsg.innerText = "Ville valide";
    cityMsg.style.color = "#3FFF00";
    return true;
  } else {
    cityMsg.innerText = `Merci d'entrer le nom de la ville suivi du code postal, ex : L'Haÿ-les-Roses 94240 `;
    cityMsg.style.color = "red";
    return false;
  }
};

const validEmail = function (inputEmail) {
  let testEmail = emailRegexp.test(inputEmail.value);
  let emailMsg = document.getElementById("emailErrorMsg");

  if (testEmail == true) {
    emailMsg.innerText = "Email valide";
    emailMsg.style.color = "#3FFF00";
    return true;
  } else {
    emailMsg.innerText = "Ex de mail accepté : ja_ja-5.@ka.mele.on ";
    emailMsg.style.color = "red";
    return false;
  }
};

//-------------------------------------------------------------- 




//--------------------- ENVOI DE LA COMMANDE -------------------

let btnSubmit = document.getElementById("order");

//---- Tableau des produits du panier à envoyer

let productTab = [];
for (i = 0; i < cart.length; i++) {
  productTab.push(cart[i].id);
}

//---- Objet à envoyer
let objectToSend = {};
objectToSend.products = productTab;

/**------------------- POST API ------------------------
 
 * @param {object} objectToSend 
 * On envoie à l'API objectTosend qui contient le tableau des produits du panier et l'objet contenant les réponses au formulaire
 * @returns {object} qui contient orderId le numéro de commande
 * On redirige vers la page de confirmation avec l'url contenant le numéro de commande en question 
 */

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


/**------------- GESTION DU BOUTON "Commander"---------------
 
 * Création del 'objet qui contient les réponses au formulaire
 * Ajout de cet objet à l'objet qu'on envoie à l'API 
 * Si tous les champs sont remplis :
 ** @function submitOrder(objectToSend)
 ** @function clear LocalStorage 
 ** @function reset Formulaire
 * Si un champ n'est pas rempli @function alertEmptyForm() est appelée
 */
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
    alertEmptyForm();
  }
});

// ------ Alerte si un champ de formulaire est vide

function alertEmptyForm() {
  let alertEmptyForm = document.createElement("div");
  alertEmptyForm.className = "custom-box";

  alertContainer.appendChild(alertEmptyForm);
  document.body.prepend(alertContainer);

  alertEmptyForm.innerHTML =
    "<p>Merci de remplir tous les champs du formulaire pour que l'on puisse vous envoyer votre commande</p>";
  alertEmptyForm.innerHTML +=
    "<button id='alert-ok' class='custom-button'> OK </button> ";

  if(document.getElementById("alert-ok")){

    document.getElementById("alert-ok").addEventListener("click", function (e) {
      alertClose()
      
    });   
  }
}

