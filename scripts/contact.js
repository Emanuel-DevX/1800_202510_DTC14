function setup(){
    document.getElementById(`back-btn`).addEventListener("click", () => {
        document.location.href = "home.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);