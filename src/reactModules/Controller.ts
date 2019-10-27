import { Jfaclass } from '../jfaFiles/jfa';
import REGL, { Regl } from 'regl';
import lines from '../linesForRender';
import { contextTypewriter } from '../contextTypewriter';

export default class Controller {
  videoURL?: string;
  audioURL?: string;
  audio?: Blob;
  video?: Blob;
  width = 100;
  height = 100;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  jfa?: Jfaclass;
  startTime: number = 0;
  elapsed: number = 0;
  azi = 0;
  alt = 0;
  tone = 0;
  len = 0;

  // audioSource;
  glContext?: Regl;
  textCanvas?: CanvasRenderingContext2D;
  contextTypewriter?: contextTypewriter;
  videoEl?: HTMLVideoElement;
  loadingHandlers: Set<Function> = new Set();
  positionHandlers: Set<Function> = new Set();
  async fetchFiles() {
    const audioResp = await window.fetch(
      'https://drive.google.com/uc?export=download&id=16NK-17yAy2fB4IXBaRmEIlG-9o3S51eM'
    );
    const videoResp = await window.fetch(
      'https://drive.google.com/uc?export=download&id=16azNUz9ga4cP9ILEWVFsQmDMH-Ni1cD0'
    );
    this.audio = await audioResp.blob();
    this.video = await videoResp.blob();
    this.audioURL = URL.createObjectURL(this.audio);
    this.videoURL = URL.createObjectURL(this.video);
    this.loadingHandlers.forEach(f => f());
  }
  addReadyFunction = (func: Function) => {
    this.loadingHandlers.add(func);
  };
  removeReadyFunction = (func: Function) => {
    this.loadingHandlers.delete(func);
  };
  attachPositionHandler = (func: Function) => {
    this.positionHandlers.add(func);
  };
  removePositoinHandler = (func: Function) => {
    this.positionHandlers.delete(func);
  };
  setPos(args: { x: number; y: number; z: number }) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.positionHandlers.forEach(f => f());
  }
  attachGLcanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.glContext = REGL({
      canvas,
      attributes: { preserveDrawingBuffer: true },
    });
    this.jfa = new Jfaclass(this.glContext, width, height, canvas, this);
    this.glContext.clear({
      color: [0, 0, 0, 0],
    });
    this.startTime = Date.now();
  }
  attachTextCanvas(canvas: HTMLCanvasElement) {
    this.textCanvas = canvas.getContext('2d')!;
    this.textCanvas.font = '32px VT323';
    this.textCanvas.strokeStyle = 'white';
    this.jfa!.inputTexture = this.textCanvas;
  }
  updateLen = () => {
    this.len =
      0.5 +
      0.5 * Math.sin((0.00001 * this.elapsed) / (0.99 * this.tone + 0.01));
    this.updatePosition();
  };
  updateVectors(vec: 'alt' | 'azi' | 'tone', amt: '--' | '-' | '+' | '++') {
    switch (amt) {
      case '--':
        this[vec] -= 1 / 16;
        break;
      case '-':
        this[vec] -= 1 / 256;
        break;
      case '+':
        this[vec] += 1 / 256;
        break;
      case '++':
        this[vec] += 1 / 16;
        break;
    }
    if (this[vec] < 0) {
      this[vec] = 0;
    } else if (this[vec] > 1) {
      this[vec] = 1;
    }
    this.updatePosition();
  }
  updatePosition() {
    const TAU = Math.PI * 2;
    let x = Math.cos(TAU * this.azi) * this.len;
    let z = Math.sin(TAU * this.azi) * this.len;
    let y = Math.sin(-0.5 * Math.PI + this.alt * Math.PI) * this.len;
    this.setPos({ x, y, z });
  }
  attachVideoCanvas = (canvas: HTMLVideoElement) => {
    this.videoEl = canvas;
    const self = this;
    this.contextTypewriter = new contextTypewriter({
      ctr: this,
      ctx: this.textCanvas!,
      text: lines,
    });
    const typing = (speed: number) => {
      this.contextTypewriter!.type();
      const sp = 50 + this.z * 40;
      window.setTimeout(() => typing(sp), speed);
    };
    window.setTimeout(() => {
      let render = () => {
        if (!this.textCanvas) return;
        this.elapsed = Date.now() - this.startTime;
        if (this.elapsed % 100 < 10) this.jfa!.updateVideoTextures(canvas);
        this.contextTypewriter!.render();
        this.jfa!._inputTexture(this.textCanvas!);
        this.jfa!._videoTexture(canvas);
        const v = this.jfa!.runJFA();
        self.updateLen();
        window.requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
      typing(100);
    }, 500);
    const updatePos = () => {
      this.updateLen();
      window.requestAnimationFrame(updatePos);
    };
    window.requestAnimationFrame(updatePos);
  };
}
