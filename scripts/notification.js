async function fetchAndDisplayNotifications() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            console.error("User is not logged in");
            return;
        }

        const notificationsContainer = document.getElementById('notifications-container');
        if (!notificationsContainer) {
            console.error("notifications-container element not found!");
            return;
        }
        notificationsContainer.innerHTML = ''; // Clear existing notifications

        // Get the user's group memberships
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        const userGroups = userDoc.data()?.groups || [];

        if (userGroups.length === 0) {
            notificationsContainer.innerHTML = "<p class='text-center text-gray-500'>You are not a member of any groups. Join a group to see notifications.</p>";
            return;
        }

        // Fetch latest posts related to the user's groups
        db.collection("Posts")
            .where("group_id", "in", userGroups)
            .orderBy("created_at", "desc")
            .limit(10) // Limit to 10 most recent posts
            .onSnapshot((snapshot) => {
                notificationsContainer.innerHTML = "";
                snapshot.forEach((doc) => {
                    const post = doc.data();
                    const card = createNotificationCard(post);
                    notificationsContainer.appendChild(card);
                });
            }, (error) => {
                console.error("Error fetching notifications: ", error);
                notificationsContainer.innerHTML = "<p class='text-center text-red-500'>Error loading notifications.</p>";
            });

    } catch (error) {
        console.error("Error in fetchAndDisplayNotifications:", error);
    }
}

function createNotificationCard(post) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4 mb-4';

    const title = document.createElement('h3');
    title.className = 'font-bold text-lg';
    title.textContent = post.title;

    const description = document.createElement('p');
    description.className = 'text-sm mt-2';
    description.textContent = post.description;

    const deadline = document.createElement('p');
    deadline.className = 'text-xs text-gray-500 mt-2';
    deadline.textContent = `Deadline: ${new Date(post.deadline).toLocaleDateString()}`;

    const createdAt = document.createElement('p');
    createdAt.className = 'text-xs text-gray-400 mt-1';
    createdAt.textContent = `Created: ${new Date(post.created_at.toDate()).toLocaleString()}`;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(deadline);
    card.appendChild(createdAt);

    return card;
}
