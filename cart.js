function renderCart() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const tbody = document.getElementById('cart-table-body');
    const subtotalDisplay = document.getElementById('subtotal-amount');
    const totalDisplay = document.getElementById('final-total');
    function getActiveCart() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (currentEmail) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = allUsers.find(u => u.email === currentEmail);
        return user ? (user.cart || []) : [];
    } else {
        return JSON.parse(localStorage.getItem('guestCart')) || [];
    }
}

function saveActiveCart(cart) {
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (currentEmail) {
        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const userIndex = allUsers.findIndex(u => u.email === currentEmail);
        if (userIndex !== -1) {
            allUsers[userIndex].cart = cart;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    } else {
        localStorage.setItem('guestCart', JSON.stringify(cart));
    }
    if (typeof refreshCartNumber === 'function') refreshCartNumber();
}

function renderCart() {
    const cart = getActiveCart(); 
    const tbody = document.getElementById('cart-table-body');
    const subtotalDisplay = document.getElementById('subtotal-amount');
    const totalDisplay = document.getElementById('final-total');
    
    let total = 0;
    tbody.innerHTML = ''; 

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Your cart is empty.</td></tr>';
        if(subtotalDisplay) subtotalDisplay.textContent = 'RM 0.00';
        if(totalDisplay) totalDisplay.textContent = 'RM 0.00';
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
                        <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin:0 10px;">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>RM ${item.price.toFixed(2)}</td>
                <td>
                    <div class="qty-control">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <input type="text" value="${item.quantity}" readonly style="width:30px; text-align:center;">
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td>RM ${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    if(subtotalDisplay) subtotalDisplay.textContent = `RM ${total.toFixed(2)}`;
    if(totalDisplay) totalDisplay.textContent = `RM ${total.toFixed(2)}`;
}

function changeQty(index, delta) {
    let cart = getActiveCart();
    cart[index].quantity += delta;
    
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    
    saveActiveCart(cart); // 修改這裡：存回正確位置
    renderCart();
}

function removeItem(index) {
    if(confirm("Remove this item?")) {
        let cart = getActiveCart();
        cart.splice(index, 1);
        saveActiveCart(cart); // 修改這裡：存回正確位置
        renderCart();
    }
}

function checkout() {
    const cart = getActiveCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your purchase!");
    saveActiveCart([]); // 清空該用戶的購物車
    window.location.href = "index.html";
}

window.onload = renderCart;
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
