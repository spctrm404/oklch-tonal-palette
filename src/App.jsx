import Chip from './components/Chip/Chip.jsx';
import './App.scss';
import { useRef } from 'react';

function App() {
  const db = useRef({
    l: 0.5,
    c: 0.2,
    h: 270,
    inP3: true,
    inSrgb: true,
  });
  return (
    <>
      <button type="button" onPointerDown={() => {}}>
        l up
      </button>
      <button type="button" onPointerDown={() => {}}>
        l down
      </button>
      <button type="button" onPointerDown={() => {}}>
        c up
      </button>
      <button type="button" onPointerDown={() => {}}>
        c down
      </button>
      <button type="button" onPointerDown={() => {}}>
        h up
      </button>
      <button type="button" onPointerDown={() => {}}>
        h down
      </button>
      <Chip
        l={db.current.l}
        c={db.current.c}
        h={db.current.h}
        inP3={db.current.inP3}
        inSrgb={db.current.inSrgb}
      ></Chip>
    </>
  );
}

export default App;
