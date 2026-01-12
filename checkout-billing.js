window.onload = function() {
    renderSummary();
    // 移除 loadReviewData(); 因為 Billing 頁面通常不需要顯示之前的 Review
};

// 1. 獲取購物車資料
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

// 2. 渲染右側訂單總結 (保持不變)
function renderSummary() {
    const cart = getCartData();
    const detailsContainer = document.getElementById('checkout-item-details');
    const itemsCountElement = document.getElementById('items-count');
    const totalElement = document.getElementById('grand-total');
    
    if (!detailsContainer) return;

    let total = 0;
    let count = 0;
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

/**
 * 3. 關鍵功能：儲存付款方式並跳轉
 * 請確保你的 HTML 按鈕寫的是 onclick="savePaymentAndNext()"
 */
function savePaymentAndNext() {
    // 獲取選中的 Radio 按鈕 (假設你的 HTML 裡付款方式的 name="payment")
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    // 儲存選擇到 localStorage
    localStorage.setItem('paymentMethod', selectedPayment.value);

    // 跳轉到最後一頁 Review
    window.location.href = "checkout-review.html";
}
