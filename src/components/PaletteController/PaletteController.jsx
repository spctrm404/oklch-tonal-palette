import Switch from '../Switch/Switch.jsx';
import NumberBox from '../NumberBox/NumberBox.jsx';
import Slider from '../Slider/Slider.jsx';
import XYSlider from '../XYSlider/XYSlider.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
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
import { useCallback, useContext, useEffect, useState } from 'react';

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
    (value, key) => {
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
  const { updateHue } = useContext(ThemeContext);

  useEffect(() => {
    // updateHue('from', hFrom);
    // updateHue('to', hTo);
  }, [updateHue, hFrom, hTo]);

  return (
    <>
      <Switch state={isRange} onChange={updateIsRange} />
      <NumberBox
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
        trackClickable={false}
        onChange={(sliderProps) => {
          handleChangeXYSlider(sliderProps, 'lInflect', 'cMax');
        }}
      />
      <NumberBox
        value={lInflect}
        min={0}
        max={1}
        step={LIGHTNESS_STEP}
        displayLength={LIGHTNESS_INT_LEN + LIGHTNESS_DECIMAL_LEN + 2}
        onChange={(numboxProps) => {
          handleChangeNumbox(numboxProps, 'lInflect');
        }}
      />
      <NumberBox
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
        ariaLabel="Hue From"
        value={hFrom}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueFrom');
          if (!isRange) handleChangeSlider(sliderProps, 'hueTo');
        }}
        minValue={0}
        maxValue={360}
        // orientation={'vertical'}
        step={HUE_STEP}
      />
      <NumberBox
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
        ariaLabel="Hue To"
        value={hTo}
        onChange={(sliderProps) => {
          handleChangeSlider(sliderProps, 'hueTo');
        }}
        minValue={0}
        maxValue={360}
        step={HUE_STEP}
      />
      <NumberBox
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
