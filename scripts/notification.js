// notification.js

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

// Function to create a notification card
function createNotificationCard(notification) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4 mb-4';

    const title = document.createElement('h2');
    title.className = 'text-xl font-semibold mb-2';
    title.textContent = notification.title;

    const message = document.createElement('p');
    message.className = 'text-gray-600 mb-2';
    message.textContent = notification.message;

    const time = document.createElement('p');
    time.className = 'text-sm text-gray-500';
    time.textContent = notification.time;

    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(time);

    return card;
}

// Function to fetch and display notifications
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
        userRef.get().then((userDoc) => {
            const userGroups = userDoc.data()?.groups || [];
            console.log("User Groups:", userGroups);

            if (userGroups.length === 0) {
                console.log("User is not in any groups.");
                notificationsContainer.innerHTML = "<p>You are not a member of any groups.  Join a group to see notifications.</p>";
                return; // Exit if user is not in any groups
            }

            // Fetch notifications related to the user's groups
            db.collection("notifications")
                .where("groupId", "in", userGroups) // Assuming a 'groupId' field in notifications
                .orderBy("timestamp", "desc") // Order by timestamp
                .onSnapshot((snapshot) => {
                    notificationsContainer.innerHTML = ""; // Clear existing notifications
                    console.log("Snapshot size", snapshot.size)
                    snapshot.forEach((doc) => {
                        const notification = doc.data();
                        console.log("Notification data", notification);
                        const card = createNotificationCard(notification);
                        notificationsContainer.appendChild(card);
                    });
                }, (error) => {
                    console.error("Error fetching notifications: ", error);
                    notificationsContainer.innerHTML = "<p>Error loading notifications.</p>";
                });
        }).catch(error => {
            console.error("Error getting user document:", error);
            notificationsContainer.innerHTML = "<p>Error loading notifications.</p>";
        });

    } catch (error) {
        console.error("Error in fetchAndDisplayNotifications:", error);
    }
}

// Function to set up the page
function setup() {
    fetchAndDisplayNotifications();
}

getCurrentUserId().then(() => {
    setup();
}).catch(error => {
    console.error("Authentication error:", error);
});

document.addEventListener('DOMContentLoaded', setup);
