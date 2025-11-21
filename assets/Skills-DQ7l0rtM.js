import{w as o,x as y,t as d,z as $,A as X}from"./index-BWvUXRnE.js";const C=({children:r,className:e="",title:c,subtitle:n,delay:t=0,isMobile:s=!1})=>o.jsxs(y.div,{initial:{opacity:0,y:s?15:30},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:s?"0%":"-10%",amount:s?.2:.3},transition:{duration:s?.4:.8,delay:s?t*.5:t,ease:[.22,1,.36,1]},className:`
        relative p-6 md:p-8
        bg-[var(--color-surface)]/30
        backdrop-blur-sm
        border border-[var(--color-border)]
        hover:border-[var(--color-accent)]/40
        transition-all duration-500 ease-out
        group
        ${e}
      `,style:{willChange:"auto"},children:[(c||n)&&o.jsxs("div",{className:"mb-4",children:[n&&o.jsx("span",{className:"font-mono-tech text-[9px] md:text-[10px] text-[var(--color-accent)] tracking-[0.2em] block mb-2 opacity-70",children:n}),c&&o.jsx("h3",{className:"font-cinzel text-lg md:text-xl text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-500",children:c})]}),r,o.jsx("div",{className:"absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/5 transition-all duration-500 pointer-events-none rounded-sm"})]}),G={patternScale:2,refraction:.015,edge:1,patternBlur:.005,liquid:.07,speed:.3},H=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),S=navigator.hardwareConcurrency<=4||H,Q=S?20:45,Z=1e3/Q,K=`#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`,Y=`#version 300 es
precision ${S?"lowp":"mediump"} float;
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
`,B=(r,e,c)=>{const n=r.createShader(c);return n?(r.shaderSource(n,e),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)?n:(console.error("Shader compilation error:",r.getShaderInfoLog(n)),r.deleteShader(n),null)):null},J=(r,e)=>{const c={},n=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<n;t++){const s=e.getActiveUniform(r,t)?.name;s&&(c[s]=e.getUniformLocation(r,s))}return c};function ee({imageData:r,params:e=G,renderSize:c}){const n=d.useRef(null),t=d.useRef(null),s=d.useRef(null),l=d.useRef(null),u=d.useRef({}),x=d.useRef({totalTime:0,lastRenderTime:0,lastFrameTime:0,frameCount:0}),v=d.useRef(null),E=d.useRef(!0),[m,T]=d.useState(!1),p=d.useMemo(()=>e,[e.patternScale,e.refraction,e.edge,e.patternBlur,e.liquid,e.speed]);return d.useEffect(()=>{const a=()=>{E.current=!document.hidden,E.current&&(x.current.lastFrameTime=performance.now())};return document.addEventListener("visibilitychange",a),()=>document.removeEventListener("visibilitychange",a)},[]),d.useEffect(()=>{const a=n.current;if(!a)return;const i=a.getContext("webgl2",{antialias:!1,alpha:!0,powerPreference:S?"low-power":"high-performance",desynchronized:!0,preserveDrawingBuffer:!1,premultipliedAlpha:!0,stencil:!1,depth:!1});if(!i)return;t.current=i;const f=B(i,K,i.VERTEX_SHADER),h=B(i,Y,i.FRAGMENT_SHADER);if(!f||!h)return;const g=i.createProgram();if(!g||(i.attachShader(g,f),i.attachShader(g,h),i.linkProgram(g),!i.getProgramParameter(g,i.LINK_STATUS)))return;s.current=g,u.current=J(g,i);const A=new Float32Array([-1,-1,1,-1,-1,1,1,1]),b=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,b),i.bufferData(i.ARRAY_BUFFER,A,i.STATIC_DRAW),i.useProgram(g);const w=i.getAttribLocation(g,"a_position");return i.enableVertexAttribArray(w),i.vertexAttribPointer(w,2,i.FLOAT,!1,0,0),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),T(!0),()=>{v.current&&cancelAnimationFrame(v.current),l.current&&i.deleteTexture(l.current),i.deleteProgram(g),i.deleteShader(f),i.deleteShader(h),i.deleteBuffer(b)}},[]),d.useEffect(()=>{const a=t.current,i=u.current;!a||!Object.keys(i).length||!m||(a.useProgram(s.current),a.uniform1f(i.u_edge,p.edge),a.uniform1f(i.u_patternBlur,p.patternBlur),a.uniform1f(i.u_patternScale,p.patternScale),a.uniform1f(i.u_refraction,p.refraction),a.uniform1f(i.u_liquid,p.liquid))},[p,m]),d.useEffect(()=>{const a=t.current,i=u.current;if(!a||!Object.keys(i).length||!r||!m)return;const f=S?3:1;let h=null,g=0,A=performance.now(),b=0;const w=N=>{if(!E.current){x.current.lastRenderTime=N,h=requestAnimationFrame(w);return}const I=x.current;if(f>0&&(g++,g%(f+1)!==0)){h=requestAnimationFrame(w);return}const q=N-A;if(b+=q,b<Z*.9){h=requestAnimationFrame(w);return}A=N;const W=b;b=0,I.totalTime+=W*p.speed,I.totalTime=I.totalTime%12e3,a.uniform1f(i.u_time,I.totalTime),a.drawArrays(a.TRIANGLE_STRIP,0,4),h=requestAnimationFrame(w)};return x.current.lastRenderTime=performance.now(),h=requestAnimationFrame(w),()=>{h&&cancelAnimationFrame(h)}},[r,p.speed,m]),d.useEffect(()=>{const a=t.current,i=n.current,f=u.current;if(!i||!a||!Object.keys(f).length||!r||!m)return;let h;const g=()=>{clearTimeout(h),h=setTimeout(()=>{const A=r.width/r.height,b=c||(S?64:96),w=Math.min(window.devicePixelRatio,S?1:1.25),N=b*w,I=b*w;(i.width!==N||i.height!==I)&&(i.width=N,i.height=I,a.viewport(0,0,N,I)),a.useProgram(s.current),a.uniform1f(f.u_ratio,1),a.uniform1f(f.u_img_ratio,A)},250)};return g(),window.addEventListener("resize",g,{passive:!0}),()=>{clearTimeout(h),window.removeEventListener("resize",g)}},[r,m,c]),d.useEffect(()=>{const a=t.current,i=u.current;if(!a||!Object.keys(i).length||!r||!m)return;l.current&&a.deleteTexture(l.current);const f=a.createTexture();l.current=f,a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,f);const h=S?a.LINEAR:a.LINEAR_MIPMAP_LINEAR;return a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,h),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,r.width,r.height,0,a.RGBA,a.UNSIGNED_BYTE,r.data),S||a.generateMipmap(a.TEXTURE_2D),a.useProgram(s.current),a.uniform1i(i.u_image_texture,0),()=>{f&&a.deleteTexture(f)}},[r,m]),o.jsx("canvas",{ref:n,style:{width:"100%",height:"100%"}})}const te=d.memo(ee),re=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),_=navigator.hardwareConcurrency<=4||re;class ae{constructor(e=40){this.maxSize=e,this.cache=new Map,this.accessCount=new Map}get(e){const c=this.cache.get(e);return c&&(this.accessCount.set(e,(this.accessCount.get(e)||0)+1),this.cache.delete(e),this.cache.set(e,c)),c}set(e,c){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxSize){let n=null,t=1/0;for(const[s,l]of this.accessCount)l<t&&(t=l,n=s);n&&(this.cache.delete(n),this.accessCount.delete(n))}this.cache.set(e,c),this.accessCount.set(e,1)}has(e){return this.cache.has(e)}clear(){this.cache.clear(),this.accessCount.clear()}}class oe{constructor(){this.high=new Set,this.normal=new Set,this.low=new Set}addHigh(e){this.normal.delete(e),this.low.delete(e),this.high.add(e)}addNormal(e){this.high.has(e)||(this.low.delete(e),this.normal.add(e))}addLow(e){!this.high.has(e)&&!this.normal.has(e)&&this.low.add(e)}getNext(){if(this.high.size>0){const e=this.high.values().next().value;return this.high.delete(e),e}if(this.normal.size>0){const e=this.normal.values().next().value;return this.normal.delete(e),e}if(this.low.size>0){const e=this.low.values().next().value;return this.low.delete(e),e}return null}get size(){return this.high.size+this.normal.size+this.low.size}}const ie=Math.min(navigator.hardwareConcurrency||2,_?2:3);let R=[],z=0,ne=0;const U=new Map,se=new oe,ce=()=>{if(typeof Worker>"u"||R.length>0)return;const r=`
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
  `,e=new Blob([r],{type:"application/javascript"}),c=URL.createObjectURL(e);for(let n=0;n<ie;n++){const t=new Worker(c);t.onmessage=s=>{const{id:l,payload:u,error:x}=s.data,v=U.get(l);v&&(x?v.reject(new Error(x)):v.resolve(u),U.delete(l))},t.onerror=s=>{console.error(`Worker ${n} error:`,s)},R.push(t)}URL.revokeObjectURL(c)};let O=!1;const F=()=>{O||(ce(),O=!0)},j=new ae(_?35:45),le=(r,e=_?192:256)=>new Promise((c,n)=>{const t=new Image;t.crossOrigin="anonymous",t.decoding="async";const s=setTimeout(()=>{t.src="",n(new Error(`Timeout loading: ${r}`))},1e4);t.onload=async()=>{clearTimeout(s);try{const l=r.toLowerCase().endsWith(".svg"),u={premultiplyAlpha:"premultiply",colorSpaceConversion:"none",resizeQuality:_?"pixelated":"low",imageOrientation:"none"};l&&(u.resizeWidth=e,u.resizeHeight=e);const x=await createImageBitmap(t,u);c(x)}catch(l){n(l)}},t.onerror=()=>{clearTimeout(s),n(new Error(`Failed to load image from URL: ${r}`))},t.src=r}),V=(r,e="default",c)=>new Promise((n,t)=>{if(R.length===0)return t(new Error("Worker pool not initialized."));const s=R[z];z=(z+1)%R.length;const l=ne++;U.set(l,{resolve:n,reject:t}),s.postMessage({id:l,imageBitmap:r,isLowEnd:_,mode:e,maxSize:c},[r])}),de=async(r,e="normal")=>{if(!r)throw new Error("No icon source provided.");const c=j.get(r);if(c)return c;F();try{const n=await le(r),t=await V(n,"default");return j.set(r,t),t}catch(n){throw console.error(`Error processing icon ${r}:`,n),n}},me=async(r,e=_?64:96)=>{if(!r)throw new Error("No icon source provided.");const c=`metallic_${e}_${r}`,n=j.get(c);if(n)return n;F();try{const t=r.toLowerCase().endsWith(".svg"),s=await new Promise((v,E)=>{const m=new Image;m.crossOrigin="anonymous";const T=setTimeout(()=>{E(new Error(`Image load timeout: ${r}`))},5e3);m.onload=()=>{clearTimeout(T),v(m)},m.onerror=p=>{clearTimeout(T),E(new Error(`Failed to load image: ${r}`))},m.src=r}),l={premultiplyAlpha:"premultiply",colorSpaceConversion:"none",resizeQuality:_?"pixelated":"medium"};t&&(l.resizeWidth=e,l.resizeHeight=e);const u=await createImageBitmap(s,l),x=await V(u,"metallic",e);return j.set(c,x.imageData),x.imageData}catch(t){throw console.error(`Error processing metallic icon ${r}:`,t),t}},M=se;let L=!1,k=!1;const ue=(r,e="low")=>{r.forEach(c=>{if(!j.has(c))switch(e){case"high":M.addHigh(c);break;case"normal":M.addNormal(c);break;default:M.addLow(c)}}),!L&&!k&&(k=!0,he())},he=()=>{if(M.size===0){L=!1,k=!1;return}L=!0;const r=e=>{const c=_?2:4,n=_?2:4;let t=0;for(;(e.timeRemaining()>c||e.didTimeout)&&M.size>0&&t<n;){const s=M.getNext();if(!s)break;de(s).catch(l=>console.warn(`Preload failed for ${s}:`,l)),t++}M.size>0?requestIdleCallback(r,{timeout:_?800:1e3}):(L=!1,k=!1)};"requestIdleCallback"in window?requestIdleCallback(r,{timeout:_?800:1e3}):setTimeout(()=>r({timeRemaining:()=>16,didTimeout:!0}),25)};typeof window<"u"&&window.addEventListener("beforeunload",()=>{j.clear(),R.forEach(r=>r.terminate()),R=[]},{once:!0});const ge=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),pe=navigator.hardwareConcurrency<=4||ge,D=({src:r,alt:e,className:c=""})=>{const[n,t]=d.useState(null),[s,l]=d.useState(!0),[u,x]=d.useState(!1),v=d.useRef(null);d.useEffect(()=>{const m=new IntersectionObserver(T=>{T.forEach(p=>{p.isIntersecting&&(x(!0),m.disconnect())})},{rootMargin:"100px",threshold:.01});return v.current&&m.observe(v.current),()=>m.disconnect()},[]),d.useEffect(()=>{if(!u)return;let m=!0;return(async()=>{try{l(!0);const p=await me(r);m&&(t(p),l(!1))}catch(p){console.warn("MetallicIcon processing failed:",p),m&&(t(null),l(!1))}})(),()=>{m=!1}},[r,u]);const E=d.useMemo(()=>({patternScale:2.5,refraction:.018,edge:.5,patternBlur:.003,liquid:.04,speed:.15}),[]);return s||!n?o.jsx("div",{ref:v,className:`${c} relative overflow-hidden bg-[var(--color-surface)]/20 rounded-lg animate-pulse`,children:!u&&o.jsx("div",{className:"w-full h-full"})}):o.jsx("div",{ref:v,className:`${c} relative overflow-hidden`,children:o.jsx(te,{imageData:n,params:E,renderSize:pe?64:96})})},fe=()=>o.jsxs("div",{className:"absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]",children:[o.jsx("svg",{className:"relative block w-[calc(100%+1.3px)] h-[60px] text-[var(--color-background)] fill-current",preserveAspectRatio:"none",viewBox:"0 0 1200 120",children:o.jsx("path",{d:"M1200 120L0 16.48 0 0 1200 0 1200 120z",className:"opacity-100"})}),o.jsx("div",{className:"absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent"})]}),P={frontend:[{name:"React",iconSrc:"icons/react.svg"},{name:"JavaScript",iconSrc:"icons/javascript.svg"},{name:"TypeScript",iconSrc:"icons/typescript.svg"},{name:"Swift",iconSrc:"icons/swift.svg"},{name:"Tailwind",iconSrc:"icons/tailwind.svg"},{name:"Framer Motion",iconSrc:"icons/framer.svg"},{name:"Three.js",iconSrc:"icons/threejs.svg"}],backend:[{name:"Node.js",iconSrc:"icons/nodejs.svg"},{name:"Python",iconSrc:"icons/python.svg"},{name:"Java",iconSrc:"icons/java.svg"},{name:"C# / .NET",iconSrc:"icons/csharp.svg"},{name:"PHP",iconSrc:"icons/php.svg"},{name:"PostgreSQL",iconSrc:"icons/postgresql.svg"},{name:"MySQL",iconSrc:"icons/mysql.svg"}],ai:[{name:"OpenCV",iconSrc:"icons/opencv.svg"},{name:"TensorFlow",iconSrc:"icons/tensorflow.svg"},{name:"LLMs",iconSrc:"icons/ai.svg"}],tools:[{name:"Git",iconSrc:"icons/git.svg"},{name:"Docker",iconSrc:"icons/docker.svg"},{name:"Figma",iconSrc:"icons/figma.svg"}]};function ve(){const r=d.useRef(null),[e,c]=d.useState(!1),{scrollYProgress:n}=$({target:r,offset:["start end","end start"]});return X(n,[0,1],e?[0,0]:[50,-50]),d.useEffect(()=>{const t=()=>{c(window.innerWidth<=768||"ontouchstart"in window)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),d.useEffect(()=>{const t=Object.values(P).flatMap(s=>s.map(l=>l.iconSrc));ue(t,"normal")},[]),o.jsxs("section",{id:"skills",ref:r,className:"relative py-20 md:py-32 bg-transparent overflow-hidden min-h-screen",children:[o.jsx(fe,{}),o.jsxs("div",{className:"absolute inset-0 z-0 pointer-events-none",children:[o.jsx("div",{className:"absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[80px] md:blur-[100px] opacity-30"}),o.jsx("div",{className:"absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 rounded-full blur-[80px] md:blur-[100px] opacity-20"}),o.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]"})]}),o.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[o.jsxs("div",{className:"mb-12 md:mb-20 border-b border-white/40 pb-8 md:pb-12",children:[o.jsxs(y.div,{initial:{opacity:0,x:e?-10:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,margin:e?"-5%":"-10%",amount:e?.3:.5},transition:{duration:e?.5:.8,ease:[.22,1,.36,1]},className:"inline-flex items-center gap-3 mb-4 md:mb-6",style:{willChange:"auto"},children:[o.jsx("div",{className:"h-[1px] w-8 md:w-12 bg-[var(--color-accent)]"}),o.jsx("span",{className:"font-mono-tech text-[10px] md:text-xs text-[var(--color-accent)] tracking-[0.3em]",children:"CAPABILITIES // 003"})]}),o.jsxs(y.h2,{initial:{opacity:0,y:e?15:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:e?"-5%":"-10%",amount:e?.3:.5},transition:{duration:e?.6:.8,delay:e?.05:.1,ease:[.22,1,.36,1]},className:"font-cinzel text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-text-primary)] tracking-tight",style:{willChange:"auto"},children:["Technical ",o.jsx("br",{}),o.jsx("span",{className:"font-cormorant italic text-[var(--color-accent)] font-light",children:"Arsenal"})]})]}),o.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(160px,auto)]",children:[o.jsx(C,{className:"md:col-span-2 md:row-span-2",title:"Frontend Engineering",subtitle:"VISUAL INTERFACE",delay:e?.05:.1,isMobile:e,children:o.jsx("div",{className:"grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4",children:P.frontend.map((t,s)=>o.jsxs(y.div,{initial:{opacity:0,scale:.8},whileInView:{opacity:1,scale:1},viewport:{once:!0,margin:e?"0%":"-10%",amount:e?.3:.5},transition:{duration:e?.3:.5,delay:e?s*.03:s*.05,ease:[.22,1,.36,1]},className:"flex flex-col items-center gap-2 group/icon",style:{willChange:"auto"},children:[o.jsx("div",{className:"p-2 md:p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center",children:o.jsx(D,{src:t.iconSrc,alt:t.name,className:"w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover/icon:scale-110"})}),o.jsx("span",{className:"text-[10px] sm:text-xs font-mono-tech text-[var(--color-text-secondary)] text-center transition-colors duration-300 group-hover/icon:text-[var(--color-accent)]",children:t.name})]},t.name))})}),o.jsx(C,{className:"md:col-span-1 md:row-span-2",title:"Backend Systems",subtitle:"CORE LOGIC",delay:e?.1:.2,isMobile:e,children:o.jsx("div",{className:"flex flex-col justify-center h-full gap-4 md:gap-5 mt-2",children:P.backend.map((t,s)=>o.jsxs(y.div,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,margin:e?"0%":"-5%",amount:e?.5:.8},transition:{duration:e?.3:.4,delay:e?s*.03:s*.05,ease:[.22,1,.36,1]},className:"flex items-center gap-3 md:gap-4 group/icon",style:{willChange:"auto"},children:[o.jsx("div",{className:"p-2 rounded bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-all duration-300 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0",children:o.jsx(D,{src:t.iconSrc,alt:t.name,className:"w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover/icon:scale-110"})}),o.jsx("span",{className:"text-xs md:text-sm font-mono-tech text-[var(--color-text-secondary)] transition-colors duration-300 group-hover/icon:text-[var(--color-accent)]",children:t.name})]},t.name))})}),o.jsx(C,{className:"md:col-span-1 lg:col-span-1 md:row-span-1",title:"AI Integration",subtitle:"INTELLIGENCE",delay:e?.15:.3,isMobile:e,children:o.jsx("div",{className:"flex flex-wrap gap-2 md:gap-3 mt-4 content-start",children:P.ai.map((t,s)=>o.jsx(y.span,{initial:{opacity:0,scale:.8},whileInView:{opacity:1,scale:1},viewport:{once:!0,margin:e?"0%":"-10%",amount:e?.5:.8},transition:{duration:e?.3:.4,delay:e?s*.05:s*.1,ease:[.22,1,.36,1]},className:"px-2 py-1 md:px-3 text-[10px] font-mono-tech border border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-full bg-[var(--color-accent)]/5 whitespace-nowrap hover:bg-[var(--color-accent)]/10 transition-all duration-300 cursor-default",style:{willChange:"auto"},children:t.name},t.name))})}),o.jsx(C,{className:"md:col-span-2 lg:col-span-1 md:row-span-1",title:"DevOps & Tools",subtitle:"INFRASTRUCTURE",delay:e?.2:.4,isMobile:e,children:o.jsx("div",{className:"flex justify-around md:justify-between items-center mt-4 px-2 md:px-0 h-full pb-4",children:P.tools.map((t,s)=>o.jsxs(y.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:e?"0%":"-10%",amount:e?.5:.8},transition:{duration:e?.3:.5,delay:e?s*.05:s*.1,ease:[.22,1,.36,1]},className:"group/icon flex flex-col items-center gap-2",style:{willChange:"auto"},children:[o.jsx("div",{className:"relative w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 p-2 rounded-lg bg-[var(--color-background)]/30 border border-transparent group-hover/icon:border-[var(--color-border)] transition-all duration-300",children:o.jsx(D,{src:t.iconSrc,alt:t.name,className:"w-full h-full transition-transform duration-300 group-hover/icon:scale-110"})}),o.jsx("span",{className:"text-[10px] font-mono-tech text-[var(--color-text-secondary)] opacity-0 group-hover/icon:opacity-100 transition-all duration-300",children:t.name})]},t.name))})}),o.jsx(C,{className:"md:col-span-3 lg:col-span-4 min-h-[100px] md:min-h-[120px] md:max-h-[120px] flex items-center justify-center bg-[var(--color-accent)]/5 !border-[var(--color-accent)]/20",delay:e?.25:.5,isMobile:e,children:o.jsxs("div",{className:"flex flex-col sm:flex-row items-center gap-4 sm:gap-8 md:gap-12 text-center w-full justify-center px-2",children:[o.jsxs(y.div,{className:"flex flex-col items-center",initial:{opacity:0,scale:.8},whileInView:{opacity:1,scale:1},viewport:{once:!0,margin:e?"0%":"-10%"},transition:{duration:e?.4:.6,delay:e?.1:.2,ease:[.22,1,.36,1]},style:{willChange:"auto"},children:[o.jsx("span",{className:"block text-2xl md:text-3xl font-cinzel text-[var(--color-accent)]",children:"100%"}),o.jsx("span",{className:"text-[8px] md:text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest",children:"COMMITMENT"})]}),o.jsx("div",{className:"w-[1px] h-6 md:h-8 bg-[var(--color-accent)]/30"}),o.jsxs(y.div,{className:"flex flex-col items-center",initial:{opacity:0,scale:.8},whileInView:{opacity:1,scale:1},viewport:{once:!0,margin:e?"0%":"-10%"},transition:{duration:e?.4:.6,delay:e?.15:.3,ease:[.22,1,.36,1]},style:{willChange:"auto"},children:[o.jsx("span",{className:"block text-2xl md:text-3xl font-cinzel text-[var(--color-accent)]",children:"24/7"}),o.jsx("span",{className:"text-[8px] md:text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest",children:"UPTIME"})]}),o.jsx("div",{className:"w-[1px] h-6 md:h-8 bg-[var(--color-accent)]/30"}),o.jsx(y.div,{className:"max-w-[200px] md:max-w-md text-xs md:text-sm text-[var(--color-text-secondary)] font-light italic text-center md:text-left",initial:{opacity:0,x:20},whileInView:{opacity:1,x:0},viewport:{once:!0,margin:e?"0%":"-10%"},transition:{duration:e?.4:.6,delay:e?.2:.4,ease:[.22,1,.36,1]},style:{willChange:"auto"},children:'"Constantly evolving my stack to build faster, scalable, and more resilient systems."'})]})})]})]})]})}export{ve as default};
