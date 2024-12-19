import React, { useEffect, useRef, useState } from 'react';
import { render_glsl, cleanup } from './Renderer.js';

const Canvas = () => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  let canvasSize = [600, 600];
  if (window.innerWidth < 1200) {
    canvasSize = [100, 100];
  }
  const [position, setPosition] = useState({ x: window.innerWidth - canvasSize[0], y: window.innerHeight - canvasSize[1] });
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
      <canvas ref={canvasRef} width={canvasSize[0]} height={canvasSize[1]} />
    </div>
  );
};

export default Canvas;

