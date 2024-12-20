import React, { useEffect, useRef, useState } from 'react';
import { render_glsl, cleanup } from './Renderer.js';
import { update_viewport_pos_callback, update_resolution_callback } from './Renderer.js';

let canvasSize = [600, 600];

const Canvas = () => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  if (window.innerWidth < 1200) {
    canvasSize = [260, 260];
  }

  // Update canvas size
  update_resolution_callback(canvasSize);


  const [position, setPosition] = useState({ x: window.innerWidth - canvasSize[0] - 0.02 * window.innerWidth, y: window.innerHeight - canvasSize[1] - 0.07 * window.innerHeight });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  update_viewport_pos_callback(position.x, position.y);
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
      update_viewport_pos_callback(position.x, position.y);
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
    </div >
  );
};

export default Canvas;

export const get_canvas_size = () => {
  return canvasSize;
}
