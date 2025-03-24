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


                        document.getElementById("group_name").innerText = name;
                        document.getElementById("group_description").innerText = description;
                        document.getElementById("group_category").innerText = category;
                        document.getElementById("group_date").innerText = date;

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



function setup() {
    document.getElementById(`back-btn`).addEventListener("click", () => {
        document.location.href = "groups.html"
    })
}
document.addEventListener("DOMContentLoaded", setup);

