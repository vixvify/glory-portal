import { useEffect, useState, useRef } from "react";

export function useScrollRow<T>(deps: T[]) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = rowRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollArrows);
      setTimeout(checkScrollArrows, 200);
    }
    return () => el?.removeEventListener("scroll", checkScrollArrows);
  }, [deps]);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const el = rowRef.current;
      const { clientWidth, scrollLeft } = el;
      
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      
      let targetScroll = scrollLeft + scrollAmount;
      const firstChild = el.firstElementChild as HTMLElement;
      
      if (firstChild) {
        const itemWidth = firstChild.getBoundingClientRect().width;
        const computedStyle = window.getComputedStyle(el);
        const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 16;
        const stepWidth = itemWidth + gap;
        
        const currentItemIndex = Math.round(scrollLeft / stepWidth);
        const itemsToScroll = Math.max(1, Math.round((clientWidth * 0.75) / stepWidth));
        
        const targetItemIndex = direction === "left"
          ? Math.max(0, currentItemIndex - itemsToScroll)
          : currentItemIndex + itemsToScroll;
          
        targetScroll = targetItemIndex * stepWidth;
      }

      const maxScrollLeft = el.scrollWidth - clientWidth;
      const finalTarget = Math.max(0, Math.min(maxScrollLeft, targetScroll));

      const originalSnap = el.style.scrollSnapType;
      el.style.scrollSnapType = "none";

      const start = el.scrollLeft;
      const change = finalTarget - start;
      const duration = 400; // 400ms duration
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // cubic easeInOut
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

        el.scrollLeft = start + change * ease;

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          el.style.scrollSnapType = originalSnap;
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return {
    rowRef,
    showLeftArrow,
    showRightArrow,
    handleScroll,
    checkScrollArrows,
  };
}
