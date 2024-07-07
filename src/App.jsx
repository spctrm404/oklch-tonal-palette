import Chip from './components/Chip/Chip.jsx';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useState } from 'react';

function App() {
  const [colour, setColour] = useState({
    l: 0.5,
    c: 0.1,
    h: 120,
    inP3: true,
    inSrgb: true,
  });
  const [palette, setPalette] = useState({
    chipNum: 10,
    lInflection: 0.5,
    cMax: 0.1,
    hueFrom: 0,
    hueTo: 120,
  });

  const debug = (key, delta) => {
    const newColour = Object.assign({}, colour);
    newColour[key] = newColour[key] + delta;
    if (key === 'h' && newColour[key] > 360)
      newColour[key] = newColour[key] % 360;
    setColour(newColour);
  };

  const debug2 = (key, delta) => {
    const newPalette = Object.assign({}, colour);
    newPalette[key] = newPalette[key] + delta;
    if ((key === 'hueFrom' || key === 'hueTo') && newPalette[key] > 360)
      newPalette[key] = newPalette[key] % 360;
    setPalette(newPalette);
  };
  return (
    <>
      <div className="control">
        {/* <button
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
        </button> */}
        <button
          type="button"
          onPointerDown={() => {
            debug2('chipNum', 1);
          }}
        >
          chipNum up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('chipNum', -1);
          }}
        >
          chipNum down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('lInflection', 0.05);
          }}
        >
          lInflection up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('lInflection', -0.05);
          }}
        >
          lInflection down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('cMax', 0.01);
          }}
        >
          cMax up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('cMax', -0.01);
          }}
        >
          cMax down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('hueFrom', 1);
          }}
        >
          hueFrom up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('hueFrom', -1);
          }}
        >
          hueFrom down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('hueTo', 1);
          }}
        >
          hueTo up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            debug2('hueTo', -1);
          }}
        >
          hueTo down
        </button>
      </div>
      {/* <Chip
        l={colour.l}
        c={colour.c}
        h={colour.h}
        inP3={colour.inP3}
        inSrgb={colour.inSrgb}
      ></Chip> */}
      <Palette
        chipNum={palette.chipNum}
        lInflection={palette.lInflection}
        cMax={palette.cMax}
        hueFrom={palette.hueFrom}
        hueTo={palette.hueTo}
      ></Palette>
    </>
  );
}

export default App;
