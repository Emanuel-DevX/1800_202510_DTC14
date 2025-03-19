function createGroupCard(groups, docid) {
    // Create the card container
    const card = document.createElement("div");
    card.id = docid
    card.className =
        "w-full inline-flex gap-6 shadow-lg bg-[#343434] text-lime-50 rounded-2xl mx-2 mb-3 p-4";

    // Add the image section
    const imageDiv = document.createElement("div");
    imageDiv.className = "";
    const image = document.createElement("img");
    image.className = "min-w-16 h-16 rounded-full";
    image.src = groups.image || "images/apples.jpg"; // Use post image or a default image
    image.alt = groups.title;
    imageDiv.appendChild(image);

    // Add the title
    const place = document.createElement("div");
    place.className = "flex justify-between w-full "
    const groupInfoDiv = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "font-bold text-xl pt-4";
    title.textContent = groups.title;
    groupInfoDiv.appendChild(title);


    const arrow = document.createElement("p")
    arrow.className = "pt-5 material-icons arrow_forward_ios ";
    arrow.innerHTML = `<span class="material-icons-outlined">
        arrow_forward_ios
    </span>`



    // Append the image and post info to the card
    place.appendChild(groupInfoDiv);
    place.appendChild(arrow);
    card.appendChild(imageDiv);
    card.appendChild(place);

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
                            const card = createGroupCard(groups, doc.id);
                            cardsSection.prepend(card);
                            document.getElementById(doc.id).addEventListener("click", () => {
                                document.location.href = "spendingsinfo.html"
                            })
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
