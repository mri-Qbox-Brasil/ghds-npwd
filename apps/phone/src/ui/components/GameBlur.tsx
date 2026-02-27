import React, { useEffect, useRef } from 'react';

const config = {
    resolutionScale: 0.5,
    defaultBlurStrength: 5.0,
    zindex: '-1',
    renderColour: [0.0, 0.0, 0.0, 0.0],
    maxBlurSize: 20,
};

const fragmentShaderSrc = `
  precision mediump float;
  varying vec2 v_texcoord;
  uniform sampler2D u_texture;
  uniform vec4 u_shape;
  uniform float u_borderRadius;
  uniform vec2 u_resolution;
  uniform float u_blurStrength;

  const int blurSizing = ${config.maxBlurSize}; 

  float roundedBoxSDF(vec2 centerPosition, vec2 size, float radius) {
    return length(max(abs(centerPosition) - size + radius, 0.0)) - radius;
  }

  float gaussian(float x, float sigma) {
    return exp(-(x * x) / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159) * sigma);
  }

  void main() {
    vec2 pixelCoord = gl_FragCoord.xy;
    vec2 centerPosition = (pixelCoord - u_shape.xy);
    
    float distance = u_shape.w == 0.0
      ? length(centerPosition) - u_shape.z
      : roundedBoxSDF(centerPosition, u_shape.zw, u_borderRadius);
    
    if (distance > 0.0) discard;
    
    vec4 blurredColor = vec4(0.0);
    float totalWeight = 0.0;
    float sigma = u_blurStrength / 3.0;
    
    for (int x = -blurSizing; x <= blurSizing; x++) {
      for (int y = -blurSizing; y <= blurSizing; y++) {
        if (float(x * x + y * y) > u_blurStrength * u_blurStrength) continue;
        vec2 offset = vec2(float(x), float(y)) / u_resolution;
        float weight = gaussian(length(offset), sigma);
        blurredColor += texture2D(u_texture, v_texcoord + offset) * weight;
        totalWeight += weight;
      }
    }
    
    gl_FragColor = blurredColor / totalWeight;
  }
`;

const vertexShaderSrc = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
  }
`;

export const GameBlur: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', {
            antialias: false,
            depth: false,
            stencil: false,
            alpha: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false
        });

        if (!gl) {
            // console.error('WebGL not supported');
            return;
        }

        // Shader creation helpers
        const makeShader = (type: number, src: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            const infoLog = gl.getShaderInfoLog(shader);
            if (infoLog) console.error(infoLog);
            return shader;
        };

        const createTexture = () => {
            const tex = gl.createTexture();
            const texPixels = new Uint8Array([0, 0, 0, 0]);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texPixels);

            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            return tex;
        };

        const createBuffers = () => {
            const vertexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

            const texBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

            return { vertexBuff, texBuff };
        };

        const createProgram = () => {
            const program = gl.createProgram();
            if (!program) return null;

            const vShader = makeShader(gl.VERTEX_SHADER, vertexShaderSrc);
            const fShader = makeShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);

            if (!vShader || !fShader) return null;

            gl.attachShader(program, vShader);
            gl.attachShader(program, fShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
                return null;
            }

            return {
                program,
                attribLocations: {
                    position: gl.getAttribLocation(program, 'a_position'),
                    texcoord: gl.getAttribLocation(program, 'a_texcoord'),
                },
                uniformLocations: {
                    shape: gl.getUniformLocation(program, 'u_shape'),
                    borderRadius: gl.getUniformLocation(program, 'u_borderRadius'),
                    resolution: gl.getUniformLocation(program, 'u_resolution'),
                    blurStrength: gl.getUniformLocation(program, 'u_blurStrength'),
                    texture: gl.getUniformLocation(program, 'u_texture'),
                },
            };
        };

        const tex = createTexture();
        const programInfo = createProgram();
        const { vertexBuff, texBuff } = createBuffers();

        if (!programInfo || !vertexBuff || !texBuff) {
            console.error('Failed to initialize WebGL resources');
            return;
        }

        gl.useProgram(programInfo.program);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(programInfo.uniformLocations.texture, 0);

        // Setup attributes
        if (programInfo.attribLocations.position !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
            gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.position);
        }

        if (programInfo.attribLocations.texcoord !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
            gl.vertexAttribPointer(programInfo.attribLocations.texcoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.texcoord);
        }

        let currentResolutionScale = config.resolutionScale;
        let animationFrameId: number;

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const scaledWidth = Math.ceil(width * currentResolutionScale);
            const scaledHeight = Math.ceil(height * currentResolutionScale);

            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            gl.viewport(0, 0, scaledWidth, scaledHeight);
        };

        const render = () => {
            const glassElements = document.querySelectorAll<HTMLElement>('[data-game-blur]');

            // If no elements, just clear and return (optional: stop loop if performance is issue)
            if (glassElements.length === 0) {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            const canvasRect = canvas.getBoundingClientRect();
            gl.clearColor(...(config.renderColour as [number, number, number, number]));
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(programInfo.program);

            glassElements.forEach(element => {
                // Ensure element is visible
                if (getComputedStyle(element).display === 'none') return;

                const rect = element.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;

                const buffer = 1;
                // Coordinates need to be relative to the viewport/canvas
                // scaling must match what's happening in shader
                const scaledLeft = Math.floor((rect.left) * currentResolutionScale) - buffer;
                const scaledTop = Math.floor((rect.top) * currentResolutionScale) - buffer;
                const scaledWidth = Math.ceil(rect.width * currentResolutionScale) + buffer * 2;
                const scaledHeight = Math.ceil(rect.height * currentResolutionScale) + buffer * 2;

                const centerX = scaledLeft + scaledWidth / 2;
                // WebGL Y is inverted relative to DOM
                const centerY = gl.canvas.height - (scaledTop + scaledHeight / 2);

                const styles = getComputedStyle(element);
                const borderRadius = parseFloat(styles.borderRadius) || 0;
                const isCircle = styles.borderRadius.includes('%') && parseFloat(styles.borderRadius) >= 50;

                gl.uniform4f(programInfo.uniformLocations.shape, centerX, centerY,
                    isCircle ? scaledWidth / 2 : scaledWidth / 2,
                    isCircle ? 0 : scaledHeight / 2);

                gl.uniform1f(programInfo.uniformLocations.borderRadius, borderRadius * currentResolutionScale);
                gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);

                const blurStrength = parseFloat(element.dataset.blurStrength || String(config.defaultBlurStrength));
                gl.uniform1f(programInfo.uniformLocations.blurStrength, blurStrength);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        resize();
        render();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: -1,
            }}
        />
    );
};
