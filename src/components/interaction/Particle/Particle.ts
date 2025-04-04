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
    const { width: canvasWidth, height: canvasHeight } = this.ctx.canvas;
    const { width: imageWidth, height: imageHeight } = this.image;

    switch(this.image.positionGroup) {
      case "top-left":
        return { x: 0, y: 0 };
      case "top-right":
        return { x: canvasWidth - imageWidth, y: 0 };
      case "bottom-left":
        return { x: 0, y: canvasHeight - imageHeight };
      case "bottom-right":
        return { x: canvasWidth - imageWidth, y: canvasHeight - imageHeight };
      case "center":
        return { x: (canvasWidth - imageWidth) / 2, y: (canvasHeight - imageHeight) / 2 };
      default:
        return { x: 0, y: 0}; // fallback
    }
  }
  
  draw() {
    const position = this.getPositionFromGroup()
    this.ctx.drawImage(this.imageObject, position.x, position.y, this.image.width, this.image.height);
  }
}