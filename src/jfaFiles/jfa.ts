import regl, { DefaultContext } from 'regl';
import genVert from './gen.vert';
import jfaFrag from './jfa.frag';
import prepare from './prepare.frag';
import keyFrag from './keyFill.frag';
import identity from './identity.frag';
import tWarp from './timeWarp.frag';
type n = number;
type Tex = regl.Texture;
type fb = regl.Framebuffer2D;
export interface jfaProps {
  resolution: [n, n];
  stepI: n;
  stepTotal: n;
  jumpLen: n;
  seedTex: regl.Texture2D | regl.Framebuffer2D;
  fb: regl.Framebuffer2D;
}

export interface prepProps {
  resolution: [n, n];
  inputTex: regl.Texture2D;
  fb: regl.Framebuffer2D;
}
export interface fillProps {
  resolution: [n, n];
  inputPts: regl.Texture2D | regl.Framebuffer2D;
  inputKey: regl.Texture2D | regl.Framebuffer2D;
  fb: regl.Framebuffer2D;
}
interface idProps {
  resolution: [n, n];
  id: regl.Texture2D | regl.Framebuffer2D;
  vid: regl.Texture2D | regl.Framebuffer2D;
  vidFrames: regl.Texture2D[];
}
export class Jfaclass {
  gl: regl.Regl;
  wid: number;
  hei: number;
  _inputTexture: regl.Texture2D;
  _videoTexture: regl.Texture2D;
  setupCanvas: CanvasRenderingContext2D;
  videoTextures: regl.Texture2D[];
  warpFunc: regl.DrawCommand<regl.DefaultContext, idProps>;
  idFunc: regl.DrawCommand<regl.DefaultContext, idProps>;
  jfaFunction: regl.DrawCommand<regl.DefaultContext, jfaProps>;
  prepFunction: regl.DrawCommand<regl.DefaultContext, prepProps>;
  fillFunction: regl.DrawCommand<regl.DefaultContext, fillProps>;
  setupFunc: regl.DrawCommand<regl.DefaultContext, fillProps>;
  out: fb;
  back: fb;
  front: fb;
  constructor(
    reglInstance: regl.Regl,
    width: number,
    height: number,
    input: regl.TextureImageData
  ) {
    this.gl = reglInstance;
    const gl = this.gl;
    this.wid = width;
    this.hei = height;
    this._inputTexture = gl.texture({
      data: input,
      width,
      height,
      wrap: 'clamp',
    });

    const canv = document.createElement('canvas');
    canv.width = this.wid;
    canv.height = this.hei;
    this.setupCanvas = canv.getContext('2d')!;
    this._videoTexture = gl.texture({
      data: input,
      width,
      height,
      wrap: 'clamp',
    });
    this.videoTextures = new Array(10).fill(
      gl.texture({
        data: input,
        width,
        height,
        wrap: 'clamp',
      })
    );
    const StartData = Array(width * height * 4).fill(0);
    this.out = gl.framebuffer({
      width: width,
      height: height,
      depth: false,
      color: gl.texture({
        width: width,
        height: height,
        data: StartData,
      }),
    });
    this.back = gl.framebuffer({
      width: width,
      height: height,
      depth: false,
      color: gl.texture({
        width: width,
        height: height,
        data: StartData,
      }),
    });
    this.front = gl.framebuffer({
      width: width,
      height: height,
      depth: false,
      color: gl.texture({
        width: width,
        height: height,
        data: StartData,
      }),
    });
    gl.clear({ framebuffer: this.front, color: [0, 0, 0, 0] });
    gl.clear({ framebuffer: this.back, color: [0, 0, 0, 0] });
    gl.clear({ framebuffer: this.out, color: [0, 0, 0, 0] });
    this.setupFunc = gl({
      vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;
  void main() {
    uv = 0.5 * (position + 1.0);
    gl_Position = vec4(position, 0, 1);
  }`,

      attributes: {
        position: [-4, -4, 4, -4, 0, 4],
      },
      count: 3,
      depth: { enable: false },
    });
    this.jfaFunction = gl({
      frag: jfaFrag,
      uniforms: {
        u_resolution: (c, { resolution }, i) => resolution,
        step_index: (c, { stepI }, i) => stepI,
        total_steps: (c, { stepTotal }, i) => stepTotal,
        jump_length: (c, { jumpLen }, i) => jumpLen,
        seed_tex: (c, { seedTex }, i) => seedTex,
      },
      framebuffer: (c, p, i) => p.fb,
    });

    this.prepFunction = gl({
      frag: prepare,
      uniforms: {
        u_resolution: (c, { resolution }, i) => resolution,
        input_points: (c, { inputTex }, i) => inputTex,
      },
      framebuffer: (c, p) => p.fb,
    });
    this.fillFunction = gl({
      frag: keyFrag,
      framebuffer: (c, p) => p.fb,
      uniforms: {
        input_points: (c, p) => p.inputPts,
        input_key: (c, p) => p.inputKey,
        u_resolution: (c, p) => p.resolution,
      },
    });
    const vidsuniforms: { [s: string]: Function } = {};
    this.videoTextures.map((t, i) => {
      vidsuniforms[`u_vidFrames[${i}]`] = (c: any, p: idProps) =>
        p.vidFrames[i];
    });
    this.warpFunc = gl({
      frag: tWarp,
      framebuffer: null,
      uniforms: {
        id: (c, p: any) => p.id,
        u_resolution: [this.wid, this.hei],
        vid: (c, p: idProps) => p.vid,
        ...vidsuniforms,
      },
    });
    this.idFunc = gl({
      frag: identity,
      framebuffer: null,
      uniforms: {
        vid: (c, p: idProps) => p.vid,
        ...vidsuniforms,
      },
    });
  }
  set inputTexture(inP: regl.TextureImageData | regl.Texture2DOptions) {
    this._inputTexture(inP as regl.TextureImageData);
  }
  set videoTexture(inP: regl.TextureImageData | regl.Texture2DOptions) {
    this._videoTexture(inP as regl.TextureImageData);
  }
  updateVideoTextures = (inP: regl.TextureImageData) => {
    const videoTag: HTMLVideoElement = inP as HTMLVideoElement;
    const newTex = this.videoTextures.pop()!;
    this.setupCanvas.clearRect(0, 0, this.wid, this.hei);
    this.setupCanvas.drawImage(videoTag, 0, 0, this.wid, this.hei);
    const tex = this.gl.texture({
      width: this.wid,
      height: this.hei,
      data: this.setupCanvas,
      flipY: true,
    });
    this.setupFunc(() => {});
    newTex({
      width: this.wid,
      height: this.hei,
      copy: true,
    });
    this.videoTextures.unshift(newTex);
  };
  runJFA() {
    const { max: mx, floor: fl } = Math;
    const radius = mx(this.wid, this.hei);
    const totalSteps = fl(Math.log2(radius)) + 1;
    const fbAccess = [this.back, this.front];
    const res = [this.wid, this.hei] as [number, number];
    const inputTexture = this._inputTexture;
    this.setupFunc(() =>
      this.prepFunction({
        resolution: res,
        inputTex: inputTexture,
        fb: this.front,
      })
    );

    // return this.front;
    for (let i = 0; i < totalSteps; i++) {
      const jumpDist = 2 ** (totalSteps - i - 1);
      this.setupFunc(() =>
        this.jfaFunction({
          fb: fbAccess[i % 2],
          jumpLen: jumpDist,
          resolution: res,
          seedTex: fbAccess[(1 + i) % 2],
          stepI: 0,
          stepTotal: totalSteps,
        })
      );
    }
    this.setupFunc(() => this.idFunc({ vid: this.front }));
    return fbAccess[(totalSteps - 1) % 2];
  }
  getFilled(inputFB: regl.Texture2D | regl.Framebuffer2D) {
    const inputTexture = this._inputTexture;
    return this.gl.read({
      framebuffer: this.out,
    });
  }
}
