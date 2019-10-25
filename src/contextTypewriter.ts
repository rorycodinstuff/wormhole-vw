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
    this.ctx = args.ctx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const maxTextWidth = text.reduce(
      (u, s) => (u < s.length ? s.length : u),
      0
    );
    this.textSize = 2 * Math.floor(width / (maxTextWidth + 1));
    this.linesPerScreen = Math.floor(height / (this.textSize + 2));
    this.originalText = text;
    this.text = this.originalText
      .slice(0)
      .reverse()
      .map(s => s.split('').reverse());
    this.textToDraw = [''];
  }
  type = () => {
    if (this.text[0].length) {
      const char = this.text[0].pop()!;
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
    }
  };
}
