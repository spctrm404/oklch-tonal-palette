import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const adjDecimalLen = useCallback((num, decimalLen) => {
    return parseFloat(num.toFixed(decimalLen));
  }, []);

  const [palettes, setPalettes] = useState([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState(null);

  useEffect(() => {
    const initialPalette = {
      id: crypto.randomUUID(),
      chipNum: 10,
      lInflection: 0.5,
      cMax: 0.1,
      hueFrom: 75.9,
      hueTo: 75.9,
    };
    setPalettes([initialPalette]);
    setSelectedPaletteId(initialPalette.id);
  }, []);

  const addPalette = () => {
    const randomHue = adjDecimalLen(Math.random() * 360, 1);
    const newPalette = {
      id: crypto.randomUUID(),
      chipNum: 10,
      lInflection: 0.5,
      cMax: 0.1,
      hueFrom: randomHue,
      hueTo: randomHue,
    };
    setPalettes((prevPalettes) => {
      return [...prevPalettes, newPalette];
    });
  };

  const adjSelectedPalette = (key, delta) => {
    if (!selectedPaletteId) return;

    setPalettes((prevPalettes) => {
      return prevPalettes.map((aPalette) => {
        return aPalette.id === selectedPaletteId
          ? {
              ...aPalette,
              [key]:
                key !== 'hueFrom' && key !== 'hueTo'
                  ? aPalette[key] + delta
                  : (aPalette[key] + delta) % 360,
            }
          : aPalette;
      });
    });
  };

  const handlePointerDown = (id) => {
    console.log(id);
    setSelectedPaletteId(id);
  };

  return (
    <>
      <button type="button" onPointerDown={addPalette}>
        ADD
      </button>
      <div className="control">
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('chipNum', 1);
          }}
        >
          chipNum up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('chipNum', -1);
          }}
        >
          chipNum down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('lInflection', 0.05);
          }}
        >
          lInflection up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('lInflection', -0.05);
          }}
        >
          lInflection down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('cMax', 0.01);
          }}
        >
          cMax up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('cMax', -0.01);
          }}
        >
          cMax down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('hueFrom', 1);
          }}
        >
          hueFrom up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('hueFrom', -1);
          }}
        >
          hueFrom down
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('hueTo', 1);
          }}
        >
          hueTo up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('hueTo', -1);
          }}
        >
          hueTo down
        </button>
      </div>
      <div>
        {palettes.map((aPalette) => (
          <Palette
            key={aPalette.id}
            chipNum={aPalette.chipNum}
            lInflection={aPalette.lInflection}
            cMax={aPalette.cMax}
            hueFrom={aPalette.hueFrom}
            hueTo={aPalette.hueTo}
            onPointerDown={() => {
              handlePointerDown(aPalette.id);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
