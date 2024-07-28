import {
  useFocus,
  useFocusVisible,
  useFocusWithin,
  useHover,
  useKeyboard,
  useMove,
  usePress,
} from 'react-aria';

const SliderTwoThumb = () => {
  const { focusProps } = useFocus({
    isDisabled: false,
    onFocus: (e) => {},
    onBlur: (e) => {},
    onFocusChange: (isFocused) => {},
  });
  const { isFocusVisible } = useFocusVisible({ isTextInput: true });
  const { focusWithinProps } = useFocusWithin({
    isDisabled: false,
    onFocusWithin: (e) => {},
    onBlurWithin: (e) => {},
    onFocusWithinChange: (isFocusWithin) => {},
  });
  const { hoverProps, isHovered } = useHover({
    onHoverStart: (e) => {},
    onHoverEnd: (e) => {},
    onHoverChange: (isHovering) => {},
  });
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {},
    onKeyUp: (e) => {},
  });
  const { moveProps } = useMove({
    onMoveStart: (e) => {},
    onMove: (e) => {},
    onMoveEnd: (e) => {},
  });
  const { pressProps, isPressed } = usePress({
    onPress: (e) => {},
    onPressStart: (e) => {},
    onPressEnd: (e) => {},
    onPressChange: (isPressed) => {},
    onPressUp: (e) => {},
  });
};
export default SliderTwoThumb;
