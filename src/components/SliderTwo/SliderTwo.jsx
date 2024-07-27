import { useState } from 'react';
import { useMove } from 'react-aria';

const SliderTwo = () => {
  const CONTAINER_SIZE = 200;
  const BALL_SIZE = 30;

  let [events, setEvents] = useState([]);
  let [color, setColor] = useState('black');
  let [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  let clamp = (pos) => Math.min(Math.max(pos, 0), CONTAINER_SIZE - BALL_SIZE);
  let { moveProps } = useMove({
    onMoveStart(e) {
      setColor('red');
      setEvents((events) => [
        `move start with pointerType = ${e.pointerType}`,
        ...events,
      ]);
    },
    onMove(e) {
      setPosition(({ x, y }) => {
        // Normally, we want to allow the user to continue
        // dragging outside the box such that they need to
        // drag back over the ball again before it moves.
        // This is handled below by clamping during render.
        // If using the keyboard, however, we need to clamp
        // here so that dragging outside the container and
        // then using the arrow keys works as expected.
        if (e.pointerType === 'keyboard') {
          x = clamp(x);
          y = clamp(y);
        }

        x += e.deltaX;
        y += e.deltaY;
        return { x, y };
      });

      setEvents((events) => [
        `move with pointerType = ${e.pointerType}, deltaX = ${e.deltaX}, deltaY = ${e.deltaY}`,
        ...events,
      ]);
    },
    onMoveEnd(e) {
      setPosition(({ x, y }) => {
        // Clamp position on mouse up
        x = clamp(x);
        y = clamp(y);
        return { x, y };
      });
      setColor('black');
      setEvents((events) => [
        `move end with pointerType = ${e.pointerType}`,
        ...events,
      ]);
    },
  });

  return (
    <div
      style={{
        width: CONTAINER_SIZE,
        height: CONTAINER_SIZE,
        background: 'white',
        border: '1px solid black',
        position: 'relative',
        touchAction: 'none',
      }}
    >
      <div
        {...moveProps}
        tabIndex={0}
        style={{
          width: BALL_SIZE,
          height: BALL_SIZE,
          borderRadius: '100%',
          position: 'absolute',
          left: clamp(position.x),
          top: clamp(position.y),
          background: color,
        }}
      />
    </div>
  );
};

export default SliderTwo;
