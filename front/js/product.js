// http://localhost:3000/api/products/{id}

const url = new URL(window.location) // stock l'url dans constante
const id = url.searchParams.get("id")
console.log(id)



fetch ('http://localhost:3000/api/products')
.then( res => res.json() )
.then ( (resultatAPI) => {
    products = resultatAPI;
    console.log(products);
    })
.catch (err => console.log("erreur GET api", err))    



/*           <div class="item__content__titlePrice">
<h1 id="title"><!-- Nom du produit --></h1>
<p>Prix : <span id="price"><!-- 42 --></span>€</p>
</div>

<div class="item__content__description">
<p class="item__content__description__title">Description :</p>
<p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p>
</div>
*/