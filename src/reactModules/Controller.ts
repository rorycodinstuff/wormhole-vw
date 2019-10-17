import { Jfaclass } from '../jfaFiles/jfa';
import { Regl } from 'regl';

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
}
