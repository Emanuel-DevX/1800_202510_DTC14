function deleteOldPosts() {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // 7 days before today

  var db = firebase.firestore();
  var postsRef = db.collection("Posts");

  // Query posts where 'deadline' is older than 1 week
  postsRef
    .where("deadline", "<=", oneWeekAgo)
    .get()
    .then((querySnapshot) => {
      var batch = db.batch(); // Batch deletes for efficiency

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    })
    .then(() => {
      console.log("Old posts deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting old posts:", error);
    });
}

// Call function when needed (e.g., on app load)
window.onload = function () {
  deleteOldPosts();
};
