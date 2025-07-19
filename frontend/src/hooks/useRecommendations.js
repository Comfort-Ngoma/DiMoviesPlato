import { useEffect, useState } from "react";
import { fetchFromTMDB } from "../api/fetchTMDB";
import { recommendationApi } from "../api/recommendationApi";

export default function useRecommendations(userPrefs) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPrefs) return;

    const loadRecommendations = async () => {
      setLoading(true);

      try {
        // ✅ 1. Try personalized backend results first
        const backendResults = await recommendationApi.getPersonalized();
        if (Array.isArray(backendResults) && backendResults.length > 0) {
          setRecommended(backendResults);
          return;
        }

        // 🔁 2. Fallback: Build TMDB discovery call from profile
        const genreNames = userPrefs.genres || [];
        const language =
          userPrefs.preferredLanguage?.toLowerCase().slice(0, 2) || "en";

        if (!genreNames.length) {
          console.warn("⚠️ No genres in user preferences — skipping fallback");
          setRecommended([]);
          return;
        }

        const genreIds = await getGenreIds(genreNames);
        if (!genreIds.length) {
          console.warn("⚠️ No valid TMDB genre IDs resolved — fallback halted");
          setRecommended([]);
          return;
        }

        const endpoint = `/discover/movie?with_genres=${genreIds.join(
          ","
        )}&with_original_language=${language}`;
        const data = await fetchFromTMDB(
          endpoint,
          `rec_fallback_${genreIds.join(",")}_${language}`
        );

        setRecommended(data?.results || []);
      } catch (err) {
        console.error("❌ useRecommendations error:", err);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userPrefs]);

  return { recommended, loading };
}

// 🔍 Helper: map genre names to TMDB IDs
async function getGenreIds(names) {
  try {
    const genreData = await fetchFromTMDB("/genre/movie/list", "tmdb_genres");
    const map = Object.fromEntries(
      (genreData.genres || []).map((g) => [g.name, g.id])
    );
    return names.map((name) => map[name]).filter(Boolean);
  } catch (err) {
    console.error("❌ Failed to fetch genre list from TMDB:", err);
    return [];
  }
}
