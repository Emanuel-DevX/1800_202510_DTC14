function insertNameFromFirestore() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
      const currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        let userName = userDoc.data().name;
        console.log(userName);
        document.getElementById("name-goes-here").innerHTML = userName;
      });
    } else {
      console.log("No user is logged in.");
    }
  });
}

function home() {
  sideNav = document.querySelector(".side-nav");
  sideNavButtons = document.querySelector(".nav-buttons");

  // Add a mouseenter event listener to trigger on hover
  sideNavButtons.addEventListener("mouseenter", () => {
    sideNav.classList.add("w-48");
  });

  sideNavButtons.addEventListener("mouseleave", () => {
    sideNav.classList.remove("w-48");
  });
}

function setup() {
  insertNameFromFirestore();
  home();

  // const postBtn = document.getElementById("post-btn");
  // if (postBtn) {
  //   postBtn.addEventListener("click", () => {
  //     console.log("Post button clicked!");
  //   });
  // } else {
  //   console.error("post-btn not found in the DOM");
  // }
}

document.addEventListener("DOMContentLoaded", setup);
