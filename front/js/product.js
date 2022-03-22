// http://localhost:3000/api/products/{id}

const url = new URL(window.location) // stock l'url dans constante
const id = url.searchParams.get("id")
console.log(id)



fetch (`http://localhost:3000/api/products/${id}`)
.then( res => res.json() )
.then ( data => {
    console.log(data);
    let title = document.getElementById('title')
    title.innerHTML = data.name;

    let price = document.getElementById('price')
    price.innerHTML =data.price;

    let description = document.getElementById('description')
    description.innerHTML =data.description;

    
    for ( let color of data.colors){ 
        
        let select = document.getElementById('colors');
        let option = document.createElement('option');
        option.value = color;
        option.innerHTML = color;
        select.add(option);
    }  

})

.catch (err => console.log("erreur GET api id", err))    






