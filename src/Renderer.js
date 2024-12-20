const date = new Date();

const preFragShaderHeader = `
precision mediump float;
uniform vec2 u_Resolution;    // Resolution of viewport in pixel coordinate
uniform float u_Time;         // Time elasped since start (in seconds)
uniform float u_DeltaTime;    // Time elasped since last frame (in seconds)
uniform float u_FrameRate;    // Shader framerate (Hz)
uniform float u_FrameCount;   // Frame count (will be integer)
uniform vec2  u_Mouse;        // Mouse position in pixel coordinate
`
let vertexShader = `
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;
}
`;

let fragmentShader = `
// Author: Ashutossh Vishwakarma
// Date: ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}

void main() {
    gl_FragColor = vec4(sin(u_Time), cos(u_Time), 0.5 + 0.5 * sin(u_Time), 1.0);
}
`;

let program = null;
let buffer = null;
let gl = null;
let lastCallTime = performance.now();
let firstCallTime = performance.now();
let frameCount = 0;
let resolution = [600, 600];
let mousePos = [0, 0];
let viewportPos = [0, 0];
let frameRate = 0;
let deltaTime = 0;
let mousePosition = [0, 0];
const minFrameTime = 16; // in ms to 60 fps

export const render_glsl = (canvasRef) => {
  const canvas = canvasRef.current;
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }
  program = getProgram(gl, vertexShader, fragmentShader);
  if (!program) return;

  setBuffers(gl);

  const render = () => {
    set_uniforms(gl);
    // updates
    const currentTime = performance.now();
    if (currentTime - lastCallTime > minFrameTime) {
      frameCount += 1;
      deltaTime = (currentTime - lastCallTime) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      lastCallTime = currentTime;
    }
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
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, preFragShaderHeader + fragmentShader);
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

  // reset varibales
  frameCount = 0;
  firstCallTime = performance.now();
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


const set_uniforms = (gl) => {
  // u_resolution (make sure resolution is updated)
  const uResolution = gl.getUniformLocation(program, 'u_Resolution');
  gl.uniform2f(uResolution, resolution[0], resolution[1]);


  // u_time
  const uTime = gl.getUniformLocation(program, 'u_Time');
  gl.uniform1f(uTime, (performance.now() - firstCallTime) / 1000);

  // u_deltatime
  const uDeltaTime = gl.getUniformLocation(program, 'u_DeltaTime');
  gl.uniform1f(uDeltaTime, deltaTime);


  // u_framerate
  frameRate = 1 / deltaTime;
  const uFrameRate = gl.getUniformLocation(program, 'u_FrameRate');
  gl.uniform1f(uFrameRate, frameRate);

  // u_framecount
  const uFrameCount = gl.getUniformLocation(program, 'u_FrameCount');
  gl.uniform1f(uFrameCount, frameCount);

  // u_mouse
  const uMouse = gl.getUniformLocation(program, 'u_Mouse');
  gl.uniform2f(uMouse, get_mouse_pos()[0], get_mouse_pos()[1]);


};


const get_mouse_pos = () => {
  let x = mousePos[0];
  let y = mousePos[1];


  // clamping X
  if (x < viewportPos[0]) {
    x = viewportPos[0];
  } else if (x > viewportPos[0] + resolution[0]) {
    x = viewportPos[0] + resolution[0];
  }
  // clamping Y
  if (y < viewportPos[1] + resolution[1]) {
    y = viewportPos[1];
  } else if (y > viewportPos[1]) {
    y = viewportPos[1] + resolution[1];
  }


  // make in pixel coordinate
  x -= viewportPos[0];
  y -= viewportPos[1];
  mousePosition = [x, y];
  return [x, y];
}

export const update_viewport_pos_callback = (x, y) => {
  viewportPos[0] = x;
  viewportPos[1] = y;
}

document.addEventListener('mousemove', (event) => {
  mousePos[0] = event.clientX; // X coordinate relative to the viewport
  mousePos[1] = event.clientY; // Y coordinate relative to the viewport
});


export const update_resolution_callback = (newResolution) => {
  resolution = newResolution;
}


// Important info getters
export const get_time = () => {
  return ((performance.now() - firstCallTime)/1000).toFixed(0);
}

export const get_frameCount = () => {
  return frameCount;
}

export const get_framerate = () => {
  return frameRate;
}
export const get_deltaTime = () => {
  return deltaTime;
}

export const get_mousePosition = () => {
  return mousePosition;
}
