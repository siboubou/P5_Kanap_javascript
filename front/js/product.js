//----------- On récupère l'id du produit de la page à partir de  l'url --------

const url = new URL(window.location); // stock l'url dans constante
const productId = url.searchParams.get("id");


/**
 * REQUEST API 
 * @param {string} productId
 * @returns {function afficheProduct(dataProduct)}
 * On récupère les données dataProduct du produit de la page
 * On retourne la fonction qui affiche un produit en fonction de ses données
 */

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((res) => res.json())
  .then((dataProduct) => {
    return afficheProduct(dataProduct);
  })
  .catch((err) => console.log("erreur GET api", err));




/**
 * AFFICHAGE DU PRODUIT DE LA PAGE
 * @param {object} dataProduct 
 * Modifcation du DOM et intégration des données du produit dans le HTML
 */
function afficheProduct(dataProduct) {
  const divImg = document.querySelector(".item__img");
  const img = document.createElement("img");
  img.setAttribute("src", `${dataProduct.imageUrl}`);
  img.setAttribute("alt", `${dataProduct.altTxt}`);

  divImg.appendChild(img);

  let title = document.getElementById("title");
  title.innerHTML = dataProduct.name;

  let price = document.getElementById("price");
  price.innerHTML = dataProduct.price;

  let description = document.getElementById("description");
  description.innerHTML = dataProduct.description;

  for (let color of dataProduct.colors) {
    let select = document.getElementById("colors");
    let option = document.createElement("option");
    option.value = color;
    option.innerHTML = color;
    select.add(option);
  }
}

//------------------- GESTION DU BOUTON "Ajouter au panier " -----------

let btnAdd = document.getElementById("addToCart");


/** 
 * Click "Ajouter au Panier"
 * Si la couleur n'est pas renseignée une alerte on doit renseigner la couleur
 * Si la quantité n'est pas renseignée une alerte on doit renseigner la quantité
 * Si couleur et quantité sont renseignées :
 *** une alerte apparaît pour redirection vers panier ou rester sur la même page
 *** la fonction addPanier est appelée > ajoute le produit au panier
 */

btnAdd.addEventListener("click", function (e) {
  e.preventDefault();

  let currentColor = document.getElementById("colors").value;
  let currentQuantity = JSON.parse(document.getElementById("quantity").value);

  //Si la couleur n'est pas renseignée
  if (currentColor == 0 && currentQuantity == 0) {
    alertBox.innerHTML =
      "<p> Vous n'avez pas choisi la couleur de votre futur canapé !</p>";
    alertBox.innerHTML +=
      "<button id='alert-close' class='custom-button'> OK </button> ";

    alertShow();

    //Si la quantité n'est pas renseignée
  } else if (currentQuantity == 0 && currentColor != 0) {
    alertBox.innerHTML =
      "<p> Dites-nous combien d'articles vous souhaitez ajouter à votre panier…</p>";
    alertBox.innerHTML +=
      "<button id='alert-close' class='custom-button'> OK </button> ";

    alertShow();

    //Si couleur et quantité sont renseignées
  } else {
    alertBox.innerHTML = "<p>Votre article a bien été ajouté !</p> ";
    alertBox.innerHTML +=
      "<button id='alert-close' class='custom-button'>Continuer mes achats</button>";
    
    alertBox.innerHTML +=
      "<button id='goto-panier' class='custom-button'>Voir mon Panier</button>";

    alertShow();
    addPanier();
  }
});


//--------- Boite Alerte personnalisée
let alertContainer = document.createElement("div");
alertContainer.setAttribute("id", "modal");

let alertBox = document.createElement("div");
alertBox.className = "custom-box";

/**
* Fonction Alerte
* Modifie le DOM pour affichage de la boite d'alerte alertBox
*/
function alertShow() {
  alertContainer.appendChild(alertBox);
  document.body.prepend(alertContainer);

  document.getElementById("alert-close").addEventListener("click", function () {
    document.body.removeChild(alertContainer);
  });

  document.getElementById("goto-panier").addEventListener("click", function () {
    window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
  });

}


/** 
 * Sauvegarde le localStorage
 * @param {object} panier 
 * Ajoute panier au localStorage sous format JSON
 */
function savePanier(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
}


/** 
 * Vérifie ce qui est dans le localStorage
 * @returns {array} des produits qui sont dans le localStorage
 */

function getPanier() {
  let productsIn = localStorage.getItem("panier");

  if (productsIn == null) {
    return [];
  } else {
    return JSON.parse(productsIn);
    
  }
}


/**
 * Ajoute les produits au localStorage
 * Crée un objet product à partir des inputs couleur et quantité
 * Vérifie les produits du localStorage en appelant @function getPanier()
 * Si un produit de la même couleur et du même id est trouvé, on ajoute à sa quantité la quantité de product 
 * Sinon, on ajoute product au panier
 * On sauvegarde le nouveau panier en appelant @function savePanier()
 */

function addPanier() {
  let currentColor = document.getElementById("colors").value;
  let currentQuantity = JSON.parse(document.getElementById("quantity").value);

  let product = {
    id: productId,
    color: currentColor,
    quantity: 0,
  };

  let productsIn = getPanier();

  console.log(typeof productsIn);
  let foundProduct = productsIn.find((p) => p.id == product.id);
  let foundColor = productsIn.find((p) => p.color == product.color);

  if (foundProduct != undefined && foundColor != undefined) {
    foundColor.quantity += currentQuantity;
  } else {
    product.quantity = currentQuantity;
    productsIn.push(product);
  }
  savePanier(productsIn);
}
