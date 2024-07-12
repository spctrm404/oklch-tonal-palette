import Numbox from '../Numbox/Numbox.jsx';
import Slider from '../Slider/Slider.jsx';
import XYSlider from '../XYSlider/XYSlider.jsx';
import { useCallback, useState } from 'react';
import { clamp } from '../../utils/numberUtils';

const PaletteController = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  onChange,
}) => {
  const [isRange, setRange] = useState(false);

  const onChangeNumberHandler = useCallback(
    (e, key) => {
      const minValue = Number(e.target.min);
      const maxValue = Number(e.target.max);
      const value = Number(e.target.value);
      onChange(key, clamp(value, minValue, maxValue));
    },
    [onChange]
  );

  const handleChangeNumbox = useCallback(
    ({ value }, key) => {
      onChange(key, Number(value));
    },
    [onChange]
  );

  const handleChangeSlider = useCallback(
    ({ value }, key) => {
      onChange(key, Number(value));
    },
    [onChange]
  );

  const handleChangeXYSlider = useCallback(
    ({ value }, keyX, keyY) => {
      onChange(keyX, Number(value.x));
      onChange(keyY, Number(value.y));
    },
    [onChange]
  );

  return (
    <>
      <Numbox
        value={chipNum}
        min={2}
        max={100}
        step={1}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'chipNum');
        }}
      />
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
        onChange={(sliderProps) => {
          handleChangeXYSlider(sliderProps, 'lInflect', 'cMax');
        }}
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
      <Slider
        value={hueFrom}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
      />
      <Slider
        value={hueTo}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueTo');
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
