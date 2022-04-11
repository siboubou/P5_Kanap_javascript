//On récupère l'id du produit dans l'url
const url = new URL(window.location) // stock l'url dans constante
const productId = url.searchParams.get("id")
console.log(productId)

//On intègre les données du produit dans le HTML
 
function afficheProduct(dataProduct){  
    console.log(dataProduct);

    const divImg = document.querySelector('.item__img')
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

    for (let color of dataProduct.colors) { 

        let select = document.getElementById('colors');
        let option = document.createElement('option');
        option.value = color;
        option.innerHTML = color;
        select.add(option);
    }
};

/* En récupérant les données dataProduct du produit de la page
 on appelle la fonction qui affiche ce produit
*/

fetch (`http://localhost:3000/api/products/${productId}`)
    .then( res => res.json() )
    .then ( dataProduct => {   
        return afficheProduct(dataProduct);
    })
    .catch (err => console.log("erreur GET api", err))  
;


//Lsq on clique sur ajouter au panier 

document
.getElementById('addToCart')
.addEventListener('click', function(e){
    e.preventDefault();
    
//si la couleur ou la quantité ne sont pas précisés il y aura une alerte
    let currentColor = document.getElementById('colors').value ;
    let currentQuantity = JSON.parse(document.getElementById('quantity').value) ;

    if (currentColor == 0 ) {
        alert("Vous n'avez pas choisi la couleur de votre futur canapé !" )

    }else if (currentQuantity == 0 ){
        alert("Dites-nous combien d'articles vous souhaitez ajouter à votre panier…")

    } else{
        addPanier(); //ajoute le produit sélectionné au panier
       // totalCost(); //modifie le coût total du panier
       // totalQuantity(); //modifie la quantité de produits dans le panier 
        
        getToPanier(); //alerte qui permet d'aller directement au panier
           
    } 
});


// si je me setItem directement dans la fonction addPanier lsq j'ajoute product je n'ajoute pas un tableau ( => .find ne fonctionne pas)
function savePanier(panier){
    localStorage.setItem('panier', JSON.stringify(panier)); 
}

//fonction qui vérifie ce qui est déja dans le panier
function getPanier(){
    let productsIn = localStorage.getItem('panier') ;

    if(productsIn == null){
        return [];
    } else {
        return JSON.parse(productsIn);
    }   
}

//fonction qui ajoute les produits au panier
function addPanier(){

    let currentColor = document.getElementById('colors').value
    let currentQuantity = JSON.parse(document.getElementById('quantity').value)
   
    
    let product = {
        "id" : productId,
        "color" : currentColor,
        "quantity" : 0, 
        
    };

    let productsIn = getPanier();
    console.log(productsIn)
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


//Alerte qui permet soit d'aller directement au panier soit de rester sur la page

function getToPanier(){
    if ( confirm('Votre article a bien été ajouté, cliquez sur "ok" pour voir votre panier')){
    window.location.href='http://127.0.0.1:5500/front/html/cart.html'
    } else{
        window.location.href= `http://127.0.0.1:5500/front/html/product.html?id=${productId}`
    
    }
} 
