import { html, LitElement, TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { classMap } from 'lit/directives/class-map.js';
import { until } from 'lit/directives/until.js';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { consume } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import { clientContext, type JwfClient } from '../../../services/client-context.ts';
import { watch } from '../../../utilities/watch.js';
import { Animate } from '../../../utilities/animate.ts';
import { emit } from '../../../utilities/event.ts';
import { JWF_EVENTS } from '../../../utilities/constants/events.ts';
import { InteractionElement as InteractionElementType } from '../../../types/pages/InteractionElement.js';
import styles from './interaction-element.styles.js';

@customElement('jwf-interaction-element')
export default class InteractionElement extends LitElement {
  private animateInstance = new Animate(this);

  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @property({ type: Object })
  public container?: HTMLElement;

  @property({ type: Object })
  public interactionElement!: InteractionElementType

  @property({ type: Boolean })
  public mobile: boolean = false;

  /** @internal */
  @state()
  private svg?: TemplateResult;

  /** @internal */
  @state()
  private hasFocus: boolean = false;

  @watch('interactionElement')
  handleInteractionElementChange() {
    const url = this.client.urlForImage(this.interactionElement.image).url()
    this.animateInstance.attachDraggable(this.container);
    this._loadImage(url);
  }

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  // Example override function
  private _processSvg(svgString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgEl = doc.documentElement;

    // Set or overwrite width/height
    svgEl.setAttribute('width', '100');
    svgEl.setAttribute('height', '100');

    return new XMLSerializer().serializeToString(svgEl);
  }

  // Load the image and handle the response
  private _loadImage(url: string) {
    fetch(url)
      .then(res => res.text())
      .then(rawSvg => {
        this.svg = html`${unsafeSVG(this.mobile 
          ? this._processSvg(rawSvg) 
          : rawSvg)
        }`;
      });
  }

  private handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.animateInstance.stopAnimations();
  }

  private handleMouseUp() {
    if (this.hasFocus) {
      this.animateInstance.restartAnimation();
    }
  }

  private handleFocusIn() {
    this.hasFocus = true;
    this.animateInstance.restartAnimation();
  }

  private handleFocusOut() {
    this.hasFocus = false;
    this.animateInstance.stopAnimations();
  }

  /** Handle the keyboard input on the image. */
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    this.handleOpenDialog();
  }

  /** Handle the mouse click on the image. */
  private handleOpenDialog() {
    const { title, description } = this.interactionElement;

    emit(this, JWF_EVENTS.JWF_OPEN_DIALOG, {
      detail: { title, description }
    });
  }

  protected render() {
    const { image } = this.interactionElement ?? {};
    const { tabIndex, alt } = image ?? {};

    return html`
      <div 
        id="main" 
        class=${classMap({
          mobile: this.mobile
        })}
        role="img" 
        aria-label=${ifDefined(alt || undefined)}
        tabindex=${tabIndex ?? 0}
        @mousedown=${this.handleMouseDown}
        @focusin=${this.handleFocusIn}
        @focusout=${this.handleFocusOut}
        @click=${this.handleOpenDialog}
        @keydown=${this.handleKeyDown}
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