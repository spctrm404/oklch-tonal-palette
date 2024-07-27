import IconButton from './components/IconButton/IconButton.jsx';
import Button from './components/Button/Button.jsx';
import Switch from './components/Switch/Switch.jsx';
import PaletteController from './components/PaletteController/PaletteController.jsx';
import Palette from './components/Palette/Palette.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import { HUE_STEP } from './utils/constants';
import { setMultipleOfStep } from './utils/numberUtils';
import { useCallback, useContext, useEffect, useState } from 'react';
import './App.scss';

function App() {
  const createARandomPalette = useCallback(() => {
    const randomHue = setMultipleOfStep(Math.random() * 360, HUE_STEP);
    const newPalette = {
      id: crypto.randomUUID(),
      chipNum: 10,
      lInflect: 0.5,
      cMax: 0.1,
      hueFrom: randomHue,
      hueTo: randomHue,
    };
    return newPalette;
  }, []);

  const [palettes, setPalettes] = useState([createARandomPalette()]);
  const [selectedPalette, setSelectedPalette] = useState({
    id: palettes[0].id,
    idx: 0,
  });

  const addAPalette = useCallback(() => {
    const newPalette = createARandomPalette();
    setPalettes((prevPalettes) => {
      return [...prevPalettes, newPalette];
    });
  }, [createARandomPalette]);

  const handleChangePaletteController = (key, value) => {
    if (!selectedPalette) return;

    setPalettes((prevPalettes) => {
      return prevPalettes.map((aPalette) => {
        return aPalette.id === selectedPalette.id
          ? {
              ...aPalette,
              [key]: value,
            }
          : aPalette;
      });
    });
  };

  const clickPaletteHandler = (id, idx) => {
    setSelectedPalette({ id: id, idx: idx });
  };
  useEffect(() => {}, []);

  const { theme, updateTheme } = useContext(ThemeContext);

  const [test, setTest] = useState(true);

  return (
    <>
      <IconButton
        value={test}
        materialIcon="settings"
        style="standard"
        disabled={false}
        onChange={setTest}
      />
      <Button label="button" />
      <Button label="button" disabled={true} />
      <Switch state={true} disabled={true} />
      <Switch state={false} disabled={true} />
      <p>{theme}</p>
      <Switch state={theme === 'light'} onChange={updateTheme} />
      <button type="button" onPointerDown={addAPalette}>
        ADD
      </button>
      <div className="control">
        <PaletteController
          totalChips={palettes[selectedPalette.idx].chipNum}
          lInflect={palettes[selectedPalette.idx].lInflect}
          cMax={palettes[selectedPalette.idx].cMax}
          hFrom={palettes[selectedPalette.idx].hueFrom}
          hTo={palettes[selectedPalette.idx].hueTo}
          onChange={handleChangePaletteController}
        ></PaletteController>
      </div>
      <div className="palette">
        {palettes.map((aPalette, idx) => (
          <Palette
            key={aPalette.id}
            totalChips={aPalette.chipNum}
            lInflect={aPalette.lInflect}
            cMax={aPalette.cMax}
            hFrom={aPalette.hueFrom}
            hTo={aPalette.hueTo}
            selected={aPalette.id === selectedPalette.id}
            onClickPalette={() => {
              clickPaletteHandler(aPalette.id, idx);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
