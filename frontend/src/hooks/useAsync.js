import { useCallback, useEffect, useRef, useState } from "react";

// Small helper for the common "load on mount, expose loading/error/data,
// allow manual refetch" pattern used across the dashboard-style pages.
export default function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (mounted.current) setData(result);
      return result;
    } catch (err) {
      if (mounted.current) setError(err);
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    run().catch(() => {});
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { data, error, loading, refetch: run, setData };
}
