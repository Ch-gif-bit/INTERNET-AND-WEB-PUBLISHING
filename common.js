/**
 * 1. 商品資料庫初始化
 */
const initialProducts = [
    { id: "p1", name: "Uniqlo T-Shirt", price: 80.00, image: "productimg/UniqloP1avif.avif", stock: 50 },
    { id: "p2", name: "Nike Shoes", price: 200.00, image: "productimg/NikeS1.avif", stock: 10 },
    { id: "p3", name: "Classic Hoodie", price: 120.00, image: "productimg/Hoodie1.avif", stock: 25 },
    { id: "p4", name: "Denim Jacket", price: 250.00, image: "productimg/Jacket1.avif", stock: 20 }
];

if (!localStorage.getItem('allProducts')) {
    localStorage.setItem('allProducts', JSON.stringify(initialProducts));
}

/**
 * 2. 智能購物車計數器 (優化版：防止閃爍)
 */
function refreshCartNumber() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    let cart = [];

    if (currentEmail) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = allUsers.find(u => u.email === currentEmail);
        cart = user ? user.cart : [];
    } else {
        cart = JSON.parse(localStorage.getItem('guestCart')) || [];
    }

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // 關鍵修改：不使用 window.onload，改用這個監聽器，HTML 一出來就填數字
    document.addEventListener('DOMContentLoaded', function() {
        const cartNumberElement = document.querySelector('.cart-number');
        if (cartNumberElement) {
            cartNumberElement.textContent = totalItems;
        }
    });
}

/**
 * 3. 檢查登入狀態並更新 Header UI (加入下拉選單)
 */
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    document.addEventListener('DOMContentLoaded', function() {
        const rightSection = document.querySelector('.right-section');
        if (currentUser && rightSection) {
            // 隱藏 Sign Up 和 Login
            const authLinks = rightSection.querySelectorAll('.nav-link');
            authLinks.forEach(link => {
                if (link.innerText.includes('Sign Up') || link.innerText.includes('Login')) {
                    link.style.display = 'none';
                }
            });

            // 建立含下拉選單的用戶區塊
            const userContainer = document.createElement('div');
            userContainer.className = 'user-dropdown-container';
            
            userContainer.innerHTML = `
                <div class="user-info-trigger">
                    <img src="images/user-avatar.png" alt="avatar">
                    <span class="user-name">Hi, ${currentUser}</span>
                    <i class="arrow-down"></i> 
                </div>
                <div class="dropdown-menu">
                    <a href="user-details.html">Account Details</a>
                    <a href="history.html">Browsing History</a>
                    <a href="orders.html">My Orders</a>
                    <a href="wishlist.html">Wishlist</a>
                    <hr>
                    <a href="javascript:void(0)" onclick="handleLogout()" class="logout-item">Logout</a>
                </div>
            `;

            const cartContainer = rightSection.querySelector('.cart-container');
            if (cartContainer) {
                rightSection.insertBefore(userContainer, cartContainer);
            }
        }
    });
}

/**
 * 4. 登出功能
 */
function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
        window.location.href = "index.html";
    }
}
function createOrder(cartItems, shippingDetails) {
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (!currentEmail) return null;

    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const userIndex = allUsers.findIndex(u => u.email === currentEmail);

    if (userIndex !== -1) {
        // 1. 封裝訂單數據
        const newOrder = {
            orderId: "ORD-" + Date.now(), // 使用時間戳產生簡易唯一 ID
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: "Processing", // 預設狀態
            shipping: shippingDetails
        };

        // 2. 存入該用戶的 orders 陣列
        if (!allUsers[userIndex].orders) {
            allUsers[userIndex].orders = [];
        }
        allUsers[userIndex].orders.unshift(newOrder); // 最新的訂單排在最前面

        // 3. 核心動作：清空該用戶的購物車
        allUsers[userIndex].cart = []; 

        // 4. 儲存回資料庫
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        // 5. 更新 Header 的購物車數字 (因為現在變 0 了)
        const cartNumberElement = document.querySelector('.cart-number');
        if (cartNumberElement) cartNumberElement.textContent = 0;

        return newOrder; // 回傳訂單物件供後續顯示
    }
    return null;
}

// 1. 負責尋找產品資料
function recordAndView(productId) {
    // 從你之前初始化的 allProducts 中找資料
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        console.log("正在記錄瀏覽歷史:", product.name);
        addToHistory(product); // 執行儲存動作
        
        // 如果你有產品詳情頁，取消下面這行的註解
        // window.location.href = `product-details.html?id=${productId}`; 
    } else {
        console.error("找不到產品資料，請確認 localStorage 中的 allProducts 是否正確");
    }
}

// 2. 負責存入 localStorage
function addToHistory(product) {
    const currentEmail = localStorage.getItem('currentUserEmail');
    let historyKey = currentEmail ? `history_${currentEmail}` : 'guestHistory';
    
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];

    // 移除重複並置頂
    history = history.filter(item => item.id !== product.id);
    history.unshift({
        ...product,
        viewedAt: new Date().getTime()
    });

    // 限制 10 筆
    if (history.length > 10) history.pop();

    localStorage.setItem(historyKey, JSON.stringify(history));
}

// --- 5. 立即執行初始化 ---
// 注意：這兩行現在放在最外層，不需要等頁面圖片下載
refreshCartNumber();
checkLoginStatus();

window.addEventListener('load', function() {
    // --- A. 購物車導航攔截 ---
    const cartLink = document.querySelector('.cart-container a');
    if (cartLink) {
        cartLink.addEventListener('click', function(event) {
            const isLoggedIn = localStorage.getItem('currentUserEmail');
            if (!isLoggedIn) {
                event.preventDefault();
                alert("Please login to use the shopping cart function!");
                window.location.href = "Sigin.html";
            }
        });
    }

    // --- B. 加入購物車功能 ---
    const addButtons = document.querySelectorAll('.add');
    addButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id'); 
            if (!productId) return;
            recordAndView(productId);
            const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
            const productInfo = allProducts.find(p => p.id === productId);
            if (!productInfo) return;

            const currentEmail = localStorage.getItem('currentUserEmail');
            if (currentEmail) {
                let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
                const userIndex = allUsers.findIndex(u => u.email === currentEmail);
                if (userIndex !== -1) {
                    if (!allUsers[userIndex].cart) allUsers[userIndex].cart = [];
                    const userCart = allUsers[userIndex].cart;
                    const existingItem = userCart.find(i => i.id === productId);
                    existingItem ? existingItem.quantity += 1 : userCart.push({ ...productInfo, quantity: 1 });
                    localStorage.setItem('allUsers', JSON.stringify(allUsers));
                }
            } else {
                let guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
                const existingItem = guestCart.find(i => i.id === productId);
                existingItem ? existingItem.quantity += 1 : guestCart.push({ ...productInfo, quantity: 1 });
                localStorage.setItem('guestCart', JSON.stringify(guestCart));
            }

            // 更新數字時不再彈跳
            const cart = currentEmail ? 
                (JSON.parse(localStorage.getItem('allUsers')).find(u => u.email === currentEmail).cart) : 
                (JSON.parse(localStorage.getItem('guestCart')) || []);
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            document.querySelector('.cart-number').textContent = totalItems;

            alert(`${productInfo.name} has been added to cart!`);
        });
    });
});
