window.onload = function() {
    renderSummary();
    loadReviewData();
};

// 1. 統一的獲取購物車函數 (與 Checkout 一致)
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
    const cart = getCartData(); // 使用統一獲取邏輯
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
            <div class="order-detail-item">
                <img src="${item.image}" width="60">
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

// 3. 加載地址與支付信息 (保持不變)
function loadReviewData() {
    const shipping = JSON.parse(localStorage.getItem('shippingAddress'));
    const shippingBox = document.getElementById('review-shipping-info');
    
    if (shipping) {
        shippingBox.innerHTML = `
            <strong>${shipping.fname} ${shipping.lname}</strong><br>
            ${shipping.addr1}${shipping.addr2 ? ', ' + shipping.addr2 : ''}<br>
            ${shipping.postcode} ${shipping.state}, ${shipping.country}<br>
            Phone: ${shipping.phone}
        `;
    } else {
        if (shippingBox) shippingBox.textContent = "No shipping information found.";
    }

    const payment = localStorage.getItem('paymentMethod');
    const paymentBox = document.getElementById('review-payment-info');
    if (paymentBox) {
        paymentBox.innerHTML = `<strong>${payment || 'Not selected'}</strong>`;
    }
}

// 4. 完成訂單：清除對應的購物車
function completeOrder() {
    if (!confirm("Confirm to place order?")) return;

    const currentEmail = localStorage.getItem('currentUserEmail');

    if (currentEmail) {
        // 會員下單：清除 allUsers 裡該用戶的 cart
        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const userIndex = allUsers.findIndex(u => u.email === currentEmail);
        if (userIndex !== -1) {
            allUsers[userIndex].cart = []; // 清空購物車
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    } else {
        // 遊客下單：清除 guestCart
        localStorage.removeItem('guestCart');
    }

    // 清除公共暫存資訊
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    // 為了保險，也清除舊的 myCart (如果有的話)
    localStorage.removeItem('myCart');

    alert("Thank you! Your order has been placed successfully.");
    window.location.href = "index.html";
}
