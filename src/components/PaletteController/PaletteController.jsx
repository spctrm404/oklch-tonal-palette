import { useCallback } from 'react';

const PaletteController = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  onChangeInput,
}) => {
  const onChangeSliderHandler = useCallback(
    (e, key) => {
      onChangeInput(key, Number(e.target.value));
    },
    [onChangeInput]
  );

  const onChangeNumberHandler = useCallback(
    (e, key) => {
      const minValue = Number(e.target.min);
      const maxValue = Number(e.target.max);
      const value = Number(e.target.value);
      onChangeInput(key, Math.max(minValue, Math.min(maxValue, value)));
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
      <input
        value={lInflect}
        onChange={(e) => {
          onChangeSliderHandler(e, 'lInflect');
        }}
        min={0}
        max={1}
        step={0.001}
        type="range"
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
          onChangeSliderHandler(e, 'cMax');
        }}
        min={0}
        max={0.4}
        step={0.001}
        type="range"
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
      <input
        value={hueFrom}
        onChange={(e) => {
          onChangeSliderHandler(e, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
        type="range"
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
          onChangeSliderHandler(e, 'hueTo');
        }}
        min={0}
        max={360}
        step={0.1}
        type="range"
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
