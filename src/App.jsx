import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useState } from 'react';

function App() {
  const [palette, setPalette] = useState({
    chipNum: 10,
    lInflection: 0.5,
    cMax: 0.1,
    hueFrom: 0,
    hueTo: 120,
  });

  const adjust = (key, delta) => {
    const newPalette = Object.assign({}, palette);
    newPalette[key] = newPalette[key] + delta;
    if ((key === 'hueFrom' || key === 'hueTo') && newPalette[key] > 360)
      newPalette[key] = newPalette[key] % 360;
    setPalette(newPalette);
  };
  return (
    <>
      <div className="control">
        <button
          type="button"
          onPointerDown={() => {
            adjust('chipNum', 1);
          }}
        >
          chipNum up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('chipNum', -1);
          }}
        >
          chipNum down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('lInflection', 0.05);
          }}
        >
          lInflection up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('lInflection', -0.05);
          }}
        >
          lInflection down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('cMax', 0.01);
          }}
        >
          cMax up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('cMax', -0.01);
          }}
        >
          cMax down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('hueFrom', 1);
          }}
        >
          hueFrom up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('hueFrom', -1);
          }}
        >
          hueFrom down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('hueTo', 1);
          }}
        >
          hueTo up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjust('hueTo', -1);
          }}
        >
          hueTo down
        </button>
      </div>
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
