import { Jfaclass } from '../jfaFiles/jfa';
import REGL, { Regl } from 'regl';
import lines from '../linesForRender';

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
  videoEl?: HTMLVideoElement;
  loadingHandlers: Set<Function> = new Set();
  positionHandlers: Set<Function> = new Set();
  async fetchFiles() {
    const audioResp = await window.fetch(
      'https://ruby-quail-portfolio-images.s3-ap-southeast-2.amazonaws.com/RubySolly-Hurihuri.mp3'
    );
    const videoResp = await window.fetch(
      'https://drive.google.com/uc?export=download&id=1DKN09ggGjL62wfhmf2k5wTSixiMGqWuk'
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
    this.jfa = new Jfaclass(this.glContext, width, height, canvas);
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
    const ot = this.jfa!.runJFA();
    this.jfa!.getFilled(ot);
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
  attachVideoCanvas(canvas: HTMLVideoElement) {
    this.videoEl = canvas;
    canvas.currentTime = 3;
    const ot = this.jfa!.runJFA();
    const self = this;
    window.setTimeout(() => {
      let render = () => {
        if (!this.textCanvas) return;
        this.elapsed = Date.now() - this.startTime;
        if (this.elapsed % 100 < 10) this.jfa!.updateVideoTextures(canvas);
        this.textCanvas.clearRect(0, 0, this.width, this.height);
        this.textCanvas.save();

        this.textCanvas.font = '64px VT323';
        this.textCanvas.fillStyle = 'white';
        this.textCanvas.translate(
          0,
          -1000 + Math.sin(this.elapsed / 10000) * 1200
        );
        this.textCanvas.scale(0.7, 0.7);
        for (let i = 0; i < lines.length; i++) {
          let y = 20 + i * 102;
          this.textCanvas.fillText(lines[i], 5, y);
        }

        this.textCanvas.restore();
        this.jfa!._inputTexture(this.textCanvas!);
        this.jfa!._videoTexture(canvas);
        const v = this.jfa!.runJFA();
        self.updateLen();
        window.requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }, 500);
    const updatePos = () => {
      this.updateLen();
      window.requestAnimationFrame(updatePos);
    };
    window.requestAnimationFrame(updatePos);
  }
}
