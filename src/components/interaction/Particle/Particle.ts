import { InteractionElement } from "../../../types/pages/InteractionElement.ts";

export class Particle {
  public drawn: boolean = false;
  public hovered: boolean = false;
  public readonly interactionElement: InteractionElement;

  private readonly padding = 32;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly imageObject: HTMLImageElement;

  private boundingBox: { x: number, y: number, width: number, height: number } | null = null;

  constructor(ctx: CanvasRenderingContext2D, interactionElement: InteractionElement, imageUrl: string) {
    this.ctx = ctx;
    this.interactionElement = interactionElement;
    this.imageObject = new Image();
    this.imageObject.src = imageUrl;
    this.imageObject.onload = () => {
      if (this.canFitInCanvas()) this.draw();
    };
  }

  /** Method that determines where on the screen an image can be placed, based on its position group. */
  getPositionFromGroup() {
    const { width: cw, height: ch } = this.ctx.canvas;
    const { width: iw, height: ih, positionGroup } = this.interactionElement.image;

    switch(positionGroup) {
      case "top-left":
        return { x: this.padding, y: this.padding };
      case "top-right":
        return { x: cw - iw - this.padding, y: this.padding };
      case "bottom-left":
        return { x: this.padding, y: ch - ih - this.padding };
      case "bottom-right":
        return { x: cw - iw - this.padding, y: ch - ih - this.padding };
      case "center":
        return { x: (cw - iw) / 2, y: (ch - ih) / 2 };
      default:
        return { x: this.padding, y: this.padding };
    }
  }

  /** Method that checks whether an image can actually fit within the canvas. */
  canFitInCanvas() {
    return this.imageObject.width < this.ctx.canvas.width && this.imageObject.height < this.ctx.canvas.height;
  }

  /** Is the given point inside the boundingBox of the Particle? */
  isPointInside(x: number, y: number): boolean {
    if (!this.drawn || !this.boundingBox) return false;
    const { x: bx, y: by, width, height } = this.boundingBox;
    return x >= bx && x <= bx + width && y >= by && y <= by + height;
  }

  /** Draw images to the provided canvas. */
  draw() {
    const { width, height } = this.interactionElement.image;
    const position = this.getPositionFromGroup();

    this.boundingBox = { x: position.x, y: position.y, width, height };
    this.drawn = true;

    if (this.hovered) {
      this.ctx.save();
      this.ctx.shadowColor = 'rgb(244, 157, 55)';
      this.ctx.shadowBlur = 50;
      this.ctx.drawImage(this.imageObject, position.x, position.y, width, height);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(this.imageObject, position.x, position.y, width, height);
    }
  }
}