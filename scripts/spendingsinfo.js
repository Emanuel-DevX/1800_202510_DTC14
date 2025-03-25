
function getInfoFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const trip_id = localStorage.getItem('trip_id');
            console.log(trip_id);
            db.collection("Posts").doc(trip_id).get()
                .then((doc) => {
                    if (doc.exists) {
                        var name = doc.data().title;
                        var items = doc.data().items;
                        var category = doc.data().category;
                        var deadline = doc.data().deadline;

                        document.getElementById("group_name").innerText = name;
                    } else {
                        console.log("No such document!");
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}

function setup() {
    getInfoFromAuth();

    document.getElementById(`back-btn`).addEventListener("click", () => {
        document.location.href = "spendings.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);