import { useState, useCallback } from "react";

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Makes an API call with the given parameters.
   * @param {string} url - The endpoint URL.
   * @param {object} options - The fetch options (method, headers, body, etc.).
   */
  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result; // Useful if the caller wants the response
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, makeRequest };
};

export default useApi;