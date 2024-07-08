// todo check onchange or other event

import { useCallback } from 'react';

const PaletteController = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  setSelectedPalette,
}) => {
  const handleChange = useCallback((e, key) => {
    setSelectedPalette(key, Number(e.target.value));
  }, []);

  return (
    <>
      <input
        value={chipNum}
        onChange={(e) => {
          handleChange(e, 'chipNum');
        }}
        min={2}
        max={100}
        step={1}
        type="number"
      />
      <input
        value={lInflect}
        onChange={(e) => {
          handleChange(e, 'lInflect');
        }}
        min={0}
        max={1}
        step={0.001}
        type="range"
      />
      <input
        value={lInflect}
        onChange={(e) => {
          handleChange(e, 'lInflect');
        }}
        min={0}
        max={1}
        step={0.001}
        type="number"
      />
      <input
        value={cMax}
        onChange={(e) => {
          handleChange(e, 'cMax');
        }}
        min={0}
        max={0.4}
        step={0.001}
        type="range"
      />
      <input
        value={cMax}
        onChange={(e) => {
          handleChange(e, 'cMax');
        }}
        min={0}
        max={0.4}
        step={0.001}
        type="number"
      />
      <input
        value={hueFrom}
        onChange={(e) => {
          handleChange(e, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
        type="range"
      />
      <input
        value={hueFrom}
        onChange={(e) => {
          handleChange(e, 'hueFrom');
        }}
        min={0}
        max={360}
        step={0.1}
        type="number"
      />
      <input
        value={hueTo}
        onChange={(e) => {
          handleChange(e, 'hueTo');
        }}
        min={0}
        max={360}
        step={0.1}
        type="range"
      />
      <input
        value={hueTo}
        onChange={(e) => {
          handleChange(e, 'hueTo');
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
