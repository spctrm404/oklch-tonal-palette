import { useContext } from 'react';
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
  const { theme, toggleTheme, updateHues } = useContext(ThemeContext);

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
      <div className="total-swatch">
        <RadioGroup orientation="horizontal">
          <Radio text="10" value="10" />
          <Radio text="5" value="5" />
          <Radio text="2" value="2" />
          <Radio text="1" value="1" />
        </RadioGroup>
      </div>
      <div className="hues">
        <Switch className="hues__range" />
        <Slider className="hues__slider hues__slider--control-from" />
        <Slider className="hues__slider hues__slider--control-to" />
        <NumberField className="hues__number-field hues__number-field--control-from" />
        <NumberField className="hues__number-field hues__number-field--control-to" />
      </div>
      <div className="l-c">
        <XYSlider className="l-c__xy" />
        <Slider className="l-c__slider l-c__slider--control-x" />
        <Slider
          className="l-c__slider l-c__slider--control-y"
          orientation="vertical"
        />
        <div className="l-c__number-fields">
          <NumberField className="l-c__number-field l-c__number-field--control-x" />
          <NumberField className="l-c__number-field l-c__number-field--control-y" />
        </div>
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
