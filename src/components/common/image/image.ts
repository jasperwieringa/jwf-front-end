import { html, LitElement, TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from '../../../utilities/watch.js';
import { parseDuration } from '../../../utilities/animate.js';
import styles from './image.styles.js';

import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

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

  @state()
  private svg?: TemplateResult;
  
    /** @internal */
  @query('#main')
  private container!: HTMLElement;

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

  @watch('src', { waitUntilFirstUpdate: true })
  handleSrcChange() {
    this._attachObserver();
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
    fetch(this.src!)
      .then(res => res.text())
      .then(svg => this.svg = html`${unsafeSVG(svg)}`);
  }

  protected render() {
    return html`
      <div id="main">
        ${until(this.svg, html`<sl-spinner id="loader"></sl-spinner>`)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-image': Image;
  }
}