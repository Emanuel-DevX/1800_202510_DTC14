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

// Assuming you've already initialized Firebase

// Initialize Firebase once at the top of your file

// Function to get current user's ID safely
function getCurrentUserId() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            resolve(user?.uid);
        }, error => {
            reject(error);
        });
    });
}

async function fetchAndRenderGroups() {
    try {
        // Wait for user ID
        const userId = await getCurrentUserId();
        if (!userId) {
            console.error("User is not logged in");
            return;
        }

        const cardsSection = document.querySelector("#group_article");

        // First, get the current user's groups array
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        const userGroups = userDoc.data()?.groups || [];

        // Listen for real-time updates
        db.collection("Posts")
            .orderBy("created_at")
            .onSnapshot(
                async (snapshot) => {
                    cardsSection.innerHTML = "";

                    // For each post, check if its ID exists in user's groups
                    snapshot.forEach(doc => {
                        if (userGroups.includes(doc.id)) {
                            const groups = doc.data();
                            const card = createGroupCard(groups);
                            cardsSection.prepend(card);
                        }
                    });
                },
                error => {
                    console.error("Error fetching posts: ", error);
                }
            );
    } catch (error) {
        console.error("Error in fetchAndRenderGroups:", error);
    }
}

// Call the function after auth state is ready
getCurrentUserId().then(() => {
    setup(); // Your existing setup function
}).catch(error => {
    console.error("Authentication error:", error);
});

function setup() {
    fetchAndRenderGroups();
}
document.addEventListener("DOMContentLoaded", setup);
