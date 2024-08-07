import {
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import { Label as AriaLabel } from 'react-aria-components';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  CHROMA_LIMIT,
} from './utils/constants.js';
import { closestQuantized } from './utils/numberUtils.js';
import { ThemeContext } from './context/ThemeContext.jsx';
import Switch from './components/Switch/Switch';
import Radio from './components/Radio/Radio';
import RadioGroup from './components/RadioGroup/RadioGroup';
import Slider from './components/Slider/Slider';
import NumberField from './components/NumberField/NumberField';
import XYSlider from './components/XYSlider/XYSlider';
import Button from './components/Button/Button';
import Palette from './components/Palette/Palette';
import './_App.scss';
function App() {
  const { theme, toggleTheme, updateHue, syncHues } = useContext(ThemeContext);

  const initialPaletteProps = useCallback(() => {
    const randomHue = closestQuantized(360 * Math.random(), HUE_STEP);
    return {
      selectedPalete: null,
      swatchStep: 10,
      isHueRanged: false,
      hueFrom: randomHue,
      hueTo: randomHue,
      lightnessInflect: 0.5,
      peakChroma: 0.11,
    };
  }, []);
  const palettePropsReducer = (state, action) => {
    switch (action.type) {
      case 'change_swatch_step': {
        return {
          ...state,
          swatchStep: action.nextVal,
        };
      }
      case 'toggle_hue_ranged': {
        return {
          ...state,
          isHueRanged: !state.isHueRanged,
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
      case 'change_peak_chroma': {
        return {
          ...state,
          peakChroma: action.nextVal,
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

  const [palettes, setPalettes] = useState([]);
  const addNewPalette = useCallback(() => {
    const newPalette = {
      uid: crypto.randomUUID(),
      totalSwatches: Math.floor(100 / paletteProps.swatchStep),
      lightnessInflect: paletteProps.lightnessInflect,
      peakChroma: paletteProps.peakChroma,
      hueFrom: paletteProps.hueFrom,
      hueTo: paletteProps.hueTo,
    };
    setPalettes((prevPalettes) => {
      return [...prevPalettes, newPalette];
    });
  });

  const onChangeSwatchStepHandler = useCallback((newString) => {
    palettePropsDispatch({
      type: 'change_swatch_step',
      nextVal: Number(newString),
    });
  }, []);
  const onChangeHueRangedHandler = useCallback(
    (newBoolean) => {
      palettePropsDispatch({
        type: 'toggle_hue_ranged',
      });
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
      updateHue('from', newNumber);
      if (!paletteProps.isHueRanged) {
        palettePropsDispatch({
          type: 'sync_hue_to',
        });
        syncHues();
      }
    },
    [paletteProps, updateHue, syncHues]
  );
  const onChangeHueToHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_hue_to',
        nextVal: newNumber,
      });
      updateHue('to', newNumber);
    },
    [updateHue]
  );
  const onChangeLightnessAndChromaHandler = useCallback(({ x, y }) => {
    palettePropsDispatch({
      type: 'change_lightness_inflect',
      nextVal: x,
    });
    palettePropsDispatch({
      type: 'change_peak_chroma',
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
      type: 'change_peak_chroma',
      nextVal: newNumber,
    });
  }, []);
  const onPressCreateHandler = useCallback(() => {
    addNewPalette();
  }, [addNewPalette]);

  useLayoutEffect(() => {
    updateHue('from', paletteProps.hueFrom);
    syncHues();
  }, []);

  const swatchStepTitleId = useId();
  const huesTitleId = useId();
  const lAndCTitleId = useId();

  console.log(palettes);

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
        <h3 className={'section-title'} id={swatchStepTitleId}>
          Swatch Step
        </h3>
        <RadioGroup
          aria-labelledby={swatchStepTitleId}
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
        <h3 className={'section-title hues__title'} id={huesTitleId}>
          Hue
        </h3>
        <Switch
          aria-labelledby={huesTitleId}
          className="hues__range"
          isSelected={paletteProps.isHueRanged}
          onChange={onChangeHueRangedHandler}
        />
        <Slider
          aria-labelledby={huesTitleId}
          className="hues__slider hues__slider--control-from"
          value={paletteProps.hueFrom}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueFromHandler}
          onChangeEnd={onChangeHueFromHandler}
        />
        <Slider
          aria-labelledby={huesTitleId}
          className="hues__slider hues__slider--control-to"
          isDisabled={!paletteProps.isHueRanged}
          value={paletteProps.hueTo}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueToHandler}
          onChangeEnd={onChangeHueToHandler}
        />
        <NumberField
          aria-labelledby={huesTitleId}
          className="hues__number-field hues__number-field--control-from"
          value={paletteProps.hueFrom}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueFromHandler}
          onChangeEnd={onChangeHueFromHandler}
        />
        <NumberField
          aria-labelledby={huesTitleId}
          className="hues__number-field hues__number-field--control-to"
          isDisabled={!paletteProps.isHueRanged}
          value={paletteProps.hueTo}
          minValue={0}
          maxValue={360}
          step={HUE_STEP}
          onChange={onChangeHueToHandler}
          onChangeEnd={onChangeHueToHandler}
        />
      </div>
      <div className="l-c">
        <h3 className={'section-title l-c__title'} id={lAndCTitleId}>
          Lightness & Chroma
        </h3>
        <XYSlider
          aria-labelledby={lAndCTitleId}
          className="l-c__xy"
          minValue={{ x: 0, y: 0 }}
          maxValue={{ x: 1, y: CHROMA_LIMIT }}
          step={{ x: LIGHTNESS_STEP, y: CHROMA_STEP }}
          value={{
            x: paletteProps.lightnessInflect,
            y: paletteProps.peakChroma,
          }}
          onChangeEnd={onChangeLightnessAndChromaHandler}
          onChange={onChangeLightnessAndChromaHandler}
        />
        <NumberField
          aria-labelledby={lAndCTitleId}
          className="l-c__number-field l-c__number-field--control-x"
          value={paletteProps.lightnessInflect}
          minValue={0}
          maxValue={1}
          step={LIGHTNESS_STEP}
          onChange={onChangeLightnessHandler}
          onChangeEnd={onChangeLightnessHandler}
        />
        <NumberField
          aria-labelledby={lAndCTitleId}
          className="l-c__number-field l-c__number-field--control-y"
          value={paletteProps.peakChroma}
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
          onPress={onPressCreateHandler}
          isDisabled={paletteProps.selectedPalete}
        />
      </div>
      {palettes.length > 0 && (
        <div className="palettes">
          {palettes.map((aPalette) => {
            return (
              <Palette
                key={aPalette.uid}
                uid={aPalette.uid}
                totalSwatches={aPalette.totalSwatches}
                lightnessInflect={aPalette.lightnessInflect}
                peakChroma={aPalette.peakChroma}
                hueFrom={aPalette.hueFrom}
                hueTo={aPalette.hueTo}
                isSelected={false}
                onClickPalette={() => {}}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
