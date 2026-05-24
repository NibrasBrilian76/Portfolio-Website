// Animasi masuk saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-transition");
});

// Animasi keluar saat pindah halaman
document.querySelectorAll("a[href], button[onclick]").forEach(el => {
    el.addEventListener("click", function(e) {
        const href = this.getAttribute("href") || 
                     this.getAttribute("onclick");
        
        // Hanya untuk link internal
        if(href && href.includes(".html")){
            e.preventDefault();
            document.body.classList.add("page-exit");
            
            setTimeout(() => {
                window.location.href = href.includes("href='") ? 
                    href.match(/href='([^']+)'/)?.[1] : 
                    this.getAttribute("href") || 
                    href.match(/href="([^"]+)"/)?.[1] ||
                    href.match(/'([^']+\.html[^']*)'/)?.[1];
            }, 300);
        }
    });
});