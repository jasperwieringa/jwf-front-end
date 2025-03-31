import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { emit } from '../../../utilities/event.ts';
import { JWF_EVENTS } from '../../../utilities/constants/events.ts';
import { watch } from '../../../utilities/watch.ts';
import { clientContext, JwfClient } from '../../../services/client-context.ts';
import { API_QUERIES } from '../../../services/apiQueries.ts';
import { InteractionElement } from '../../../types/pages/InteractionElement.ts';
import styles from './interactive-image.styles.js';
import { hasItems } from '../../../utilities/hasItems.ts';

/**
 * @event jwf-loaded - Fired when the component is done loading.
 */
@customElement('jwf-interactive-image')
export default class InteractiveImage extends LitElement {
  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private interactions: InteractionElement[] = [];

  @query('#main')
  private canvas?: HTMLCanvasElement;

  private ctx?: CanvasRenderingContext2D;

  private readonly resizeHandler = this.setCanvasSizeAndDraw.bind(this);

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeHandler);
    this.interactions = await this.client.query(API_QUERIES.interactions);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
  }

  /** Watch for changes in interactions and re-draw */
  @watch('interactions')
  private handleInteractionsChange() {
    if (!hasItems(this.interactions)) return;
    this.drawInteractions();
    emit(this, JWF_EVENTS.JWF_LOADED);
  }

  /** Resize canvas to match window */
  private resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Resize and re-draw when window resizes */
  private setCanvasSizeAndDraw() {
    this.resizeCanvas();
    this.drawInteractions();
  }

  /** Draw all interaction SVGs */
  private drawInteractions() {
    if (!this.canvas || !hasItems(this.interactions)) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.interactions.forEach(interaction => {
      const svgImage = new Image();
      svgImage.src = this.client.urlForImage(interaction.image).url();
      svgImage.onload = () => {
        this.ctx!.drawImage(svgImage, 100, 100); // ← you may want to use interaction.x, interaction.y instead of 100,100
      };
    });
  }

  protected render() {
    return html`
      <canvas id="main" width=${window.innerWidth} height=${window.innerHeight}></canvas>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interactive-image': InteractiveImage;
  }
}
