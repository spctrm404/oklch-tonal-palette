import Button from '../Button/Button.jsx';
import Slider from '../Slider/Slider.jsx';
import XYSlider from '../XYSlider/XYSlider.jsx';
import { useCallback, useState } from 'react';

const PaletteController = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  onChangeInput,
}) => {
  const [isRange, setRange] = useState(false);

  const onChangeSliderHandler = useCallback(
    (value, min, max, key) => {
      onChangeInput(key, Number(value));
    },
    [onChangeInput]
  );

  const onChangeNumberHandler = useCallback(
    (e, key) => {
      const minValue = Number(e.target.min);
      const maxValue = Number(e.target.max);
      const value = Number(e.target.value);
      onChangeInput(key, Math.min(Math.max(minValue, value), maxValue));
    },
    [onChangeInput]
  );

  const onChangeXYSliderHandler = useCallback(
    (value, min, max) => {
      onChangeInput('lInflect', Math.min(Math.max(min.x, value.x), max.x));
      onChangeInput('cMax', Math.min(Math.max(min.y, value.y), max.y));
    },
    [onChangeInput]
  );

  return (
    <>
      <input
        value={chipNum}
        onChange={(e) => {
          onChangeNumberHandler(e, 'chipNum');
        }}
        min={2}
        max={100}
        step={1}
        type="number"
      />
      <XYSlider
        value={{ x: lInflect, y: cMax }}
        min={{ x: 0, y: 0 }}
        max={{ x: 1, y: 0.4 }}
        step={{ x: 0.001, y: 0.001 }}
        trackClickable={false}
        onChange={onChangeXYSliderHandler}
      />
      <input
        value={lInflect}
        onChange={(e) => {
          onChangeNumberHandler(e, 'lInflect');
        }}
        min={0}
        max={1}
        step={0.001}
        type="number"
      />
      <input
        value={cMax}
        onChange={(e) => {
          onChangeNumberHandler(e, 'cMax');
        }}
        min={0}
        max={0.4}
        step={0.001}
        type="number"
      />
      <Button label="Range"></Button>
      <Slider
        value={hueFrom}
        onChange={(value, min, max) => {
          onChangeSliderHandler(value, min, max, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
      />
      <Slider
        value={hueTo}
        onChange={(value, min, max) => {
          onChangeSliderHandler(value, min, max, 'hueTo');
        }}
        min={0}
        max={360}
        step={0.1}
      />
      <input
        value={hueFrom}
        onChange={(e) => {
          onChangeNumberHandler(e, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
        type="number"
      />
      <input
        value={hueTo}
        onChange={(e) => {
          onChangeNumberHandler(e, 'hueTo');
        }}
        min={0}
        max={360}
        step={0.1}
        type="number"
      />
    </>
  );
};

export default PaletteController;
