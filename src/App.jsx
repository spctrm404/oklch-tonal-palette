import PaletteController from './components/PaletteController/PaletteController.jsx';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const setDecimalLen = useCallback((num, decimalLen) => {
    return parseFloat(num.toFixed(decimalLen));
  }, []);

  const createARandomPalette = useCallback(() => {
    const randomHue = setDecimalLen(Math.random() * 360, 1);
    const newPalette = {
      id: crypto.randomUUID(),
      chipNum: 10,
      lInflect: 0.5,
      cMax: 0.1,
      hueFrom: randomHue,
      hueTo: randomHue,
    };
    return newPalette;
  }, [setDecimalLen]);

  const [palettes, setPalettes] = useState([createARandomPalette()]);
  const [selectedPaletteId, setSelectedPaletteId] = useState(palettes[0].id);

  const getSelectedPaletteIdx = useCallback(() => {
    if (!selectedPaletteId) return null;

    for (let idx = 0; idx < palettes.length; idx++)
      if (palettes[idx].id === selectedPaletteId) return idx;

    return null;
  }, []);

  const selectedPaletteIdx = useRef(getSelectedPaletteIdx());

  const addPalette = useCallback(() => {
    const newPalette = createARandomPalette();
    setPalettes((prevPalettes) => {
      return [...prevPalettes, newPalette];
    });
  }, [createARandomPalette]);

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

  const setSelectedPalette = (key, value) => {
    if (!selectedPaletteId) return;

    setPalettes((prevPalettes) => {
      return prevPalettes.map((aPalette) => {
        return aPalette.id === selectedPaletteId
          ? {
              ...aPalette,
              [key]: value,
            }
          : aPalette;
      });
    });
  };

  const handleClick = (id) => {
    setSelectedPaletteId(id);
    selectedPaletteIdx.current = getSelectedPaletteIdx();
  };

  useEffect(() => {}, []);

  return (
    <>
      <button type="button" onPointerDown={addPalette}>
        ADD
      </button>
      <div className="control">
        <PaletteController
          chipNum={palettes[selectedPaletteIdx.current].chipNum}
          lInflect={palettes[selectedPaletteIdx.current].lInflect}
          cMax={palettes[selectedPaletteIdx.current].cMax}
          hueFrom={palettes[selectedPaletteIdx.current].hueFrom}
          hueTo={palettes[selectedPaletteIdx.current].hueTo}
          setSelectedPalette={setSelectedPalette}
        ></PaletteController>
        {/* <button
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
            adjSelectedPalette('lInflect', 0.05);
          }}
        >
          lInflect up
        </button>
        <button
          type="button"
          onPointerDown={() => {
            adjSelectedPalette('lInflect', -0.05);
          }}
        >
          lInflect down
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
        </button> */}
      </div>
      <div>
        {palettes.map((aPalette) => (
          <Palette
            key={aPalette.id}
            chipNum={aPalette.chipNum}
            lInflect={aPalette.lInflect}
            cMax={aPalette.cMax}
            hueFrom={aPalette.hueFrom}
            hueTo={aPalette.hueTo}
            isSelected={aPalette.id === selectedPaletteId}
            onClick={() => {
              handleClick(aPalette.id);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
