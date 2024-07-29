import { useState, useEffect, useLayoutEffect } from 'react';

export const useResizeEffect = ({
  effectCallback = () => {},
  layoutEffectCallback = () => {},
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setWindowSize(newSize);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    effectCallback?.(windowSize);
  }, [windowSize]);

  useLayoutEffect(() => {
    layoutEffectCallback?.(windowSize);
  }, [windowSize]);

  return { windowSize };
};
