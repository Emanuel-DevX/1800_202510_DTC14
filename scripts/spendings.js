function createGroupCard(groups) {
    // Create the card container
    const card = document.createElement("div");
    card.className =
        "min-w-72 inline-flex gap-6 shadow-lg bg-green-800 text-lime-50 rounded-2xl mx-2 mb-3 p-4";

    // Add the image section
    const imageDiv = document.createElement("div");
    imageDiv.className = "";
    const image = document.createElement("img");
    image.className = "w-16 h-16 rounded-full";
    image.src = groups.image || "images/apples.jpg"; // Use post image or a default image
    image.alt = groups.title;
    imageDiv.appendChild(image);

    // Add the title
    const groupInfoDiv = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "font-bold text-lg";
    title.textContent = groups.title;
    groupInfoDiv.appendChild(title);

    // Add the description
    const description = document.createElement("p");
    description.textContent = groups.description;
    groupInfoDiv.appendChild(description);

    // Append the image and post info to the card
    card.appendChild(imageDiv);
    card.appendChild(groupInfoDiv);

    return card;
}

// x = document.getElementById("group_article")
// x.appendChild(createGroupCard(groups))

function fetchAndRenderGroups() {
    const cardsSection = document.querySelector("#group_article");

    // Listen for real-time updates
    db.collection("Posts")
        .orderBy("created_at") // Order by creation date (newest first)
        .onSnapshot(
            (snapshot) => {
                // Clear the existing cards (optional, depending on your use case)
                cardsSection.innerHTML = "";

                // Loop through the documents and render cards
                snapshot.forEach((doc) => {
                    const groups = doc.data();
                    const card = createGroupCard(groups);
                    cardsSection.prepend(card); // Prepend the new card
                });
            },
            (error) => {
                console.error("Error fetching posts: ", error);
            }
        );
}

function setup() {
    fetchAndRenderGroups();
}
document.addEventListener("DOMContentLoaded", setup);