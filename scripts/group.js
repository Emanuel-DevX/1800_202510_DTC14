async function addPost(postData) {
    try {
        // Reference to the "Posts" collection
        const postsRef = db.collection("Posts");

        // Add a new document with a generated ID
        const docRef = await postsRef.add({
            created_at: postData.created_at,
            description: postData.description,
            image: postData.image,
            title: postData.title,
            owner: postData.owner,
            price: postData.price, // New field for price
            category: postData.category, // New field for category
            deadline: postData.deadline, // New field for deadline
            quantity: postData.quantity,
            members: postData.members,
        });
        addPostToUsers(docRef.id);

        console.log("Document added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
async function addPostToUsers(groupId) {
    try {
        // Reference to the "Posts" collection
        const userRef = db.collection("users");

        // Add a new document with a generated ID
        const docRef = await userRef.add({
            groups: [groupId],
        });

        console.log("Document added with ID: ", userRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


function createGroupCard(groups) {
    // Create the card container
    const card = document.createElement("div");
    card.className =
        "min-w-72 inline-flex gap-6 shadow-lg bg-green-800 text-lime-50 rounded-2xl mx-2 mb-3 p-4";

    // Add the image section
    const imageDiv = document.createElement("div");
    imageDiv.className = "image max-h-48 overflow-hidden";
    const image = document.createElement("img");
    image.className = "w-full rounded-t-xl";
    image.src = post.image || "images/apples.jpg"; // Use post image or a default image
    image.alt = post.title;
    imageDiv.appendChild(image);

    // Add the title
    const title = document.createElement("h3");
    title.className = "font-bold text-lg text-lime-100";
    title.textContent = post.title;
    postInfoDiv.appendChild(title);

    // Add the description
    const description = document.createElement("p");
    description.textContent = post.description;
    postInfoDiv.appendChild(description);

    // Append the image and post info to the card
    card.appendChild(imageDiv);
    card.appendChild(postInfoDiv);

    return card;
}

x = document.getElementById("group_article")
x.appendChild(createGroupCard)
