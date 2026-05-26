// Loading indicator untuk tombol
function setLoading(btnId, isLoading, originalText){
    const btn = document.getElementById(btnId);
    if(!btn) return;
    if(isLoading){
        btn.dataset.originalText = btn.innerText;
        btn.innerText = "Loading...";
        btn.classList.add("btn-loading");
    } else {
        btn.innerText = originalText || btn.dataset.originalText;
        btn.classList.remove("btn-loading");
    }
}

// Validasi form
function validasiInput(value, nama, options = {}){
    if(!value || value.trim() === ""){
        showToast(`${nama} tidak boleh kosong!`, "error");
        return false;
    }
    if(options.min && value.length < options.min){
        showToast(`${nama} minimal ${options.min} karakter!`, "error");
        return false;
    }
    if(options.max && value.length > options.max){
        showToast(`${nama} maksimal ${options.max} karakter!`, "error");
        return false;
    }
    if(options.email && !value.includes("@")){
        showToast(`${nama} tidak valid!`, "error");
        return false;
    }
    if(options.url && !value.startsWith("http")){
        showToast(`${nama} harus diawali dengan http:// atau https://`, "error");
        return false;
    }
    return true;
}