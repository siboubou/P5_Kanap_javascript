//On récupère l'id du produit dans l'url
const url = new URL(window.location) // stock l'url dans constante
const productId = url.searchParams.get("id")
console.log(productId)


// On récupère les données dataProduct du produit de la page

let dataProduct ;

async function getProduct(){
    await fetch (`http://localhost:3000/api/products/${productId}`)
    .then( res => res.json() )
    .then ( response => { 
        dataProduct = response ;
    })
    .catch (err => console.log("erreur GET api id", err))  
}

getProduct();

//On intègre les données du produit dans le HTML

function ficheProduct(){
    let title = document.getElementById('title');
    title.innerHTML = dataProduct.name ;

    let price = document.getElementById('price')
    price.innerHTML =dataProduct.price;

    let description = document.getElementById('description')
    description.innerHTML =dataProduct.description;

    for ( let color of dataProduct.colors){ 

        let select = document.getElementById('colors');
        let option = document.createElement('option');
        option.value = color;
        option.innerHTML = color;
        select.add(option);
    }
}

//On appelle la fonction globale pour afficher le produit
async function afficheProduct(){
    await getProduct();
    ficheProduct();
}

afficheProduct();





document
.getElementById('addToCart')
.addEventListener('click', function(e){
    e.preventDefault();
    console.log('ajout dans panier');
    addPanier(); 
})


// si je me setitem directement dans la fonction addPanier lorsuqe j'ajoute product je n'ajoute pas un tableau
function savePanier(panier){
    localStorage.setItem('panier', JSON.stringify(panier)); 
}

function getPanier(){
    let productsIn = localStorage.getItem('panier') ;

    if(productsIn == null){
        return [];
    }else{
        return JSON.parse(productsIn);
    }   
}

function addPanier(){

    let currentColor = document.getElementById('colors').value
    let currentQuantity = JSON.parse(document.getElementById('quantity').value)
    
    let product = {
        "id" : productId,
        "color" : currentColor,
        "quantity" : 0
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




