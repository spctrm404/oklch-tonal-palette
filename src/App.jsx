import {
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  CHROMA_LIMIT,
} from './utils/constants.js';
import { closestQuantized } from './utils/numberUtils.js';
import { ThemeContext } from './context/ThemeContext.jsx';
import {
  exportCssOklch,
  exportCssRgb,
  exportCssHex,
  exportFigmaHex,
} from './utils/export.js';
import Switch from './components/Switch/Switch';
import ToggleButton from './components/ToggleButton/ToggleButton.jsx';
import RadioGroup from './components/RadioGroup/RadioGroup';
import Slider from './components/Slider/Slider';
import NumberField from './components/NumberField/NumberField';
import XYSlider from './components/XYSlider/XYSlider';
import GamutGraph from './components/GamutGraph/GamutGraph.jsx';
import Button from './components/Button/Button';
import Palette from './components/Palette/Palette';
import './_App.scss';
import st from './_App.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

function App() {
  const { theme, toggleTheme, updateHues, syncHues } = useContext(ThemeContext);

  const initialPaletteControl = () => {
    const randomHue = closestQuantized(360 * Math.random(), HUE_STEP);
    return {
      swatchStep: 10,
      lightnessInflect: 0.5,
      peakChroma: 0.11,
      hueFrom: randomHue,
      hueTo: randomHue,
    };
  };
  const [paletteControl, setPaletteControl] = useState(initialPaletteControl());

  const [isHueRanged, setHueRanged] = useState(false);

  const initialPalette = () => {
    return { ...paletteControl, ['uid']: crypto.randomUUID() };
  };
  const [palettes, setPalettes] = useState([initialPalette()]);
  const addANewPalette = useCallback(() => {
    const aNewPalette = { ...paletteControl, ['uid']: crypto.randomUUID() };
    setPalettes((prevPalettes) => {
      return [...prevPalettes, aNewPalette];
    });
  }, [paletteControl]);

  const [selectedPaletteUid, setSelectedPaletteUid] = useState(palettes[0].uid);
  const selectedPalette = useCallback(() => {
    return palettes.find((aPalette) => {
      return aPalette.uid === selectedPaletteUid;
    });
  }, [palettes, selectedPaletteUid]);
  const getSelectedPalette = useCallback(
    (uid) => {
      return palettes.find((aPalette) => {
        return aPalette.uid === uid;
      });
    },
    [palettes]
  );

  const updateSelectedPalette = useCallback(
    (newProps) => {
      setPalettes((prevPalettes) => {
        return prevPalettes.map((aPrevPalettes) => {
          if (aPrevPalettes.uid === selectedPaletteUid)
            return {
              ...aPrevPalettes,
              ...newProps,
              ['uid']: aPrevPalettes.uid,
            };
          return { ...aPrevPalettes };
        });
      });
    },
    [selectedPaletteUid]
  );
  const updatePaletteControl = useCallback(
    (newProps, gate = true) => {
      setPaletteControl((prevPaletteControl) => {
        return { ...prevPaletteControl, ...newProps };
      });
      if (gate) updateSelectedPalette(newProps);
    },
    [updateSelectedPalette]
  );

  const [isDrawerOpened, setDrawerOpened] = useState(false);

  const controllerRef = useRef(null);

  const onChangeDrawerButtonHandler = useCallback(() => {
    setDrawerOpened((prevState) => {
      return !prevState;
    });
  }, []);
  const onChangeSwatchStepHandler = useCallback(
    (newString) => {
      updatePaletteControl({ swatchStep: Number(newString) });
    },
    [updatePaletteControl]
  );
  const onChangeHueRangedHandler = useCallback(
    (newBoolean) => {
      setHueRanged(newBoolean);
      if (!newBoolean) {
        updatePaletteControl({ hueTo: paletteControl.hueFrom });
        syncHues();
      }
    },
    [paletteControl, updatePaletteControl, syncHues]
  );
  const onChangeHueFromHandler = useCallback(
    (newNumber) => {
      updatePaletteControl(
        isHueRanged
          ? { hueFrom: newNumber }
          : { hueFrom: newNumber, hueTo: newNumber }
      );
      updateHues(
        isHueRanged ? { from: newNumber } : { from: newNumber, to: newNumber }
      );
    },
    [isHueRanged, updatePaletteControl, updateHues]
  );
  const onChangeHueToHandler = useCallback(
    (newNumber) => {
      updatePaletteControl({ hueTo: newNumber });
      updateHues({ to: newNumber });
    },
    [updatePaletteControl, updateHues]
  );
  const onChangeLightnessAndChromaHandler = useCallback(
    ({ x, y }) => {
      updatePaletteControl({
        lightnessInflect: x,
        peakChroma: y,
      });
    },
    [updatePaletteControl]
  );
  const onChangeLightnessHandler = useCallback(
    (newNumber) => {
      updatePaletteControl({
        lightnessInflect: newNumber,
      });
    },
    [updatePaletteControl]
  );
  const onChangeChromaHandler = useCallback(
    (newNumber) => {
      updatePaletteControl({
        peakChroma: newNumber,
      });
    },
    [updatePaletteControl]
  );
  const onPressCreateHandler = useCallback(() => {
    addANewPalette();
  }, [addANewPalette]);
  const onPressPaletteHandler = useCallback(
    (newUid) => {
      setSelectedPaletteUid(newUid);
      const selectedPalette = getSelectedPalette(newUid);
      updatePaletteControl(selectedPalette, false);
      updateHues({ from: selectedPalette.hueFrom, to: selectedPalette.hueTo });
    },
    [getSelectedPalette, updatePaletteControl, updateHues]
  );

  const swatchStepTitleId = useId();
  const huesTitleId = useId();
  const lAndCTitleId = useId();

  const swatchStepItemsRef = useRef([
    { uid: crypto.randomUUID(), text: '10', value: '10' },
    { uid: crypto.randomUUID(), text: '5', value: '5' },
    { uid: crypto.randomUUID(), text: '2', value: '2' },
    { uid: crypto.randomUUID(), text: '1', value: '1' },
  ]);

  useLayoutEffect(() => {
    updateHues({ from: paletteControl.hueFrom, to: paletteControl.hueTo });
  }, []);

  return (
    <>
      <div className={cx('grid')}>
        <div
          className={cx('drawer')}
          data-theme={theme}
          {...(isDrawerOpened && { 'data-opened': 'true' })}
        >
          <div className={cx('drawer__button')}>
            <ToggleButton
              buttontype="standard"
              materialIconA="tune"
              materialIconB="left_panel_close"
              isSelected={isDrawerOpened}
              onChange={onChangeDrawerButtonHandler}
            />
          </div>
          <div className={cx('drawer__scrollable')}>
            <div className={cx('controller')} ref={controllerRef}>
              <div
                className={cx(
                  'controller__section',
                  'controller__section--area-swatch-step'
                )}
              >
                <h3
                  className={cx('controller__section__title')}
                  id={swatchStepTitleId}
                >
                  Swatch Step
                </h3>
                <RadioGroup
                  aria-labelledby={swatchStepTitleId}
                  items={swatchStepItemsRef.current}
                  value={paletteControl.swatchStep.toString()}
                  orientation="horizontal"
                  onChange={onChangeSwatchStepHandler}
                ></RadioGroup>
              </div>
              <div
                className={cx(
                  'controller__section',
                  'controller__section--area-hues'
                )}
              >
                <h3
                  className={cx('controller__section__title')}
                  id={huesTitleId}
                >
                  Hue
                </h3>
                <Switch
                  aria-labelledby={huesTitleId}
                  className={cx('controller__is-ranged')}
                  isSelected={isHueRanged}
                  onChange={onChangeHueRangedHandler}
                />
                <Slider
                  aria-labelledby={huesTitleId}
                  className={cx('controller__slider-hue-from')}
                  value={paletteControl.hueFrom}
                  minValue={0}
                  maxValue={360}
                  step={HUE_STEP}
                  onChange={onChangeHueFromHandler}
                  onChangeEnd={onChangeHueFromHandler}
                />
                <Slider
                  aria-labelledby={huesTitleId}
                  className={cx('controller__slider-hue-to')}
                  isDisabled={!isHueRanged}
                  value={paletteControl.hueTo}
                  minValue={0}
                  maxValue={360}
                  step={HUE_STEP}
                  onChange={onChangeHueToHandler}
                  onChangeEnd={onChangeHueToHandler}
                />
                <div className={cx('controller__number-fields-hues')}>
                  <NumberField
                    aria-labelledby={huesTitleId}
                    className={cx('controller__number-fields-hue-from')}
                    value={paletteControl.hueFrom}
                    minValue={0}
                    maxValue={360}
                    step={HUE_STEP}
                    onChange={onChangeHueFromHandler}
                    onChangeEnd={onChangeHueFromHandler}
                  />
                  <NumberField
                    aria-labelledby={huesTitleId}
                    className={cx('controller__number-fields-hue-to')}
                    isDisabled={!isHueRanged}
                    value={paletteControl.hueTo}
                    minValue={0}
                    maxValue={360}
                    step={HUE_STEP}
                    onChange={onChangeHueToHandler}
                    onChangeEnd={onChangeHueToHandler}
                  />
                </div>
              </div>
              <div
                className={cx(
                  'controller__section',
                  'controller__section--area-l-c'
                )}
              >
                <h3
                  className={cx('controller__section__title')}
                  id={lAndCTitleId}
                >
                  Lightness & Chroma
                </h3>
                <div className={cx('controller__l-c')}>
                  <GamutGraph
                    width={400}
                    height={200}
                    lightnessInflect={paletteControl.lightnessInflect}
                    peakChroma={paletteControl.peakChroma}
                    hueFrom={paletteControl.hueFrom}
                    hueTo={paletteControl.hueTo}
                    className={cx('controller__gamut-graph')}
                  />
                  <XYSlider
                    aria-labelledby={lAndCTitleId}
                    className={cx('controller__xy-slider')}
                    minValue={{ x: 0, y: 0 }}
                    maxValue={{ x: 1, y: CHROMA_LIMIT }}
                    step={{ x: LIGHTNESS_STEP, y: CHROMA_STEP }}
                    value={{
                      x: paletteControl.lightnessInflect,
                      y: paletteControl.peakChroma,
                    }}
                    onChangeEnd={onChangeLightnessAndChromaHandler}
                    onChange={onChangeLightnessAndChromaHandler}
                  />
                </div>
                <div className={cx('controller__number-fields-l-c')}>
                  <NumberField
                    aria-labelledby={lAndCTitleId}
                    className={cx('controller__number-fields-l')}
                    value={paletteControl.lightnessInflect}
                    minValue={0}
                    maxValue={1}
                    step={LIGHTNESS_STEP}
                    onChange={onChangeLightnessHandler}
                    onChangeEnd={onChangeLightnessHandler}
                  />
                  <NumberField
                    aria-labelledby={lAndCTitleId}
                    className={cx('controller__number-fields-c')}
                    value={paletteControl.peakChroma}
                    minValue={0}
                    maxValue={CHROMA_LIMIT}
                    step={CHROMA_STEP}
                    onChange={onChangeChromaHandler}
                    onChangeEnd={onChangeChromaHandler}
                  />
                </div>
              </div>
              <div
                className={cx(
                  'controller__section',
                  'controller__section--create'
                )}
              >
                <Button
                  buttontype="filled"
                  materialIcon="add"
                  text="create palette"
                  onPress={onPressCreateHandler}
                  isDisabled={paletteControl.selectedPalete}
                />
              </div>
              <div
                className={cx(
                  'controller__section',
                  'controller__section--export'
                )}
              >
                <Button
                  buttontype="tonal"
                  materialIcon="download"
                  text="export palette"
                  onPress={() => {
                    console.log('exportCssOklch');
                    console.log(exportCssOklch(selectedPalette()));
                    console.log('exportCssRgb');
                    console.log(exportCssRgb(selectedPalette()));
                    console.log('exportCssHex');
                    console.log(exportCssHex(selectedPalette()));
                    console.log('exportFigmaHex');
                    console.log(exportFigmaHex(selectedPalette()));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={cx('menu')} data-theme={theme}>
          <Switch
            materialIcon="dark_mode"
            materialIconAlt="light_mode"
            isSelected={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
        <div className={cx('main')} data-theme={theme}>
          {palettes.length > 0 && (
            <div className={cx('palettes')}>
              {palettes.map((aPalette) => {
                return (
                  <Palette
                    className={cx('palette')}
                    key={aPalette.uid}
                    uid={aPalette.uid}
                    swatchStep={aPalette.swatchStep}
                    lightnessInflect={aPalette.lightnessInflect}
                    peakChroma={aPalette.peakChroma}
                    hueFrom={aPalette.hueFrom}
                    hueTo={aPalette.hueTo}
                    isSelected={aPalette.uid === selectedPaletteUid}
                    onPress={onPressPaletteHandler}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
