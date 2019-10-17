import regl from 'regl';
import genVert from './gen.vert';
import jfaFrag from './jfa.frag';
import prepare from './prepare.frag';
import keyFrag from './keyFill.frag';
import identity from './identity.frag';
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
export class Jfaclass {
  gl: regl.Regl;
  wid: number;
  hei: number;
  private _inputTexture: regl.Texture2D;
  idFunc: regl.DrawCommand;
  jfaFunction: regl.DrawCommand<regl.DefaultContext, jfaProps>;
  prepFunction: regl.DrawCommand<regl.DefaultContext, prepProps>;
  fillFunction: regl.DrawCommand<regl.DefaultContext, fillProps>;
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
      wrap: 'clamp',
    });
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
    this.jfaFunction = gl({
      vert: genVert,
      frag: jfaFrag,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2],
      },
      count: 3,
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
      vert: genVert,
      frag: prepare,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2],
      },
      count: 3,
      depth: { enable: false },
      uniforms: {
        u_resolution: (c, { resolution }, i) => resolution,
        input_points: (c, { inputTex }, i) => inputTex,
      },
      framebuffer: (c, p) => p.fb,
    });
    this.fillFunction = gl({
      vert: genVert,
      frag: keyFrag,
      framebuffer: (c, p) => p.fb,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2],
      },
      count: 3,
      depth: { enable: false },
      uniforms: {
        input_points: (c, p) => p.inputPts,
        input_key: (c, p) => p.inputKey,
        u_resolution: (c, p) => p.resolution,
      },
    });
    this.idFunc = gl({
      vert: genVert,
      frag: identity,
      framebuffer: null,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2],
      },
      count: 3,
      depth: { enable: false },
      uniforms: {
        id: (c, p: any) => p.id,
      },
    });
  }
  set inputTexture(inP: regl.TextureImageData | ImageData) {
    this._inputTexture(inP as any);
  }
  runJFA() {
    const { max: mx, floor: fl } = Math;
    const radius = mx(this.wid, this.hei);
    const totalSteps = fl(Math.log2(radius));
    const fbAccess = [this.back, this.front];
    const res = [this.wid, this.hei] as [number, number];
    const inputTexture = this._inputTexture;
    this.prepFunction({
      resolution: res,
      inputTex: inputTexture,
      fb: this.front,
    });

    // return this.front;
    for (let i = 0; i < totalSteps; i++) {
      const jumpDist = 2 ** (totalSteps - i - 1);
      this.jfaFunction({
        fb: fbAccess[i % 2],
        jumpLen: jumpDist,
        resolution: res,
        seedTex: fbAccess[(1 + i) % 2],
        stepI: i,
        stepTotal: totalSteps,
      });
    }

    return fbAccess[(totalSteps - 1) % 2];
  }
  getFilled(inputFB: regl.Texture2D | regl.Framebuffer2D) {
    const inputTexture = this._inputTexture;
    this.fillFunction({
      fb: this.out,
      inputKey: inputTexture,
      inputPts: inputFB,
      resolution: [this.wid, this.hei],
    });
    this.idFunc({ id: this.out });
    console.log(
      this.gl.read({ framebuffer: inputFB as regl.Framebuffer2D })[299]
    );
    return this.gl.read({
      framebuffer: this.out,
    });
  }
}
