import { useCallback, useEffect, useRef, useState } from 'react';

const useCreateHandlerRef = () => {
  const stopPropagation = useRef(true);
  const preventDefault = useRef(true);
  const handler = useRef(null);
  const setHandler = useCallback(
    (
      handlerFunction,
      stopPropagationFlag = true,
      preventDefaultFlag = true
    ) => {
      handler.current = handlerFunction;
      stopPropagation.current = stopPropagationFlag;
      preventDefault.current = preventDefaultFlag;
    },
    []
  );
  return [stopPropagation, preventDefault, handler, setHandler];
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
    stopPropagationOnPointerDrag,
    preventDefaultOnPointerDrag,
    onPointerDrag,
    setOnPointerDrag,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerUp,
    preventDefaultOnPointerUp,
    onPointerUp,
    setOnPointerUp,
  ] = useCreateHandlerRef();
  const [, , onPointerClick, setOnPointerClick] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerLeave,
    preventDefaultOnPointerLeave,
    onPointerLeave,
    setOnPointerLeave,
  ] = useCreateHandlerRef();
  const [stopPropagationOnFocus, preventDefaultOnFocus, onFocus, setOnFocus] =
    useCreateHandlerRef();
  const [stopPropagationOnBlur, preventDefaultOnBlur, onBlur, setOnBlur] =
    useCreateHandlerRef();

  const [isDisabled, setDisabled] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const added = useRef(false);
  const pressing = useRef(false);
  const dragging = useRef(false);

  const preventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onPointerEnterTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerEnter.current) e.stopPropagation();
      if (preventDefaultOnPointerEnter.current) e.preventDefault();
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

  const onPointerDragHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerDrag.current) e.stopPropagation();
      if (preventDefaultOnPointerDrag.current) e.preventDefault();
      if (isDisabled) return;
      if (pressing.current) {
        dragging.current = true;
        onPointerDrag.current?.(e);
      }
    },
    [
      stopPropagationOnPointerDrag,
      preventDefaultOnPointerDrag,
      onPointerDrag,
      isDisabled,
    ]
  );

  const onPointerUpHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerUp.current) e.stopPropagation();
      if (preventDefaultOnPointerUp.current) e.preventDefault();
      if (!isDisabled) {
        onPointerUp.current?.(e);
        if (
          (pressing.current && targetRef.current === e.target) ||
          targetRef.current.contains(e.target)
        )
          onPointerClick.current?.(e);
        pressing.current = false;
        dragging.current = false;
        setPressed(false);
      }
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('pointermove', onPointerDragHandler);
      document.removeEventListener('pointerup', onPointerUpHandler);
    },
    [
      stopPropagationOnPointerUp,
      preventDefaultOnPointerUp,
      onPointerUp,
      onPointerClick,
      isDisabled,
      onPointerDragHandler,
      preventDefault,
    ]
  );

  const onPointerDownNullHandler = useCallback((e) => {
    if (
      targetRef.current &&
      targetRef.current !== e.target &&
      !targetRef.current.contains(e.target)
    ) {
      added.current = false;
      targetRef.current.blur();
      document.removeEventListener('pointerdown', onPointerDownNullHandler);
    }
  }, []);

  const onPointerDownTargetHandler = useCallback(
    (e) => {
      document.addEventListener('touchstart', preventDefault);
      if (stopPropagationOnPointerDown.current) e.stopPropagation();
      if (preventDefaultOnPointerDown.current) e.preventDefault();
      if (!isDisabled) {
        onPointerDown.current?.(e);
        pressing.current = true;
        dragging.current = false;
        setPressed(true);
        targetRef.current.focus();
      }
      document.addEventListener('pointermove', onPointerDragHandler);
      document.addEventListener('pointerup', onPointerUpHandler);
      if (!added.current) {
        added.current = true;
        document.addEventListener('pointerdown', onPointerDownNullHandler);
      }
    },
    [
      stopPropagationOnPointerDown,
      preventDefaultOnPointerDown,
      onPointerDown,
      isDisabled,
      onPointerDragHandler,
      onPointerUpHandler,
      onPointerDownNullHandler,
      preventDefault,
    ]
  );

  const onPointerLeaveTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerLeave.current) e.stopPropagation();
      if (preventDefaultOnPointerLeave.current) e.preventDefault();
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

  const onFocusTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnFocus.current) e.stopPropagation();
      if (preventDefaultOnFocus.current) e.preventDefault();
      if (isDisabled) return;
      onFocus.current?.(e);
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

  const onBlurTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnBlur.current) e.stopPropagation();
      if (preventDefaultOnBlur.current) e.preventDefault();
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
    target?.addEventListener('pointerenter', onPointerEnterTargetHandler);
    target?.addEventListener('pointerdown', onPointerDownTargetHandler);
    target?.addEventListener('pointerleave', onPointerLeaveTargetHandler);
    target?.addEventListener('focus', onFocusTargetHandler);
    target?.addEventListener('blur', onBlurTargetHandler);

    return () => {
      target?.removeEventListener('touchstart', preventDefault);
      target?.removeEventListener('pointerenter', onPointerEnterTargetHandler);
      target?.removeEventListener('pointerdown', onPointerDownTargetHandler);
      target?.removeEventListener('pointerleave', onPointerLeaveTargetHandler);
      target?.removeEventListener('focus', onFocusTargetHandler);
      target?.removeEventListener('blur', onBlurTargetHandler);
    };
  }, [
    onPointerEnterTargetHandler,
    onPointerDownTargetHandler,
    onPointerLeaveTargetHandler,
    onFocusTargetHandler,
    onBlurTargetHandler,
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
    setOnPointerDrag,
    setOnPointerUp,
    setOnPointerClick,
    setOnPointerLeave,
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
