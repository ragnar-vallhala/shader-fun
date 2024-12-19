import React, { useEffect, useRef, useState } from 'react';
import { render_glsl, cleanup } from './Renderer.js';

const Canvas = () => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    render_glsl(canvasRef);
    return () => { cleanup() };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <canvas ref={canvasRef} width={600} height={600} />
    </div>
  );
};

export default Canvas;

