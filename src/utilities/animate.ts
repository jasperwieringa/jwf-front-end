import { animate, createDraggable, createSpring } from 'animejs';

export class Animate {
  private readonly element;
  private readonly animation;

  constructor(el: HTMLElement) {
    this.element = el;
    this.animation = animate(this.element, {
      scale: [
        { to: 1.10, ease: 'inOut(3)', duration: 300 },
        { to: 1, ease: createSpring({ stiffness: 200 }) }
      ],
      autoplay: false,
      loop: true,
      loopDelay: 250,
    });
  }

  restartAnimation() {
    this.animation.restart();
  }

  stopAnimations() {
    this.animation.cancel();
  }

  // Make the element draggable around its center
  attachDraggable(container?: HTMLElement) {
    createDraggable(this.element, {
      container,
    })
  }
}
