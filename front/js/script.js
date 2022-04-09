//emplacement dans le DOM des cartes produits
const itemsPosition = document.querySelector('.items')

//GET API

async function getAPI(){
    await fetch ("http://localhost:3000/api/products")  
    .then( res => res.json() )
    .then ( data => {
        products = data ;
        console.log(products);
    })
    
    .catch (err => console.log("erreur GET api", err))
}



async function afficheProducts(){
    await getAPI();
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








         