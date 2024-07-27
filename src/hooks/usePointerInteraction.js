import { useCallback, useEffect, useRef, useState } from 'react';

const useCreateHandlerRef = () => {
  const stopPropagationRef = useRef(true);
  const preventDefaultRef = useRef(true);
  const handlerRef = useRef(null);
  const setHandler = useCallback(
    (
      newHandlerRef,
      newStopPropagationRef = true,
      newPreventDefaultRef = true
    ) => {
      handlerRef.current = newHandlerRef;
      stopPropagationRef.current = newStopPropagationRef;
      preventDefaultRef.current = newPreventDefaultRef;
    },
    []
  );
  return [stopPropagationRef, preventDefaultRef, handlerRef, setHandler];
};

const usePointerInteraction = () => {
  const targetRef = useRef(null);
  const setTargetRef = useCallback((newTargetRef) => {
    targetRef.current = newTargetRef;
  }, []);

  const [
    stopPropagationOnPointerEnterRef,
    preventDefaultOnPointerEnterRef,
    onPointerEnterRef,
    setOnPointerEnter,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerDownRef,
    preventDefaultOnPointerDownRef,
    onPointerDownRef,
    setOnPointerDown,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerDragRef,
    preventDefaultOnPointerDragRef,
    onPointerDragRef,
    setOnPointerDrag,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerUpRef,
    preventDefaultOnPointerUpRef,
    onPointerUpRef,
    setOnPointerUp,
  ] = useCreateHandlerRef();
  const [, , onPointerClickRef, setOnPointerClick] = useCreateHandlerRef();
  const [
    stopPropagationOnPointerLeaveRef,
    preventDefaultOnPointerLeaveRef,
    onPointerLeaveRef,
    setOnPointerLeave,
  ] = useCreateHandlerRef();
  const [
    stopPropagationOnFocusRef,
    preventDefaultOnFocusRef,
    onFocusRef,
    setOnFocus,
  ] = useCreateHandlerRef();
  const [stopPropagationOnBlurRef, preventDefaultOnBlurRef, onBlur, setOnBlur] =
    useCreateHandlerRef();

  const [isDisabled, setDisabled] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const focusRetrieverAddedRef = useRef(false);
  const isPresseingRef = useRef(false);
  const isDraggingRef = useRef(false);

  const preventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onPointerEnterTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerEnterRef.current) e.stopPropagation();
      if (preventDefaultOnPointerEnterRef.current) e.preventDefault();
      if (isDisabled) return;
      onPointerEnterRef.current?.(e);
      setHovered(true);
    },
    [
      stopPropagationOnPointerEnterRef,
      preventDefaultOnPointerEnterRef,
      onPointerEnterRef,
      isDisabled,
      setHovered,
    ]
  );

  const onPointerDragHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerDragRef.current) e.stopPropagation();
      if (preventDefaultOnPointerDragRef.current) e.preventDefault();
      if (isDisabled) return;
      if (isPresseingRef.current) {
        isDraggingRef.current = true;
        onPointerDragRef.current?.(e);
      }
    },
    [
      stopPropagationOnPointerDragRef,
      preventDefaultOnPointerDragRef,
      onPointerDragRef,
      isDisabled,
    ]
  );

  const onPointerUpHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerUpRef.current) e.stopPropagation();
      if (preventDefaultOnPointerUpRef.current) e.preventDefault();
      if (!isDisabled) {
        onPointerUpRef.current?.(e);
        if (
          (isPresseingRef.current && targetRef.current === e.target) ||
          targetRef.current.contains(e.target)
        )
          onPointerClickRef.current?.(e);
        isPresseingRef.current = false;
        isDraggingRef.current = false;
        setPressed(false);
      }
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('pointermove', onPointerDragHandler);
      document.removeEventListener('pointerup', onPointerUpHandler);
    },
    [
      stopPropagationOnPointerUpRef,
      preventDefaultOnPointerUpRef,
      onPointerUpRef,
      onPointerClickRef,
      isDisabled,
      onPointerDragHandler,
      preventDefault,
    ]
  );

  const onPointerDownNullHandler = useCallback((e) => {
    if (
      targetRef.current !== e.target &&
      !targetRef.current.contains(e.target)
    ) {
      focusRetrieverAddedRef.current = false;
      targetRef.current.blur();
      document.removeEventListener('pointerdown', onPointerDownNullHandler);
    }
  }, []);

  const onPointerDownTargetHandler = useCallback(
    (e) => {
      document.addEventListener('touchstart', preventDefault);
      if (stopPropagationOnPointerDownRef.current) e.stopPropagation();
      if (preventDefaultOnPointerDownRef.current) e.preventDefault();
      if (!isDisabled) {
        onPointerDownRef.current?.(e);
        isPresseingRef.current = true;
        isDraggingRef.current = false;
        setPressed(true);
        targetRef.current.focus();
      }
      document.addEventListener('pointermove', onPointerDragHandler);
      document.addEventListener('pointerup', onPointerUpHandler);
      if (!focusRetrieverAddedRef.current) {
        focusRetrieverAddedRef.current = true;
        document.addEventListener('pointerdown', onPointerDownNullHandler);
      }
    },
    [
      stopPropagationOnPointerDownRef,
      preventDefaultOnPointerDownRef,
      onPointerDownRef,
      isDisabled,
      onPointerDragHandler,
      onPointerUpHandler,
      onPointerDownNullHandler,
      preventDefault,
    ]
  );

  const onPointerLeaveTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnPointerLeaveRef.current) e.stopPropagation();
      if (preventDefaultOnPointerLeaveRef.current) e.preventDefault();
      if (isDisabled) return;
      onPointerLeaveRef.current?.(e);
      setHovered(false);
    },
    [
      stopPropagationOnPointerLeaveRef,
      preventDefaultOnPointerLeaveRef,
      onPointerLeaveRef,
      isDisabled,
      setHovered,
    ]
  );

  const onFocusTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnFocusRef.current) e.stopPropagation();
      if (preventDefaultOnFocusRef.current) e.preventDefault();
      if (isDisabled) return;
      onFocusRef.current?.(e);
      setFocused(true);
    },
    [
      stopPropagationOnFocusRef,
      preventDefaultOnFocusRef,
      onFocusRef,
      isDisabled,
      setFocused,
    ]
  );

  const onBlurTargetHandler = useCallback(
    (e) => {
      if (stopPropagationOnBlurRef.current) e.stopPropagation();
      if (preventDefaultOnBlurRef.current) e.preventDefault();
      if (isDisabled) return;
      onBlur.current?.(e);
      setFocused(false);
    },
    [
      stopPropagationOnBlurRef,
      preventDefaultOnBlurRef,
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
