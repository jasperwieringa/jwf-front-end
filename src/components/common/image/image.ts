import { html, LitElement, TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { customElement, property, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import { watch } from '../../../utilities/watch.js';
import styles from './image.styles.js';

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

  /** @internal */
  @state()
  private svg?: TemplateResult;

  @watch('src')
  handleSrcChange() {
    this._loadImage();
  }

  static styles = styles;

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