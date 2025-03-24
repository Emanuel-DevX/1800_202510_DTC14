function setup() {
    document.getElementById(`manage_spending`).addEventListener("click", () => {
        document.location.href = "spendings.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);