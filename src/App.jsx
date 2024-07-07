import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useState } from 'react';

function App() {
  const [palette, setPalette] = useState({
    chipNum: 10,
    lInflection: 0.5,
    cMax: 0.2,
    hueFrom: 0,
    hueTo: 0,
    idx: 0,
  });

  // const debug = (key, delta) => {
  //   const newColour = Object.assign({}, colour);
  //   newColour[key] = newColour[key] + delta;
  //   if (key === 'h' && newColour[key] > 360)
  //     newColour[key] = newColour[key] % 360;
  //   setColour(newColour);
  // };
  return (
    <>
      {/* <div className="control">
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
      </div> */}
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
