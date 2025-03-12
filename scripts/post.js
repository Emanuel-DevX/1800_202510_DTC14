let globalUserId = null;
function initializeUserId() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      globalUserId = user.uid; // Set the global user ID
      console.log("User ID initialized:", globalUserId);
    } else {
      globalUserId = null; // Reset if no user is logged in
      console.log("No user is logged in.");
    }
  });
}

function getPostImage(category) {
  category = category.toLowerCase();
  const defaultPostImg =
    "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxpZmV8ZW58MHx8MHx8fDA%3D";

  const myImages = {
    electronics: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1620288650879-20db0eb38c05?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBob25lc3xlbnwwfDB8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGhvbmVzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvbXB1dGVyc3xlbnwwfDB8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1620365602462-40d8f2cdd84c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNvbXB1dGVyc3xlbnwwfDB8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1625750319971-ee4b61e68df8?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFjY2Vzb3JpZXN8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHRlY2hub2xvZ3l8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHRlY2hub2xvZ3l8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2F0Y2h8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1632280071595-b13521457242?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdhdGNofGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHdhdGNofGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJpZGdlfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1610527003928-47afd5f470c6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fG92ZW58ZW58MHwwfDB8fHww",
    ],
    groceries: [
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JvY2VyaWVzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1543168256-418811576931?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyb2Nlcmllc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVnZXRhYmxlc3xlbnwwfDB8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1592201426550-83c4be24a0a7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmVnZXRhYmxlc3xlbnwwfDB8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZlZ2V0YWJsZXN8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHZlZ2V0YWJsZXN8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIwfHx2ZWdldGFibGVzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhaXJ5fGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1572086301796-cb8920f1b2af?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGRhaXJ5fGVufDB8MHwwfHx8MA%3D%3D",
    ],
    clothing: [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2hvZXN8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHwwfDB8fHww",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2VzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNob2VzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1524532787116-e70228437bbe?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHNob2VzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdGhpbmdzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdGhpbmdzfGVufDB8MHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1618231560380-f4791a31f900?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM1fHxjbG90aGluZ3N8ZW58MHwwfDB8fHww",
    ],
    // Add more categories and images as needed
  };

  // Check if the category exists in myImages
  if (myImages.hasOwnProperty(category)) {
    // Randomly select an image from the category's array
    const images = myImages[category];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return randomImage;
  } else {
    // Return the default image if the category is not found
    return defaultPostImg;
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
      owner: postData.owner,
      price: postData.price, // New field for price
      category: postData.category, // New field for category
      deadline: postData.deadline, // New field for deadline
      quantity: postData.quantity,
      members: postData.members,
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
        if (!globalUserId) {
          alert("You need to be logged in to create posts!");
          return 0;
        }
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
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        group_id: "userName",
        image: getPostImage(category),
        post_id: "post123",
        title: title,
        owner: globalUserId,
        price: price, // New price field
        category: category, // New category field
        deadline: deadline, // New deadline field
        quantity: quantity,
        members: [globalUserId],
      };

      addPost(post);

      document.getElementById("postForm").reset();

      hideForm();
    });
}

function getUserName(userId) {
  if (!userId) {
    console.error("Invalid userId");
    return Promise.resolve(null); // Return null or an appropriate default value
  }
  const db = firebase.firestore(); // Ensure Firestore is initialized
  const userRef = db.collection("users").doc(userId);

  return userRef
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        return userDoc.data().name; // Correctly return the name
      } else {
        throw new Error("User not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      return null;
    });
}

function createPostCard(post) {
  // Create the card container
  const card = document.createElement("div");
  card.className =
    "relative post-1 max-w-[320px] md:w-80 lg:w-[31%] shadow-lg bg-[#434343] text-lime-50 rounded-2xl md:mx-2 mb-6";

  // Add the image section
  const imageDiv = document.createElement("div");
  imageDiv.className = "image max-h-48 overflow-hidden";
  const image = document.createElement("img");
  image.className = "w-full rounded-t-xl";
  image.src = post.image || "images/apples.jpg"; // Use post image or a default image
  image.alt = post.title;
  imageDiv.appendChild(image);

  // Add the post info section
  const postInfoDiv = document.createElement("div");
  postInfoDiv.className = "post-info px-2";

  // Add the title
  const title = document.createElement("h3");
  title.className = "font-bold text-lg text-lime-100";
  title.textContent = post.title;
  postInfoDiv.appendChild(title);

  // Add the description
  const description = document.createElement("p");
  description.textContent = post.description;
  postInfoDiv.appendChild(description);

  // Add the original price
  const originalPrice = document.createElement("p");
  originalPrice.innerHTML = `<span class="font-bold">Original price:</span> $${post.price} /lb`;
  postInfoDiv.appendChild(originalPrice);

  // Add the bulk price
  const bulkPrice = document.createElement("p");
  bulkPrice.innerHTML = `<span class="font-bold">Bulk price:</span> $${Math.round(
    post.price * 0.6
  )} /lb`; // Example discount
  postInfoDiv.appendChild(bulkPrice);

  // Add the category
  const category = document.createElement("p");
  category.innerHTML = `<span class="font-bold">Category:</span> ${post.category}`;
  postInfoDiv.appendChild(category);

  // Add the deadline
  const deadline = document.createElement("p");
  deadline.innerHTML = `<span class="font-bold">Deadline:</span> ${new Date(
    post.deadline
  ).toLocaleDateString()}`;
  postInfoDiv.appendChild(deadline);

  // Add the quantity
  const quantity = document.createElement("p");
  quantity.innerHTML = `<span class="font-bold">Quantity:</span> ${post.quantity}`;
  postInfoDiv.appendChild(quantity);

  // Add the posted by
  const postedBy = document.createElement("p");
  postedBy.innerHTML = `<span class="font-bold">Posted by:</span> ${getUserName(
    post.owner
  )}`;
  postInfoDiv.appendChild(postedBy);

  // Add the card actions section
  const cardActionsDiv = document.createElement("div");
  cardActionsDiv.className = "card-actions flex justify-between items-end mt-4";

  // Add the join button
  const joinButton = document.createElement("button");
  joinButton.className =
    "border-2 px-2 pb-1 rounded-b-xl ml-auto absolute top-0 right-2 bg-[#434343] self-right mb-2 mt-auto border-lime-50 border-3 shadow-lg border-t-0 hover:bg-white hover:border-[#434343] hover:border-3 hover:border-t-0 hover:text-green-900 font-bold";
  joinButton.textContent = "Join +";
  cardActionsDiv.appendChild(joinButton);

  // Append the card actions to the post info
  postInfoDiv.appendChild(cardActionsDiv);

  // Append the image and post info to the card
  card.appendChild(imageDiv);
  card.appendChild(postInfoDiv);

  return card;
}

function fetchAndRenderPosts() {
  const cardsSection = document.querySelector(".cards");

  // Listen for real-time updates
  db.collection("Posts")
    .orderBy("created_at") // Order by creation date (newest first)
    .onSnapshot(
      (snapshot) => {
        // Clear the existing cards (optional, depending on your use case)
        cardsSection.innerHTML = "";

        // Loop through the documents and render cards
        snapshot.forEach((doc) => {
          const post = doc.data();
          const card = createPostCard(post);
          cardsSection.prepend(card); // Prepend the new card
        });
      },
      (error) => {
        console.error("Error fetching posts: ", error);
      }
    );
}

function setup() {
  initializeUserId();
  postPage();
  submitForm();
  //insertPostInfo();
  fetchAndRenderPosts(); // Fetch and render posts
}

document.addEventListener("DOMContentLoaded", setup);
