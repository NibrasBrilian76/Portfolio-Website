function showToast(message, type = "success"){
    // Buat container kalau belum ada
    let container = document.getElementById("toastContainer");
    if(!container){
        container = document.createElement("div");
        container.id = "toastContainer";
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    // Warna berdasarkan type
    const colors = {
        success: "linear-gradient(45deg, #22c55e, #16a34a)",
        error: "linear-gradient(45deg, #ef4444, #dc2626)",
        info: "linear-gradient(45deg, #3b82f6, #2563eb)",
        warning: "linear-gradient(45deg, #f59e0b, #d97706)"
    };

    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warning: "⚠️"
    };

    // Buat toast
    const toast = document.createElement("div");
    toast.style.cssText = `
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-break: break-word;
    `;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Animasi masuk
    setTimeout(() => { toast.style.transform = "translateX(0)"; }, 10);

    // Animasi keluar dan hapus
    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}