document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化頁面
    initAccountPage();
});

/**
 * 初始化頁面：檢查權限並渲染
 */
function initAccountPage() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    
    // 如果沒有登入 Email，直接踢回登入頁
    if (!currentEmail) {
        alert("Please login to view your account details.");
        window.location.href = "Sigin.html";
        return;
    }

    renderProfile();
}

/**
 * 渲染用戶資料到畫面上
 */
function renderProfile() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    // 使用 find 尋找用戶 (增加 toLowerCase() 確保不分大小寫都能找到)
    const user = allUsers.find(u => 
        u.email.toLowerCase() === currentEmail.toLowerCase()
    );

    const displayEmail = document.getElementById('display-email');
    const displayUsername = document.getElementById('display-username');
    const displayPhone = document.getElementById('display-phone');

    if (user) {
        // A. 顯示資料 (優先使用 firstName，這是你 signin.js 存的欄位)
        displayEmail.textContent = user.email;
        displayUsername.textContent = user.fullName || user.username || "User";
        displayPhone.textContent = user.phone || "Not set";

        // B. 同步預填編輯彈窗中的輸入框
        if (document.getElementById('edit-name')) {
            document.getElementById('edit-name').value = user.firstName || user.username || "";
        }
        if (document.getElementById('edit-phone')) {
            document.getElementById('edit-phone').value = user.phone || "";
        }
    } else {
        // C. 處理 Admin 或 找不到數據的情況
        displayEmail.textContent = currentEmail;
        displayUsername.textContent = localStorage.getItem('currentUser') || "Guest";
        displayPhone.textContent = "Not set";
    }
}

/**
 * 彈窗控制：開啟
 */
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * 彈窗控制：關閉
 */
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 儲存修改：將新資料存回 allUsers
 */
function saveProfile() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    // 找到該用戶在陣列中的位置
    const userIndex = allUsers.findIndex(u => 
        u.email.toLowerCase() === currentEmail.toLowerCase()
    );

    if (userIndex !== -1) {
        const newName = document.getElementById('edit-name').value.trim();
        const newPhone = document.getElementById('edit-phone').value.trim();

        if (newName === "") {
            alert("Name cannot be empty!");
            return;
        }

        // 1. 更新資料庫中的物件 (同步更新 firstName 以維持與 signin.js 一致)
        allUsers[userIndex].firstName = newName;
        allUsers[userIndex].phone = newPhone;

        // 2. 存回 localStorage
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        // 3. 更新目前顯示的用戶名 (Header 會用到)
        localStorage.setItem('currentUser', newName);

        alert("Profile updated successfully!");
        closeEditModal();
        renderProfile(); // 重新渲染畫面
        
        // 如果 header 有顯示名字，強制刷新一下 header
        if (typeof checkLoginStatus === 'function') {
            // 如果 common.js 裡有這函數，可以嘗試重新執行
            location.reload(); 
        }
    } else {
        alert("Error: User not found in database.");
    }
}

// 點擊彈窗外部可以關閉 (優化體驗)
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target == modal) {
        closeEditModal();
    }
}