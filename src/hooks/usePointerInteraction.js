import { useCallback, useEffect, useRef, useState } from 'react';

const usePointerInteraction = ({
  targetRef = null,
  onPointerEnter = null,
  onPointerDown = null,
  onPointerMove = null,
  onPointerUp = null,
  onPointerLeave = null,
  onFocus = null,
  onBlur = null,
}) => {
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const isFocusedByPointer = useRef(false);

  const preventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handlePointerEnterTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPointerEnter?.(e);
      setHovered(true);
    },
    [onPointerEnter, setHovered]
  );
  const handlePointerMove = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPointerMove?.(e);
    },
    [onPointerMove]
  );
  const handlePointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPointerUp?.(e);
      isFocusedByPointer.current = false;
      setPressed(false);
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    },
    [onPointerUp, handlePointerMove, preventDefault]
  );
  const handlePointerDownTarget = useCallback(
    (e) => {
      document.addEventListener('touchstart', preventDefault);
      e.stopPropagation();
      e.preventDefault();
      onPointerDown?.(e);
      isFocusedByPointer.current = true;
      setPressed(true);
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [
      onPointerDown,
      setPressed,
      isFocusedByPointer,
      handlePointerMove,
      handlePointerUp,
      preventDefault,
    ]
  );
  const handlePointerLeaveTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPointerLeave?.(e);
      setHovered(false);
    },
    [onPointerLeave, setHovered]
  );
  const handleFocusTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onFocus?.(e);
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [onFocus, setFocused, isFocusedByPointer]
  );
  const handleBlurTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onBlur?.(e);
      setFocused(false);
    },
    [onBlur, setFocused]
  );

  useEffect(() => {
    const target = targetRef.current;

    if (target) target.style.touchAction = 'none';
    target?.addEventListener('touchstart', preventDefault);
    target?.addEventListener('pointerenter', handlePointerEnterTarget);
    target?.addEventListener('pointerdown', handlePointerDownTarget);
    target?.addEventListener('pointerleave', handlePointerLeaveTarget);
    target?.addEventListener('focus', handleFocusTarget);
    target?.addEventListener('blur', handleBlurTarget);

    return () => {
      target?.removeEventListener('touchstart', preventDefault);
      target?.removeEventListener('pointerenter', handlePointerEnterTarget);
      target?.removeEventListener('pointerdown', handlePointerDownTarget);
      target?.removeEventListener('pointerleave', handlePointerLeaveTarget);
      target?.removeEventListener('focus', handleFocusTarget);
      target?.removeEventListener('blur', handleBlurTarget);
    };
  }, [
    targetRef,
    handlePointerEnterTarget,
    handlePointerLeaveTarget,
    handleFocusTarget,
    handleBlurTarget,
    handlePointerDownTarget,
    preventDefault,
  ]);

  return {
    targetRef: targetRef,
    isHovered: isHovered,
    setHovered: setHovered,
    isFocused: isFocused,
    setFocused: setFocused,
    isPressed: isPressed,
    setPressed: setPressed,
  };
};

export default usePointerInteraction;
