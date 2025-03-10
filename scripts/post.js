function hideForm() {
  let form = document.getElementById("post-form");
  let icon = document.getElementById("post-icon");

  form.classList.toggle("hidden");
  icon.classList.toggle("rotate-180"); // Rotate icon for animation
}

function postPage() {
  document.getElementById("post-btn").addEventListener("click", hideForm);
}

async function addPost(postData) {
  try {
    // Reference to the "Posts" collection
    const postsRef = db.collection("Posts");

    // Add a new document with a generated ID
    const docRef = await postsRef.add({
      created_at: postData.created_at,
      description: postData.description,
      group_id: postData.group_id,
      image: postData.image,
      post_id: postData.post_id,
      title: postData.title,
      user_id: postData.user_id,
      price: postData.price, // New field for price
      category: postData.category, // New field for category
      deadline: postData.deadline, // New field for deadline
    });

    console.log("Document added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
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
      post = {
        created_at: 2023,
        description: description,
        group_id: "userName",
        image: "https://example.com/macbook.jpg",
        post_id: "post123",
        title: title,
        user_id: "bjk",
        price: price, // New price field
        category: category, // New category field
        deadline: deadline, // New deadline field
      };

      addPost(post);

      document.getElementById("postForm").reset();

      hideForm();
    });
}

function setup(){
    postPage();
    submitForm();
}


document.addEventListener("DOMContentLoaded", setup);
