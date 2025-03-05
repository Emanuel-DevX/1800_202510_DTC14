$(document).ready(setup)
function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid); // Let's know who the logged-in user is by logging their UID
      currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
      currentUser.get().then(userDoc => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userName);
        //$("#name-goes-here").text(userName); // jQuery
        document.getElementById("name-goes-here").innerHTML = userName;
      })
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  })
}

insertNameFromFirestore();



function home() {
  console.log('in home')
  console.log('in home');
  let post1 = $('.post-1').clone();  // Clone the template post

  for (let i = 0; i < 5; i++) {
    $('.posts').append(post1.clone()); // Append a fresh clone each time
  }

}

const posts = [
  {
    id: 1,
    title: "Organic Apples - Bulk Order 🍏",
    description: "Get fresh organic apples at a discount! Need 5 more buyers.",
    pricePerUnit: 3.5,
    bulkPrice: 2.8,
    participants: 3,
    slotsLeft: 5,
    image: "apple.jpg"
  },
  {
    id: 2,
    title: "Wireless Earbuds 🎧",
    description: "Group purchase for top-quality wireless earbuds.",
    pricePerUnit: 50,
    bulkPrice: 40,
    participants: 7,
    slotsLeft: 3,
    image: "earbuds.jpg"
  }
];

function setup() {
  home()
}



