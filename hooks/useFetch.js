"use client";
import { useCallback, useEffect, useState } from "react";

/** Runs an async loader and returns { data, loading, error, reload }. */
export function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await loader();
      setState({ data, loading: false, error: "" });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}
