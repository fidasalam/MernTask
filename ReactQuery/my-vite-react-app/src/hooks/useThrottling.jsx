// src/hooks/useThrottle.js
import { useState, useEffect } from 'react';

export function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
    }, limit);

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
