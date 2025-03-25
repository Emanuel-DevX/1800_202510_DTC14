function profileSetting() {
  const profileIcon = document.getElementById("profile-icon");
  const profileMenu = document.getElementById("profile-menu");

  // Toggle menu visibility
  profileIcon.addEventListener("click", function () {
    profileMenu.classList.toggle("hidden");
  });

  // Close the menu if clicked outside
  window.addEventListener("click", function (event) {
    if (
      !profileIcon.contains(event.target) &&
      !profileMenu.contains(event.target)
    ) {
      profileMenu.classList.add("hidden");
    }
  });
}
function insertNameFromFirestore() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
      const currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        let userName = userDoc.data().name;
        console.log(userName);
        namePlaceholder = document.getElementById("name-goes-here");

        if (namePlaceholder) namePlaceholder.innerHTML = userName;
      });
    } else {
      console.log("No user is logged in.");
    }
  });
}

function logout() {
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", function () {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  });
}

function setup(){
    insertNameFromFirestore();
    profileSetting();
}

document.addEventListener("DOMContentLoaded", setup)