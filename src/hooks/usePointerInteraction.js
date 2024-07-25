import { useCallback, useEffect, useRef, useState } from 'react';

const useCreateHandlerRef = () => {
  const stopPropagation = useRef(true);
  const preventDefault = useRef(true);
  const handlerRef = useRef(null);
  const setHandler = useCallback(
    (fn, stopPropagationFlag = true, preventDefaultFlag = true) => {
      handlerRef.current = fn;
      stopPropagation.current = stopPropagationFlag;
      preventDefault.current = preventDefaultFlag;
    },
    []
  );
  return [stopPropagation, preventDefault, handlerRef, setHandler];
};

const usePointerInteraction = () => {
  const targetRef = useRef(null);
  const setTargetRef = useCallback((ref) => {
    targetRef.current = ref;
  }, []);

  const [
    stopPropagationOnPointerEnter,
    preventDefaultOnPointerEnter,
    onPointerEnter,
    setOnPointerEnter,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerDown,
    preventDefaultOnPointerDown,
    onPointerDown,
    setOnPointerDown,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerMove,
    preventDefaultOnPointerMove,
    onPointerMove,
    setOnPointerMove,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerUp,
    preventDefaultOnPointerUp,
    onPointerUp,
    setOnPointerUp,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerLeave,
    preventDefaultOnPointerLeave,
    onPointerLeave,
    setOnPointerLeave,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerClick,
    preventDefaultOnPointerClick,
    onPointerClick,
    setOnPointerClick,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerDrag,
    preventDefaultOnPointerDrag,
    onPointerDrag,
    setOnPointerDrag,
  ] = useCreateHandlerRef();
  const [stopPropagationOnFocus, preventDefaultOnFocus, onFocus, setOnFocus] =
    useCreateHandlerRef();
  const [stopPropagationOnBlur, preventDefaultOnBlur, onBlur, setOnBlur] =
    useCreateHandlerRef();

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
      if (stopPropagationOnPointerEnter) e.stopPropagation();
      if (preventDefaultOnPointerEnter) e.preventDefault();
      if (isDisabled) return;
      onPointerEnter.current?.(e);
      setHovered(true);
    },
    [
      stopPropagationOnPointerEnter,
      preventDefaultOnPointerEnter,
      onPointerEnter,
      isDisabled,
      setHovered,
    ]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (stopPropagationOnPointerMove) e.stopPropagation();
      if (preventDefaultOnPointerMove) e.preventDefault();
      if (isDisabled) return;
      if (pressing.current) {
        dragging.current = true;
        onPointerDrag.current?.(e);
      }
      onPointerMove.current?.(e);
    },
    [
      stopPropagationOnPointerMove,
      preventDefaultOnPointerMove,
      onPointerMove,
      onPointerDrag,
      isDisabled,
    ]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (stopPropagationOnPointerUp) e.stopPropagation();
      if (preventDefaultOnPointerUp) e.preventDefault();
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
      stopPropagationOnPointerUp,
      preventDefaultOnPointerUp,
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
      if (stopPropagationOnPointerDown) e.stopPropagation();
      if (preventDefaultOnPointerDown) e.preventDefault();
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
      stopPropagationOnPointerDown,
      preventDefaultOnPointerDown,
      onPointerDown,
      isDisabled,
      handlePointerMove,
      handlePointerUp,
      preventDefault,
    ]
  );

  const handlePointerLeaveTarget = useCallback(
    (e) => {
      if (stopPropagationOnPointerLeave) e.stopPropagation();
      if (preventDefaultOnPointerLeave) e.preventDefault();
      if (isDisabled) return;
      onPointerLeave.current?.(e);
      setHovered(false);
    },
    [
      stopPropagationOnPointerLeave,
      preventDefaultOnPointerLeave,
      onPointerLeave,
      isDisabled,
      setHovered,
    ]
  );

  const handleFocusTarget = useCallback(
    (e) => {
      if (stopPropagationOnFocus) e.stopPropagation();
      if (preventDefaultOnFocus) e.preventDefault();
      if (isDisabled) return;
      onFocus.current?.(e);
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [
      stopPropagationOnFocus,
      preventDefaultOnFocus,
      onFocus,
      isDisabled,
      setFocused,
    ]
  );

  const handleBlurTarget = useCallback(
    (e) => {
      if (stopPropagationOnBlur) e.stopPropagation();
      if (preventDefaultOnBlur) e.preventDefault();
      if (isDisabled) return;
      onBlur.current?.(e);
      setFocused(false);
    },
    [
      stopPropagationOnBlur,
      preventDefaultOnBlur,
      onBlur,
      isDisabled,
      setFocused,
    ]
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
