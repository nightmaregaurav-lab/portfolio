"use client";

import { useEffect, useState } from "react";

export function useShadow<T extends object>(original?: T) {
  const [shadow, setShadow] = useState<T>();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShadow(structuredClone(original));
  }, [original]);

  function updateShadow<K extends keyof T>(key: K, value: T[K]) {
    setShadow((prevState) => {
      if (!prevState) {
        return;
      }

      return {
        ...prevState,
        [key]: value,
      };
    });
  }

  return {
    shadow,
    setShadow,
    updateShadow,
  };
}
