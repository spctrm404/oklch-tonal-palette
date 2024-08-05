import Button from './components/Button/Button.jsx';
import Switch from './components/Switch/Switch.jsx';
import PaletteController from './components/PaletteController/PaletteController.jsx';
import Palette from './components/Palette/Palette.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import { HUE_STEP } from './utils/constants';
import { closestQuantized } from './utils/numberUtils';
import { useCallback, useContext, useEffect, useState } from 'react';
import './App.scss';

function App() {
  const createARandomPalette = useCallback(() => {
    const randomHue = closestQuantized(Math.random() * 360, HUE_STEP);
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
  const [selectedPalette, setSelectedPalette] = useState(palettes[0]);

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

  const findeSelectedPalette = useCallback(() => {
    return palettes.find((palette) => palette.id === selectedPalette.id);
  }, [palettes, selectedPalette]);

  const clickPaletteHandler = (id) => {
    const selected = palettes.find((palette) => palette.id === id);
    setSelectedPalette(selected);
  };
  useEffect(() => {}, []);

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <p>{theme}</p>
      <Switch
        materialIconA={'dark_mode'}
        materialIconB={'light_mode'}
        isSelected={theme === 'light'}
        onChange={toggleTheme}
      />
      <Button
        buttontype={'filled'}
        label="Create a Palette"
        onPress={addAPalette}
      />
      <div className="control">
        <PaletteController
          totalChips={findeSelectedPalette().chipNum}
          lInflect={findeSelectedPalette().lInflect}
          cMax={findeSelectedPalette().cMax}
          hFrom={findeSelectedPalette().hueFrom}
          hTo={findeSelectedPalette().hueTo}
          onChange={handleChangePaletteController}
        ></PaletteController>
      </div>
      <div className="palette">
        {palettes.map((aPalette) => (
          <Palette
            key={aPalette.id}
            id={aPalette.id}
            totalChips={aPalette.chipNum}
            lInflect={aPalette.lInflect}
            cMax={aPalette.cMax}
            hFrom={aPalette.hueFrom}
            hTo={aPalette.hueTo}
            selected={aPalette.id === selectedPalette.id}
            onClickPalette={clickPaletteHandler}
          />
        ))}
      </div>
    </>
  );
}

export default App;
