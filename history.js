// js/history.js

document.addEventListener('DOMContentLoaded', renderHistory);

function renderHistory() {
    const currentEmail = localStorage.getItem('currentUserEmail');
    let historyKey = currentEmail ? `history_${currentEmail}` : 'guestHistory';
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    
    // 這裡改為 match 你 HTML 裡的 id="history-list"
    const container = document.getElementById('history-list'); 
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = `<p style="color:#888; grid-column: 1/-1; text-align:center; padding: 40px;">You haven't viewed any products yet.</p>`;
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>RM ${parseFloat(item.price).toFixed(2)}</p>
            <button class="primary-black-btn" style="width:100%; padding:8px; margin-top:10px; cursor:pointer;" onclick="recordAndView('${item.id}')">View Again</button>
        </div>
    `).join('');
}

// 這裡改成 clearMyHistory 以對應 HTML 裡的 onclick
function clearMyHistory() {
    if (confirm("Clear all browsing history?")) {
        const currentEmail = localStorage.getItem('currentUserEmail');
        let historyKey = currentEmail ? `history_${currentEmail}` : 'guestHistory';
        localStorage.removeItem(historyKey);
        renderHistory(); // 重新渲染
    }
}