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

// function home() {
//   nav(); // Load the navigation first

//   const postTemplate = document.querySelector(".post-1");
//   if (!postTemplate) {
//     console.error("Template post (.post-1) not found!");
//     return;
//   }

//   for (let i = 0; i < 5; i++) {
//     let clonedPost = postTemplate.cloneNode(true);
//     document.querySelector(".posts").appendChild(clonedPost);
//   }
// }

// function home() {
//    // Load the navigation first

//   const postTemplate = document.querySelector(".post-1");
//   if (!postTemplate) {
//     console.error("Template post (.post-1) not found!");
//     return;
//   }

//   for (let i = 0; i < 5; i++) {
//     let clonedPost = postTemplate.cloneNode(true);
//     document.querySelector(".posts").appendChild(clonedPost);
//   }
// }

function postPage() {
  document.getElementById("post-btn").addEventListener("click", function () {
    let form = document.getElementById("post-form");
    let icon = document.getElementById("post-icon");

    form.classList.toggle("hidden");
    icon.classList.toggle("rotate-180"); // Rotate icon for animation
  });
}

function setup() {
  insertNameFromFirestore();
  postPage();
  // home();

  const postBtn = document.getElementById("post-btn");
  if (postBtn) {
    postBtn.addEventListener("click", () => {
      console.log("Post button clicked!");
    });
  } else {
    console.error("post-btn not found in the DOM");
  }
}

document.addEventListener("DOMContentLoaded", setup);
