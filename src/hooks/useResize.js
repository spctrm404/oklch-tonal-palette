import { useLayoutEffect, useRef } from 'react';

const useResize = ({ onResize, onResizeEnd }) => {
  const resizeTimeoutRef = useRef(null);
  const isResizingRef = useRef(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!isResizingRef.current) {
        isResizingRef.current = true;
        if (onResize) {
          onResize();
        }
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        isResizingRef.current = false;
        if (onResizeEnd) {
          onResizeEnd();
        }
      }, 100); // 변경 후 100ms 후에 'onResizeEnd' 콜백 실행
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [onResize, onResizeEnd]);
};

export default useResize;
