import type { Image } from '../../../types/Image.ts';

export class Particle {
  public hovered: boolean = false;

  private readonly ctx;
  private boundingBox: { x: number, y: number, width: number, height: number } | null = null;
  private readonly image;
  private readonly imageObject;

  constructor(ctx: CanvasRenderingContext2D, image: Image, imageUrl: string) {
    this.ctx = ctx;
    this.image = image;
    this.imageObject = new Image();
    this.imageObject.src = imageUrl;
    this.imageObject.onload = () => this.draw();
  }

  /** Method that determines where on the screen an image can be placed, based on its position group. */
  getPositionFromGroup() {
    const { width: cw, height: ch } = this.ctx.canvas;
    const { width: iw, height: ih, positionGroup } = this.image;

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

  /** Is the point inside the boundingBox of the Particle? */
  isPointInside(x: number, y: number): boolean {
    if (!this.boundingBox) return false;
    const { x: bx, y: by, width, height } = this.boundingBox;
    return x >= bx && x <= bx + width && y >= by && y <= by + height;
  }

  /** Method to update the hovered state on the Particle. */
  setHovered(state: boolean) {
    this.hovered = state;
  }

  /** Draw images to the provided canvas. */
  draw() {
    const { width, height } = this.image;
    const position = this.getPositionFromGroup()
    this.boundingBox = { x: position.x, y: position.y, width, height };

    if (this.hovered) {
      // Draw hover highlight (e.g., border or glow)
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