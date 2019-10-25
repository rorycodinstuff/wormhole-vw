import Controller from './reactModules/Controller';
interface args {
  ctx: CanvasRenderingContext2D;
  ctr: Controller;
  text: String[];
}
export class contextTypewriter {
  ctx: CanvasRenderingContext2D;
  textSize: number;
  linesPerScreen: number;
  originalText: String[];
  textToDraw: String[];
  text: String[][];
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
      this.textToDraw[this.textToDraw.length - 1] =
        this.textToDraw[this.textToDraw.length - 1] +
        this.text[this.text.length - 1].pop();
    }
  };
}
