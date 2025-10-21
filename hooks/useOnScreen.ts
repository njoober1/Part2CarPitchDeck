import { useState, useEffect, RefObject } from 'react';

export const useOnScreen = (ref: RefObject<HTMLElement>, triggerOnce = true): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    // Capture the element reference to ensure it's stable within the effect's closure
    const element = ref.current;
    
    // Don't proceed if the element doesn't exist yet
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        if (entry.isIntersecting) {
          setIntersecting(true);
          // If it should only trigger once, unobserve the element
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else {
          // If it should trigger every time, reset the state when it goes off-screen
          if (!triggerOnce) {
            setIntersecting(false);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(element);

    // Cleanup function: disconnect the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [ref, triggerOnce]); // Rerun the effect if the ref or triggerOnce prop changes

  return isIntersecting;
};
