import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("dimoviesplatoUserInfo"));
  const token = userInfo?.token;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

(async () => {
  try {
    const res = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
  } catch (err) {
    console.error("❌ TMDB Error:", err.response?.data || err.message);
  }
})();

export default API;
