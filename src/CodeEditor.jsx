import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import './CodeEditor.css'
const CodeEditor = () => {
  const [code, setCode] = useState(`// Write your code here\nfunction greet() {\n  console.log('Hello, World!');\n}`);

  const handleEditorChange = (value) => {
    setCode(value); // Update the state when code changes
  };

  return (
    <div className='CodeEditor'>
      <header>
        <h2>Code Editor</h2>
        <button
          onClick={() => { console.log("Run") }}>
          Run Code
        </button>
      </header>
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;

