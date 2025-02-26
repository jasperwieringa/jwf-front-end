export interface ElementAnimation {
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
}

interface ElementAnimationMap {
  [animationName: string]: ElementAnimation;
}

const defaultAnimationRegistry = new Map<string, ElementAnimation>();
const customAnimationRegistry = new WeakMap<Element, ElementAnimationMap>();

/* Retrieves an element's animation. Falls back to the default if no animation is found. */
function getAnimation(el: Element, animationName: string) {
  const customAnimation = customAnimationRegistry.get(el);

  /* Check for a custom animation. */
  if (customAnimation && customAnimation[animationName]) {
    return customAnimation[animationName];
  }

  /* Check for a default animation. */
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return defaultAnimation;
  }

  /* Fall back to an empty animation. */
  return { keyframes: [], options: { duration: 0 } };
}

/* Animates an element using keyframes. Returns a promise that resolves after the animation completes or gets canceled. */
function startAnimations(el: HTMLElement, keyframes: Keyframe[], options?: KeyframeAnimationOptions) {
  return new Promise(resolve => {
    if (options?.duration === Infinity) {
      throw new Error('Promise-based animations must be finite.');
    }

    const animation = el.animate(keyframes, {
      ...options,
      /* c8 ignore next */
      duration: options!.duration,
    });

    animation.addEventListener('cancel', resolve, { once: true });
    animation.addEventListener('finish', resolve, { once: true });
  });
}

/* Stops all active animations on the target element. Returns a promise that resolves after all animations are canceled. */
function stopAnimations(el: HTMLElement) {
  return Promise.all(
    el.getAnimations().map(
      animation =>
        new Promise(resolve => {
          const handleAnimationEvent = requestAnimationFrame(resolve);

          animation.addEventListener('cancel', () => handleAnimationEvent, { once: true });
          animation.cancel();
        })
    )
  );
}

/* Parses a delay and returns the number in milliseconds */
function parseDuration(delay: number | string) {
  const delayStr = delay.toString().toLowerCase();

  if (delayStr.indexOf('ms') > -1) {
    return parseFloat(delayStr);
  }

  if (delayStr.indexOf('s') > -1) {
    return parseFloat(delayStr) * 1000;
  }

  return parseFloat(delayStr);
}

export {
  getAnimation,
  startAnimations,
  stopAnimations,
  parseDuration,
};
