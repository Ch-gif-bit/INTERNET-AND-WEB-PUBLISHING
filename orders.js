document.addEventListener('DOMContentLoaded', () => {
    renderOrdersPage();
});

function renderOrdersPage() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    
    // 1. 找到當前用戶
    const user = allUsers.find(u => u.email === currentEmail);
    const listContainer = document.getElementById('orders-list');

    if (!listContainer) return;

    // 2. 檢查是否有訂單資料
    if (!user || !user.orders || user.orders.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align:center; padding: 60px 20px;">
                <img src="images/empty-orders.png" style="width:100px; opacity:0.3; margin-bottom:20px;">
                <p style="color:#888; font-size:16px;">You haven't placed any orders yet.</p>
                <a href="index.html" style="display:inline-block; margin-top:15px; color:black; font-weight:bold; text-decoration:underline;">
                    Start Shopping
                </a>
            </div>`;
        return;
    }

    // 3. 渲染訂單列表
    // 使用 map 迴圈遍歷每一個訂單 (Order Object)
    listContainer.innerHTML = user.orders.map(order => `
        <div class="order-card" style="border: 1px solid #eee; border-radius:8px; margin-bottom:25px; background:white;">
            <div class="order-header" style="background:#f9f9f9; padding:15px 20px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; border-radius:8px 8px 0 0;">
                <div>
                    <span style="font-size:12px; color:#888; text-transform:uppercase;">Order ID</span>
                    <div style="font-weight:bold; font-size:14px;">${order.orderId}</div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:12px; color:#888; text-transform:uppercase;">Date</span>
                    <div style="font-weight:bold; font-size:14px;">${order.date}</div>
                </div>
                <div>
                    <span class="status-badge" style="background:#e8f5e9; color:#2e7d32; padding:4px 12px; border-radius:15px; font-size:12px; font-weight:bold;">
                        ${order.status || 'Processing'}
                    </span>
                </div>
            </div>

            <div class="order-body" style="padding:20px;">
                ${order.items.map(item => `
                    <div class="order-item" style="display:flex; align-items:center; gap:15px; margin-bottom:15px; border-bottom:1px solid #fafafa; padding-bottom:15px;">
                        <img src="${item.image}" alt="${item.name}" style="width:70px; height:70px; object-fit:cover; border-radius:4px; border:1px solid #eee;">
                        <div style="flex:1;">
                            <div style="font-weight:bold; font-size:15px;">${item.name}</div>
                            <div style="color:#888; font-size:13px;">Quantity: ${item.quantity}</div>
                        </div>
                        <div style="font-weight:bold;">RM ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>

            <div class="order-footer" style="padding:15px 20px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:13px; color:#666;">
                    Total Items: ${order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </div>
                <div style="font-size:16px; font-weight:bold;">
                    Grand Total: <span style="color:#ff4d4d;">RM ${parseFloat(order.total).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}