window.onload = function() {
    renderSummary();
    loadReviewData();
};

// 1. 統一獲取購物車函數
function getCartData() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (currentEmail) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = allUsers.find(u => u.email === currentEmail);
        return user ? (user.cart || []) : [];
    } else {
        return JSON.parse(localStorage.getItem('guestCart')) || [];
    }
}

// 2. 渲染右側訂單總結
function renderSummary() {
    const cart = getCartData();
    const detailsContainer = document.getElementById('checkout-item-details');
    const itemsCountElement = document.getElementById('items-count');
    const totalElement = document.getElementById('grand-total');
    
    let total = 0;
    let count = 0;

    if (!detailsContainer) return;

    detailsContainer.innerHTML = '';
    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        total += (price * qty);
        count += qty;
        
        detailsContainer.innerHTML += `
            <div class="order-detail-item" style="display:flex; gap:10px; margin-bottom:10px;">
                <img src="${item.image}" width="60" style="object-fit:cover;">
                <div>
                    <strong>${item.name}</strong><br>
                    <span>Qty: ${qty}</span><br>
                    <strong>RM ${price.toFixed(2)}</strong>
                </div>
            </div>`;
    });

    if (itemsCountElement) itemsCountElement.textContent = count;
    if (totalElement) totalElement.textContent = `RM ${total.toFixed(2)}`;
}

// 3. 加載地址與支付資訊
function loadReviewData() {
    const shipping = JSON.parse(localStorage.getItem('shippingAddress'));
    const shippingBox = document.getElementById('review-shipping-info');
    
    if (shipping && shippingBox) {
        shippingBox.innerHTML = `
            <strong>${shipping.fname} ${shipping.lname}</strong><br>
            ${shipping.addr1}${shipping.addr2 ? ', ' + shipping.addr2 : ''}<br>
            ${shipping.postcode} ${shipping.state}, ${shipping.country}<br>
            Phone: ${shipping.phone}
        `;
    } else if (shippingBox) {
        shippingBox.textContent = "No shipping information found.";
    }

    const payment = localStorage.getItem('paymentMethod');
    const paymentBox = document.getElementById('review-payment-info');
    if (paymentBox) {
        paymentBox.innerHTML = `<strong>${payment || 'Not selected'}</strong>`;
    }
}

// 4. 完成訂單：建立記錄並清除購物車 (保留這一個版本就好)
function completeOrder() {
    const cart = getCartData();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (!confirm("Confirm to place order?")) return;

    const currentEmail = localStorage.getItem('currentUserEmail');
    const shipping = JSON.parse(localStorage.getItem('shippingAddress'));

    if (currentEmail) {
        // 調用 common.js 裡的建立訂單功能
        const orderResult = createOrder(cart, shipping);
        if (!orderResult) {
            alert("Error creating order.");
            return;
        }
        alert(`Order successful! Your Order ID is: ${orderResult.orderId}`);
        window.location.href = "orders.html";
    } else {
        alert("Thank you for your guest order!");
        localStorage.removeItem('guestCart');
        window.location.href = "index.html";
    }

    // 清除暫存資訊
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('myCart');
}
