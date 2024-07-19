import { useCallback, useEffect, useRef, useState } from 'react';

const useGUI = (
  onMouseEnter = null,
  onMouseLeave = null,
  onFocus = null,
  onBlur = null,
  onPointerDown = null,
  onPointerMove = null,
  onPointerUp = null
) => {
  const targetRef = useRef(null);

  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const isFocusedByPointer = useRef(false);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
  }, []);
  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
  }, []);
  const handleMouseEnterTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onMouseEnter?.();
      setHovered(true);
    },
    [onMouseEnter, setHovered]
  );
  const handleMouseLeaveTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onMouseLeave?.();
      setHovered(false);
    },
    [onMouseLeave, setHovered]
  );
  const handleFocusTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onFocus?.();
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [onFocus, setFocused, isFocusedByPointer]
  );
  const handleBlurTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onBlur?.();
      setFocused(false);
    },
    [onBlur, setFocused]
  );
  const handlePointerDownTarget = useCallback(
    (e) => {
      const handlePointerMove = (e) => {
        e.preventDefault();
        onPointerMove?.();
      };
      const handlePointerUp = (e) => {
        e.preventDefault();
        onPointerUp?.();
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
      e.stopPropagation();
      e.preventDefault();
      onPointerDown?.();
      isFocusedByPointer.current = true;
      setPressed(true);

      document.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [onPointerDown, onPointerMove, onPointerUp, setPressed, isFocusedByPointer]
  );

  useEffect(() => {
    const target = targetRef.current;

    target?.addEventListener('mouseenter', handleMouseEnterTarget);
    target?.addEventListener('mouseleave', handleMouseLeaveTarget);
    target?.addEventListener('focus', handleFocusTarget);
    target?.addEventListener('blur', handleBlurTarget);
    target?.addEventListener('pointerdown', handlePointerDownTarget);

    return () => {
      target?.removeEventListener('mouseenter', handleMouseEnterTarget);
      target?.removeEventListener('mouseleave', handleMouseLeaveTarget);
      target?.removeEventListener('focus', handleFocusTarget);
      target?.removeEventListener('blur', handleBlurTarget);
      target?.removeEventListener('pointerdown', handlePointerDownTarget);
    };
  }, [
    handleMouseEnterTarget,
    handleMouseLeaveTarget,
    handleFocusTarget,
    handleBlurTarget,
    handlePointerDownTarget,
  ]);

  return {
    isHovered: isHovered,
    setHovered: setHovered,
    isFocused: isFocused,
    setFocused: setFocused,
    isPressed: isPressed,
    setPressed: setPressed,
  };
};

export default useGUI;
