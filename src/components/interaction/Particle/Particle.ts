import type { Image } from '../../../types/Image.ts';

export class Particle {
  private readonly ctx;
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

  /** Draw images to the provided canvas. */
  draw() {
    const position = this.getPositionFromGroup()
    this.ctx.drawImage(this.imageObject, position.x, position.y, this.image.width, this.image.height);
  }
}