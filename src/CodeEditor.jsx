import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import './CodeEditor.css';
import { get_shader_code, set_shader_code, render_glsl } from './Renderer';
const CodeEditor = () => {
  const [code, setCode] = useState(`${get_shader_code()}`);

  const handleEditorChange = (value) => {
    setCode(value); // Update the state when code changes
  };
  // useEffect(() => {
  //   // Define the keywords and types for the GLSL-like language
  //   const keywords = [
  //     'uniform', 'varying', 'void', 'int', 'float', 'vec3', 'vec4', 'mat3', 'mat4',
  //     'bool', 'highp', 'mediump', 'lowp', 'discard', 'main'
  //   ];

  //   const typeKeywords = [
  //     'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
  //   ];

  //   const operators = [
  //     '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
  //     '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
  //     '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
  //     '%=', '<<=', '>>=', '>>>='
  //   ];

  //   // Define the language structure
  //   const customLanguageRules = {
  //     keywords: keywords,
  //     typeKeywords: typeKeywords,
  //     operators: operators,
  //     symbols: /[=><!~?:&|+\-*\/\^%]+/,
  //     escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  //     tokenizer: {
  //       root: [
  //         // Match identifiers and keywords
  //         [/[a-z_$][\w$]*/, {
  //           cases: {
  //             '@typeKeywords': 'keyword',
  //             '@keywords': 'keyword',
  //             '@default': 'identifier'
  //           }
  //         }],
  //         [/[A-Z][\w\$]*/, 'type.identifier'],  // Class names

  //         // Whitespace handling
  //         { include: '@whitespace' },

  //         // Brackets and delimiters
  //         [/[{}()\[\]]/, '@brackets'],
  //         [/[<>](?!@symbols)/, '@brackets'],
  //         [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],

  //         // Number literals
  //         [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
  //         [/0[xX][0-9a-fA-F]+/, 'number.hex'],
  //         [/\d+/, 'number'],

  //         // Punctuation (like commas, semicolons)
  //         [/[;,.]/, 'delimiter'],

  //         // String literals
  //         [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
  //         [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

  //         // Character literals
  //         [/'[^\\']'/, 'string'],
  //         [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
  //         [/'/, 'string.invalid']
  //       ],

  //       // Comment block
  //       comment: [
  //         [/[^\/*]+/, 'comment'],
  //         [/\/\*/, 'comment', '@push'],    // Nested comment
  //         ["\\*/", 'comment', '@pop'],
  //         [/[\/*]/, 'comment']
  //       ],

  //       // String handling
  //       string: [
  //         [/[^\\"]+/, 'string'],
  //         [/@escapes/, 'string.escape'],
  //         [/\\./, 'string.escape.invalid'],
  //         [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
  //       ],

  //       // Whitespace handling
  //       whitespace: [
  //         [/[ \t\r\n]+/, 'white'],
  //         [/\/\*/, 'comment', '@comment'],
  //         [/\/\/.*$/, 'comment']
  //       ]
  //     },
  //   };

  //   // Register the custom language with Monaco
  //   monaco.languages.register({ id: 'custom-glsl' });

  //   // Set the tokenization rules for the custom language
  //   monaco.languages.setMonarchTokensProvider('custom-glsl', customLanguageRules);

  //   // Define a custom theme to map your tokens to colors
  //   monaco.editor.defineTheme('myTheme', {
  //     base: 'vs-dark', // Use the default dark theme as a base
  //     inherit: true,
  //     rules: [
  //       { token: 'keyword', foreground: 'ff0000', fontStyle: 'bold' }, // Red keywords
  //       { token: 'operator', foreground: '00ff00' }, // Green operators
  //       { token: 'number', foreground: '0000ff' }, // Blue numbers
  //       { token: 'string', foreground: 'ffa500' }, // Orange strings
  //       { token: 'comment', foreground: '808080', fontStyle: 'italic' }, // Gray comments
  //     ],
  //     colors: {
  //       'editor.background': '#1e1e1e', // Dark background
  //       'editor.foreground': '#d4d4d4', // Light text color
  //       'editorCursor.foreground': '#ff0000', // Cursor color
  //       'editor.lineHighlightBackground': '#333333', // Line highlight
  //       'editor.selectionBackground': '#3f3f3f' // Selection background
  //     }
  //   });

  //   // Set the theme
  //   monaco.editor.setTheme('myTheme');
  //   monaco.editor.create(document.getElementById('editor-container'), {
  //     value: code,
  //     language: 'cpp',
  //     theme: 'vs-dark',
  //     onChange: handleEditorChange,
  //     minimap: { enabled: true },
  //     fontSize: 14,
  //     scrollBeyondLastLine: true,
  //     automaticLayout: true,
  //     wordWrap: false
  //   });
  // }, []); // Empty dependency array to run only once on mount


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
    </div>
  );
};

export default CodeEditor;

