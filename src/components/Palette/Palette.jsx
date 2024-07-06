import style from './Palette.module.scss';
import { useEffect, useRef } from 'react';

const Palette = ({}) => {
  const renderCnt = useRef(0);
  const paletteRef = useRef();

  useEffect(() => {
    // renderCnt.current = renderCnt.current + 1;
    // console.log('props', renderCnt.current);
  }, []);

  return;
};

export default Palette;
