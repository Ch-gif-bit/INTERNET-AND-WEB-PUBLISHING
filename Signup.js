document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-card');
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirm = document.getElementById("toggleConfirmPassword");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm-password");
    const errorMessage = document.getElementById('error-message');

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }

    if (toggleConfirm) {
        toggleConfirm.addEventListener("click", function () {
            const type = confirmInput.getAttribute("type") === "password" ? "text" : "password";
            confirmInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault(); // 防止頁面跳轉

            const fullName = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;

            // 檢查密碼是否一致
            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords do not match!";
                errorMessage.style.display = "block";
                confirmInput.style.borderColor = "red";
                return;
            }

            // --- 重點部分：儲存資料以實現自動登入 ---
            
            // 1. 提取 First Name
            const firstName = fullName.split(' ')[0];

            // 2. 獲取目前所有的用戶清單 (如果沒有就建立空陣列)
            let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

            // 3. 檢查 Email 是否已經被註冊過
            const isExisted = allUsers.some(user => user.email === email);
            if (isExisted) {
                errorMessage.textContent = "This email is already registered!";
                errorMessage.style.display = "block";
                return;
            }

            // 4. 建立新用戶物件 (包含空的購物車 cart)
            const newUser = { 
                fullName: fullName,
                firstName: firstName,
                email: email, 
                password: password,
                cart: [] // 每個用戶專屬的購物車盒子
            };

            // 5. 將新用戶推入陣列，並存回 localStorage
            allUsers.push(newUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers));

            // 6. 設定當前登入狀態 (註冊完自動登入)
            localStorage.setItem('currentUser', firstName);
            localStorage.setItem('currentUserEmail', email); // 這把鑰匙很重要！

            alert(`Welcome, ${firstName}! Your account has been created.`);

            // 7. 跳轉回首頁
            window.location.href = "index.html";
        });
    }
});
