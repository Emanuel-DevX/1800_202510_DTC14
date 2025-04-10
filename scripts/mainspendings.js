
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // User is logged in
    console.log("User is logged in:", user);

    // Highlighted: Update profile icon with user's avatar
    const profileIcon = document.getElementById("profile-icon");
    if (profileIcon && user.photoURL) {
      profileIcon.src = user.photoURL; // Set the user's avatar image
    } else {
      profileIcon.src = "images/profile.jpg"; // Default avatar image
    }

    // Highlighted: Fetch spending data for the logged-in user
    const userId = user.uid; // Use Firebase's authenticated user ID
    await fetchSpendingData(userId);
    await fetchRecentSpendingData(userId);

    // Highlighted: Add event listener for managing spending
    document.getElementById("manage_spending").addEventListener("click", () => {
      document.location.href = "spendings.html";
    });
  } else {
    // User is not logged in
    console.log("No user is logged in.");
  }
});

async function fetchSpendingData(userId) {
  const spendingData = {};

  try {
    // Add query filter by userId
    const querySnapshot = await db
      .collection("spending")
      .where("userId", "==", userId) // Filter by userId
      .get();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      spendingData[data.category] =
        (spendingData[data.category] || 0) + parseFloat(data.totalSpending);
    });
    // console.log(spendingData);

    updateChart(spendingData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the function with the specific userId

// Update Chart.js with fetched data

chartInstance = null;
function updateChart(data) {
  const ctx = document.getElementById("spendingChart").getContext("2d");

  // Check if the data has any non-zero values
  const values = Object.values(data);
  const allZero = values.every((value) => value === 0);

  // If all values are 0 or no data, use a fallback dataset
  if (allZero || Object.keys(data).length === 0) {
    data = {
      "No Spending": 100, // Fallback label and value
    };
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create a new chart
  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Spending",
          data: Object.values(data),
          backgroundColor: [
            "#2C2C2C", // Darker gray for the first category
            "#3B82F6", // Darker blue
            "#10B981", // Darker mint green
            "#F59E0B", // Darker yellow
            "#7C3AED", // Darker purple
            "#D946EF", // Darker pink
            "#34D399", // Darker teal green
            "#F59E0B", // Darker yellow-amber
            "#D15F00", // Darker orange
            "#22C55E", // Darker emerald green
          ],
        },
      ],
    },
  });
}

// Fetch data on load

async function fetchRecentSpendingData(userId) {
  const recentSpendingData = {};

  try {
    // Get the date range for the last 3 months
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    // Firestore query
    const querySnapshot = await db
      .collection("spending")
      .where("userId", "==", userId)
      .where("timestamp", ">=", threeMonthsAgo)
      .get();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
    //   console.log("Document Data:", data); // Debugging

      if (!data.tripDate) return; // Skip if tripDate is missing

      const spendingDate = new Date(data.tripDate);
      if (isNaN(spendingDate)) return; // Skip invalid dates

      const period = spendingDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      // Aggregate spending by month
      if (!recentSpendingData[period]) {
        recentSpendingData[period] = 0;
      }
      recentSpendingData[period] += parseFloat(data.totalSpending) || 0;
    });

    // Convert aggregated data into an array
 const formattedSpendingData = Object.keys(recentSpendingData)
   .map((period) => ({
     period,
     amount: recentSpendingData[period],
     date: new Date(period), // Convert period to Date object for sorting
   }))
   .sort((a, b) => b.date - a.date); // Sort by most recent date first


    updateMonthlySpendingHTML(formattedSpendingData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// Function to update the HTML with the spending data
function updateMonthlySpendingHTML(data) {
  const spendingDiv = document.getElementById("monthly-spendings");

  // Clear any existing content
  spendingDiv.innerHTML = "";

  // Loop through the data and populate the HTML
  data.forEach((entry) => {
    const div = document.createElement("div");
    div.classList.add(
      "max-w-auto",
      "bg-[#343434]",
      "text-lime-50",
      "rounded-lg",
      "m-2",
      "mb-3",
      "py-2",
      "px-8",
      "flex",
      "justify-between"
    );

    const periodDiv = document.createElement("div");
    periodDiv.classList.add("inline-flex", "gap-4");
    const periodText = document.createElement("h2");
    periodText.classList.add("text-xl", "font-bold", "md:text-2xl", "py-2");
    periodText.textContent = entry.period;
    // console.log(entry.period)
    periodDiv.appendChild(periodText);

    const amountDiv = document.createElement("div");
    amountDiv.classList.add("flex", "gap-2", "md:gap-8", "p-2");
    const amountText = document.createElement("h1");
    amountText.classList.add("text-xl", "md:text-2xl");
    amountText.textContent = `$${entry.amount.toFixed(2)}`;
    amountDiv.appendChild(amountText);

    div.appendChild(periodDiv);
    div.appendChild(amountDiv);

    spendingDiv.appendChild(div);
  });
}

function setup() {
  fetchSpendingData(userId);
  fetchRecentSpendingData(userId);

  document.getElementById(`manage_spending`).addEventListener("click", () => {
    document.location.href = "spendings.html";
  });
}
document.addEventListener("DOMContentLoaded", setup);
