import Toggle from '../Toggle/Toggle.jsx';
import Inputnumber from '../Inputnumber/Inputnumber.jsx';
import Slider from '../Slider/Slider.jsx';
import XYSlider from '../XYSlider/XYSlider.jsx';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  LIGHTNESS_INT_LEN,
  CHROMA_INT_LEN,
  HUE_INT_LEN,
  LIGHTNESS_DECIMAL_LEN,
  CHROMA_DECIMAL_LEN,
  HUE_DECIMAL_LEN,
  CHROMA_MAX,
} from '../../utils/constants';
import { useCallback, useState } from 'react';

const PaletteController = ({
  totalChips,
  lInflect,
  cMax,
  hFrom,
  hTo,
  onChange,
}) => {
  const [isRange, setRange] = useState(false);

  const updateIsRange = useCallback(
    (newState) => {
      setRange(newState);
      if (!newState) onChange('hueTo', Number(hFrom));
    },
    [hFrom, onChange]
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
        value={totalChips}
        min={2}
        max={100}
        step={1}
        displayLength={3 + 1}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'chipNum');
        }}
      />
      <XYSlider
        value={{ x: lInflect, y: cMax }}
        min={{ x: 0, y: 0 }}
        max={{ x: 1, y: CHROMA_MAX }}
        step={{ x: LIGHTNESS_STEP, y: CHROMA_STEP }}
        trackClickable={true}
        onChange={(sliderProps) => {
          handleChangeXYSlider(sliderProps, 'lInflect', 'cMax');
        }}
      />
      <Inputnumber
        value={lInflect}
        min={0}
        max={1}
        step={LIGHTNESS_STEP}
        displayLength={LIGHTNESS_INT_LEN + LIGHTNESS_DECIMAL_LEN + 2}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'lInflect');
        }}
      />
      <Inputnumber
        value={cMax}
        min={0}
        max={CHROMA_MAX}
        step={CHROMA_STEP}
        displayLength={CHROMA_INT_LEN + CHROMA_DECIMAL_LEN + 2}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'cMax');
        }}
      />
      <Slider
        value={hFrom}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueFrom');
          if (!isRange) handleChangeSlider(sliderProps, 'hueTo');
        }}
        min={0}
        max={360}
        step={HUE_STEP}
      />
      <Inputnumber
        value={hFrom}
        min={0}
        max={360}
        step={HUE_STEP}
        displayLength={HUE_INT_LEN + HUE_DECIMAL_LEN + 2}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'hueFrom');
          if (!isRange) handleChangeSlider(numboxProps, 'hueTo');
        }}
      />
      <Slider
        value={hTo}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueTo');
        }}
        min={0}
        max={360}
        step={HUE_STEP}
      />
      <Inputnumber
        value={hTo}
        min={0}
        max={360}
        step={HUE_STEP}
        displayLength={HUE_INT_LEN + HUE_DECIMAL_LEN + 2}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'hueTo');
        }}
      />
    </>
  );
};

export default PaletteController;
