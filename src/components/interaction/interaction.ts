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
import { isDefined } from '../../utilities/isDefined.ts';
import { InteractionElement } from '../../types/pages/InteractionElement.js';
import { PositionGroup } from '../../types/Image.js';
import { API_QUERIES } from '../../services/apiQueries.js';
import styles from './interaction.styles.js';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { Particle } from './Particle/Particle.js';

/**
 * @event jwf-loaded - An event fired when the component is done loading.
 */
@customElement('jwf-interaction')
export default class JwfInteraction extends LitElement {
  private readonly resizeHandler = this.setCanvasSizeAndDraw.bind(this);

  /** @internal - Stores the fetched images to prevent excessively fetching images. */
  private storedParticles = new Map<string, Particle>();

  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private interactionsByPosition: Map<PositionGroup, InteractionElement[]> = new Map();

  @state()
  private hasError: boolean = false;

  @query('#main')
  private canvas!: HTMLCanvasElement;

  @watch('interactionsByPosition', { waitUntilFirstUpdate: true })
  async handleInteractionsByPositionChange() {
    if (this.groupInteractions.length === 0) return;
    this.drawInteractionElements();
  }

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeHandler);

    // Query the images
    this.client.query(API_QUERIES.interactions)
      .then(results => this.groupInteractions(results))
      .catch(() => this.hasError = true)
      .finally(() => emit(this, JWF_EVENTS.JWF_LOADED));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
  }

  /** Method that groups interactions by their provided positionGroup. */
  private groupInteractions(interactions) {
    const grouped = new Map<PositionGroup, InteractionElement[]>();
    interactions.forEach((element: InteractionElement) => {
      const position = element.image.positionGroup;
      if (!grouped.has(position)) {
        grouped.set(position, []);
      }
      grouped.get(position)!.push(element);
    });
    this.interactionsByPosition = grouped;
  }

  /** Resize canvas to match window. */
  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Resize and re-draw when window resizes. */
  private setCanvasSizeAndDraw() {
    this.resizeCanvas();
    this.drawInteractionElements();
  }

  /** Method that iterates through the fetched images. */
  private drawInteractionElements() {
    const ctx = this.canvas.getContext('2d');

    // Clear old images on resize
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Loop through all positions (top-left, top-right etc.)
    [...this.interactionsByPosition.keys()].forEach(key => {
      // Loop through each item in a specific position group
      [...this.interactionsByPosition.get(key)].forEach((item) => {
        const { image, _id } = item;
        const storedParticle = this.storedParticles.get(_id);

        // If the particle does not exist yet, create it
        if (!isDefined(storedParticle)) {
          this.storedParticles.set(_id, new Particle(
            ctx,
            image,
            this.client.urlForImage(image).url()
          ));
          return;
        }

        // If the particle does exist, re-draw it
        storedParticle.draw();
      });
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
          ${t('section_errors.missing_interactions')}
        </sl-alert>
      </div>
    `;
  }

  protected render() {
    return when(!this.hasError,
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