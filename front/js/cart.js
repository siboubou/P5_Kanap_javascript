async function getProducts() {
  await fetch(`http://localhost:3000/api/products/`)
    .then((res) => res.json())
    .then((response) => {
      products = response;
    })
    .catch((err) => console.log("erreur GET api", err));
}
getProducts();

//récupère les données du panier dans l'array cart
let cart = localStorage.getItem("panier");
cart = JSON.parse(cart);


//emplacement DOM
const panierPosition = document.querySelector("#cart__items");


async function afficheProductCard() {
  await getProducts();

  for (let product of cart) { //pour chaque produit dans le localStorage
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${product.id}`);
    article.setAttribute("data-color", `${product.color}`);

    panierPosition.appendChild(article);

    //on va chercher le produit dans l'API qui a le même id pour récupérer toutes ses données
    let foundProduct = products.find((p) => p._id == product.id); 
    
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
      colorProduct.textContent = `${product.color}`;

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
      quantityProduct.textContent = `Qté : ${product.quantity}`;

      let itemQuantity = document.createElement("input");

      itemQuantity.classList.add("itemQuantity");
      itemQuantity.setAttribute("type", "number");
      itemQuantity.setAttribute("name", "itemQuantity");
      itemQuantity.setAttribute("min", "1");
      itemQuantity.setAttribute("max", "100");
      itemQuantity.setAttribute("value", `${product.quantity}`);

      divSettingsQuantity.appendChild(quantityProduct);
      divSettingsQuantity.appendChild(itemQuantity);

      divSettings.appendChild(divSettingsQuantity);


      const divSettingsDelete = document.createElement("div");
      divSettingsDelete.classList.add("cart__item__content__settings__delete");
      const deleteProduct = document.createElement("p");
      deleteProduct.classList.add("deleteItem");
      deleteProduct.textContent = "Supprimer";

      divSettingsDelete.appendChild(deleteProduct);
      divSettings.appendChild(divSettingsDelete);

      divContent.appendChild(divSettings);
      article.appendChild(divContent);
    }
  }
}

afficheProductCard();


//afficher la quantité totale qu'on récupère du localStorage
let totalQuantity = document.getElementById('totalQuantity')
let quantityStorage = localStorage.getItem('totalQuantity')
quantityStorage = JSON.parse(quantityStorage)

totalQuantity.textContent = quantityStorage


//afficher le prix total qu'on récupère du localStorage
let totalPrice = document.getElementById('totalPrice')
let priceStorage = localStorage.getItem('totalCost')
priceStorage = JSON.parse(priceStorage)

totalPrice.textContent = priceStorage



//Modifier quantité


/*
for(i=0 ; i<itemQuantity.lenght ; i++){
  itemQuantity[i].addEventListener('change', function(e){
    console.log(this.value)
  })
}
/*
//supprimer un produit

let cartItems = document.getElementsByClassName('cart__item')

console.log(cartItems[0])

/*
async function dataset (){
  await afficheProductCard();
  for (let cartItem of cartItems ){
    console.log(cartItem.dataset.id)
  
  }
}



/*
  let deleteItem = cartItem[i].closest('.deleteItem')
  
  deleteItem.addEventListener('click', function(){
    console.log(deleteItem)
  })
    //localStorage.removeItem()
  
}


  


/*









/*
function deleteItem(product){
    let panier = getPanier();
    localStorage.removeItem('id')
}

*/
