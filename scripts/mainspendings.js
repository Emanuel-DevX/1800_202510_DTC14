const userId = localStorage.getItem("userIdLocal");

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
    console.log(spendingData);

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
  chartInstance =  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Spending",
          data: Object.values(data),
          backgroundColor: [
            "#343434", // Dark gray for the first category
            "#60A5FA", // Light blue
            "#34D399", // Mint green
            "#FBBF24", // Bright yellow
            "#A78BFA", // Soft purple
            "#F472B6", // Soft pink
            "#6EE7B7", // Teal green
            "#FCD34D", // Yellow-amber
            "#FF6A00", // Vibrant orange
            "#4ADE80", // Emerald green
          ],
        },
      ],
    },
  });
}

// Fetch data on load

function setup() {
  fetchSpendingData(userId);

  document.getElementById(`manage_spending`).addEventListener("click", () => {
    document.location.href = "spendings.html";
  });
}
document.addEventListener("DOMContentLoaded", setup);
