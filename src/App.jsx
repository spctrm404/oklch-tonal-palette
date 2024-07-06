import Chip from './components/Chip/Chip.jsx';
import './App.scss';
import { useRef, useState } from 'react';

function App() {
  const [colour, setColour] = useState({
    l: 0.5,
    c: 0.2,
    h: 270,
    inP3: true,
    inSrgb: true,
  });

  const debug = (key, delta) => {
    const newColour = Object.assign({}, colour);
    newColour[key] = newColour[key] + delta;
    if (key === 'h' && newColour[key] > 360)
      newColour[key] = newColour[key] % 360;
    setColour(newColour);
    // console.log(colour);
  };
  return (
    <>
      <button
        type="button"
        onPointerDown={() => {
          debug('l', 0.01);
        }}
      >
        l up
      </button>
      <button
        type="button"
        onPointerDown={() => {
          debug('l', -0.01);
        }}
      >
        l down
      </button>
      <button
        type="button"
        onPointerDown={() => {
          debug('c', 0.01);
        }}
      >
        c up
      </button>
      <button
        type="button"
        onPointerDown={() => {
          debug('c', -0.01);
        }}
      >
        c down
      </button>
      <button
        type="button"
        onPointerDown={() => {
          debug('h', 1);
        }}
      >
        h up
      </button>
      <button
        type="button"
        onPointerDown={() => {
          debug('h', -1);
        }}
      >
        h down
      </button>
      <Chip
        l={colour.l}
        c={colour.c}
        h={colour.h}
        inP3={colour.inP3}
        inSrgb={colour.inSrgb}
      ></Chip>
    </>
  );
}

export default App;
