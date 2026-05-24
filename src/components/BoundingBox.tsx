import React, { useLayoutEffect, useRef, useState } from 'react';

interface GameLayerProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const BoundingBox: React.FC<GameLayerProps> = ({ width, height, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dynamicHeight, setDynamicHeight] = useState(height);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current.parentElement || document.body;

        // On mobile itch.io, the iframe may be wider/taller than the physical screen.
        // screen.width/height give the actual device dimensions in CSS pixels,
        // so we clamp the available space to what the device can actually show.
        const availW = Math.min(clientWidth || window.innerWidth, window.screen.width);
        const availH = Math.min(clientHeight || window.innerHeight, window.screen.height);

        const targetRatio = width / height;
        const availRatio = availW / availH;

        if (availRatio <= targetRatio) {
          // Screen is taller than standard aspect ratio (e.g. Galaxy Z Flip, modern taller smartphones)
          // Fit perfectly to the screen width and expand the height dynamically to eliminate empty space.
          const s = availW / width;
          setScale(s);
          setDynamicHeight(availH / s);
        } else {
          // Screen is wider than standard aspect ratio (e.g. desktops, tablets, landscape)
          // Fit perfectly to the screen height and keep the standard phone aspect ratio width.
          const s = availH / height;
          setScale(s);
          setDynamicHeight(height);
        }
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
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${dynamicHeight}px`,
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
