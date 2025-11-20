import{w as r,x as z,t as d,z as $,A as X}from"./index-U1XOcH-j.js";const j=({children:t,className:e="",title:o,subtitle:s,delay:n=0})=>r.jsxs(z.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-10%"},transition:{duration:.8,delay:n,ease:[.22,1,.36,1]},className:`group relative overflow-hidden bg-[var(--color-surface)]/40 backdrop-blur-md border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors duration-500 ${e}`,style:{isolation:"auto"},children:[r.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"}),r.jsx("div",{className:"absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity",children:r.jsx("div",{className:"w-2 h-2 border-t border-r border-[var(--color-accent)]"})}),r.jsx("div",{className:"absolute bottom-0 left-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity",children:r.jsx("div",{className:"w-2 h-2 border-b border-l border-[var(--color-accent)]"})}),r.jsxs("div",{className:"relative z-10 p-6 h-full flex flex-col",children:[(o||s)&&r.jsxs("div",{className:"mb-6",children:[s&&r.jsx("span",{className:"block font-mono-tech text-[9px] text-[var(--color-accent)] tracking-widest uppercase mb-1",children:s}),o&&r.jsx("h3",{className:"font-cinzel text-xl text-[var(--color-text-primary)]",children:o})]}),r.jsx("div",{className:"flex-grow",children:t})]})]}),G={patternScale:2,refraction:.015,edge:1,patternBlur:.005,liquid:.07,speed:.3},H=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),I=navigator.hardwareConcurrency<=4||H,Q=I?20:45,Z=1e3/Q,K=`#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`,Y=`#version 300 es
precision ${I?"lowp":"mediump"} float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz - vec4(i1, 0., 0.);
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m; m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

vec2 get_img_uv() {
  vec2 img_uv = vUv - .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;
  return img_uv;
}
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
  float ch = c2;
  float blur = u_patternBlur + extra_blur;
  ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));
  float border = w[0];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  b = smoothstep(.2, .8, b);
  border = w[0] + .4 * (1. - b) * w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + .5 * (1. - b) * w[1];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));
  return ch;
}
float get_img_frame_alpha(vec2 uv, float img_frame_width) {
  float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
  img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
  return img_frame_alpha;
}
void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;
  float diagonal = uv.x - uv.y;
  float t = .001 * u_time;
  vec2 img_uv = get_img_uv();
  vec4 img = texture(u_image_texture, img_uv);
  vec3 color = vec3(0.);
  float opacity = 1.;
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));
  float edge = img.r;
  vec2 grad_uv = uv - .5;
  float dist = length(grad_uv + vec2(0., .2 * diagonal));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * 3.14159);
  float bulge = pow(1.8 * dist, 1.2);
  bulge = 1. - bulge;
  bulge *= pow(uv.y, .3);
  float cycle_width = u_patternScale;
  float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
  float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);
  float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
  float thin_strip_2_width = cycle_width * thin_strip_2_ratio;
  opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
  opacity *= get_img_frame_alpha(img_uv, 0.01);
  float noise = snoise(uv - t);
  edge += (1. - edge) * u_liquid * noise;
  float refr = (1. - bulge);
  refr = clamp(refr, 0., 1.);
  float dir = grad_uv.x + diagonal;
  dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));
  bulge *= clamp(pow(uv.y, .1), .3, 1.);
  dir *= (.1 + (1.1 - edge) * bulge);
  dir *= smoothstep(1., .7, edge);
  dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
  dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));
  dir *= (.5 + .5 * pow(uv.y, 2.));
  dir *= cycle_width;
  dir -= t;
  float refr_r = refr + .03 * bulge * noise;
  float refr_b = 1.3 * refr;
  refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
  refr_r -= diagonal;
  refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
  refr_b -= .2 * edge;
  refr_r *= u_refraction;
  refr_b *= u_refraction;
  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
  float stripe_r = mod(dir + refr_r, 1.);
  float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
  float stripe_g = mod(dir, 1.);
  float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);
  float stripe_b = mod(dir - refr_b, 1.);
  float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);
  color = vec3(r, g, b) * opacity;
  fragColor = vec4(color, opacity);
}
`,B=(t,e,o)=>{const s=t.createShader(o);return s?(t.shaderSource(s,e),t.compileShader(s),t.getShaderParameter(s,t.COMPILE_STATUS)?s:(console.error("Shader compilation error:",t.getShaderInfoLog(s)),t.deleteShader(s),null)):null},J=(t,e)=>{const o={},s=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<s;n++){const l=e.getActiveUniform(t,n)?.name;l&&(o[l]=e.getUniformLocation(t,l))}return o};function ee({imageData:t,params:e=G,renderSize:o}){const s=d.useRef(null),n=d.useRef(null),l=d.useRef(null),c=d.useRef(null),m=d.useRef({}),v=d.useRef({totalTime:0,lastRenderTime:0,lastFrameTime:0,frameCount:0}),x=d.useRef(null),y=d.useRef(!0),[u,S]=d.useState(!1),f=d.useMemo(()=>e,[e.patternScale,e.refraction,e.edge,e.patternBlur,e.liquid,e.speed]);return d.useEffect(()=>{const a=()=>{y.current=!document.hidden,y.current&&(v.current.lastFrameTime=performance.now())};return document.addEventListener("visibilitychange",a),()=>document.removeEventListener("visibilitychange",a)},[]),d.useEffect(()=>{const a=s.current;if(!a)return;const i=a.getContext("webgl2",{antialias:!1,alpha:!0,powerPreference:I?"low-power":"high-performance",desynchronized:!0,preserveDrawingBuffer:!1,premultipliedAlpha:!0,stencil:!1,depth:!1});if(!i)return;n.current=i;const p=B(i,K,i.VERTEX_SHADER),h=B(i,Y,i.FRAGMENT_SHADER);if(!p||!h)return;const g=i.createProgram();if(!g||(i.attachShader(g,p),i.attachShader(g,h),i.linkProgram(g),!i.getProgramParameter(g,i.LINK_STATUS)))return;l.current=g,m.current=J(g,i);const R=new Float32Array([-1,-1,1,-1,-1,1,1,1]),b=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,b),i.bufferData(i.ARRAY_BUFFER,R,i.STATIC_DRAW),i.useProgram(g);const w=i.getAttribLocation(g,"a_position");return i.enableVertexAttribArray(w),i.vertexAttribPointer(w,2,i.FLOAT,!1,0,0),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),S(!0),()=>{x.current&&cancelAnimationFrame(x.current),c.current&&i.deleteTexture(c.current),i.deleteProgram(g),i.deleteShader(p),i.deleteShader(h),i.deleteBuffer(b)}},[]),d.useEffect(()=>{const a=n.current,i=m.current;!a||!Object.keys(i).length||!u||(a.useProgram(l.current),a.uniform1f(i.u_edge,f.edge),a.uniform1f(i.u_patternBlur,f.patternBlur),a.uniform1f(i.u_patternScale,f.patternScale),a.uniform1f(i.u_refraction,f.refraction),a.uniform1f(i.u_liquid,f.liquid))},[f,u]),d.useEffect(()=>{const a=n.current,i=m.current;if(!a||!Object.keys(i).length||!t||!u)return;const p=I?3:1;let h=null,g=0,R=performance.now(),b=0;const w=N=>{if(!y.current){v.current.lastRenderTime=N,h=requestAnimationFrame(w);return}const E=v.current;if(p>0&&(g++,g%(p+1)!==0)){h=requestAnimationFrame(w);return}const W=N-R;if(b+=W,b<Z*.9){h=requestAnimationFrame(w);return}R=N;const V=b;b=0,E.totalTime+=V*f.speed,E.totalTime=E.totalTime%12e3,a.uniform1f(i.u_time,E.totalTime),a.drawArrays(a.TRIANGLE_STRIP,0,4),h=requestAnimationFrame(w)};return v.current.lastRenderTime=performance.now(),h=requestAnimationFrame(w),()=>{h&&cancelAnimationFrame(h)}},[t,f.speed,u]),d.useEffect(()=>{const a=n.current,i=s.current,p=m.current;if(!i||!a||!Object.keys(p).length||!t||!u)return;let h;const g=()=>{clearTimeout(h),h=setTimeout(()=>{const R=t.width/t.height,b=o||(I?64:96),w=Math.min(window.devicePixelRatio,I?1:1.25),N=b*w,E=b*w;(i.width!==N||i.height!==E)&&(i.width=N,i.height=E,a.viewport(0,0,N,E)),a.useProgram(l.current),a.uniform1f(p.u_ratio,1),a.uniform1f(p.u_img_ratio,R)},250)};return g(),window.addEventListener("resize",g,{passive:!0}),()=>{clearTimeout(h),window.removeEventListener("resize",g)}},[t,u,o]),d.useEffect(()=>{const a=n.current,i=m.current;if(!a||!Object.keys(i).length||!t||!u)return;c.current&&a.deleteTexture(c.current);const p=a.createTexture();c.current=p,a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,p);const h=I?a.LINEAR:a.LINEAR_MIPMAP_LINEAR;return a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,h),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,t.width,t.height,0,a.RGBA,a.UNSIGNED_BYTE,t.data),I||a.generateMipmap(a.TEXTURE_2D),a.useProgram(l.current),a.uniform1i(i.u_image_texture,0),()=>{p&&a.deleteTexture(p)}},[t,u]),r.jsx("canvas",{ref:s,style:{width:"100%",height:"100%"}})}const te=d.memo(ee),re=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),_=navigator.hardwareConcurrency<=4||re;class ae{constructor(e=40){this.maxSize=e,this.cache=new Map,this.accessCount=new Map}get(e){const o=this.cache.get(e);return o&&(this.accessCount.set(e,(this.accessCount.get(e)||0)+1),this.cache.delete(e),this.cache.set(e,o)),o}set(e,o){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxSize){let s=null,n=1/0;for(const[l,c]of this.accessCount)c<n&&(n=c,s=l);s&&(this.cache.delete(s),this.accessCount.delete(s))}this.cache.set(e,o),this.accessCount.set(e,1)}has(e){return this.cache.has(e)}clear(){this.cache.clear(),this.accessCount.clear()}}class oe{constructor(){this.high=new Set,this.normal=new Set,this.low=new Set}addHigh(e){this.normal.delete(e),this.low.delete(e),this.high.add(e)}addNormal(e){this.high.has(e)||(this.low.delete(e),this.normal.add(e))}addLow(e){!this.high.has(e)&&!this.normal.has(e)&&this.low.add(e)}getNext(){if(this.high.size>0){const e=this.high.values().next().value;return this.high.delete(e),e}if(this.normal.size>0){const e=this.normal.values().next().value;return this.normal.delete(e),e}if(this.low.size>0){const e=this.low.values().next().value;return this.low.delete(e),e}return null}get size(){return this.high.size+this.normal.size+this.low.size}}const ie=Math.min(navigator.hardwareConcurrency||2,_?2:3);let M=[],k=0,se=0;const U=new Map,ne=new oe,ce=()=>{if(typeof Worker>"u"||M.length>0)return;const t=`
    // Worker-scoped device detection
    let isLowEndDevice = false;

    // Metallic Icon Processing (Simple Alpha Inversion)
    function processMetallicIconOnWorker(imageBitmap, maxSize = 128) {
      return new Promise((resolve) => {
        let width = imageBitmap.width;
        let height = imageBitmap.height;

        // Downscale if needed
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Use OffscreenCanvas for rendering
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
          alpha: true,
        });

        ctx.drawImage(imageBitmap, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Alpha inversion for metallic shader
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i + 3];
        }

        resolve({ imageData });
      });
    }

    // Logo Processing with Distance Field (for SkillIcon)
    function parseLogoImageOnWorker(imageBitmap) {
      return new Promise((resolve) => {
        const MAX_SIZE = isLowEndDevice ? 224 : 320;
        const MIN_SIZE = isLowEndDevice ? 112 : 160;
        let width = imageBitmap.width;
        let height = imageBitmap.height;

        const ratio = width / height;
        if (width > MAX_SIZE || height > MAX_SIZE || width < MIN_SIZE || height < MIN_SIZE) {
          if (ratio > 1) {
            width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, width));
            height = Math.round(width / ratio);
          } else {
            height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, height));
            width = Math.round(height * ratio);
          }
        }

        width = (width >> 2) << 2;
        height = (height >> 2) << 2;

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: true });
        
        ctx.imageSmoothingEnabled = !isLowEndDevice;
        ctx.imageSmoothingQuality = "low";
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        const shapeImageData = ctx.getImageData(0, 0, width, height);
        const data = shapeImageData.data;
        const length = width * height;
        const shapeMask = new Uint8Array(length);

        // Create shape mask
        for (let i = 0; i < length; i++) {
          shapeMask[i] = data[(i << 2) + 3] > 20 ? 1 : 0;
        }

        // Create boundary mask
        const boundaryMask = new Uint8Array(length);
        for (let y = 1; y < height - 1; y++) {
          const yOffset = y * width;
          for (let x = 1; x < width - 1; x++) {
            const idx = yOffset + x;
            if (shapeMask[idx] && (!shapeMask[idx - 1] || !shapeMask[idx + 1] || 
                !shapeMask[idx - width] || !shapeMask[idx + width])) {
              boundaryMask[idx] = 1;
            }
          }
        }

        // Distance field calculation
        let u = new Float32Array(length);
        let newU = new Float32Array(length);
        u.fill(0);

        const C = 0.01;
        const ITERATIONS = isLowEndDevice ? 40 : 65;
        const getU = (idx, arr) => (shapeMask[idx] ? arr[idx] : 0);

        for (let iter = 0; iter < ITERATIONS; iter++) {
          for (let i = 0; i < length; i++) {
            if (!shapeMask[i] || boundaryMask[i]) {
              newU[i] = 0;
              continue;
            }
            const x = i % width;
            const y = (i / width) | 0;
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) continue;

            const sumN = getU(i + 1, u) + getU(i - 1, u) + getU(i + width, u) + getU(i - width, u);
            newU[i] = (C + sumN) * 0.25;
          }
          [u, newU] = [newU, u];
        }

        // Find max value
        let maxVal = 0;
        for (let i = 0; i < length; i++) {
          if (u[i] > maxVal) maxVal = u[i];
        }

        // Create output image
        const invMaxVal = maxVal > 0 ? 1 / maxVal : 0;
        const outImg = ctx.createImageData(width, height);
        const outData = outImg.data;
        const ALPHA = 2.0;

        for (let i = 0; i < length; i++) {
          const px = i << 2;
          if (!shapeMask[i]) {
            outData[px] = outData[px + 1] = outData[px + 2] = outData[px + 3] = 255;
          } else {
            const normalized = u[i] * invMaxVal;
            const gray = (255 * (1 - Math.pow(normalized, ALPHA))) | 0;
            outData[px] = outData[px + 1] = outData[px + 2] = gray;
            outData[px + 3] = 255;
          }
        }

        ctx.putImageData(outImg, 0, 0);
        canvas.convertToBlob({ type: "image/png", quality: 0.75 }).then((blob) => {
          resolve({ imageData: outImg, pngBlob: blob });
        });
      });
    }

    // Worker Message Handler
    self.onmessage = async (e) => {
      const { id, imageBitmap, isLowEnd, mode, maxSize } = e.data;
      isLowEndDevice = isLowEnd;

      if (!imageBitmap) {
        self.postMessage({ id, error: "No ImageBitmap received in worker." });
        return;
      }

      try {
        let parsedData;

        if (mode === "metallic") {
          parsedData = await processMetallicIconOnWorker(imageBitmap, maxSize || 128);
        } else {
          parsedData = await parseLogoImageOnWorker(imageBitmap);
        }

        imageBitmap.close();
        self.postMessage({ id, payload: parsedData }, [parsedData.imageData.data.buffer]);
      } catch (error) {
        imageBitmap.close();
        self.postMessage({ id, error: \`Worker processing failed: \${error.message}\` });
      }
    };
  `,e=new Blob([t],{type:"application/javascript"}),o=URL.createObjectURL(e);for(let s=0;s<ie;s++){const n=new Worker(o);n.onmessage=l=>{const{id:c,payload:m,error:v}=l.data,x=U.get(c);x&&(v?x.reject(new Error(v)):x.resolve(m),U.delete(c))},n.onerror=l=>{console.error(`Worker ${s} error:`,l)},M.push(n)}URL.revokeObjectURL(o)};let O=!1;const F=()=>{O||(ce(),O=!0)},A=new ae(_?35:45),le=(t,e=_?192:256)=>new Promise((o,s)=>{const n=new Image;n.crossOrigin="anonymous",n.decoding="async";const l=setTimeout(()=>{n.src="",s(new Error(`Timeout loading: ${t}`))},1e4);n.onload=async()=>{clearTimeout(l);try{const c=t.toLowerCase().endsWith(".svg"),m={premultiplyAlpha:"premultiply",colorSpaceConversion:"none",resizeQuality:_?"pixelated":"low",imageOrientation:"none"};c&&(m.resizeWidth=e,m.resizeHeight=e);const v=await createImageBitmap(n,m);o(v)}catch(c){s(c)}},n.onerror=()=>{clearTimeout(l),s(new Error(`Failed to load image from URL: ${t}`))},n.src=t}),q=(t,e="default",o)=>new Promise((s,n)=>{if(M.length===0)return n(new Error("Worker pool not initialized."));const l=M[k];k=(k+1)%M.length;const c=se++;U.set(c,{resolve:s,reject:n}),l.postMessage({id:c,imageBitmap:t,isLowEnd:_,mode:e,maxSize:o},[t])}),de=async(t,e="normal")=>{if(!t)throw new Error("No icon source provided.");const o=A.get(t);if(o)return o;F();try{const s=await le(t),n=await q(s,"default");return A.set(t,n),n}catch(s){throw console.error(`Error processing icon ${t}:`,s),s}},ue=async(t,e=_?64:96)=>{if(!t)throw new Error("No icon source provided.");const o=`metallic_${e}_${t}`,s=A.get(o);if(s)return s;F();try{const n=t.toLowerCase().endsWith(".svg"),l=await new Promise((x,y)=>{const u=new Image;u.crossOrigin="anonymous";const S=setTimeout(()=>{y(new Error(`Image load timeout: ${t}`))},5e3);u.onload=()=>{clearTimeout(S),x(u)},u.onerror=f=>{clearTimeout(S),y(new Error(`Failed to load image: ${t}`))},u.src=t}),c={premultiplyAlpha:"premultiply",colorSpaceConversion:"none",resizeQuality:_?"pixelated":"medium"};n&&(c.resizeWidth=e,c.resizeHeight=e);const m=await createImageBitmap(l,c),v=await q(m,"metallic",e);return A.set(o,v.imageData),v.imageData}catch(n){throw console.error(`Error processing metallic icon ${t}:`,n),n}},T=ne;let L=!1,C=!1;const me=(t,e="low")=>{t.forEach(o=>{if(!A.has(o))switch(e){case"high":T.addHigh(o);break;case"normal":T.addNormal(o);break;default:T.addLow(o)}}),!L&&!C&&(C=!0,he())},he=()=>{if(T.size===0){L=!1,C=!1;return}L=!0;const t=e=>{const o=_?2:4,s=_?2:4;let n=0;for(;(e.timeRemaining()>o||e.didTimeout)&&T.size>0&&n<s;){const l=T.getNext();if(!l)break;de(l).catch(c=>console.warn(`Preload failed for ${l}:`,c)),n++}T.size>0?requestIdleCallback(t,{timeout:_?800:1e3}):(L=!1,C=!1)};"requestIdleCallback"in window?requestIdleCallback(t,{timeout:_?800:1e3}):setTimeout(()=>t({timeRemaining:()=>16,didTimeout:!0}),25)};typeof window<"u"&&window.addEventListener("beforeunload",()=>{A.clear(),M.forEach(t=>t.terminate()),M=[]},{once:!0});const ge=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),fe=navigator.hardwareConcurrency<=4||ge,D=({src:t,alt:e,className:o=""})=>{const[s,n]=d.useState(null),[l,c]=d.useState(!0),[m,v]=d.useState(!1),x=d.useRef(null);d.useEffect(()=>{const u=new IntersectionObserver(S=>{S.forEach(f=>{f.isIntersecting&&(v(!0),u.disconnect())})},{rootMargin:"100px",threshold:.01});return x.current&&u.observe(x.current),()=>u.disconnect()},[]),d.useEffect(()=>{if(!m)return;let u=!0;return(async()=>{try{c(!0);const f=await ue(t);u&&(n(f),c(!1))}catch(f){console.warn("MetallicIcon processing failed:",f),u&&(n(null),c(!1))}})(),()=>{u=!1}},[t,m]);const y=d.useMemo(()=>({patternScale:2.5,refraction:.018,edge:.5,patternBlur:.003,liquid:.04,speed:.15}),[]);return l||!s?r.jsx("div",{ref:x,className:`${o} relative overflow-hidden bg-[var(--color-surface)]/20 rounded-lg animate-pulse`,children:!m&&r.jsx("div",{className:"w-full h-full"})}):r.jsx("div",{ref:x,className:`${o} relative overflow-hidden`,children:r.jsx(te,{imageData:s,params:y,renderSize:fe?64:96})})},pe=()=>r.jsxs("div",{className:"absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]",children:[r.jsx("svg",{className:"relative block w-[calc(100%+1.3px)] h-[60px] text-[var(--color-background)] fill-current",preserveAspectRatio:"none",viewBox:"0 0 1200 120",children:r.jsx("path",{d:"M1200 120L0 16.48 0 0 1200 0 1200 120z",className:"opacity-100"})}),r.jsx("div",{className:"absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent"})]}),P={frontend:[{name:"React",iconSrc:"icons/react.svg"},{name:"JavaScript",iconSrc:"icons/javascript.svg"},{name:"TypeScript",iconSrc:"icons/typescript.svg"},{name:"Swift",iconSrc:"icons/swift.svg"},{name:"Tailwind",iconSrc:"icons/tailwind.svg"},{name:"Framer Motion",iconSrc:"icons/framer.svg"},{name:"Three.js",iconSrc:"icons/threejs.svg"}],backend:[{name:"Node.js",iconSrc:"icons/nodejs.svg"},{name:"Python",iconSrc:"icons/python.svg"},{name:"Java",iconSrc:"icons/java.svg"},{name:"C# / .NET",iconSrc:"icons/csharp.svg"},{name:"PHP",iconSrc:"icons/php.svg"},{name:"PostgreSQL",iconSrc:"icons/postgresql.svg"},{name:"MySQL",iconSrc:"icons/mysql.svg"}],ai:[{name:"OpenCV",iconSrc:"icons/opencv.svg"},{name:"TensorFlow",iconSrc:"icons/tensorflow.svg"},{name:"LLMs",iconSrc:"icons/ai.svg"}],tools:[{name:"Git",iconSrc:"icons/git.svg"},{name:"Docker",iconSrc:"icons/docker.svg"},{name:"Figma",iconSrc:"icons/figma.svg"}]};function xe(){const t=d.useRef(null),{scrollYProgress:e}=$({target:t,offset:["start end","end start"]});return X(e,[0,1],[50,-50]),d.useEffect(()=>{const o=Object.values(P).flatMap(s=>s.map(n=>n.iconSrc));me(o,"normal")},[]),r.jsxs("section",{id:"skills",ref:t,className:"relative py-32 bg-transparent overflow-hidden min-h-screen",children:[r.jsx(pe,{}),r.jsxs("div",{className:"absolute inset-0 z-0 pointer-events-none",children:[r.jsx("div",{className:"absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[100px] opacity-30"}),r.jsx("div",{className:"absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] opacity-20"}),r.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]"})]}),r.jsxs("div",{className:"max-w-7xl mx-auto px-6 lg:px-8 relative z-10",children:[r.jsxs("div",{className:"mb-20 border-b border-white/40 pb-12",children:[r.jsxs(z.div,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0},className:"inline-flex items-center gap-3 mb-6",children:[r.jsx("div",{className:"h-[1px] w-12 bg-[var(--color-accent)]"}),r.jsx("span",{className:"font-mono-tech text-xs text-[var(--color-accent)] tracking-[0.3em]",children:"CAPABILITIES // 003"})]}),r.jsxs(z.h2,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.8,delay:.1},className:"font-cinzel text-5xl sm:text-7xl lg:text-8xl leading-[0.85] text-[var(--color-text-primary)] tracking-tight",children:["Technical ",r.jsx("br",{}),r.jsx("span",{className:"font-cormorant italic text-[var(--color-accent)] font-light",children:"Arsenal"})]})]}),r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(180px,auto)]",children:[r.jsx(j,{className:"md:col-span-2 md:row-span-2",title:"Frontend Engineering",subtitle:"VISUAL INTERFACE",delay:.1,children:r.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4",children:P.frontend.map(o=>r.jsxs("div",{className:"flex flex-col items-center gap-2 group/icon",children:[r.jsx("div",{className:"p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-16 h-16 flex items-center justify-center",children:r.jsx(D,{src:o.iconSrc,alt:o.name,className:"w-10 h-10"})}),r.jsx("span",{className:"text-xs font-mono-tech text-[var(--color-text-secondary)]",children:o.name})]},o.name))})}),r.jsx(j,{className:"md:col-span-1 md:row-span-2",title:"Backend Systems",subtitle:"CORE LOGIC",delay:.2,children:r.jsx("div",{className:"flex flex-col gap-6 mt-4",children:P.backend.map(o=>r.jsxs("div",{className:"flex items-center gap-4 group/icon",children:[r.jsx("div",{className:"p-2 rounded bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-12 h-12 flex items-center justify-center flex-shrink-0",children:r.jsx(D,{src:o.iconSrc,alt:o.name,className:"w-8 h-8"})}),r.jsx("span",{className:"text-sm font-mono-tech text-[var(--color-text-secondary)]",children:o.name})]},o.name))})}),r.jsx(j,{className:"md:col-span-1 lg:col-span-1 md:row-span-1",title:"AI Integration",subtitle:"INTELLIGENCE",delay:.3,children:r.jsx("div",{className:"flex flex-wrap gap-3 mt-4",children:P.ai.map(o=>r.jsx("span",{className:"px-3 py-1 text-[10px] font-mono-tech border border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-full bg-[var(--color-accent)]/5",children:o.name},o.name))})}),r.jsx(j,{className:"md:col-span-1 lg:col-span-1 md:row-span-1",title:"DevOps & Tools",subtitle:"INFRASTRUCTURE",delay:.4,children:r.jsx("div",{className:"flex gap-4 mt-4 justify-center",children:P.tools.map(o=>r.jsx("div",{className:"group/icon relative w-10 h-10 m-2",children:r.jsx(D,{src:o.iconSrc,alt:o.name,className:"w-full h-full"})},o.name))})}),r.jsx(j,{className:"md:col-span-3 lg:col-span-4 min-h-[120px] lg:max-h-[120px] flex items-center justify-center bg-[var(--color-accent)]/5 !border-[var(--color-accent)]/20",delay:.5,children:r.jsxs("div",{className:"flex flex-col md:flex-row items-center gap-4 md:gap-12 text-center",children:[r.jsxs("div",{children:[r.jsx("span",{className:"block text-3xl font-cinzel text-[var(--color-accent)]",children:"100%"}),r.jsx("span",{className:"text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest",children:"COMMITMENT"})]}),r.jsx("div",{className:"hidden md:block w-[1px] h-8 bg-[var(--color-accent)]/30"}),r.jsxs("div",{children:[r.jsx("span",{className:"block text-3xl font-cinzel text-[var(--color-accent)]",children:"24/7"}),r.jsx("span",{className:"text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest",children:"UPTIME"})]}),r.jsx("div",{className:"hidden md:block w-[1px] h-8 bg-[var(--color-accent)]/30"}),r.jsx("div",{className:"max-w-md text-sm text-[var(--color-text-secondary)] font-light italic",children:'"Constantly evolving my stack to build faster, scalable, and more resilient systems."'})]})})]})]})]})}export{xe as default};
