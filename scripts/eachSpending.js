// Firebase Authentication and Firestore Spending Tracker

let tripItems = [];
let tripCategory = "";
let existingPurchaseDocId = null;
let existingPurchases = [];
let tripDate = "";
function getInfoFromAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const trip_id = localStorage.getItem("trip_id_local");

      // Fetch trip details
      db.collection("Posts")
        .doc(trip_id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const name = doc.data().title;
            const items = doc.data().items;
            const category = doc.data().category;
            tripDate = doc.data().deadline;

            // Store trip details
            tripItems = items;
            tripCategory = category;

            // Set group name
            document.getElementById("group_name").innerText = name;

            // Check for existing purchase
            checkExistingPurchase(user.uid, trip_id);

            // Set up Add More button
            document
              .getElementById("add-more-btn")
              .addEventListener("click", () => addItemRow(items));

            // Set up Save button
            document
              .getElementById("save-btn")
              .addEventListener("click", () =>
                savePurchases(user.uid, name, trip_id)
              );
          } else {
            console.log("No such document!");
          }
        });
    } else {
      console.log("No user is logged in");
    }
  });
}

function checkExistingPurchase(userId, tripId) {
  // Query for existing purchase for this trip and user
  db.collection("spending")
    .where("userId", "==", userId)
    .where("tripId", "==", tripId)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Get the first (should be only) document
        const doc = querySnapshot.docs[0];
        existingPurchaseDocId = doc.id;
        existingPurchases = doc.data().purchases || [];

        // Display existing purchases
        displaySavedPurchases(existingPurchases);
      }
    })
    .catch((error) => {
      console.error("Error checking existing purchases: ", error);
    });
}

function deleteItem(index) {
  // Remove the item from existingPurchases
  existingPurchases.splice(index, 1);

  // Update Firestore document
  if (existingPurchaseDocId) {
    const spendingDocument = {
      purchases: existingPurchases,
      totalSpending: existingPurchases.reduce(
        (total, purchase) => total + purchase.totalItemCost,
        0
      ),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("spending")
      .doc(existingPurchaseDocId)
      .update(spendingDocument)
      .then(() => {
        console.log("Item deleted successfully.");
        displaySavedPurchases(existingPurchases);
      })
      .catch((error) => {
        console.error("Error deleting item: ", error);
      });
  }
}

function displaySavedPurchases(purchases) {
  const savedItemsList = document.getElementById("saved-items-list");
  savedItemsList.innerHTML = ""; // Clear existing list

  // Calculate total spending
  let totalSpending = 0;

  // Create list of saved items
  purchases.forEach((purchase, index) => {
    // Create a new div for each item
    const itemDiv = document.createElement("div");
    itemDiv.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "p-2",
      "border-b"
    );

    // Create the delete button separately
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add(
      "delete-item-btn",
      "bg-red-500",
      "text-white",
      "px-2",
      "py-1",
      "rounded",
      "ml-2"
    );
    deleteButton.setAttribute("data-index", index);

    // Add event listener directly when creating the button
    deleteButton.addEventListener("click", function () {
      const indexToDelete = this.getAttribute("data-index");
      deleteItem(parseInt(indexToDelete));
    });

    // Create spans for item details
    const itemNameSpan = document.createElement("span");
    itemNameSpan.textContent = purchase.item;
    itemNameSpan.classList.add("flex-grow");

    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = `Qty: ${purchase.quantity}`;
    quantitySpan.classList.add("mx-2");

    const costSpan = document.createElement("span");
    costSpan.textContent = `$${purchase.totalItemCost.toFixed(2)}`;

    // Append all elements to the item div
    itemDiv.appendChild(itemNameSpan);
    itemDiv.appendChild(quantitySpan);
    itemDiv.appendChild(costSpan);
    itemDiv.appendChild(deleteButton);

    // Add the item div to the list
    savedItemsList.appendChild(itemDiv);

    // Calculate total spending
    totalSpending += purchase.totalItemCost;
  });

  // Update total spending display
  document.getElementById(
    "total-spending"
  ).innerText = `Total Spending: $${totalSpending.toFixed(2)}`;
}

function addItemRow(items) {
  const itemContainer = document.getElementById("item-container");

  // Create a new row for item selection
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("item-row", "flex", "space-x-2", "mb-2");

  // Create dropdown
  const dropdown = document.createElement("select");
  dropdown.classList.add("item-dropdown", "flex-grow");

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select an item";
  defaultOption.value = "";
  dropdown.appendChild(defaultOption);

  // Populate dropdown with items
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.text = item.name;
    dropdown.appendChild(option);
  });

  // Create quantity input
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.placeholder = "Quantity";
  quantityInput.classList.add("quantity-input", "w-20");

  // Create remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add(
    "remove-btn",
    "bg-red-",
    "text-white",
    "px-2",
    "py-1",
    "rounded"
  );
  removeBtn.addEventListener("click", () => {
    itemContainer.removeChild(rowDiv);
  });

  // Append elements to row
  rowDiv.appendChild(dropdown);
  rowDiv.appendChild(quantityInput);
  rowDiv.appendChild(removeBtn);

  // Add row to container
  itemContainer.appendChild(rowDiv);
}

function savePurchases(userId, tripName, tripId) {
  // Get all item rows
  const itemRows = document.querySelectorAll(".item-row");

  // Validate input
  let isValid = true;
  const newPurchases = [];

  itemRows.forEach((row) => {
    const dropdown = row.querySelector(".item-dropdown");
    const quantityInput = row.querySelector(".quantity-input");

    if (!dropdown.value || !quantityInput.value || quantityInput.value <= 0) {
      isValid = false;
      alert("Please fill in all item details correctly.");
      return;
    }

    // Find the price of the selected item
    const item = tripItems.find((i) => i.name === dropdown.value);
    const itemPrice = item ? item.price : 0;

    // Calculate the total cost for the selected item and quantity
    const quantity = parseInt(quantityInput.value);
    const totalItemCost = itemPrice * quantity;

    // Check if item already exists
    const existingItemIndex = existingPurchases.findIndex(
      (purchase) => purchase.item === dropdown.value
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      existingPurchases[existingItemIndex] = {
        item: dropdown.value,
        quantity: quantity,
        itemPrice: itemPrice,
        totalItemCost: totalItemCost,
      };
    } else {
      // Add new item
      existingPurchases.push({
        item: dropdown.value,
        quantity: quantity,
        itemPrice: itemPrice,
        totalItemCost: totalItemCost,
      });
    }
  });

  if (!isValid) return;

  // Prepare the document to save
  const spendingDocument = {
    userId: userId,
    tripId: tripId,
    tripName: tripName,
    tripDate: tripDate,
    category: tripCategory,
    purchases: existingPurchases,
    totalSpending: existingPurchases.reduce(
      (total, purchase) => total + purchase.totalItemCost,
      0
    ),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Determine whether to add or update
  const spendingCollection = db.collection("spending");

  if (existingPurchaseDocId) {
    // Update existing document
    spendingCollection
      .doc(existingPurchaseDocId)
      .update(spendingDocument)
      .then(() => {
        console.log("Spending data updated successfully.");
        displaySavedPurchases(existingPurchases);
        clearItemRows();
      })
      .catch((error) => {
        console.error("Error updating data: ", error);
      });
  } else {
    // Add new document
    spendingCollection
      .add(spendingDocument)
      .then((docRef) => {
        console.log("Spending data saved successfully.");
        existingPurchaseDocId = docRef.id;
        displaySavedPurchases(existingPurchases);
        clearItemRows();
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
      });
  }
}

function clearItemRows() {
  // Clear item rows after saving
  const itemContainer = document.getElementById("item-container");
  itemContainer.innerHTML = ""; // Clear existing rows
}

function setup() {
  getInfoFromAuth();

  // Add event listener for back button
  document.getElementById(`back-btn`).addEventListener("click", () => {
    document.location.href = "spendings.html";
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", setup);
