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
import Select from './components/Select/Select';
import Slider from './components/Slider/Slider';
import NumberField from './components/NumberField/NumberField';
import XYSlider from './components/XYSlider/XYSlider';
import Button from './components/Button/Button';
import Palette from './components/Palette/Palette';
import './_App.scss';
import st from './_App.module.scss';
import classNames from 'classnames/bind';
import IconButton from './components/IconButton/IconButton.jsx';
import ToggleButton from './components/ToggleButton/ToggleButton.jsx';

const cx = classNames.bind(st);

function App() {
  const { theme, toggleTheme, updateHue, syncHues } = useContext(ThemeContext);

  const initialPaletteProps = useCallback(() => {
    const randomHue = closestQuantized(360 * Math.random(), HUE_STEP);
    return {
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
      case 'import_palette': {
        return {
          ...state,
          swatchStep: action.swatchStep,
          hueFrom: action.hueFrom,
          hueTo: action.hueTo,
          lightnessInflect: action.lightnessInflect,
          peakChroma: action.peakChroma,
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

  const initialPalette = useCallback(() => {
    return {
      uid: crypto.randomUUID(),
      swatchStep: paletteProps.swatchStep,
      lightnessInflect: paletteProps.lightnessInflect,
      peakChroma: paletteProps.peakChroma,
      hueFrom: paletteProps.hueFrom,
      hueTo: paletteProps.hueTo,
    };
  }, [paletteProps]);

  const [palettes, setPalettes] = useState([initialPalette()]);

  const addNewPalette = useCallback(() => {
    const newPalette = {
      uid: crypto.randomUUID(),
      swatchStep: paletteProps.swatchStep,
      lightnessInflect: paletteProps.lightnessInflect,
      peakChroma: paletteProps.peakChroma,
      hueFrom: paletteProps.hueFrom,
      hueTo: paletteProps.hueTo,
    };
    setPalettes((prevPalettes) => {
      return [...prevPalettes, newPalette];
    });
  }, [paletteProps]);

  const [selectedPaletteUid, setSelectedPaletteUid] = useState(palettes[0].uid);

  const getSelectedPalette = useCallback(
    (uid) => {
      return palettes.find((aPalette) => {
        return aPalette.uid === uid;
      });
    },
    [palettes]
  );

  const selectedPalette = useCallback(() => {
    return palettes.find((aPalette) => {
      return aPalette.uid === selectedPaletteUid;
    });
  }, [palettes, selectedPaletteUid]);
  const changeSelectedPalette = useCallback(
    (key, value) => {
      setPalettes((prevPalettes) => {
        return prevPalettes.map((aPrevPalettes) => {
          if (aPrevPalettes.uid === selectedPaletteUid)
            return {
              ...aPrevPalettes,
              [key]: value,
            };
          return { ...aPrevPalettes };
        });
      });
    },
    [selectedPaletteUid]
  );

  const onChangeSwatchStepHandler = useCallback(
    (newString) => {
      palettePropsDispatch({
        type: 'change_swatch_step',
        nextVal: Number(newString),
      });
      changeSelectedPalette('swatchStep', Number(newString));
    },
    [changeSelectedPalette]
  );
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
        changeSelectedPalette('hueTo', paletteProps.hueFrom);
      }
    },
    [paletteProps, changeSelectedPalette, syncHues]
  );
  const onChangeHueFromHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_hue_from',
        nextVal: newNumber,
      });
      updateHue('from', newNumber);
      changeSelectedPalette('hueFrom', newNumber);
      if (!paletteProps.isHueRanged) {
        palettePropsDispatch({
          type: 'sync_hue_to',
        });
        updateHue('to', newNumber);
        changeSelectedPalette('hueTo', newNumber);
      }
    },
    [paletteProps, changeSelectedPalette, updateHue]
  );
  const onChangeHueToHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_hue_to',
        nextVal: newNumber,
      });
      updateHue('to', newNumber);
      changeSelectedPalette('hueTo', newNumber);
    },
    [changeSelectedPalette, updateHue]
  );
  const onChangeLightnessAndChromaHandler = useCallback(
    ({ x, y }) => {
      palettePropsDispatch({
        type: 'change_lightness_inflect',
        nextVal: x,
      });
      palettePropsDispatch({
        type: 'change_peak_chroma',
        nextVal: y,
      });
      changeSelectedPalette('lightnessInflect', x);
      changeSelectedPalette('peakChroma', y);
    },
    [changeSelectedPalette]
  );
  const onChangeLightnessHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_lightness_inflect',
        nextVal: newNumber,
      });
      changeSelectedPalette('lightnessInflect', newNumber);
    },
    [changeSelectedPalette]
  );
  const onChangeChromaHandler = useCallback(
    (newNumber) => {
      palettePropsDispatch({
        type: 'change_peak_chroma',
        nextVal: newNumber,
      });
      changeSelectedPalette('peakChroma', newNumber);
    },
    [changeSelectedPalette]
  );
  const onPressCreateHandler = useCallback(() => {
    addNewPalette();
  }, [addNewPalette]);
  const onPressPaletteHandler = useCallback(
    (newUid) => {
      setSelectedPaletteUid(newUid);
      const selectedPalette = getSelectedPalette(newUid);
      palettePropsDispatch({
        type: 'import_palette',
        swatchStep: selectedPalette.swatchStep,
        hueFrom: selectedPalette.hueFrom,
        hueTo: selectedPalette.hueTo,
        lightnessInflect: selectedPalette.lightnessInflect,
        peakChroma: selectedPalette.peakChroma,
      });
      updateHue('from', selectedPalette.hueFrom);
      updateHue('to', selectedPalette.hueTo);
    },
    [getSelectedPalette, updateHue]
  );

  useLayoutEffect(() => {
    updateHue('from', paletteProps.hueFrom);
    updateHue('to', paletteProps.hueTo);
  }, []);

  const swatchStepTitleId = useId();
  const huesTitleId = useId();
  const lAndCTitleId = useId();

  const swatchStepItems = [
    {
      uid: crypto.randomUUID(),
      text: 10,
    },
    {
      uid: crypto.randomUUID(),
      text: 5,
    },
    {
      uid: crypto.randomUUID(),
      text: 2,
    },
    {
      uid: crypto.randomUUID(),
      text: 1,
    },
  ];

  // return (
  //   <>
  //     <div className="theme">
  //       <Switch
  //         materialIcon="dark_mode"
  //         materialIconAlt="light_mode"
  //         isSelected={theme === 'light'}
  //         onChange={toggleTheme}
  //       />
  //     </div>
  //     {/* <div className="test">
  //       <Select items={swatchStepItems} />
  //     </div> */}
  //     <div className="swatch-step">
  //       <h3 className={'section-title'} id={swatchStepTitleId}>
  //         Swatch Step
  //       </h3>
  //       <RadioGroup
  //         aria-labelledby={swatchStepTitleId}
  //         value={paletteProps.swatchStep.toString()}
  //         orientation="horizontal"
  //         onChange={onChangeSwatchStepHandler}
  //       >
  //         <Radio text="10" value="10" />
  //         <Radio text="5" value="5" />
  //         <Radio text="2" value="2" />
  //         <Radio text="1" value="1" />
  //       </RadioGroup>
  //     </div>
  //     <div className="hues">
  //       <h3 className={'section-title hues__title'} id={huesTitleId}>
  //         Hue
  //       </h3>
  //       <Switch
  //         aria-labelledby={huesTitleId}
  //         className="hues__range"
  //         isSelected={paletteProps.isHueRanged}
  //         onChange={onChangeHueRangedHandler}
  //       />
  //       <Slider
  //         aria-labelledby={huesTitleId}
  //         className="hues__slider hues__slider--control-from"
  //         value={paletteProps.hueFrom}
  //         minValue={0}
  //         maxValue={360}
  //         step={HUE_STEP}
  //         onChange={onChangeHueFromHandler}
  //         onChangeEnd={onChangeHueFromHandler}
  //       />
  //       <Slider
  //         aria-labelledby={huesTitleId}
  //         className="hues__slider hues__slider--control-to"
  //         isDisabled={!paletteProps.isHueRanged}
  //         value={paletteProps.hueTo}
  //         minValue={0}
  //         maxValue={360}
  //         step={HUE_STEP}
  //         onChange={onChangeHueToHandler}
  //         onChangeEnd={onChangeHueToHandler}
  //       />
  //       <div className="hues__number-fields">
  //         <NumberField
  //           aria-labelledby={huesTitleId}
  //           className="hues__number-field hues__number-field--control-from"
  //           value={paletteProps.hueFrom}
  //           minValue={0}
  //           maxValue={360}
  //           step={HUE_STEP}
  //           onChange={onChangeHueFromHandler}
  //           onChangeEnd={onChangeHueFromHandler}
  //         />
  //         <NumberField
  //           aria-labelledby={huesTitleId}
  //           className="hues__number-field hues__number-field--control-to"
  //           isDisabled={!paletteProps.isHueRanged}
  //           value={paletteProps.hueTo}
  //           minValue={0}
  //           maxValue={360}
  //           step={HUE_STEP}
  //           onChange={onChangeHueToHandler}
  //           onChangeEnd={onChangeHueToHandler}
  //         />
  //       </div>
  //     </div>
  //     <div className="l-c">
  //       <h3 className={'section-title l-c__title'} id={lAndCTitleId}>
  //         Lightness & Chroma
  //       </h3>
  //       <XYSlider
  //         aria-labelledby={lAndCTitleId}
  //         className="l-c__xy"
  //         minValue={{ x: 0, y: 0 }}
  //         maxValue={{ x: 1, y: CHROMA_LIMIT }}
  //         step={{ x: LIGHTNESS_STEP, y: CHROMA_STEP }}
  //         value={{
  //           x: paletteProps.lightnessInflect,
  //           y: paletteProps.peakChroma,
  //         }}
  //         onChangeEnd={onChangeLightnessAndChromaHandler}
  //         onChange={onChangeLightnessAndChromaHandler}
  //       />
  //       <div className="l-c__number-fields">
  //         <NumberField
  //           aria-labelledby={lAndCTitleId}
  //           className="l-c__number-field l-c__number-field--control-x"
  //           value={paletteProps.lightnessInflect}
  //           minValue={0}
  //           maxValue={1}
  //           step={LIGHTNESS_STEP}
  //           onChange={onChangeLightnessHandler}
  //           onChangeEnd={onChangeLightnessHandler}
  //         />
  //         <NumberField
  //           aria-labelledby={lAndCTitleId}
  //           className="l-c__number-field l-c__number-field--control-y"
  //           value={paletteProps.peakChroma}
  //           minValue={0}
  //           maxValue={CHROMA_LIMIT}
  //           step={CHROMA_STEP}
  //           onChange={onChangeChromaHandler}
  //           onChangeEnd={onChangeChromaHandler}
  //         />
  //       </div>
  //     </div>
  //     <div className="create">
  //       <Button
  //         buttontype="filled"
  //         materialIcon="add"
  //         text="create a palette"
  //         onPress={onPressCreateHandler}
  //         isDisabled={paletteProps.selectedPalete}
  //       />
  //     </div>
  //     {palettes.length > 0 && (
  //       <div className="palettes">
  //         {palettes.map((aPalette) => {
  //           return (
  //             <Palette
  //               className="palette"
  //               key={aPalette.uid}
  //               uid={aPalette.uid}
  //               swatchStep={aPalette.swatchStep}
  //               lightnessInflect={aPalette.lightnessInflect}
  //               peakChroma={aPalette.peakChroma}
  //               hueFrom={aPalette.hueFrom}
  //               hueTo={aPalette.hueTo}
  //               isSelected={aPalette.uid === selectedPaletteUid}
  //               onPress={onPressPaletteHandler}
  //             />
  //           );
  //         })}
  //       </div>
  //     )}
  //   </>
  // );

  const [isDrawerOpened, setDrawerOpened] = useState(false);

  return (
    <>
      <div className={cx('grid')}>
        <div
          className={cx('drawer')}
          {...(isDrawerOpened && { 'data-opened': 'true' })}
        >
          <div className={cx('drawer__button')}>
            <ToggleButton
              buttontype="standard"
              materialIconA="tune"
              materialIconB="close"
              isSelected={isDrawerOpened}
              onChange={() => {
                setDrawerOpened(!isDrawerOpened);
              }}
            />
          </div>
          <div className={cx('drawer__scrollable')}>
            <div className={cx('controller')}></div>
          </div>
        </div>
        <div className={cx('main')}>
          <div className={cx('main__button')}>
            <Switch
              materialIcon="dark_mode"
              materialIconAlt="light_mode"
              isSelected={theme === 'light'}
              onChange={toggleTheme}
            />
          </div>
          <div className={cx('main__scrollable')}>
            <div className={cx('palettes')}>
              <div className={cx('palette')}>
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
              </div>
              <div className={cx('palette')}>
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
                <div className={cx('swatch')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
