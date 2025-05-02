import { html, LitElement, TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { customElement, property, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import { watch } from '../../../utilities/watch.js';
import { Animate } from '../../../utilities/animate.ts';
import styles from './interaction-element.styles.js';

@customElement('jwf-interaction-element')
export default class InteractionElement extends LitElement {
  private animateInstance = new Animate(this);

  @property({ type: Object })
  public container?: HTMLElement;

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
    this.animateInstance.attachDraggable(this.container);
    this._loadImage();
  }

  static styles = styles;

  // Load the image and handle the response
  private _loadImage() {
    fetch(this.src!)
      .then(res => res.text())
      .then(svg => this.svg = html`${unsafeSVG(svg)}`);
  }

  private handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.animateInstance.stopAnimations();
  }

  protected render() {
    return html`
      <div 
        id="main" 
        role="img" 
        aria-label=${this.alt ?? ''}
        tabindex="0"
        @mousedown=${this.handleMouseDown}
        @focusin=${() => this.animateInstance.restartAnimation()}
        @focusout=${() => this.animateInstance.stopAnimations()}
      >
        ${until(this.svg, html`<sl-spinner id="loader"></sl-spinner>`)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction-element': InteractionElement;
  }
}