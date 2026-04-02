import { useEffect, useRef } from 'react';

/**
 * useGameLoop Hook
 * 
 * Provides a highly performant, requestAnimationFrame-based game loop
 * that maintains a steady tick rate independent of framerate.
 */
export function useGameLoop(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>(undefined);
  const previousTimeRef = useRef<number>(undefined);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
}
