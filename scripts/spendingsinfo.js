
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


async function displayUserAvatar() {
    try {
        const user = firebase.auth().currentUser;
        if (user && user.photoURL) {
            const profileIcon = document.getElementById("profile-icon");
            if (profileIcon) {
                profileIcon.src = user.photoURL; // Set the user's avatar
            }
        } else {
            console.log("No user is logged in or no avatar found.");
        }
    } catch (error) {
        console.error("Error fetching user avatar:", error);
    }
}


function setup() {
    displayUserAvatar(); // Fetch and display the user's avatar
    getInfoFromAuth();

    document.getElementById(`back-btn`).addEventListener("click", () => {
        document.location.href = "spendings.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);
