import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  CHROMA_LIMIT,
  P3_MAX_CHROMA_OFFSET,
  LIGHTNESS_OF_PEAK_CHROMA,
  SECONDARY_CHROMA_RATIO,
  NEUTRAL_VARIANT_PEAK_CHROMA,
  NEUTRAL_PEAK_CHROMA,
  UTILITY_PEAK_CHROMA,
} from '../../utils/constants';
import { createColour, hueOfLightness } from '../../utils/colourUtils';
import { clampChroma, displayable, converter } from 'culori';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_GamutGraph.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const GamutGraph = ({
  width,
  height,
  lightnessInflect,
  peakChroma,
  hueFrom,
  hueTo,
  className = '',
  ...props
}) => {
  const { vividsRef, neutralVariantsRef, neutralsRef, theme } =
    useContext(ThemeContext);

  const strokeColourRef = useRef({
    light: createColour(
      Math.floor(100 * neutralsRef.current.outline.light),
      100,
      LIGHTNESS_OF_PEAK_CHROMA,
      NEUTRAL_PEAK_CHROMA,
      hueFrom,
      hueTo
    ),
    dark: createColour(
      Math.floor(100 * neutralsRef.current.outline.dark),
      100,
      LIGHTNESS_OF_PEAK_CHROMA,
      NEUTRAL_PEAK_CHROMA,
      hueFrom,
      hueTo
    ),
  });
  const [size] = useState({ width: width, height: height });
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const renderRamp = useCallback(
    (ctx) => {
      const toP3Rgb = converter('rgb');
      const strokeColour = toP3Rgb(strokeColourRef.current.light);
      console.log(strokeColour);
      ctx.strokeStyle = `rgb(${255 * strokeColour.r} ${255 * strokeColour.g} ${
        255 * strokeColour.b
      })`;
      ctx.beginPath();
      ctx.moveTo(0, ctx.canvas.height);
      ctx.lineTo(
        lightnessInflect * ctx.canvas.width,
        (1 - peakChroma / CHROMA_LIMIT) * ctx.canvas.height
      );
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();
    },
    [lightnessInflect, peakChroma]
  );

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageData) ctx.putImageData(imageData, 0, 0);
    renderRamp(ctx);
  }, [imageData, renderRamp]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
    ctxRef.current = ctx;
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.createImageData(canvas.width, canvas.height, {
      colorSpace: 'display-p3',
    });
    const toP3Rgb = converter('p3');
    for (let x = 0; x < imageData.width; x++) {
      const lightness = x / (imageData.width - 1);
      const hue = hueOfLightness(lightness, hueFrom, hueTo);
      let isInSrgb = true;
      let wasInSrgb = true;

      for (let y = imageData.height - 1; y >= 0; y--) {
        const chroma = CHROMA_LIMIT * (1 - y / (imageData.height - 1));
        const rawOklch = `oklch(${lightness} ${chroma} ${hue})`;
        const p3ClamppedOklch = clampChroma(rawOklch, 'oklch', 'p3');
        const inP3 = chroma <= p3ClamppedOklch.c;
        isInSrgb = displayable(rawOklch);
        if (!inP3) break;
        const p3ClamppedRgb = toP3Rgb(p3ClamppedOklch);
        const idx = (y * imageData.width + x) * 4;
        if (!isInSrgb && isInSrgb !== wasInSrgb) {
          imageData.data[idx] = 255;
          imageData.data[idx + 1] = 255;
          imageData.data[idx + 2] = 255;
          imageData.data[idx + 3] = 255;
        } else {
          imageData.data[idx] = Math.round(255 * p3ClamppedRgb.r);
          imageData.data[idx + 1] = Math.round(255 * p3ClamppedRgb.g);
          imageData.data[idx + 2] = Math.round(255 * p3ClamppedRgb.b);
          imageData.data[idx + 3] = 255;
        }
        wasInSrgb = isInSrgb;
      }
    }
    setImageData(imageData);
  }, [hueFrom, hueTo]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div
      className={cx('canvas-container', className)}
      data-theme={theme}
      ref={canvasContainerRef}
    >
      <canvas className={cx('canvas')} ref={canvasRef}></canvas>
    </div>
  );
};

export default GamutGraph;
