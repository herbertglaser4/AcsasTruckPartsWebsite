/*
 * File: server.js
 * Authors: TripleP (Alex Smith, Herbert Glaser, Kaitlyn Dominguez)
 * Version: 1.2
 *
 * Main store javascript with stripe and cart functionality
 */

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
//Checks to see if browser supports local storage
function CheckBrowser() {
    if ('localStorage' in window && window['localStorage'] !== null) {
        // We can use localStorage object to store data.
        return true;
    } else {
            return false;
    }
}

//Creates Eventlisteners for all buttons
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

//Stripe handler that takes items from cart and sends them to Stripe
var stripeHandler = StripeCheckout.configure({

    key: stripePublicKey,
    locale: 'en',
    token: function(token) {

        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId

            items.push({
                id: id,
                quantity: quantity
            })

        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
           // alert(data.message)
            if(document.getElementById('payment') != null){
              document.forms["payment"].submit();
            }
            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
           localStorage.clear();
            res.redirect('../index')
        }).catch(function(error) {
            console.error(error)
        })
    }
})

//Sends price to the stripe handler
function purchaseClicked() {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerHTML.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })
}

//Deletes item from cart
function removeCartItem(event) {
    var buttonClicked = event.target
    var key = buttonClicked.parentElement.parentElement.id;
    var deleteItem = localStorage.removeItem(key)
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

//Adds item information to cart
function addToCartClicked(event) {
    var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
    if(pageCheck == "View Cart"){
        var button = event.target
        var shopItem = button.parentElement.parentElement.parentElement.parentElement.parentElement
        var title = shopItem.getElementsByClassName('product-name')[0].innerText
        var price = shopItem.getElementsByClassName('price-rating')[0].innerText
        var imageSrc = shopItem.getElementsByClassName('product-img')[0].src
        var id = shopItem.dataset.itemId
    }
    else{
        var button = event.target
        var shopItem = button.parentElement.parentElement.parentElement.parentElement.parentElement
        var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
        var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
        var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
        var id = shopItem.dataset.itemId
    }
    //Adds specific item for listing into cart if on the post listing page
     if(pageCheck == "POST A LISTING"){
       id=9999
       var full = {
                 "title": title,
                 "price": price,
                 "imageSrc": imageSrc,
                 "id": id
             }
             addItemToCart(title, price, imageSrc, id)
                 updateCartTotal()
       }
      else{
        var full = {
            "title": title,
            "price": price,
            "imageSrc": imageSrc,
            "id": id
        }
    localStorage.setItem(id, JSON.stringify(full))
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
  }

}

//Creates the div for cart item
function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
     var pageCheck = document.getElementsByClassName("page-title")[0].innerText;

         if(pageCheck == "POST A LISTING"){
           var chekr = document.getElementById("carto").value
           var cartRowContents = `
             <div class="cart-item cart-column">
               <img class="cart-item-image" src="${imageSrc}" style="width:0px;height:0px;">
               <span class="cart-item-title" style="font-size:0px">${title}</span>
             </div>
            <span class="cart-price cart-column" style="font-size:0px">${price}</span>
            <div class="cart-quantity cart-column" style="width:0px;height:0px;">
              <input class="cart-quantity-input" type="number" id="invisibleQuant" value="0" style="width:0px;height:0px;">
            </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    document.getElementById("invisibleQuant").value = chekr;
    }

    else{
    var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>`
        cartRow.innerHTML = cartRowContents
        cartItems.append(cartRow)
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
        updateCartTotal()
    }   
}

//Shows cart total 
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price cart-column')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseInt(priceElement.innerHTML.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100)/100
    document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + total
    var numItems = $('.cart-row').length;
    var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
    if (pageCheck == "CART"){}
    else if(pageCheck == "checkout"){}
    else if(pageCheck == "POST A LISTING"){
      var total = 0
      var quantityElement = document.getElementById('carto').value
      total = (500 * quantityElement)
      displayTotal = Math.round(total)/100
      document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + displayTotal
    }
    else{
      document.getElementsByClassName("cart-quantity")[0].innerHTML = "("+ (numItems) +")";
    }
}

//Retrieves cart information over page loads through local storage
function populateCart() {
    if (CheckBrowser()) {
        var key = "";
        for (var i = 0; i <= localStorage.length-1; i++) {
            key = localStorage.key(i);
            if (key == "lsid"){
            }
            else{
              keyer = localStorage.getItem(key);
              var parser = JSON.parse(keyer);
              var cartRow = document.createElement('div')
              cartRow.setAttribute("id", key);
              cartRow.classList.add('cart-row')
              cartRow.dataset.itemId = parser.id;
              var cartItems = document.getElementsByClassName('cart-items')[0]
              var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
              var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
      
              if(pageCheck == "checkout"){             
                 var cartRowContents = `
                   <div class="cart-item cart-column">
                     <img class="cart-item-image" src="${parser.imageSrc}" width="100" height="100">
                     <span class="cart-item-title">${parser.title}</span>
                   </div>
                   <span class="pull-right"><span class="cart-price cart-column">${parser.price}</span></span>
                   <div class="cart-quantity cart-column">
                     <input class="cart-quantity-input" type="number" value="1" style="text-align: center">
                     <p></p>
                   </div>`
                     cartRow.innerHTML = cartRowContents 
                     cartItems.append(cartRow)
                     cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
                     updateCartTotal();
               }
               else{
                 var cartRowContents = `
                 <div class="cart-item cart-column">
                   <img class="cart-item-image" src="${parser.imageSrc}" width="100" height="100">
                   <span class="cart-item-title">${parser.title}</span>
                 </div>
                 <span class="cart-price cart-column">${parser.price}</span>
                 <div class="cart-quantity cart-column">
                   <input class="cart-quantity-input" type="number" value="1">
                   <button class="btn btn-danger" type="button">REMOVE</button>
                 </div>`
                 cartRow.innerHTML = cartRowContents
                 cartItems.append(cartRow)
                 cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
                 cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
                 updateCartTotal();
                }
            }
        }

    } else {
        alert('Cannot save shopping list as your browser does not support HTML 5');
    }

}

//Function for body onload
function allOnloads(){
    populateCart();
    ready();
    fetch('/checkSession');
    fetch('/changeLoginButton');
}

//Clears cart
function ClearAll() {
    localStorage.clear();
    location.reload();
}
