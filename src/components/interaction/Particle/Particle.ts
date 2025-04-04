import { InteractionElement } from "../../../types/pages/InteractionElement.ts";

export class Particle {
  public drawn: boolean = false;
  public hovered: boolean = false;
  public readonly interactionElement: InteractionElement;

  private readonly ctx: CanvasRenderingContext2D;
  private boundingBox: { x: number, y: number, width: number, height: number } | null = null;
  private readonly imageObject: HTMLImageElement;

  constructor(ctx: CanvasRenderingContext2D, interactionElement: InteractionElement, imageUrl: string) {
    this.ctx = ctx;
    this.interactionElement = interactionElement;
    this.imageObject = new Image();
    this.imageObject.src = imageUrl;
    this.imageObject.onload = () => this.draw();
  }

  /** Method that determines where on the screen an image can be placed, based on its position group. */
  getPositionFromGroup() {
    const { width: cw, height: ch } = this.ctx.canvas;
    const { width: iw, height: ih, positionGroup } = this.interactionElement.image;

    switch(positionGroup) {
      case "top-left":
        return { x: 0, y: 0 };
      case "top-right":
        return { x: cw - iw, y: 0 };
      case "bottom-left":
        return { x: 0, y: ch - ih };
      case "bottom-right":
        return { x: cw - iw, y: ch - ih };
      case "center":
        return { x: (cw - iw) / 2, y: (ch - ih) / 2 };
      default:
        return { x: 0, y: 0};
    }
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