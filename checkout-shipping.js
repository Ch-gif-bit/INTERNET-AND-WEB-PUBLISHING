// 1. 頁面載入時執行渲染
window.onload = function() {
    renderCheckout();
};

// 2. 渲染右側訂單摘要 (Order Summary)
function renderCheckout() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    let cart = [];

    // 關鍵修改：根據登入狀態決定去哪裡拿購物車數據
    if (currentEmail) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = allUsers.find(u => u.email === currentEmail);
        cart = user ? (user.cart || []) : [];
    } else {
        cart = JSON.parse(localStorage.getItem('guestCart')) || [];
    }

    const detailsContainer = document.getElementById('checkout-item-details');
    const itemsCountElement = document.getElementById('items-count');
    const totalElement = document.getElementById('grand-total');

    if (!detailsContainer) return;

    let total = 0;
    let count = 0;
    detailsContainer.innerHTML = '';

    cart.forEach(item => {
        // 使用新代碼中的屬性名 (id, name, price, quantity, image)
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        
        total += (price * qty);
        count += qty;
        
        detailsContainer.innerHTML += `
            <div class="order-detail-item" style="display: flex; margin-bottom: 15px; align-items: center;">
                <img src="${item.image}" width="50" height="50" style="object-fit: cover; border-radius: 4px; margin-right: 10px;">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color:#888">Qty: ${qty}</span><br>
                    <strong>RM ${price.toFixed(2)}</strong>
                </div>
            </div>
        `;
    });

    if (itemsCountElement) itemsCountElement.textContent = count;
    if (totalElement) totalElement.textContent = `RM ${total.toFixed(2)}`;
}

// 3. 國家與州屬關聯邏輯
function updateStates() {
    const countrySelect = document.getElementById('country');
    const stateSelect = document.getElementById('state');
    if (!countrySelect || !stateSelect) return;

    const selectedCountry = countrySelect.value;
    const stateData = {
        "Malaysia": ["Kuala Lumpur", "Selangor", "Johor", "Penang", "Sabah", "Sarawak", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Kedah", "Kelantan", "Terengganu", "Labuan", "Putrajaya"],
        "United States": ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Nevada", "Arizona"]
    };

    stateSelect.innerHTML = '<option value="" disabled selected>Select State*</option>';

    if (stateData[selectedCountry]) {
        stateData[selectedCountry].forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    } else {
        stateSelect.innerHTML = '<option value="">No states available</option>';
    }
}

// 4. 跳轉到 Billing 頁面 (儲存數據版)
function goToBilling() {
    // 獲取輸入值
    const shippingInfo = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        addr1: document.getElementById('addr1').value,
        addr2: document.getElementById('addr2').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        postcode: document.getElementById('postcode').value,
        phone: document.getElementById('phone').value
    };

    // 簡單驗證
    if (!shippingInfo.fname || !shippingInfo.addr1 || !shippingInfo.country) {
        alert("Please fill in all required fields (*)");
        return;
    }

    // 儲存到 localStorage 供下一頁使用
    localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));

    // 跳轉
    window.location.href = "checkout-billing.html";
}
