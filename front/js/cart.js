async function getProducts() {
  await fetch(`http://localhost:3000/api/products/`)
    .then((res) => res.json())
    .then((response) => {
      products = response;
    })
    .catch((err) => console.log("erreur GET api", err));
}
getProducts();

let cart = localStorage.getItem("panier");
cart = JSON.parse(cart);
console.log(cart);

//emplacement DOM
const panierPosition = document.querySelector("#cart__items");

async function productCard() {
  await getProducts();

  for (let product of cart) {
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${product.id}`);
    article.setAttribute("data-color", `${product.color}`);

    panierPosition.appendChild(article);

    console.log(products);
    let foundProduct = products.find((p) => p._id == product.id);
    console.log(foundProduct);

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

      const itemQuantity = document.createElement("input");
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

productCard();

/*









/*
function deleteItem(product){
    let panier = getPanier();
    localStorage.removeItem('id')
}

*/
