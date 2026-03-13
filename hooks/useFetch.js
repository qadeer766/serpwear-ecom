import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshRef = useRef(0);
  const optionsRef = useRef(options);

  // keep latest options without triggering re-render loop
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        method: method.toUpperCase(),
        signal: controller.signal,
        ...optionsRef.current,
      });

      const resData = response.data;

      if (resData?.success === false) {
        throw new Error(resData.message);
      }

      setData(resData?.data ?? resData);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [url, method]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshRef.current]);

  const refetch = useCallback(() => {
    refreshRef.current += 1;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;