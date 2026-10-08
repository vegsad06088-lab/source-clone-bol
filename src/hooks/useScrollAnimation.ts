import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationProps {
  threshold?: number;
  delay?: number;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  delay = 0,
}: UseScrollAnimationProps = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a delay before showing the animation
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Stop observing after animation is triggered
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, delay]);

  return { ref, isVisible };
};

