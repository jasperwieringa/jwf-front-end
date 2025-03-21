import { html, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { emit } from '../../../utilities/event.js';
import { watch } from '../../../utilities/watch.js';
import { JWF_EVENTS } from '../../../utilities/constants/events.js';
import { getAnimation, parseDuration, startAnimations, stopAnimations } from '../../../utilities/animate.js';
import styles from './image.styles.js';

/**
 * @event jwf-image-loaded - Emitted when the image is loaded.
 * @event jwf-error - Emitted when the image cannot be loaded.
 */
@customElement('jwf-image')
export default class Image extends LitElement {
  /** Set the path to the image. */
  @property({ type: String })
  public src?: string;

  /** Set the alternate text for the image. */
  @property({ type: String })
  public alt?: string;

  /** Set the width of the image. */
  @property({ type: String })
  public width?: string;

  /** Set the height of the image. */
  @property({ type: String })
  public height?: string;

  /** Set the delay in ms before loading the image. */
  @property({
    type: Number,
    converter: (attrValue: string | null) => (attrValue ? parseDuration(attrValue) : 1000),
  })
  delay: number = 1000;
  
    /** @internal */
  @query('#main')
  private container!: HTMLElement;

  /** @internal */
  @query('#image')
  private image!: HTMLImageElement;

  /** @internal */
  @query('#loader')
  private loader!: HTMLElement;

  /** @internal - Reference to the intersection observer. */
  private _intersectionObserver?: IntersectionObserver;

  /** @internal - Options that define certain aspects of the observer’s behavior. */
  private _observerOptions: any = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 1],
  };

  /** @internal - Used to set a timeout on loading the image. */
  private _loadTimer: number | null = null;

  /** @internal - Loading state of the image. */
  @state()
  private _loading: boolean = false;

  /** @internal - Is a valid image loaded?. */
  @state()
  private _hasImage: boolean = false;

  @watch('src', { waitUntilFirstUpdate: true })
  handleSrcChange() {
    this._attachObserver();
  }

  @watch('_loading', { waitUntilFirstUpdate: true })
  async handleLoadingChange() {
    if (this._loading) {
      await stopAnimations(this.loader);
      const { keyframes, options } = getAnimation(this.loader, 'loader.show');
      await startAnimations(this.loader, keyframes, options);
    } else {
      await stopAnimations(this.loader);
    }
  }

  static styles = styles;

  firstUpdated() {
    this._attachObserver();
  }

  private _attachObserver() {
    this._removeObserver();
    this._intersectionObserver = new IntersectionObserver(this._handleIntersection.bind(this), this._observerOptions);
    this._intersectionObserver.observe(this.container);
  }

  private _removeObserver() {
    if (!this._intersectionObserver) return;
    this._intersectionObserver.disconnect();
  }

  // Callback that gets fired whenever the first or last pixel of the container is intersecting the root element
  private _handleIntersection(entries: any[]) {
    entries.forEach(({ intersectionRatio }) => {
      if (intersectionRatio === 0) {
        if (this._loadTimer) {
          clearTimeout(this._loadTimer);
          this._loadTimer = null;
        }
      } else if (intersectionRatio === 1) {
        this._loadTimer = window.setTimeout(this._loadImage.bind(this), this.delay);
      }
    });
  }

  // Load the image and handle the response
  private _loadImage() {
    this._loading = true;
    this.image.src = this.src!;
    this.image.onload = this._imageResponse.bind(this);
    this.image.onerror = this._imageResponse.bind(this);
  }

  // Emit the response from the image
  private _imageResponse(e: any) {
    this._loading = false;
    this._hasImage = e.type === 'load';
    this._removeObserver();

    emit(this, this._hasImage ? JWF_EVENTS.JWF_IMAGE_LOADED : JWF_EVENTS.JWF_ERROR, {
      detail: e,
    });
  }

  protected render() {
    if (this._hasImage) {
      this.setAttribute('has-image', '');
    }

    return html`
      <div id="main">
        <img 
          id="image" 
          height=${this.height ?? 'auto'} 
          width=${this.width ?? 'auto'}
          src=""
          alt=${this.alt ?? ''} />
        <div id="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-image': Image;
  }
}