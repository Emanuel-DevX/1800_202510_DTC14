async function insertNameFromFirestore() {
  // Handle user authentication state change
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      console.log(user.uid);
      localStorage.setItem("userIdLocal", user.uid); // Correctly set the userId to localStorage

      const currentUser = db.collection("users").doc(user.uid);
      try {
        const userDoc = await currentUser.get();
        let userName = userDoc.data().name;
        console.log(userName);

        // Get the name placeholder and update the inner HTML
        const namePlaceholder = document.getElementById("name-goes-here");
        if (namePlaceholder) {
          namePlaceholder.innerHTML = userName;
        }
<<<<<<< HEAD
        const profileIcon = document.getElementById("profile-icon");

        let profilePic = userDoc.data().photoURL;
        if (profilePic != null && profilePic != "" && profileIcon) {
          profileIcon.src = profilePic;
        }
=======

        // Update profile icon with user's avatar
        const profileIcon = document.getElementById("profile-icon");
        if (profileIcon && user.photoURL) {
          profileIcon.src = user.photoURL; // Set the avatar image
        } else {
          profileIcon.src = "images/profile.jpg"; // Default avatar image
        }

>>>>>>> temp-branch
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No user is logged in.");
    }
  });
}

function profileSetting() {
  const profileIcon = document.getElementById("profile-icon");
  const profileMenu = document.getElementById("profile-menu");

  // Check if elements exist before adding event listeners
  if (profileIcon && profileMenu) {
    profileIcon.addEventListener("click", function () {
      profileMenu.classList.toggle("hidden");
    });

    window.addEventListener("click", function (event) {
      if (
        !profileIcon.contains(event.target) &&
        !profileMenu.contains(event.target)
      ) {
        profileMenu.classList.add("hidden");
      }
    });
  }
}

function logout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("User logged out successfully");
        })
        .catch((error) => {
          console.error("Error logging out: ", error);
        });
    });
  }
}

function sideNavbar() {
  const sideNav = document.querySelector(".side-nav");
  const sideNavButtons = document.querySelector(".nav-buttons");

  // Check if elements exist before adding event listeners
  if (sideNav && sideNavButtons) {
    sideNavButtons.addEventListener("mouseenter", () => {
      sideNav.classList.add("w-48");
    });

    sideNavButtons.addEventListener("mouseleave", () => {
      sideNav.classList.remove("w-48");
    });
  }
}

function postList() {
  const addItemButton = document.getElementById("add-item");
  if (addItemButton) {
    addItemButton.addEventListener("click", function () {
      const itemList = document.getElementById("item-list");
      const newItem = document.createElement("div");
      newItem.classList.add("item-entry", "flex", "gap-2", "mb-2");
      newItem.innerHTML = `
        <button type="button" class="remove-item text-red-500">✖</button>
        <input type="text" class="item-name w-full p-2 border rounded" placeholder="Item name" required />
        <input type="number" class="item-price w-1/3 p-2 border rounded" placeholder="Price ($)" required />
      `;
      itemList.appendChild(newItem);

      newItem
        .querySelector(".remove-item")
        .addEventListener("click", function () {
          newItem.remove();
        });
    });
  }
}

function home() {
  postList();
  profileSetting();
  sideNavbar();
  logout();
}

function setup() {
  // Get today's date
  const today = new Date();

  // Format it as yyyy-mm-dd (the format accepted by the date input field)
  const formattedDate = today.toISOString().split("T")[0];

  // Set the 'min' attribute of the date input to today's date
  const deadlineInput = document.getElementById("deadline");
  if (deadlineInput) {
    deadlineInput.setAttribute("min", formattedDate);
  }

  insertNameFromFirestore();
  home();
}

document.addEventListener("DOMContentLoaded", setup);
