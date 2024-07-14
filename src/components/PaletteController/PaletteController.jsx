import Toggle from '../Toggle/Toggle.jsx';
import Inputnumber from '../Inputnumber/Inputnumber.jsx';
import Slider from '../Slider/Slider.jsx';
import XYSlider from '../XYSlider/XYSlider.jsx';
import { useCallback, useState } from 'react';

const PaletteController = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  onChange,
}) => {
  const [isRange, setRange] = useState(false);

  const updateIsRange = useCallback(
    (newState) => {
      setRange(newState);
      if (!newState) onChange('hueTo', Number(hueFrom));
    },
    [hueFrom, onChange]
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
      <Toggle state={isRange} onChange={updateIsRange} />
      <Inputnumber
        value={chipNum}
        min={2}
        max={100}
        step={1}
        ch={4}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'chipNum');
        }}
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
      <Inputnumber
        value={lInflect}
        min={0}
        max={1}
        step={0.001}
        ch={6}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'lInflect');
        }}
      />
      <Inputnumber
        value={cMax}
        min={0}
        max={0.4}
        step={0.001}
        ch={6}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'cMax');
        }}
      />
      <Slider
        value={hueFrom}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueFrom');
          if (!isRange) handleChangeSlider(sliderProps, 'hueTo');
        }}
        min={0}
        max={360}
        step={0.1}
      />
      <Inputnumber
        value={hueFrom}
        min={0}
        max={360}
        step={0.1}
        ch={6}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'hueFrom');
          if (!isRange) handleChangeSlider(numboxProps, 'hueTo');
        }}
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
      <Inputnumber
        value={hueTo}
        min={0}
        max={360}
        step={0.1}
        ch={6}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'hueTo');
        }}
      />
    </>
  );
};

export default PaletteController;
