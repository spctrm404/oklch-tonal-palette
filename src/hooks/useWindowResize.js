import { useState, useLayoutEffect, useRef } from 'react';

const useWindowResize = ({ onResize = () => {}, onResizeEnd = () => {} }) => {
  const [resizeState, setResizeState] = useState('');
  const resizeTimeoutRef = useRef(null);
  const isResizingRef = useRef(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!isResizingRef.current) {
        isResizingRef.current = true;
        setResizeState('resizing');
        console.log('resizing');
        onResize?.();
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        isResizingRef.current = false;
        setResizeState('resized');
        console.log('resized');
        onResizeEnd?.();
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

  return resizeState;
};

export default useWindowResize;
