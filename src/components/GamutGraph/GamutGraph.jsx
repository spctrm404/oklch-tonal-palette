import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { CHROMA_LIMIT } from '../../utils/constants';
import {
  createColours,
  hueOfLightness,
  chromaOfLightness,
} from '../../utils/colourUtils';
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
  const { theme } = useContext(ThemeContext);

  const [size] = useState({ width: width, height: height });
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const coloursRef = useRef(
    createColours(10, lightnessInflect, peakChroma, hueFrom, hueTo).map(
      (aColour) => {
        return {
          ...aColour,
          uid: crypto.randomUUID(),
        };
      }
    )
  );

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageData) ctx.putImageData(imageData, 0, 0);
  }, [imageData]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = size.width * 1;
    canvas.height = size.height * 1;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
    ctxRef.current = ctx;
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const imageDataArray = new Uint8ClampedArray(width * height * 4);
    const toP3Rgb = converter('p3');

    for (let x = 0; x < width; x++) {
      const lightness = x / (width - 1);
      const hue = hueOfLightness(lightness, hueFrom, hueTo);
      let wasInSrgb = true;
      for (let y = height - 1; y >= 0; y--) {
        const chroma = CHROMA_LIMIT * (1 - y / (height - 1));
        const rawOklch = `oklch(${lightness} ${chroma} ${hue})`;
        const p3ClamppedOklch = clampChroma(rawOklch, 'oklch', 'p3');
        const inP3 = chroma <= p3ClamppedOklch.c;
        const isInSrgb = displayable(rawOklch);

        if (!inP3) break;

        const p3ClamppedRgb = toP3Rgb(p3ClamppedOklch);
        const idx = (y * width + x) * 4;
        if (!isInSrgb && isInSrgb !== wasInSrgb) {
        } else {
          imageDataArray[idx] = Math.round(255 * p3ClamppedRgb.r);
          imageDataArray[idx + 1] = Math.round(255 * p3ClamppedRgb.g);
          imageDataArray[idx + 2] = Math.round(255 * p3ClamppedRgb.b);
          imageDataArray[idx + 3] = 255;
        }
        wasInSrgb = isInSrgb;
      }
    }

    const imageData = new ImageData(imageDataArray, width, height, {
      colorSpace: 'display-p3',
    });
    setImageData(imageData);
  }, [hueFrom, hueTo]);

  useEffect(() => {
    render();
  }, [render]);

  const svgGraphic = useCallback(() => {
    const toP3Rgb = converter('p3');
    coloursRef.current = createColours(
      10,
      lightnessInflect,
      peakChroma,
      hueFrom,
      hueTo
    ).map((aColour, idx) => {
      return { ...aColour, uid: coloursRef.current[idx]['uid'] };
    });
    return (
      <svg className={cx('svg')} width={size.width} height={size.height}>
        <polyline
          points={`0 ${size.height} ${size.width * lightnessInflect} ${
            size.height * (1 - peakChroma / CHROMA_LIMIT)
          } ${size.width} ${size.height}`}
          stroke={
            theme === 'light' ? 'var(--primary-light)' : 'var(--primary-dark)'
          }
          fill="transparent"
          strokeWidth="1"
        />
        {coloursRef.current.map((aColour) => {
          if (aColour.inP3) return;
          return (
            <polyline
              key={`${aColour.uid}-stroke`}
              points={`${size.width * aColour.l} ${
                size.height * (1 - aColour.c / CHROMA_LIMIT)
              } ${size.width * aColour.l} ${
                size.height *
                (1 -
                  chromaOfLightness(aColour.l, lightnessInflect, peakChroma) /
                    CHROMA_LIMIT)
              }`}
              stroke={
                aColour.inP3
                  ? theme === 'light'
                    ? 'var(--on-secondary-container-light)'
                    : 'var(--on-secondary-container-dark)'
                  : 'red'
              }
              fill="transparent"
              strokeWidth="1"
            ></polyline>
          );
        })}
        {coloursRef.current.map((aColour) => {
          const p3ClamppedRgb = toP3Rgb(aColour);
          return (
            <circle
              key={aColour.uid}
              cx={size.width * aColour.l}
              cy={size.height * (1 - aColour.c / CHROMA_LIMIT)}
              r={5}
              stroke={
                aColour.inP3
                  ? theme === 'light'
                    ? 'var(--on-secondary-container-light)'
                    : 'var(--on-secondary-container-dark)'
                  : 'red'
              }
              fill={`color(display-p3 ${p3ClamppedRgb.r} ${p3ClamppedRgb.g} ${p3ClamppedRgb.b})`}
              strokeWidth="2"
            ></circle>
          );
        })}
      </svg>
    );
  }, [lightnessInflect, peakChroma, hueFrom, hueTo, theme, size]);

  return (
    <div
      className={cx('canvas-container', className)}
      data-theme={theme}
      ref={canvasContainerRef}
    >
      <canvas className={cx('canvas')} ref={canvasRef}></canvas>
      {svgGraphic()}
    </div>
  );
};

export default GamutGraph;
