// src/utils/cache.js

export const getCachedData = (key, storageType = "session") => {
  try {
    const storage = storageType === "local" ? localStorage : sessionStorage;
    const item = storage.getItem(key);
    if (!item) return null;

    const { data, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
      storage.removeItem(key);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Cache fetch error:", err);
    return null;
  }
};

export const setCachedData = (
  key,
  data,
  ttl = 3600000,
  storageType = "session"
) => {
  try {
    const storage = storageType === "local" ? localStorage : sessionStorage;

    const entry = {
      data,
      expiry: Date.now() + ttl,
    };

    storage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    console.warn("Cache save error:", err);
    // Optionally: fallback logic or storage cleanup
  }
};
