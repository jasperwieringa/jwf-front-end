export class Particle {
  private readonly ctx;
  private readonly image;

  constructor(ctx, imageUrl) {
    this.ctx = ctx;
    this.image = new Image();
    this.image.src = imageUrl;
    this.image.onload = () => this.draw();
  }

  // Update the particle's position and gradually reduce its size
  update() {}

  // Draw the particle as a circle on the canvas
  draw() {
    this.ctx.drawImage(this.image, 100, 100);
  }
}