import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CHROMA_LIMIT } from '../../utils/constants';
import { hueOfLightness } from '../../utils/colourUtils';
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

  const [size, setSize] = useState({ width: width, height: height });
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const renderGamut = useCallback(
    (imageData) => {
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
    },
    [hueFrom, hueTo]
  );

  const renderRamp = useCallback(
    (ctx) => {
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
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const imageData = ctx.createImageData(canvas.width, canvas.height, {
      colorSpace: 'display-p3',
    });
    renderGamut(imageData);
    ctx.putImageData(imageData, 0, 0);
    renderRamp(ctx);
  }, [renderGamut, renderRamp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
    ctxRef.current = ctx;
  }, [size]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className={cx('canvas-container', className)} ref={canvasContainerRef}>
      <canvas className={cx('canvas')} ref={canvasRef}></canvas>
    </div>
  );
};

export default GamutGraph;
