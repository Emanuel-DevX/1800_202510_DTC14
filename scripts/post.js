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

let globalUserName = null;

function getUserName(u_id) {
  return new Promise((resolve, reject) => {
    const userDocRef = db.collection("users").doc(u_id); // Reference the user document
    userDocRef
      .get()
      .then((userDoc) => {
        if (userDoc.exists) {
          const userName = userDoc.data().name; // Get the username from the document
          resolve(userName); // Resolve the promise with the username
        } else {
          reject("User document does not exist."); // Reject if the document doesn't exist
        }
      })
      .catch((error) => {
        reject("Error getting user document: " + error); // Reject if there's an error
      });
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
      minPrice: postData.minPrice, // New field for price
      category: postData.category, // New field for category
      deadline: postData.deadline, // New field for deadline
      members: postData.members,
      items: postData.items,
    });
    addPostToUsers(docRef.id);

    console.log("Document added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
async function addPostToUsers(groupId) {
  try {
    // Reference to the specific user document
    const userRef = db.collection("users").doc(globalUserId);

    // Update the document with arrayUnion to add to the array
    await userRef.update({
      groups: firebase.firestore.FieldValue.arrayUnion(groupId),
    });

    //console.log("Successfully added group to user:", globalUserId);
  } catch (e) {
    console.error("Error updating document: ", e);
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
      const deadline = document.getElementById("deadline").value;
      let items = [];
      document.querySelectorAll("#item-list .item-entry").forEach((itemRow) => {
        let itemName = itemRow.querySelector(".item-name").value;
        let itemPrice = itemRow.querySelector(".item-price").value;
        if (itemName && itemPrice) {
          items.push({ name: itemName, price: parseFloat(itemPrice) });
        }
      });

      // Log the values to the console (or process them as needed)
      post = {
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        description: description,
        group_id: "userName",
        image: getPostImage(category),
        post_id: "post123",
        title: title,
        owner: globalUserId,
        minPrice: price, // New price field
        category: category, // New category field
        deadline: deadline, // New deadline field
        members: [globalUserId],
        items: items,
      };

      addPost(post);

      document.getElementById("postForm").reset();

      hideForm();
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Get all filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  const postsContainer = document.querySelector(".posts");
  let allButton = null; // Reference to the "All" button

  // Add click event to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");

      // Update active button styling - including the "All" button if it exists
      const allButtons = [...filterButtons];
      if (allButton) allButtons.push(allButton);

      allButtons.forEach((btn) => {
        btn.classList.remove("bg-green-900", "text-white");
        btn.classList.add("border-green-900/50", "text-green-900");
      });

      // Highlight only the clicked button
      this.classList.remove("border-green-900/50", "text-green-900", "px-2");
      this.classList.add("bg-green-900", "text-white", "px-2");

      // Get all post cards
      const allPosts = document.querySelectorAll(".post-1");

      // Loop through each post card
      allPosts.forEach((post) => {
        // Find the category element within the post
        const categoryElement = post.querySelector("p:nth-of-type(3)"); // Assuming category is the third paragraph

        if (categoryElement) {
          const postCategory = categoryElement.textContent
            .replace("Category:", "")
            .trim();

          // Show/hide based on selected category
          if (selectedCategory === "All" || postCategory === selectedCategory) {
            post.style.display = "block";
          } else {
            post.style.display = "none";
          }
        }
      });
    });
  });

  // Add "All" button
  function addAllButton() {
    allButton = document.createElement("button");
    allButton.setAttribute("data-category", "All");
    allButton.classList.add(
      "max-h-8",
      "filter-btn",
      "border-2",
      "border-green-900/50",
      "text-green-900",
      "font-bold",
      "rounded-full",
      "px-1",
      "mr-2"
    );
    allButton.textContent = "All";

    const filterButtonsContainer = document.querySelector(".filter-buttons");
    filterButtonsContainer.prepend(allButton);

    // Add event listener to the "All" button
    allButton.addEventListener("click", function () {
      // Update button styling for all buttons including the original filter buttons
      const allButtons = [...filterButtons];
      allButtons.push(allButton);

      allButtons.forEach((btn) => {
        btn.classList.remove("bg-green-900", "text-white");
        btn.classList.add("border-green-900/50", "text-green-900");
      });

      // Highlight only the "All" button
      this.classList.remove("border-green-900/50", "text-green-900");
      this.classList.add("bg-green-900", "text-white");

      // Show all posts
      document.querySelectorAll(".post-1").forEach((post) => {
        post.style.display = "block";
      });
    });
  }

  addAllButton();
});

function createPostCard(post, docId) {
  // Create the card container
  const card = document.createElement("div");
  card.className =
    "relative md:min-h-115 post-1 max-w-[320px] md:w-80 lg:w-[31%] shadow-lg bg-[#434343] text-lime-50 rounded-2xl md:mx-2 mb-6";
  card.setAttribute("data-category", post.category);

  // When setting the data attribute, use the docId parameter:

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
  const minPrice = document.createElement("p");
  minPrice.innerHTML = `<span class="font-bold">Bulk Discount Min:</span> $${post.minPrice}`;
  postInfoDiv.appendChild(minPrice);

  // Add the category
  const category = document.createElement("p");
  category.innerHTML = `<span class="font-bold">Category:</span> ${post.category}`;
  postInfoDiv.appendChild(category);
  // Add the items
  const items = document.createElement("p");
  // items.innerHTML = `<span class="font-bold">Items:</span> ${post.items}`;
  const itemsList = post.items.map((item) => `${item.name}`).join(", ");

  items.innerHTML = `<span class="font-bold">Items:</span> ${itemsList}`;
  postInfoDiv.appendChild(items);

  // Add the deadline
  const deadline = document.createElement("p");
  deadline.innerHTML = `<span class="font-bold">Deadline:</span> ${new Date(
    post.deadline
  ).toLocaleDateString()}`;
  postInfoDiv.appendChild(deadline);

  // Add the posted by
  const postedBy = document.createElement("p");
  if (post.owner) {
    getUserName(post.owner)
      .then((userName) => {
        postedBy.innerHTML = `<span class="font-bold">Posted by: ${userName}</span> `;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  postInfoDiv.appendChild(postedBy);

  // Add the card actions section
  const cardActionsDiv = document.createElement("div");
  cardActionsDiv.className = "card-actions flex justify-between items-end mt-4";

  // Add the join button
  const joinButton = document.createElement("button");
  joinButton.dataset.groupId = docId;

  joinButton.id = "join-group";
  joinButton.id = "join-" + docId;
  joinButton.className =
    "border-2 px-2 pb-1 rounded-b-xl ml-auto absolute top-0 right-2 bg-[#434343] self-right mb-2 mt-auto border-lime-50 border-3 shadow-lg border-t-0 hover:bg-white hover:border-[#434343] hover:border-3 hover:border-t-0 hover:text-green-900 font-bold";
  joinButton.textContent = "Join +";

  // Add click event listener directly to this button
  joinButton.addEventListener("click", function () {
    addPostToUsers(this.dataset.groupId);
    toggleGroupJoin(this.dataset.groupId);
  });

  cardActionsDiv.appendChild(joinButton);

  // Append the card actions to the post info
  postInfoDiv.appendChild(cardActionsDiv);

  // Append the image and post info to the card
  card.appendChild(imageDiv);
  card.appendChild(postInfoDiv);

  return card;
}

async function toggleGroupJoin(groupId) {
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Fetch the user's Firestore document
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((userDoc) => {
          // Ensure the user document exists and has the joinedGroups field
          let joinedGroups = userDoc.exists ? userDoc.data().groups || [] : [];

          // Assuming groupId is already defined
          let joinButton = document.getElementById("join-" + groupId);

          // console.log("Current user:", userDoc.data().groups);
          // console.log("Joined groups:", joinedGroups);

          // Clear any existing event listeners
          joinButton.removeEventListener("click", handleLeaveClick);

          // Check if the user is already part of the group
          if (joinedGroups.includes(groupId)) {
            joinButton.disabled = false; // Enable button if already in the group
            joinButton.innerHTML = "Leave";

            // Add a click event listener to the Leave button to show the confirmation dialog
            joinButton.addEventListener("click", handleLeaveClick);
            addPostToUsers(groupId);
          } else {
            joinButton.disabled = false; // Enable button if not in the group
            joinButton.innerHTML = "Join +";
          }
        })
        .catch((error) => {
          console.error("Error fetching user document:", error);
        });
    } else {
      // Handle case when user is not logged in
      console.log("No user logged in");
    }
  });
}


const cancelBtn = document.getElementById("cancel-btn");
const confirmationModal = document.getElementById("confirmation-modal");
const confirmSaveBtn = document.getElementById("confirm-save");
const cancelConfirmBtn = document.getElementById("cancel-confirm");
const notificationToast = document.getElementById("notification-toast");
const toastContent = document.getElementById("toast-content");

function showNotification(message, type) {
  // Create notification content based on type
  let iconHTML = "";
  let bgColor = "";

  switch (type) {
    case "success":
      iconHTML =
        '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      bgColor = "bg-green-600";
      break;
    case "error":
      iconHTML =
        '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      bgColor = "bg-red-600";
      break;
    case "loading":
      iconHTML =
        '<svg class="animate-spin h-6 w-6 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
      bgColor = "bg-blue-600";
      break;
    default:
      iconHTML =
        '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      bgColor = "bg-gray-600";
  }

  // Set notification content
  toastContent.innerHTML = `${iconHTML}<span class="text-white">${message}</span>`;

  // Set background color
  notificationToast.className = `fixed bottom-24 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${bgColor}`;

  // Show the notification
  notificationToast.classList.remove("hidden");
  setTimeout(() => {
    notificationToast.classList.remove("opacity-0");
  }, 100);

  // Hide after 5 seconds (unless it's a loading notification)
  if (type !== "loading") {
    setTimeout(() => {
      notificationToast.classList.add("opacity-0");
      setTimeout(() => {
        notificationToast.classList.add("hidden");
      }, 100);
    }, 2000);
  }
   
}

// Define the handleLeaveClick function to show the confirmation dialog

async function handleLeaveClick(event) {
  const groupId = event.target.id.replace("join-", ""); // Extract groupId from button ID

  // Show confirmation modal
  confirmationModal.classList.remove("hidden");

  // Store the groupId in a variable that can be accessed by the confirmation button handler
  confirmSaveBtn.dataset.groupId = groupId;

  // Update confirmation modal text to be specific to leaving a group
  document.querySelector("#confirmation-modal .modal-title").textContent =
    "Leave Group";
  document.querySelector("#confirmation-modal .modal-message").textContent =
    "Are you sure you want to leave this group?";

  // Update confirm button text
  confirmSaveBtn.textContent = "Leave Group";
}

// You'll need to add this event listener outside the function
confirmSaveBtn.addEventListener("click", async function () {
  // Hide confirmation modal
  confirmationModal.classList.add("hidden");

  // Get the groupId from the dataset
  const groupId = this.dataset.groupId;

  // Get current user
  const user = firebase.auth().currentUser;
  if (!user) {
    showNotification("You must be logged in to leave a group.", "error");
    return;
  }

  // Show loading notification
  //showNotification("Processing your request...", "loading");

  try {
    // Remove the group from the user's groups in Firestore
    await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        groups: firebase.firestore.FieldValue.arrayRemove(groupId), // Removes groupId from user's groups
      });

    // After successfully removing the group, update the UI
    const joinButton = document.getElementById("join-" + groupId);
    joinButton.innerHTML = "Join +";

    // Show success notification
    showNotification("You have successfully left the group.", "success");
    console.log("User has left the group");
  } catch (error) {
    console.error("Error updating Firestore:", error);
    showNotification("Error leaving group: " + error.message, "error");
  }
});

// Make sure to add this event listener as well
cancelConfirmBtn.addEventListener("click", function () {
  confirmationModal.classList.add("hidden");
});

function fetchAndRenderPosts() {
  const cardsSection = document.querySelector(".cards");

  // Listen for real-time updates
  db.collection("Posts")
    .orderBy("created_at")
    .onSnapshot(
      (snapshot) => {
        cardsSection.innerHTML = "";

        snapshot.forEach((doc) => {
          const post = doc.data();
          const card = createPostCard(post, doc.id); // Pass doc.id as the postId parameter
          cardsSection.prepend(card);
          toggleGroupJoin(doc.id);
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
