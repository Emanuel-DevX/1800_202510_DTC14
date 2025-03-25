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
    card.className = 'w-full shadow-lg bg-[#343434] text-lime-50 rounded-2xl mx-2 mb-3 p-4';

    const title = document.createElement('h3');
    title.className = 'font-bold text-lg';
    title.textContent = notification.title;

    const message = document.createElement('p');
    message.className = 'text-sm mt-2';
    message.textContent = notification.message;

    const time = document.createElement('p');
    time.className = 'text-xs text-gray-400 mt-2';
    time.textContent = new Date(notification.created_at.toDate()).toLocaleString();

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
        const userDoc = await userRef.get();
        const userGroups = userDoc.data()?.groups || [];

        if (userGroups.length === 0) {
            notificationsContainer.innerHTML = "<p class='text-center text-gray-500'>You are not a member of any groups. Join a group to see notifications.</p>";
            return;
        }

        // Fetch notifications related to the user's groups
        db.collection("notifications")
            .where("groupId", "in", userGroups)
            .orderBy("created_at", "desc")
            .onSnapshot((snapshot) => {
                notificationsContainer.innerHTML = "";
                snapshot.forEach((doc) => {
                    const notification = doc.data();
                    const card = createNotificationCard(notification);
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

// Function to set up the page
function setup() {
    fetchAndDisplayNotifications();
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'home.html';
    });
}

// Call the function after auth state is ready
getCurrentUserId().then(() => {
    setup();
}).catch(error => {
    console.error("Authentication error:", error);
});

document.addEventListener('DOMContentLoaded', setup);
