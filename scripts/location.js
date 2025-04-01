async function getSuggestions(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    const suggestions = data
      .map((item) => `<li>${item.display_name}</li>`)
      .join("");

    if (suggestions.trim() === "") {
      document.getElementById("suggestions").innerHTML =
        "<li>No results found</li>";
    } else {
      document.getElementById("suggestions").innerHTML = suggestions;
    }

    document.getElementById("suggestions").classList.remove("hidden");
  } catch (error) {
    // If the fetch fails, silently use the entered query value
    document.getElementById("suggestions").innerHTML = `<li>${query}</li>`;
    document.getElementById("suggestions").classList.remove("hidden");
  }
}
