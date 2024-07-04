import { useState } from 'react';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';

function App() {
  const [palettes, setPalettes] = useState([
    {
      chipNum: 8,
      lInflection: 0.5,
      cMax: 0.16,
      hueFrom: 100,
      hueTo: 200,
    },
  ]);
  return (
    <>
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
    </>
  );
}

export default App;
