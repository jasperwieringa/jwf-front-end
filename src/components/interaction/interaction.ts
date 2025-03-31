import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { translate as t } from 'lit-i18n';
import { consume } from '@lit/context';
import {
  type JwfClient,
  clientContext,
} from '../../services/client-context.js';
import { emit } from '../../utilities/event.js';
import { JWF_EVENTS } from '../../utilities/constants/events.js';
import { watch } from '../../utilities/watch.ts';
import { hasItems } from '../../utilities/hasItems.ts';
import { InteractionElement } from '../../types/pages/InteractionElement.js';
import { API_QUERIES } from '../../services/apiQueries.js';
import styles from './interaction.styles.js';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { isDefined } from '../../utilities/isDefined.ts';

/**
 * @event jwf-loaded - An event fired when the component is done loading.
 */
@customElement('jwf-interaction')
export default class JwfInteraction extends LitElement {
  private readonly resizeHandler = this.setCanvasSizeAndDraw.bind(this);

  /** @internal - Stores the fetched images to prevent excessively fetching images. */
  private storedImages = new Map<string, HTMLImageElement>();

  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private _interactionElements: InteractionElement[] = [];

  @state()
  private _hasError: boolean = false;

  @query('#main')
  private canvas?: HTMLCanvasElement;

  @watch('_interactionElements')
  handleInteractionElementsChange() {
    if (!hasItems(this._interactionElements)) return;
    this.drawInteractionElements();
  }

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeHandler);

    // Query the images
    this._interactionElements = await this.client.query(API_QUERIES.interactions)
      .catch(() => this._hasError = true)
      .finally(() => emit(this, JWF_EVENTS.JWF_LOADED));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
  }

  /** Resize canvas to match window. */
  private resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Resize and re-draw when window resizes. */
  private setCanvasSizeAndDraw() {
    this.resizeCanvas();
    this.drawInteractionElements();
  }

  /** Method that renders the element to interact with. */
  private drawInteractionElements() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');

    // Clear old images on resize
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._interactionElements.forEach(item => {
      const { image, _id } = item;
      let svgImage = this.storedImages.get(_id);

      // If the image wasn't loaded yet, load (and store) it
      if (!isDefined(svgImage)) {
        svgImage = new Image();
        svgImage.src = this.client.urlForImage(image).url();
        this.storedImages.set(_id, svgImage);

        svgImage.onload = () => {
          this.drawInteractionElements();
        };
      }

      if (svgImage.complete) {
        ctx.drawImage(svgImage, 100, 100);
      }
    })
  }

  /** Draw a canvas object to add SVGs to. */
  private renderCanvas() {
    return html`
      <canvas id="main" width=${window.innerWidth} height=${window.innerHeight}></canvas>
    `;
  }

  /** When the client fails, display an error. */
  private renderError() {
    return html`
      <div class="page--no-upload">
        <sl-alert variant="primary" open>
          <sl-icon slot="icon" name="info-circle"></sl-icon>
          <strong>${t('general.error')}</strong><br />
          ${t('section_errors.missing_interaction')}
        </sl-alert>
      </div>
    `;
  }

  protected render() {
    return when(!this._hasError,
      () => this.renderCanvas(),
      () => this.renderError()
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction': JwfInteraction;
  }
}
