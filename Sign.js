document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-card');
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const emailInput = document.getElementById("email").value;
            const passwordInput = document.getElementById("password").value;

            // --- 核心修改：從 allUsers 陣列中尋找用戶 ---
            // 1. 抓取所有用戶陣列
            const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

            // 2. 使用 find 尋找匹配的物件
            const user = allUsers.find(u => u.email === emailInput && u.password === passwordInput);

            // 3. 驗證邏輯
            if (user) {
                // A. 匹配到註冊過的帳號
                localStorage.setItem('currentUser', user.firstName);
                localStorage.setItem('currentUserEmail', user.email); // 這是方案 B 的關鍵鑰匙
                
                alert(`Login successful! Welcome back, ${user.firstName}.`);
                window.location.href = "index.html";

            } else if (emailInput === "admin@example.com" && passwordInput === "123456") {
                // B. 匹配預設的測試帳號 (admin)
                localStorage.setItem('currentUser', "Justin");
                localStorage.setItem('currentUserEmail', "admin@example.com"); // admin 也要給鑰匙
                
                alert("Login successful! Welcome, Justin.");
                window.location.href = "index.html";

            } else {
                // C. 驗證失敗
                alert("Invalid email or password. If you haven't registered, please Sign Up first.");
            }
        });
    }
});
