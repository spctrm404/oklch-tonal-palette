import { useCallback, useEffect, useRef, useState } from 'react';

const useCreateHandlerRef = (initialValue = null) => {
  const handlerRef = useRef(initialValue);
  const setHandler = useCallback((fn) => {
    handlerRef.current = fn;
  }, []);
  return [handlerRef, setHandler];
};

const usePointerInteraction = () => {
  const targetRef = useRef(null);
  const setTargetRef = useCallback((ref) => {
    targetRef.current = ref;
  }, []);

  const [onPointerEnter, setOnPointerEnter] = useCreateHandlerRef();
  const [onPointerDown, setOnPointerDown] = useCreateHandlerRef();
  const [onPointerMove, setOnPointerMove] = useCreateHandlerRef();
  const [onPointerUp, setOnPointerUp] = useCreateHandlerRef();
  const [onPointerLeave, setOnPointerLeave] = useCreateHandlerRef();
  const [onPointerClick, setOnPointerClick] = useCreateHandlerRef();
  const [onPointerDrag, setOnPointerDrag] = useCreateHandlerRef();
  const [onFocus, setOnFocus] = useCreateHandlerRef();
  const [onBlur, setOnBlur] = useCreateHandlerRef();

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
      onPointerEnter.current?.(e);
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
        onPointerDrag.current?.(e);
      }
      onPointerMove.current?.(e);
    },
    [onPointerMove, onPointerDrag, isDisabled]
  );

  const handlePointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isDisabled) {
        if (pressing.current && !dragging.current) {
          if (isFocused) targetRef.current.blur();
          onPointerClick.current?.(e);
        }
        onPointerUp.current?.(e);
        pressing.current = false;
        dragging.current = false;
        isFocusedByPointer.current = false;
        setPressed(false);
      }
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    },
    [
      onPointerUp,
      onPointerClick,
      isDisabled,
      isFocused,
      handlePointerMove,
      preventDefault,
    ]
  );

  const handlePointerDownTarget = useCallback(
    (e) => {
      document.addEventListener('touchstart', preventDefault);
      e.stopPropagation();
      e.preventDefault();
      if (!isDisabled) {
        onPointerDown.current?.(e);
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
      onPointerLeave.current?.(e);
      setHovered(false);
    },
    [onPointerLeave, isDisabled, setHovered]
  );

  const handleFocusTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      onFocus.current?.(e);
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [onFocus, isDisabled, setFocused]
  );

  const handleBlurTarget = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled) return;
      onBlur.current?.(e);
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
    targetRef,
    setTargetRef,
    setOnPointerEnter,
    setOnPointerDown,
    setOnPointerMove,
    setOnPointerUp,
    setOnPointerLeave,
    setOnPointerClick,
    setOnPointerDrag,
    setOnFocus,
    setOnBlur,
    isDisabled,
    setDisabled,
    isHovered,
    setHovered,
    isFocused,
    setFocused,
    isPressed,
    setPressed,
    getState,
  };
};

export default usePointerInteraction;
