import React, { useLayoutEffect, useRef, useState } from 'react';

interface GameLayerProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const BoundingBox: React.FC<GameLayerProps> = ({ width, height, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current.parentElement || document.body;

        // On mobile itch.io, the iframe may be wider/taller than the physical screen.
        // screen.width/height give the actual device dimensions in CSS pixels,
        // so we clamp the available space to what the device can actually show.
        const availW = Math.min(clientWidth || window.innerWidth, window.screen.width);
        const availH = Math.min(clientHeight || window.innerHeight, window.screen.height);

        const scaleX = availW / width;
        const scaleY = availH / height;
        setScale(Math.min(scaleX, scaleY));
      }
    };

    window.addEventListener('resize', handleResize);
    window.screen.orientation?.addEventListener('change', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.screen.orientation?.removeEventListener('change', handleResize);
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center', // Keep centered
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
