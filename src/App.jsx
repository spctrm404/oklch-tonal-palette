import { useState } from 'react';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';

function App() {
  const [palettes, setPalettes] = useState([
    {
      chipNum: 20,
      lInflection: 0.5,
      cMax: 0.11,
      hueFrom: 0,
      hueTo: 200,
    },
  ]);

  const createNewPalette = () => {
    const palettesCoppied = palettes.map((aPalette) => ({
      ...aPalette,
    }));

    const randomChroma = Math.random() * 0.4;
    const randomHueFrom = Math.random() * 360;
    const randomHueTo = Math.random() * 360;
    const newPalette = {
      chipNum: 20,
      lInflection: 0.5,
      cMax: randomChroma,
      hueFrom: randomHueFrom,
      hueTo: randomHueTo,
    };

    palettesCoppied.push(newPalette);
    setPalettes(palettesCoppied);
  };

  return (
    <>
      <div className="layout">
        <div className="control">
          <button type="button" onPointerDown={createNewPalette}>
            add
          </button>
        </div>
        <div className="palettes">
          {palettes.map((aPalette) => {
            return (
              <Palette
                key={crypto.randomUUID()}
                chipNum={aPalette.chipNum}
                lInflection={aPalette.lInflection}
                cMax={aPalette.cMax}
                hueFrom={aPalette.hueFrom}
                hueTo={aPalette.hueTo}
              ></Palette>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
