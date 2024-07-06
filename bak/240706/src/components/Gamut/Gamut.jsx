import { clampChroma, displayable, toGamut } from 'culori';
import { useEffect, useRef } from 'react';
import style from './Gamut.module.scss';

const Gamut = ({
  gamutContainerRef,
  chipNum,
  lInflection,
  cMax,
  hueFrom,
  hueTo,
}) => {
  const canvasRef = useRef();
  const toP3 = toGamut('p3', 'oklch', null);

  const setCanvas = (canvas, gamutContainerRef, resolutionMultiplier = 1) => {
    canvas.width = Math.floor(
      resolutionMultiplier * gamutContainerRef.current.clientWidth
    );
    canvas.height = Math.floor(
      resolutionMultiplier * gamutContainerRef.current.clientHeight
    );
  };

  const renderGamut = (hueFrom, hueTo, width, height, ctx) => {
    const imageData = ctx.createImageData(width, height, {
      colorSpace: 'display-p3',
    });

    for (let x = 0; x < imageData.width; x++) {
      const lightness = x / (imageData.width - 1);
      const hue =
        hueFrom +
        (x *
          (hueTo > hueFrom ? hueTo - hueFrom : (hueTo + 360 - hueFrom) % 360)) /
          (imageData.width - 1);

      let isInSrgb = true;
      let wasInSrgb = true;

      for (let y = imageData.height - 1; y >= 0; y--) {
        const chroma = 0.4 * (1 - y / (imageData.height - 1));

        const color = `oklch(${lightness} ${chroma} ${hue})`;
        const clamppedColor = clampChroma(color, `oklch`, `p3`);

        if (chroma > clamppedColor.c) break;

        const p3Color = toP3(color);
        isInSrgb = displayable(color);

        const idx = (y * imageData.width + x) * 4;
        if (!isInSrgb && isInSrgb !== wasInSrgb) {
          imageData.data[idx] = 255;
          imageData.data[idx + 1] = 255;
          imageData.data[idx + 2] = 255;
          imageData.data[idx + 3] = 255;
        } else {
          imageData.data[idx] = Math.round(255 * p3Color.r);
          imageData.data[idx + 1] = Math.round(255 * p3Color.g);
          imageData.data[idx + 2] = Math.round(255 * p3Color.b);
          imageData.data[idx + 3] = 255;
        }

        wasInSrgb = isInSrgb;
      }
    }

    return imageData;
  };

  const draw = (hueFrom, hueTo, width, height, ctx) => {
    const gamutImg = renderGamut(hueFrom, hueTo, width, height, ctx);
    ctx.putImageData(gamutImg, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas, gamutContainerRef, 1);
    const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });

    draw(hueFrom, hueTo, canvas.width, canvas.height, ctx);
  }, [chipNum, lInflection, cMax, hueFrom, hueTo]);

  return <canvas className={style.gamut} ref={canvasRef}></canvas>;
};

export default Gamut;
