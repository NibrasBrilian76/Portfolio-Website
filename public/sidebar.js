async function buatSidebar(username){
    const res = await fetch("/ambil-portfolio");
    const data = await res.json();
    const profileImg = data.portfolio.profile_image || "https://via.placeholder.com/42";
    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
        .hamburger {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 10px 13px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            width: auto !important;
            margin-top: 0 !important;
        }
            .topbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1000;
    box-sizing: border-box;
}
.topbarLeft {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}
.topbarLeft img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    transition: 0.3s;
}
.topbarLeft img:hover {
    border-color: var(--mainColor);
}
.topbarLeft span {
    color: white;
    font-size: 14px;
    font-weight: 500;
}
.hamburger {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 8px 11px;
    cursor: pointer;
    width: auto !important;
    margin-top: 0 !important;
}
        .hamburger span {
            display: block;
            width: 22px;
            height: 2px;
            background: white;
            margin: 5px 0;
            transition: 0.3s;
            border-radius: 2px;
        }
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
        .sidebar {
            position: fixed;
            top: 0;
            right: -280px;
            width: 260px;
            height: 100%;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            border-left: 1px solid rgba(255,255,255,0.1);
            z-index: 999;
            transition: 0.3s ease;
            padding: 80px 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .sidebar.open { right: 0; }
        .sidebarItem {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 14px;
            color: white;
            cursor: pointer;
            transition: 0.2s;
            font-size: 15px;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
            margin-top: 0 !important;
        }
        .sidebarItem:hover {
            background: rgba(255,255,255,0.1);
            transform: translateX(-5px);
        }
        .sidebarItem .icon {
            font-size: 20px;
            width: 30px;
            text-align: center;
        }
        .sidebarLogout {
            margin-top: auto !important;
            background: rgba(239,68,68,0.15) !important;
            border: 1px solid rgba(239,68,68,0.3) !important;
        }
        .sidebarLogout:hover {
            background: rgba(239,68,68,0.3) !important;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            display: none;
        }
        .overlay.show { display: block; }
        .sidebarUsername {
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 0 18px 15px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // HTML
    const html = `
    <div class="topbar">
        <div class="topbarLeft" onclick="window.location.href='/profil.html'">
            <img src="${profileImg}">
            <span>@${username}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
            <div style="position:relative;cursor:pointer" onclick="toggleNotifikasi()">
                <span style="font-size:22px">🔔</span>
                <span id="notifBadge" style="display:none;position:absolute;top:-5px;right:-5px;background:#ef4444;color:white;border-radius:50%;width:18px;height:18px;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:bold">0</span>
            </div>
            <button class="hamburger" id="hamburger" onclick="toggleSidebar()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>

    <!-- Panel Notifikasi -->
    <div id="notifPanel" style="display:none;position:fixed;top:60px;right:10px;width:300px;max-height:400px;overflow-y:auto;background:#1e293b;border-radius:16px;border:1px solid rgba(255,255,255,0.1);z-index:1001;box-shadow:0 10px 40px rgba(0,0,0,0.5)">
        <div style="padding:15px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center">
            <span style="color:white;font-weight:bold">Notifikasi 🔔</span>
            <span onclick="bacaSemua()" style="color:#94a3b8;font-size:12px;cursor:pointer">Tandai semua dibaca</span>
        </div>
        <div id="notifList" style="padding:10px">
            <p style="color:#94a3b8;text-align:center;font-size:13px;padding:20px">Loading...</p>
        </div>
    </div>
        <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>
        <div class="sidebar" id="sidebar">
            <div class="sidebarUsername">👤 ${username}</div>
            <button class="sidebarItem" onclick="navigasi('/dashboard.html')">
                <span class="icon">🏠</span> Dashboard
            </button>
            <button class="sidebarItem" onclick="navigasi('/feed.html')">
    <span class="icon">📱</span> Feed
</button>
            <button class="sidebarItem" onclick="navigasi('/portfolio.html')">
                <span class="icon">🎨</span> Portfolio Saya
            </button>
            <button class="sidebarItem" onclick="navigasi('/cari.html')">
                <span class="icon">🔍</span> Cari Portfolio
            </button>
            <button class="sidebarItem" onclick="navigasi('/settings.html')">
    <span class="icon">⚙️</span> Settings
</button>
            <button class="sidebarItem" onclick="navigasi('/about.html')">
    <span class="icon">ℹ️</span> About
</button>
            <button class="sidebarItem" onclick="sharePorfolio('${username}')">
                <span class="icon">🔗</span> Share Portfolio
            </button>
            <button class="sidebarItem" onclick="toggleMode()">
    <span class="icon" id="modeIcon">🌙</span> <span id="modeText">Dark Mode</span>
</button>
            <button class="sidebarItem sidebarLogout" onclick="navigasi('/logout')">
                <span class="icon">🚪</span> Logout
            </button>
        </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

function toggleSidebar(){
    document.getElementById("hamburger").classList.toggle("active");
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
}

function navigasi(url){
    toggleSidebar();
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

function sharePorfolio(username){
    const link = `${window.location.origin}/publik.html?user=${username}`;
    navigator.clipboard.writeText(link);
    alert("Link portofolio tersalin! 🔥\n" + link);
}

function toggleMode(){
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("mode", isLight ? "light" : "dark");
    document.getElementById("modeIcon").innerText = isLight ? "☀️" : "🌙";
    document.getElementById("modeText").innerText = isLight ? "Light Mode" : "Dark Mode";
}

// Load mode saat halaman dibuka
function loadMode(){
    const mode = localStorage.getItem("mode");
    if(mode === "light"){
        document.body.classList.add("light-mode");
    }
}

loadMode();

async function cekNotifikasi(){
    try {
        const res = await fetch("/notifikasi/unread");
        const data = await res.json();
        const badge = document.getElementById("notifBadge");
        if(badge){
            if(data.count > 0){
                badge.style.display = "flex";
                badge.innerText = data.count > 9 ? "9+" : data.count;
            } else {
                badge.style.display = "none";
            }
        }
    } catch(e) {}
}

async function toggleNotifikasi(){
    const panel = document.getElementById("notifPanel");
    if(panel.style.display === "none" || panel.style.display === ""){
        panel.style.display = "block";
        await loadNotifikasi();
        await bacaSemua();
    } else {
        panel.style.display = "none";
    }
}

async function loadNotifikasi(){
    const res = await fetch("/notifikasi");
    const data = await res.json();
    const list = document.getElementById("notifList");

    if(data.length === 0){
        list.innerHTML = `<p style="color:#94a3b8;text-align:center;font-size:13px;padding:20px">Belum ada notifikasi</p>`;
        return;
    }

    const icons = { like: "❤️", comment: "💬", follow: "👥" };
    const texts = {
        like: "menyukai postinganmu",
        comment: "mengomentari postinganmu",
        follow: "mulai mengikutimu"
    };

    list.innerHTML = data.map(n => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:${n.is_read ? 'transparent' : 'rgba(255,255,255,0.05)'};margin-bottom:5px">
            <img src="${n.avatar || 'https://via.placeholder.com/35'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;flex-shrink:0">
            <div style="flex:1">
                <p style="color:white;font-size:13px"><strong>@${n.username}</strong> ${texts[n.type] || n.type} ${icons[n.type] || ''}</p>
                <p style="color:#64748b;font-size:11px">${new Date(n.created_at).toLocaleDateString('id-ID')}</p>
            </div>
        </div>
    `).join('');
}

async function bacaSemua(){
    await fetch("/notifikasi/baca", { method: "POST" });
    const badge = document.getElementById("notifBadge");
    if(badge) badge.style.display = "none";
}

// Cek notifikasi setiap 30 detik
cekNotifikasi();
setInterval(cekNotifikasi, 30000);

// Tutup panel kalau klik di luar
document.addEventListener("click", function(e){
    const panel = document.getElementById("notifPanel");
    if(panel && !panel.contains(e.target) && !e.target.closest("[onclick='toggleNotifikasi()']")){
        panel.style.display = "none";
    }
});