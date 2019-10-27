import Controller from './reactModules/Controller';
interface args {
  ctx: CanvasRenderingContext2D;
  ctr: Controller;
  text: string[];
}
export class contextTypewriter {
  ctx: CanvasRenderingContext2D;
  textSize: number;
  linesPerScreen: number;
  originalText: string[];
  textToDraw: string[];
  text: string[][];
  constructor(args: args) {
    const { ctx, text } = args;
    const scale = window.devicePixelRatio;
    this.ctx = args.ctx;
    const width = ctx.canvas.width * scale;
    const height = ctx.canvas.height * scale;
    const maxTextWidth = text.reduce(
      (u, s) => (u < s.length ? s.length : u),
      0
    );
    this.textSize = Math.floor(width / (maxTextWidth * 0.5));
    this.linesPerScreen = Math.floor(
      (height - this.textSize) / (this.textSize * 1.6)
    );
    this.originalText = text;
    this.text = this.originalText
      .slice(0)
      .reverse()
      .map(s => s.split('').reverse());
    this.textToDraw = [''];
  }
  type() {
    if (this.text[0] && this.text[this.text.length - 1].length) {
      const char = this.text[this.text.length - 1].pop()!;
      this.textToDraw[this.textToDraw.length - 1] += char;
      return;
    } else if (this.text.length < 1) {
      this.text = this.originalText
        .slice(0)
        .reverse()
        .map(s => s.split('').reverse());
      this.textToDraw = [''];
      return;
    } else if (this.textToDraw.length >= this.linesPerScreen) {
      this.textToDraw = [''];
      return;
    } else {
      this.text.pop();
      this.textToDraw.push('');
      return;
    }
  }
  render() {
    const { ctx, textSize } = this;
    ctx.font = `${this.textSize}px VT323`;
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const lHeight = Math.floor(this.textSize * 1.2);
    const margin = Math.floor(this.textSize / 2);
    for (let i = 0; i < this.textToDraw.length; i++) {
      const line = this.textToDraw[i];
      ctx.fillText(line, margin, textSize + margin + lHeight * i);
    }
  }
}
