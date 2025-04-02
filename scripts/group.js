function createGroupCard(groups, docid) {
  // Create the card container
  const card = document.createElement("div");
  card.id = docid;
  card.className =
    "w-full  inline-flex gap-6 shadow-lg bg-[#343434] text-lime-50 rounded-2xl mx-2 mb-3 px-4 py-3";

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
  place.className = "flex justify-between w-full items-center";
  const groupInfoDiv = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "font-bold text-lg ";
  title.textContent = groups.title;
  groupInfoDiv.appendChild(title);

  // Add the location

  const location = document.createElement("h4");
  location.className = "text-xs ";
  location.textContent = groups.location;
  groupInfoDiv.appendChild(location);

  const arrow = document.createElement("p");
  arrow.className = "pt-5 material-icons arrow_forward_ios self-start";
  arrow.innerHTML = `<span class="material-icons-outlined">
        arrow_forward_ios
    </span>`;

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
    firebase.auth().onAuthStateChanged(
      (user) => {
        resolve(user?.uid);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

async function fetchAndRenderGroups() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
    const cardsSection = document.querySelector("#group_article");
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userGroups = userDoc.data()?.groups || [];

    db.collection("Posts")
      .orderBy("created_at")
      .onSnapshot(
        async (snapshot) => {
          cardsSection.innerHTML = "";

          snapshot.forEach((doc) => {
            if (userGroups.includes(doc.id)) {
              const groups = doc.data();
              const card = createGroupCard(groups, doc.id);
              cardsSection.prepend(card);
              document.getElementById(doc.id).addEventListener("click", () => {
                localStorage.setItem('trip_id', doc.id);
                document.location.href = "groupinfo.html";
              });
            }
          });
        },
        (error) => {
          console.error("Error fetching posts: ", error);
        }
      );
  } catch (error) {
    console.error("Error in fetchAndRenderGroups:", error);
  }
}


getCurrentUserId()
  .then(() => {
    setup();
  })
  .catch((error) => {
    console.error("Authentication error:", error);
  });


async function displayUserAvatar() {
  try {
    const user = firebase.auth().currentUser;
    if (user && user.photoURL) {
      const profileIcon = document.getElementById("profile-icon");
      if (profileIcon) {
        profileIcon.src = user.photoURL; // Set the user's avatar
      }
    } else {
      console.log("No user is logged in or no avatar found.");
    }
  } catch (error) {
    console.error("Error fetching user avatar:", error);
  }
}


function setup() {
  displayUserAvatar(); // Fetch and display the user's avatar
  fetchAndRenderGroups();
}
document.addEventListener("DOMContentLoaded", setup);
