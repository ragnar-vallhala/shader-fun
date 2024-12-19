const date = new Date();
let vertexShader = `
// Author: Ashutossh Vishwakarma
// Date: ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}

attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;
}
`;

let fragmentShader = `
// Author: Ashutossh Vishwakarma
// Date: ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}

precision mediump float;
uniform float u_Time;
void main() {
    gl_FragColor = vec4(sin(u_Time), cos(u_Time), 0.5 + 0.5 * sin(u_Time), 1.0);
}
`;

let program = null;
let buffer = null;
let gl = null;
let startTime = null;

export const render_glsl = (canvasRef) => {
  const canvas = canvasRef.current;
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }
  startTime = Date.now();
  program = getProgram(gl, vertexShader, fragmentShader);
  if (!program) return;

  setBuffers(gl);

  const render = () => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    set_uniforms(gl, elapsedTime);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  };

  render();
};


export const cleanup = () => {
};

export const get_shader_code = () => {
  return fragmentShader;
}

export const set_shader_code = (newFragShader) => {
  fragmentShader = newFragShader;
  program = getProgram(gl, vertexShader, fragmentShader);

}
const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const getProgram = (gl, vertexShader, fragmentShader) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.useProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
};

const setBuffers = (gl) => {
  const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_Position');
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);
};

const set_uniforms = (gl, elapsedTime) => {
  const uTime = gl.getUniformLocation(program, 'u_Time');
  gl.uniform1f(uTime, elapsedTime);
};
