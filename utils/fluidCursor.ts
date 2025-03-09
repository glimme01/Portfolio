const useFluidCursor = () => {
  // Check if we're on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                  (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
  
  // Don't initialize on mobile devices
  if (isMobile) return;
  
  const canvas = document.getElementById("fluid-cursor");
  if (!canvas) return;
  
  // Make sure canvas is a canvas element
  const canvasElement = canvas as HTMLCanvasElement;
  
  // Set canvas dimensions
  const resizeCanvas = () => {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Configuration
  let config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 3,
    VELOCITY_DISSIPATION: 1.8,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    PAUSED: false,
    TRANSPARENT: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
  };
  
  // Get WebGL context
  const gl = canvasElement.getContext('webgl');
  if (!gl) return;
  
  // Pointer prototype
  function pointerPrototype() {
    this.id = -1;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.down = false;
    this.moved = false;
    this.color = [30, 0, 300];
  }
  
  let pointers = [];
  let splatStack = [];
  pointers.push(new pointerPrototype());
  
  // Shader code (simplified for brevity)
  const baseVertexShader = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  
  const displayShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;
    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
  `;
  
  // Create shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, baseVertexShader);
  gl.compileShader(vertexShader);
  
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, displayShaderSource);
  gl.compileShader(fragmentShader);
  
  // Create program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // Create buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  
  // Create texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
  // Mouse events
  const updatePointerMoveData = (pointer, posX, posY) => {
    pointer.x = posX;
    pointer.y = posY;
  };
  
  const generateColor = () => {
    let c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
  };
  
  const HSVtoRGB = (h, s, v) => {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
  
    return {
      r,
      g,
      b
    };
  };
  
  // Simplified splat function
  const splat = (x, y) => {
    let color = generateColor();
    gl.viewport(0, 0, canvasElement.width, canvasElement.height);
    gl.clearColor(color.r, color.g, color.b, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
  
  // Mouse event listeners
  window.addEventListener('mousemove', e => {
    let pointer = pointers[0];
    let posX = e.clientX;
    let posY = e.clientY;
    updatePointerMoveData(pointer, posX, posY);
    splat(posX, posY);
  });
  
  // Animation loop
  const animate = () => {
    gl.viewport(0, 0, canvasElement.width, canvasElement.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(animate);
  };
  
  animate();
  
  // Clean up on unmount
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
};

export default useFluidCursor; 