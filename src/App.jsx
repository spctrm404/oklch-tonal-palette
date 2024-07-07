import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useState } from 'react';

function App() {
  const [currentPalette, setCurrentPalette] = useState({
    chipNum: 10,
    lInflection: 0.5,
    cMax: 0.1,
    hueFrom: 0,
    hueTo: 120,
  });

  const adjustCurrentPalette = (key, delta) => {
    const newPalette = Object.assign({}, currentPalette);
    newPalette[key] = newPalette[key] + delta;
    if ((key === 'hueFrom' || key === 'hueTo') && newPalette[key] > 360)
      newPalette[key] = newPalette[key] % 360;
    setCurrentPalette(newPalette);
  };
  return (
    <>
      <div className="control">
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('chipNum', 1);
          }}
        >
          chipNum up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('chipNum', -1);
          }}
        >
          chipNum down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('lInflection', 0.05);
          }}
        >
          lInflection up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('lInflection', -0.05);
          }}
        >
          lInflection down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('cMax', 0.01);
          }}
        >
          cMax up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('cMax', -0.01);
          }}
        >
          cMax down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('hueFrom', 1);
          }}
        >
          hueFrom up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('hueFrom', -1);
          }}
        >
          hueFrom down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('hueTo', 1);
          }}
        >
          hueTo up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjustCurrentPalette('hueTo', -1);
          }}
        >
          hueTo down
        </button>
      </div>
      <Palette
        chipNum={currentPalette.chipNum}
        lInflection={currentPalette.lInflection}
        cMax={currentPalette.cMax}
        hueFrom={currentPalette.hueFrom}
        hueTo={currentPalette.hueTo}
      ></Palette>
    </>
  );
}

export default App;
