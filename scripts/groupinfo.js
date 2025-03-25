function getUserName(owner) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(owner).get()
                .then((doc) => {
                    if (doc.exists) {
                        var owner_name = doc.data().name;

                        document.getElementById("group_owner").innerText = owner_name;
                    } else {
                        console.log("No such document!");
                    }
                })
        } else {
            console.log("No user is logged in");
        }
    });
}


function membersNames(member_list){
    console.log(member_list)
    var empty_string = '';
    for (let y of member_list) {
        console.log(123);
        empty_string += `${y} ~ `;
    }
    console.log(empty_string);
    document.getElementById("group_members").innerText = empty_string;
}

function getMemberName(member) {
    var member_list = [];
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            for (let x of member) {
                db.collection("users").doc(x).get()
                    .then((doc) => {
                        if (doc.exists) {
                            var member_name = doc.data().name;

                            member_list.push(member_name)

                            membersNames(member_list)
                        } else {
                            console.log("No such document!");
                        }
                    })
            }
            
        } else {
            console.log("No user is logged in");
        }
    });
}

function getInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const trip_id = localStorage.getItem('trip_id');
            console.log(trip_id);
            db.collection("Posts").doc(trip_id).get()
                .then((doc) => {
                    if (doc.exists) {
                        var name = doc.data().title;
                        var description = doc.data().description;
                        var owner = doc.data().owner;
                        var category = doc.data().category;
                        var date = doc.data().deadline;
                        var member = doc.data().members;
                        var image = doc.data().image;


                        document.getElementById("group_name").innerText = name;
                        document.getElementById("group_description").innerText = description;
                        document.getElementById("group_category").innerText = category;
                        document.getElementById("group_date").innerText = date;
                        document.getElementById("group_image").src = image;


                        getUserName(owner)
                        getMemberName(member)
                    } else {
                        console.log("No such document!");
                    }
                })
        } else {
            console.log("No user is logged in");
        }
    });
}
getInfo();

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

async function handleLeaveClick() {
    const groupId = localStorage.getItem('trip_id');
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
cancelConfirmBtn.addEventListener("click", function () {
    confirmationModal.classList.add("hidden");
});

function leaveBtn(){
    document.getElementById(`leave_group`).addEventListener("click", async () => {
        handleLeaveClick()
})}
leaveBtn()

function leaveGroup() {
    confirmSaveBtn.addEventListener("click", async () => {
        console.log(123)
        const groupId = localStorage.getItem('trip_id');

        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            showNotification("You must be logged in to leave a group.", "error");
            return;
        }else{
        try{
        await firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .update({
                groups: firebase.firestore.FieldValue.arrayRemove(groupId), });
        await firebase
            .firestore()
            .collection("Posts")
            .doc(groupId)
            .update({ members: firebase.firestore.FieldValue.arrayRemove(user.uid) });
        console.log("User has left the group");
        document.location.href = "groups.html"
        showNotification("You have successfully left the group.", "success");
        } catch (error) {
            console.error("Error updating Firestore:", error);
            showNotification("Error leaving group: " + error.message, "error");
        }}
}
)}
leaveGroup()

function setup() {
    document.getElementById(`back-btn`).addEventListener("click", () => {
        document.location.href = "groups.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);

