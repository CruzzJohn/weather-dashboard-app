import { useEffect, useState } from "react";
import useAuthStore from "../context/authStore";
import { getFavorites, deleteFavorite } from "../api";

const Favorites = () => {
  const token = localStorage.getItem("token");
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites(token);
      setFavorites(res.data.favoriteCities);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  useEffect(() => {
    if (token) loadFavorites();
  }, [token]);

 const handleDelete = async (city) => {
  try {
    await deleteFavorite(city, token);

    // Reload favorites from database
    await loadFavorites();

  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>My Favorite Cities</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((f, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {f.city}, {f.country}
            </span>

            <button onClick={() => handleDelete(f.city)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorites;