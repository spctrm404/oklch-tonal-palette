import { useCallback, useContext, useReducer, useState } from 'react';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  CHROMA_LIMIT,
} from './utils/constants.js';
import { ThemeContext } from './context/ThemeContext.jsx';
import Switch from './components/Switch/Switch';
import Radio from './components/Radio/Radio';
import RadioGroup from './components/RadioGroup/RadioGroup';
import Slider from './components/Slider/Slider';
import NumberField from './components/NumberField/NumberField';
import XYSlider from './components/XYSlider/XYSlider';
import Button from './components/Button/Button';
import './_App.scss';
function App() {
  const { theme, toggleTheme, updateHues, syncHues } = useContext(ThemeContext);

  const initialPaletteProps = () => {
    const randomHue = 360 * Math.random();
    return {
      swatchStep: 10,
      hueFrom: randomHue,
      hueTo: randomHue,
      lightnessInflect: 0.5,
      chromaPeak: 0.11,
    };
  };
  const palettePropsReducer = (state, action) => {
    switch (action.type) {
      case 'change_swatch_step': {
        return {
          ...state,
          swatchStep: action.nextVal,
        };
      }
      case 'change_hue_from': {
        return {
          ...state,
          hueFrom: action.nextVal,
        };
      }
      case 'change_hue_to': {
        return {
          ...state,
          hueTo: action.nextVal,
        };
      }
      case 'sync_hue_to': {
        return {
          ...state,
          hueTo: state.hueFrom,
        };
      }
      case 'change_lightness_inflect': {
        return {
          ...state,
          lightnessInflect: action.nextVal,
        };
      }
      case 'change_chroma_peak': {
        return {
          ...state,
          chromaPeak: action.nextVal,
        };
      }
    }
    throw Error('Unknown action: ' + action.type);
  };
  const [paletteProps, palettePropsDispatch] = useReducer(
    palettePropsReducer,
    null,
    initialPaletteProps
  );
  const [isHueRanged, setHueRange] = useState(false);

  const onChangeSwatchStepHandler = useCallback((newString) => {
    palettePropsDispatch({
      type: 'change_swatch_step',
      nextVal: Number(newString),
    });
  }, []);
  const onChangeHueRangedHandler = useCallback(
    (newBoolean) => {
      setHueRange(newBoolean);
      if (!newBoolean) {
        palettePropsDispatch({
          type: 'sync_hue_to',
        });
        syncHues();
      }
    },
    [syncHues]
  );
  const onChangeHueFromHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_hue_from',
        nextVal: newNumber,
      });
      updateHues('from', newNumber);
      if (!isHueRanged) {
        palettePropsDispatch({
          type: 'sync_hue_to',
        });
        syncHues();
      }
    },
    [isHueRanged, updateHues, syncHues]
  );
  const onChangeHueToHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_hue_to',
        nextVal: newNumber,
      });
      updateHues('to', newNumber);
    },
    [updateHues]
  );
  const onChangeLightnessAndChromaHandler = useCallback(({ x, y }) => {
    palettePropsDispatch({
      type: 'change_lightness_inflect',
      nextVal: x,
    });
    palettePropsDispatch({
      type: 'change_chroma_peak',
      nextVal: y,
    });
  }, []);
  const onChangeLightnessHandler = useCallback((newNumber) => {
    palettePropsDispatch({
      type: 'change_lightness_inflect',
      nextVal: newNumber,
    });
  }, []);
  const onChangeChromaHandler = useCallback((newNumber) => {
    palettePropsDispatch({
      type: 'change_chroma_peak',
      nextVal: newNumber,
    });
  }, []);

  return (
    <>
      <div className="theme">
        <Switch
          materialIcon="dark_mode"
          materialIconAlt="light_mode"
          isSelected={theme === 'light'}
          onChange={toggleTheme}
        />
      </div>
      <div className="swatch-step">
        <RadioGroup
          value={paletteProps.swatchStep.toString()}
          orientation="horizontal"
          onChange={onChangeSwatchStepHandler}
        >
          <Radio text="10" value="10" />
          <Radio text="5" value="5" />
          <Radio text="2" value="2" />
          <Radio text="1" value="1" />
        </RadioGroup>
      </div>
      <div className="hues">
        <Switch
          className="hues__range"
          isSelected={isHueRanged}
          onChange={onChangeHueRangedHandler}
        />
        <Slider
          className="hues__slider hues__slider--control-from"
          value={paletteProps.hueFrom}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueFromHandler}
          onChangeEnd={onChangeHueFromHandler}
        />
        <Slider
          className="hues__slider hues__slider--control-to"
          isDisabled={!isHueRanged}
          value={paletteProps.hueTo}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueToHandler}
          onChangeEnd={onChangeHueToHandler}
        />
        <NumberField
          className="hues__number-field hues__number-field--control-from"
          value={paletteProps.hueFrom}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueFromHandler}
          onChangeEnd={onChangeHueFromHandler}
        />
        <NumberField
          className="hues__number-field hues__number-field--control-to"
          isDisabled={!isHueRanged}
          value={paletteProps.hueTo}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueToHandler}
          onChangeEnd={onChangeHueToHandler}
        />
      </div>
      <div className="l-c">
        <XYSlider
          className="l-c__xy"
          minValue={{ x: 0, y: 0 }}
          maxValue={{ x: 1, y: CHROMA_LIMIT }}
          step={{ x: LIGHTNESS_STEP, y: CHROMA_STEP }}
          value={{
            x: paletteProps.lightnessInflect,
            y: paletteProps.chromaPeak,
          }}
          onChangeEnd={onChangeLightnessAndChromaHandler}
          onChange={onChangeLightnessAndChromaHandler}
        />
        <NumberField
          className="l-c__number-field l-c__number-field--control-x"
          value={paletteProps.lightnessInflect}
          minValue={0}
          maxValue={1}
          step={LIGHTNESS_STEP}
          onChange={onChangeLightnessHandler}
          onChangeEnd={onChangeLightnessHandler}
        />
        <NumberField
          className="l-c__number-field l-c__number-field--control-y"
          value={paletteProps.chromaPeak}
          minValue={0}
          maxValue={CHROMA_LIMIT}
          step={CHROMA_STEP}
          onChange={onChangeChromaHandler}
          onChangeEnd={onChangeChromaHandler}
        />
      </div>
      <div className="create">
        <Button
          buttontype="filled"
          materialIcon="add"
          text="create a palette"
        />
      </div>
    </>
  );
}

export default App;
