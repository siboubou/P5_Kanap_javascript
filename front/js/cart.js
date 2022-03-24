

//emplacement DOM
const panierPosition = document.querySelector('#cart__items')

const article = document.createElement('article')
article.classList.add('cart__item')
article.setAttribute('data-id', `{productId}`)
article.setAttribute('data-color', `{product.color}`)

//div image
const divImage = document.createElement('div')
divImage.classList.add('cart__item__img')

const img = document.createElement('img')
img.setAttribute ('src', '{product.imageUrl}')
img.setAttribute ('alt', '{product.altTxt}')

divImage.appendChild(img)

//div content 

const divContent = document.createElement('div')
divContent.classList.add('cart__item__content')

//div content description 

const divContentDescription = document.createElement('div')
divContentDescription.classList.add('cart__item__content__description')

const nameProduct = document.createElement('h2')
nameProduct.textContent = `{product.name}`

const colorProduct = document.createElement('p')
colorProduct.textContent = `{product.color}`

const priceProduct = document.createElement('p')
priceProduct.textContent = `{product.price} €`


divContentDescription.appendChild(nameProduct)
divContentDescription.appendChild(colorProduct)
divContentDescription.appendChild(priceProduct)

divContent.appendChild(divContentDescription)

//div content settings
const divSettings = document.createElement('div')
divSettings.classList.add('cart__item__content__settings')

const divSettingsQuantity = document.createElement('div')
divSettingsQuantity.classList.add('cart__item__content__settings__quantity')

const quantityProduct = document.createElement('p')
quantityProduct.textContent = `Qté : `

const itemQuantity = document.createElement('input')
itemQuantity.classList.add('itemQuantity')
itemQuantity.setAttribute('type', 'number')
itemQuantity.setAttribute('name', 'itemQuantity')
itemQuantity.setAttribute('min', '1')
itemQuantity.setAttribute('max', '100')
itemQuantity.setAttribute('value', `42`)

divSettingsQuantity.appendChild(quantityProduct)
divSettingsQuantity.appendChild(itemQuantity)

divSettings.appendChild(divSettingsQuantity)

const divSettingsDelete = document.createElement('div')
divSettingsDelete.classList.add('cart__item__content__settings__delete')

const deleteProduct = document.createElement('p')
deleteProduct.classList.add('deleteItem')
deleteProduct.textContent = 'Supprimer'

divSettingsDelete.appendChild(deleteProduct)
divSettings.appendChild(divSettingsDelete)


divContent.appendChild(divSettings)

article.appendChild(divImage)
article.appendChild(divContent)
panierPosition.appendChild(article)






function deleteItem(product){
    let panier = getPanier();
    localStorage.removeItem('id')
}