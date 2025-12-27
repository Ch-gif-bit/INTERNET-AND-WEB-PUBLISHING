function renderCart() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const tbody = document.getElementById('cart-table-body');
    const subtotalDisplay = document.getElementById('subtotal-amount');
    const totalDisplay = document.getElementById('final-total');
    
    let total = 0;
    tbody.innerHTML = ''; 

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Your cart is empty.</td></tr>';
        subtotalDisplay.textContent = 'RM 0.00';
        totalDisplay.textContent = 'RM 0.00';
        return;
    }

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="product-cell">
                        <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
                        <img src="${item.image}" alt="">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>RM ${item.price.toFixed(2)}</td>
                <td>
                    <div class="qty-control">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td>RM ${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    subtotalDisplay.textContent = `RM ${total.toFixed(2)}`;
    totalDisplay.textContent = `RM ${total.toFixed(2)}`;
}

function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem('myCart'));
    cart[index].quantity += delta;
    
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('myCart'));
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCart();
}

function checkout() {
    alert("Thank you for your purchase!");
    localStorage.removeItem('myCart'); 
    window.location.href = "index.html";
}

window.onload = renderCart;