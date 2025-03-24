// Add this to your existing JavaScript code

document.addEventListener("DOMContentLoaded", function () {
  // Get all filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  const postsContainer = document.querySelector(".posts");

  // Add click event to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");

      // Update active button styling
      filterButtons.forEach((btn) => {
        btn.classList.remove("bg-green-900", "text-white");
        btn.classList.add("border-green-900/50", "text-green-900");
      });

      this.classList.remove("border-green-900/50", "text-green-900");
      this.classList.add("bg-green-900", "text-white");

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

  // Optional: Add "All" button if needed
  function addAllButton() {
    const allButton = document.createElement("button");
    allButton.setAttribute("data-category", "All");
    allButton.classList.add(
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

    const filterButtons = document.querySelector(".filter-buttons");
    filterButtons.prepend(allButton);

    // Add event listener to the "All" button
    allButton.addEventListener("click", function () {
      // Update button styling
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("bg-green-900", "text-white");
        btn.classList.add("border-green-900/50", "text-green-900");
      });

      this.classList.remove("border-green-900/50", "text-green-900");
      this.classList.add("bg-green-900", "text-white");

      // Show all posts
      document.querySelectorAll(".post-1").forEach((post) => {
        post.style.display = "block";
      });
    });
  }

  // Uncomment to add an "All" button
  // addAllButton();
});

// Modify your createPostCard function to add the data-category attribute
function createPostCard(post, docId) {
  // Create the card container
  const card = document.createElement("div");
  card.className =
    "relative md:min-h-115 post-1 max-w-[320px] md:w-80 lg:w-[31%] shadow-lg bg-[#434343] text-lime-50 rounded-2xl md:mx-2 mb-6";

  // Add data-category attribute for filtering
  card.setAttribute("data-category", post.category);

  // Rest of your existing card creation code...

  // Create the image div
  const imageDiv = document.createElement("div");
  imageDiv.className = "image max-h-48 overflow-hidden";
  const image = document.createElement("img");
  image.className = "w-full rounded-t-xl";
  image.src = post.image || "images/apples.jpg"; // Use post image or a default image
  image.alt = post.title;
  imageDiv.appendChild(image);

  // The rest of your function remains the same...

  return card;
}
