"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

type ScrollPosition = {
  scrollTop: number;
  scrollBottom: number;
  scrollLeft: number;
  scrollRight: number;
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
};

const EPSILON = 1;

function useScrollPosition(
  reference: RefObject<HTMLElement | null>,
): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollBottom: 0,
    scrollLeft: 0,
    scrollRight: 0,
    isAtTop: true,
    isAtBottom: true,
    isAtLeft: true,
    isAtRight: true,
  });

  const updatePosition = useCallback(() => {
    const element = reference.current;

    if (!element) return;

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = element;

    const scrollBottom = Math.max(0, scrollHeight - scrollTop - clientHeight);

    const scrollRight = Math.max(0, scrollWidth - scrollLeft - clientWidth);

    setPosition({
      scrollTop,
      scrollBottom,
      scrollLeft,
      scrollRight,
      isAtTop: scrollTop <= EPSILON,
      isAtBottom: scrollBottom <= EPSILON,
      isAtLeft: scrollLeft <= EPSILON,
      isAtRight: scrollRight <= EPSILON,
    });
  }, [reference]);

  useEffect(() => {
    const element = reference.current;

    if (!element) return;

    let frameId: number | null = null;

    const scheduleUpdate = () => {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        frameId = null;
        updatePosition();
      });
    };

    // Initial measurement.
    updatePosition();

    // Scroll events can fire very frequently, so update once per frame.
    element.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });

    // Handles content changes that alter scrollHeight/scrollWidth.
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(element);

    // Handles changes to children/content that may not resize the
    // observed element itself.
    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Fonts/images/layout can settle after the effect runs.
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      element.removeEventListener("scroll", scheduleUpdate);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [reference, updatePosition]);

  return position;
}

export default useScrollPosition;
