const url = new URL(window.location) 
const urlId = url.searchParams.get("orderId")


let orderId = document.getElementById('orderId')
orderId.innerHTML = urlId


