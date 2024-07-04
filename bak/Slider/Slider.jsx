import { useState, useRef, useCallback } from 'react';
import s from './Slider.module.scss';

const Slider = ({
  isXActive = true,
  isYActive = false,
  isMirrored = false,
  isRanged = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const thumbRect = thumbRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      const offsetX = e.clientX - thumbRect.left;
      const offsetY = e.clientY - thumbRect.top;

      const newX = e.clientX - trackRect.left - offsetX;
      const newY = e.clientY - trackRect.top - offsetY;

      // 트랙 내에서 썸 위치 제한
      const maxX = trackRect.width - thumbRect.width;
      const maxY = trackRect.height - thumbRect.height;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // 썸 위치 업데이트
      setPos({ x: constrainedX, y: constrainedY });
      console.log('m', pos);
    },
    [isDragging, pos]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);

    // 이벤트 리스너 제거
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);

    // 스타일 초기화
    document.body.style.cursor = 'auto';
    console.log('u', pos);
  }, [handlePointerMove, pos]); // 여기서 handlePointerUp 을 의존성 배열에 추가

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);

      const thumbRect = thumbRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      const offsetX = e.clientX - thumbRect.left;
      const offsetY = e.clientY - thumbRect.top;

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);

      handlePointerMove(e);

      document.body.style.cursor = 'grabbing';

      console.log('d', pos);
    },
    [handlePointerMove, handlePointerUp, pos]
  ); // 여기서 handlePointerDown 을 의존성 배열에 추가

  return (
    <div
      className={`${s.slider} ${
        s[`slider-${isXActive ? `x` : ``}${isYActive ? `y` : ``}`]
      } ${isMirrored && isXActive !== isYActive ? s[`slider-mirrored`] : ``}`}
    >
      <div className={`${s.track}`} ref={trackRef}>
        <div
          className={`${s.thumb} ${
            isRanged && isXActive !== isYActive ? s[`thumb-from`] : ``
          } ${isDragging ? s[`thumb-pressed`] : ``}`}
          ref={thumbRef}
          onPointerDown={handlePointerDown}
          style={{ '--x-from': `${pos.x}px`, '--y-from': `${pos.y}px` }}
        ></div>
        {isRanged && isXActive !== isYActive && (
          <div
            className={`${s.thumb} ${s[`thumb-to`]} ${
              isDragging ? s[`thumb-pressed`] : ``
            }`}
            ref={thumbRef}
            onPointerDown={handlePointerDown}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Slider;
