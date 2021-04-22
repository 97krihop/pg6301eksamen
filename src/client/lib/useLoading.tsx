import { useEffect, useState } from "react";

export function useLoading<T>(loadingFunction: () => Promise<T>, deps = []) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  async function reload() {
    setLoading(true);
    setData(null);
    setError(undefined);
    console.log()
    try {
      setData(await loadingFunction());
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, deps);

  return { error, loading, data, reload };
}
