//emplacement dans le DOM des cartes produits
const itemsPosition = document.querySelector('.items')

//---------- Fonction qui récupère les données de l'API -----

async function getAPI(){
    let products = await fetch ("http://localhost:3000/api/products")  
    return await products.json();
}

/*------------- Fonction qui affiche les produits -------
* Pour chaque produit de l'API le bloc html est créé
*/
async function afficheProducts(){
   let products = await getAPI();
        for (let product of products){
            
            //création de la carte Produit
                //Image    
                const imageProduct = document.createElement('img')
                imageProduct.setAttribute ('src', `${product.imageUrl}`)
                imageProduct.setAttribute ('alt', `${product.altTxt}`)
            
                //Nom
                const nameProduct = document.createElement ('h3')
                nameProduct.classList.add('productName')
                nameProduct.textContent = `${product.name}`
            
                //Description
                const descriptionProduct = document.createElement ('p')
                descriptionProduct.classList.add('productDescription')
                descriptionProduct.textContent = `${product.description}`
            
                //Carte dans son ensemble
                const cardProduct = document.createElement ('a')
                cardProduct.setAttribute ('href', `./product.html?id=${product._id}`)
            
                const article = document.createElement ('article')
            
                article.appendChild(imageProduct)
                article.appendChild(nameProduct)
                article.appendChild(descriptionProduct)
                cardProduct.appendChild(article)
            
                itemsPosition.appendChild(cardProduct)
        }
    }
    
afficheProducts();








         