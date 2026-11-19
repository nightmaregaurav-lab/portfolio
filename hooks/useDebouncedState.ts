import { useEffect, useState } from "react";

export function useDebouncedState<T>(initialValue: T, delay: number) {
  const [state, setState] = useState<T>(initialValue);
  const [debouncedState, setDebouncedState] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [state, delay]);

  return {
    state,
    debouncedState,
    setState,
  };
}
