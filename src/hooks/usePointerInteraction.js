import { useCallback, useEffect, useRef, useState } from 'react';

const usePointerInteraction = ({
  targetRef = null,
  onPointerEnter = null,
  onPointerDown = null,
  onPointerMove = null,
  onPointerUp = null,
  onPointerLeave = null,
  onPointerClick = null,
  onPointerDrag = null,
  onFocus = null,
  onBlur = null,
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const pressing = useRef(false);
  const dragging = useRef(false);
  const isFocusedByPointer = useRef(false);

  const preventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handlePointerEnterTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      onPointerEnter?.(e);
      setHovered(true);
    },
    [onPointerEnter, isDisabled, setHovered]
  );
  const handlePointerMove = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      if (pressing.current) {
        dragging.current = true;
        onPointerDrag?.(e);
      }
      onPointerMove?.(e);
    },
    [onPointerMove, onPointerDrag, isDisabled, pressing, dragging]
  );
  const handlePointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isDisabled) {
        if (pressing.current && !dragging.current) {
          if (isFocused) targetRef.current.blur();
          onPointerClick?.(e);
        }
        onPointerUp?.(e);
        pressing.current = true;
        dragging.current = true;
        isFocusedByPointer.current = false;
        setPressed(false);
      }
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    },
    [
      targetRef,
      onPointerClick,
      onPointerUp,
      isDisabled,
      isFocused,
      handlePointerMove,
      preventDefault,
      pressing,
      dragging,
    ]
  );
  const handlePointerDownTarget = useCallback(
    (e) => {
      document.addEventListener('touchstart', preventDefault);
      e.stopPropagation();
      e.preventDefault();
      if (!isDisabled) {
        onPointerDown?.(e);
        pressing.current = true;
        dragging.current = false;
        isFocusedByPointer.current = true;
        setPressed(true);
      }
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [
      onPointerDown,
      isDisabled,
      setPressed,
      pressing,
      dragging,
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
      if (isDisabled) return;
      onPointerLeave?.(e);
      setHovered(false);
    },
    [onPointerLeave, isDisabled, setHovered]
  );
  const handleFocusTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      onFocus?.(e);
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [onFocus, isDisabled, setFocused, isFocusedByPointer]
  );
  const handleBlurTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      onBlur?.(e);
      setFocused(false);
    },
    [onBlur, isDisabled, setFocused]
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

  const getState = useCallback(() => {
    if (isDisabled) return 'disabled';
    if (isPressed) return 'pressed';
    if (isFocused) return 'focused';
    if (isHovered) return 'hovered';
    return 'idle';
  }, [isDisabled, isHovered, isFocused, isPressed]);

  return {
    targetRef: targetRef,
    isDisabled: isDisabled,
    setDisabled: setDisabled,
    isHovered: isHovered,
    setHovered: setHovered,
    isFocused: isFocused,
    setFocused: setFocused,
    isPressed: isPressed,
    setPressed: setPressed,
    getState: getState,
  };
};

export default usePointerInteraction;
