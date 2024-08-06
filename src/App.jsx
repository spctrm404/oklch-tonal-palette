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
      uid: crypto.randomUUID(),
      chipNum: 10,
      lInflect: 0.5,
      cMax: 0.11,
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
        return aPalette.uid === selectedPalette.uid
          ? {
              ...aPalette,
              [key]: value,
            }
          : aPalette;
      });
    });
  };

  const findeSelectedPalette = useCallback(() => {
    return palettes.find((palette) => palette.uid === selectedPalette.uid);
  }, [palettes, selectedPalette]);

  const clickPaletteHandler = (uid) => {
    const selected = palettes.find((palette) => palette.uid === uid);
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
            key={aPalette.uid}
            uid={aPalette.uid}
            totalChips={aPalette.chipNum}
            lInflect={aPalette.lInflect}
            cMax={aPalette.cMax}
            hFrom={aPalette.hueFrom}
            hTo={aPalette.hueTo}
            selected={aPalette.uid === selectedPalette.uid}
            onClickPalette={clickPaletteHandler}
          />
        ))}
      </div>
    </>
  );
}

export default App;
