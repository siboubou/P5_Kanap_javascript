//On récupère l'id du produit dans l'url
const url = new URL(window.location) // stock l'url dans constante
const productId = url.searchParams.get("id")
console.log(productId)


// On récupère les données dataProduct du produit de la page


async function getProduct(){
    await fetch (`http://localhost:3000/api/products/${productId}`)
    .then( res => res.json() )
    .then ( function(dataProduct) {   
        console.log(dataProduct) ; 
        return dataProduct;   
    })
    .catch (err => console.log("erreur GET api", err))  
}

//On intègre les données du produit dans le HTML
 
async function afficheProduct(dataProduct){
    dataProduct = await getProduct();
    console.log(dataProduct);

    const divImg = document.getElementById('img')
    const img = document.createElement('img');
    img.setAttribute('src', `${dataProduct.imageUrl}`);
    img.setAttribute('alt', `${dataProduct.altTxt}`);

    divImg.appendChild(img)

    let title = document.getElementById('title');
    title.innerHTML = dataProduct.name ;

    let price = document.getElementById('price')
    price.innerHTML = dataProduct.price;

    let description = document.getElementById('description')
    description.innerHTML =dataProduct.description;

    for ( let color of dataProduct.colors){ 

        let select = document.getElementById('colors');
        let option = document.createElement('option');
        option.value = color;
        option.innerHTML = color;
        select.add(option);
    }
};

//On appelle la fonction globale pour afficher le produit
afficheProduct();


//Lsq on clique sur ajouter au panier 
document
.getElementById('addToCart')
.addEventListener('click', function(e){
    e.preventDefault();
    
    addPanier(); 
    totalCost();
    totalQuantity();
})


// si je me setItem directement dans la fonction addPanier lsq j'ajoute product je n'ajoute pas un tableau ( => .find ne fonctionne pas)
function savePanier(panier){
    localStorage.setItem('panier', JSON.stringify(panier)); 
}

//fonction qui vérifie ce qui est déja dans le panier
function getPanier(){
    let productsIn = localStorage.getItem('panier') ;

    if(productsIn == null){
        return [];
    }else{
        return JSON.parse(productsIn);
    }   
}

//ajoute les produits au panier
function addPanier(){

    let currentColor = document.getElementById('colors').value
    let currentQuantity = JSON.parse(document.getElementById('quantity').value)

    let product = {
        "id" : productId,
        "color" : currentColor,
        "quantity" : 0, 
    };

    let productsIn = getPanier();
    let foundProduct = productsIn.find(p => p.id == product.id);
    let foundColor = productsIn.find(p => p.color == product.color);

    if(foundProduct != undefined && foundColor != undefined){
        foundColor.quantity += currentQuantity ;
    }
    else{
        product.quantity = currentQuantity;
        productsIn.push(product);
    }

    savePanier(productsIn);
}


//donne le cout total du panier
async function totalCost(){
    await getProduct();
    let currentPrice = dataProduct.price ;
    
    let pricePanier = JSON.parse(localStorage.getItem('totalCost'));

    if(pricePanier != null){
        localStorage.setItem('totalCost', pricePanier + currentPrice ) ;
    }else{
        localStorage.setItem('totalCost', currentPrice);
    }
}

//donne la quantité total de produits dans le panier
async function totalQuantity(){
    await getProduct();

    let currentQuantity = JSON.parse(document.getElementById('quantity').value);
    let quantityPanier = JSON.parse(localStorage.getItem('totalQuantity'));

    if(quantityPanier != null){
        localStorage.setItem('totalQuantity', quantityPanier + currentQuantity)
    }else{
        localStorage.setItem('totalQuantity', currentQuantity)
    }
}
