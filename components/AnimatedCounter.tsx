
import React, { useEffect, useState, useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isOnScreen = useOnScreen(ref);
  const isFloat = end % 1 !== 0;

  useEffect(() => {
    if (isOnScreen) {
      let start = 0;
      const startTime = performance.now();

      const animate = (time: number) => {
        const timeFraction = (time - startTime) / duration;
        if (timeFraction < 1) {
          const progress = timeFraction;
          const current = start + progress * (end - start);
          setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isOnScreen, end, duration, isFloat]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
