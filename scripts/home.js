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


function home(){
    console.log('in home')
       console.log('in home');
    let post1 = $('.post-1').clone();  // Clone the template post

    for (let i = 0; i < 5; i++) {
        $('.posts').append(post1.clone()); // Append a fresh clone each time
    }
    
}

function setup(){
home()
}



$(document).ready(setup)