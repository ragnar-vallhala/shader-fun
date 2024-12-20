import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import './CodeEditor.css';
import { get_shader_code, set_shader_code, get_time, get_framerate, get_frameCount, get_deltaTime, get_mousePosition } from './Renderer';
import { get_canvas_size } from './Canvas';



const CodeEditor = () => {
  const [code, setCode] = useState(`${get_shader_code()}`);

  const [time, setTime] = useState(get_time());
  const [framerate, setFramerate] = useState(get_framerate());
  const [frameCount, setFrameCount] = useState(get_frameCount());
  const [deltaTime, setDeltaTime] = useState(get_deltaTime());
  const [mousePosition, setMousePosition] = useState(get_mousePosition());
  const [viewportSize, setViewportSize] = useState(get_canvas_size());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(get_time());
      setFramerate(get_framerate());
      setFrameCount(get_frameCount());
      setDeltaTime(get_deltaTime());
      setMousePosition(get_mousePosition());
      setViewportSize(get_canvas_size());
    }, 300);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empt


  const handleEditorChange = (value) => {
    setCode(value); // Update the state when code changes
  };

  return (
    <div className='CodeEditor'>
      <header>
        <h2>WebGL Editor</h2>
        <button onClick={() => { set_shader_code(code); }}>

          Run Code
        </button>
      </header>
      <Editor
        height="90vh"
        language="c"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: true,
          automaticLayout: true,
          wordWrap: false
        }}
      />
      <div className='status-bar'>
        <div className='status-bar-item'>{`Time: ${time}`}</div>
        <div className='status-bar-item'>{`Frame Count: ${frameCount}`}</div>
        <div className='status-bar-item'>{`FPS: ${framerate.toFixed(2)}`}</div>
        <div className='status-bar-item'>{`Delta Time: ${deltaTime.toFixed(4)}`}</div>
        <div className='status-bar-item'>{`Mouse: ${mousePosition[0]} , ${mousePosition[1]}`}</div>
        <div className='status-bar-item'>{`Viewport: ${viewportSize[0]} X ${viewportSize[1]}`}</div>
      </div>
    </div>
  );
};

export default CodeEditor;

