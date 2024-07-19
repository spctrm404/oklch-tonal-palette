import { useCallback } from 'react';

const usePreventTouchScroll = () => {
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
  }, []);
  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
  }, []);

  const prevent = useCallback(
    (flag) => {
      if (flag) {
        document.addEventListener('touchstart', handleTouchStart, {
          passive: false,
        });
        document.addEventListener('touchmove', handleTouchMove, {
          passive: false,
        });
      } else {
        document.addEventListener('touchstart', handleTouchStart, {
          passive: false,
        });
        document.addEventListener('touchmove', handleTouchMove, {
          passive: false,
        });
      }
    },
    [handleTouchStart, handleTouchMove]
  );

  return prevent;
};

export default usePreventTouchScroll;
