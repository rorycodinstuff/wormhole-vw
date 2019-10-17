import { Jfaclass } from '../jfaFiles/jfa';
import REGL, { Regl } from 'regl';
import lines from '../linesForRender';

export default class {
  videoURL?: string;
  audioURL?: string;
  audio?: Blob;
  video?: Blob;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  jfa?: Jfaclass;
  // audioSource;
  glContext?: Regl;
  textCanvas?: CanvasRenderingContext2D;
  loadingHandlers: Set<Function> = new Set();
  async fetchFiles() {
    const audioResp = await window.fetch(
      'https://ruby-quail-portfolio-images.s3-ap-southeast-2.amazonaws.com/RubySolly-Hurihuri.mp3'
    );
    const videoResp = await window.fetch(
      'https://ruby-quail-portfolio-images.s3-ap-southeast-2.amazonaws.com/640x480.webm'
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
  attachGLcanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.glContext = REGL({ canvas });
    this.jfa = new Jfaclass(this.glContext, width, height, canvas);
    this.glContext.clear({
      color: [0, 0, 0, 0],
    });
  }
  attachTextCanvas(canvas: HTMLCanvasElement) {
    this.textCanvas = canvas.getContext('2d')!;
    this.textCanvas.font = '32px VT323';
    this.textCanvas.strokeStyle = 'white';
    for (let i = 0; i < lines.length; i++) {
      let y = 10 + i * 32;
      this.textCanvas.strokeText(lines[i], 5, y);
    }
    this.jfa!.inputTexture = this.textCanvas;
    const ot = this.jfa!.runJFA();
    this.jfa!.getFilled(ot);
  }
}
