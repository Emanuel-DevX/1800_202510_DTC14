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
  // Load the navigation first

  const postTemplate = document.querySelector(".post-1");
  if (!postTemplate) {
    console.error("Template post (.post-1) not found!");
    return;
  }

  for (let i = 0; i < 5; i++) {
    let clonedPost = postTemplate.cloneNode(true);
    document.querySelector(".posts").appendChild(clonedPost);
  }
}

function hideForm() {
  let form = document.getElementById("post-form");
  let icon = document.getElementById("post-icon");

  form.classList.toggle("hidden");
  icon.classList.toggle("rotate-180"); // Rotate icon for animation
}

function postPage() {
  document.getElementById("post-btn").addEventListener("click", hideForm);
}

function submitForm() {
  // Attach the event listener to the form
  document
    .getElementById("postForm")
    .addEventListener("submit", function (event) {
      // Prevent the form from submitting and refreshing the page
      event.preventDefault();

      // Retrieve the form values
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const category = document.getElementById("category").value;
      const price = document.getElementById("price").value;
      const quantity = document.getElementById("quantity").value;
      const deadline = document.getElementById("deadline").value;

      // Log the values to the console (or process them as needed)
      console.log("Title:", title);
      console.log("Description:", description);
      console.log("Category:", category);
      console.log("Price:", price);
      console.log("Quantity:", quantity);
      console.log("Deadline:", deadline);

      document.getElementById("postForm").reset();

      hideForm();
    });
}

function setup() {
  insertNameFromFirestore();
  postPage();
  home();
  submitForm();

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
