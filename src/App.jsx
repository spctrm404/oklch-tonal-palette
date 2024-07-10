import Slider from './components/Slider/Slider.jsx';
import PaletteController from './components/PaletteController/PaletteController.jsx';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  // const setDecimalLen = useCallback((num, decimalLen) => {
  //   return parseFloat(num.toFixed(decimalLen));
  // }, []);
  // const createARandomPalette = useCallback(() => {
  //   const randomHue = setDecimalLen(Math.random() * 360, 1);
  //   const newPalette = {
  //     id: crypto.randomUUID(),
  //     chipNum: 10,
  //     lInflect: 0.5,
  //     cMax: 0.1,
  //     hueFrom: randomHue,
  //     hueTo: randomHue,
  //   };
  //   return newPalette;
  // }, [setDecimalLen]);
  // const [palettes, setPalettes] = useState([createARandomPalette()]);
  // const [selectedPalette, setSelectedPalette] = useState({
  //   id: palettes[0].id,
  //   idx: 0,
  // });
  // const addAPalette = useCallback(() => {
  //   const newPalette = createARandomPalette();
  //   setPalettes((prevPalettes) => {
  //     return [...prevPalettes, newPalette];
  //   });
  // }, [createARandomPalette]);
  // const changeInputHandler = (key, value) => {
  //   console.log(key, value);
  //   if (!selectedPalette) return;
  //   setPalettes((prevPalettes) => {
  //     return prevPalettes.map((aPalette) => {
  //       return aPalette.id === selectedPalette.id
  //         ? {
  //             ...aPalette,
  //             [key]: value,
  //           }
  //         : aPalette;
  //     });
  //   });
  // };
  // const clickPaletteHandler = (id, idx) => {
  //   setSelectedPalette({ id: id, idx: idx });
  // };
  // useEffect(() => {}, []);
  // return (
  //   <>
  //     <button type="button" onPointerDown={addAPalette}>
  //       ADD
  //     </button>
  //     <div className="control">
  //       <PaletteController
  //         chipNum={palettes[selectedPalette.idx].chipNum}
  //         lInflect={palettes[selectedPalette.idx].lInflect}
  //         cMax={palettes[selectedPalette.idx].cMax}
  //         hueFrom={palettes[selectedPalette.idx].hueFrom}
  //         hueTo={palettes[selectedPalette.idx].hueTo}
  //         onChangeInput={changeInputHandler}
  //       ></PaletteController>
  //     </div>
  //     <div>
  //       {palettes.map((aPalette, idx) => (
  //         <Palette
  //           key={aPalette.id}
  //           chipNum={aPalette.chipNum}
  //           lInflect={aPalette.lInflect}
  //           cMax={aPalette.cMax}
  //           hueFrom={aPalette.hueFrom}
  //           hueTo={aPalette.hueTo}
  //           isSelected={aPalette.id === selectedPalette.id}
  //           onClickPalette={() => {
  //             clickPaletteHandler(aPalette.id, idx);
  //           }}
  //         />
  //       ))}
  //     </div>
  //   </>
  // );

  const [sliderValue, setSliderValue] = useState(50);
  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  };

  return (
    <div className="App">
      <h1>Custom Slider</h1>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        flip={true}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        flip={true}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        vertical={true}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        vertical={true}
        flip={true}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
      <Slider
        value={sliderValue}
        min={0}
        max={100}
        step={0.1}
        vertical={true}
        flip={true}
        onChange={handleSliderChange}
      />
      <p>Slider Value: {sliderValue}</p>
    </div>
  );
}

export default App;
