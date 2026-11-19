import { type SetStateAction, useSyncExternalStore } from "react";

/**
 * The API returned by `createExternalHook`.
 *
 * @template T - The type of value stored in the external state.
 */
type ExternalHook<T> = {
  /** React hook that returns the current value of the external state. */
  useState: () => T;

  /**
   * Updates the external state and notifies all subscribed components.
   *
   * Accepts either a new value or an updater function receiving the previous value.
   */
  update: (next: SetStateAction<T>) => void;
  /**
   * Returns the current value of the external state.
   */
  get: () => T;
};

/**
 * Creates a small external state store with a React hook for subscribing and an externally callable updater.
 *
 * @param initialValue - The initial value stored in the external state.
 * @returns An object containing the `useState` hook, `get` function and the `update` function.
 *
 * @example
 * Usage:
 *
 * `@hooks/useCount.ts`
 * ```ts
 * import { createExternalHook } from "@/lib/createExternalHook";
 *
 * export const {
 *   useState: useCount,
 *   update: updateCount,
 *   get: getCount
 * } = createExternalHook(0);
 * ```
 *
 * `@components/Count.tsx`
 * ```tsx
 * import { useCount } from "@/hooks/useCount";
 *
 * export function Count() {
 *   const count = useCount();
 *
 *   return <div>Count: {count}</div>;
 * }
 * ```
 *
 * `@services/count.ts`
 * ```ts
 * import { getCount, updateCount } from "@/hooks/useCount";
 *
 * export function incrementCount() {
 *   console.log(getCount()); // Get the current count value
 *   updateCount((count) => count + 1);
 * }
 * ```
 */
export function createExternalHook<T>(initialValue: T) {
  let value = initialValue;
  const listeners = new Set<() => void>();

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function update(next: SetStateAction<T>) {
    value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    notify();
  }

  function getSnapshot() {
    return value;
  }

  function useState() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  return {
    useState,
    update,
    get: getSnapshot,
  } as ExternalHook<T>;
}
