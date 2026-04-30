const API =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://mana-shop-backend-code.onrender.com";

export default API;