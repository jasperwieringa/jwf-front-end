import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { translate as t } from 'lit-i18n';
import { consume } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import {
  type JwfClient,
  clientContext,
} from '../../services/client-context.js';
import { emit } from '../../utilities/event.js';
import { JWF_EVENTS } from '../../utilities/constants/events.js';
import { InteractionElement } from '../../types/pages/InteractionElement.js';
import { PositionGroup } from '../../types/Image.js';
import { API_QUERIES } from '../../services/apiQueries.js';
import './interaction-element/interaction-element.js';
import styles from './interaction.styles.js';

/**
 * @event jwf-loaded - An event fired when the component is done loading.
 */
@customElement('jwf-interaction')
export default class JwfInteraction extends LitElement {
  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private interactionsByPosition: Map<PositionGroup, InteractionElement[]> = new Map();

  @state()
  private hasError: boolean = false;

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    // Query the images
    this.client.query(API_QUERIES.interactions)
      .then(results => this.groupInteractions(results))
      .catch(() => this.hasError = true)
      .finally(() => emit(this, JWF_EVENTS.JWF_LOADED));
  }

  /** Method that groups interactions by their provided positionGroup. */
  private groupInteractions(interactions: InteractionElement[]) {
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

  /** Handle the keyboard input on the image. */
  private handleKeyDown(e: KeyboardEvent, item: InteractionElement) {
    if (e.key !== 'Enter') return;
    this.handleOpenDialog(item);
  }

  /** Handle the mouse click on the image. */
  private handleOpenDialog(item: InteractionElement) {
    const { title, description } = item;

    emit(this, JWF_EVENTS.JWF_OPEN_DIALOG, {
      detail: { title, description }
    });
  }

  /** Method that renders the element to interact with. */
  private renderInteractionElement(item: InteractionElement) {
    const { image, _id } = item;
    const { alt, gridIndex, rowIndex } = image;

    return html`
      <div style=${styleMap({
        'grid-column': gridIndex !== 0 ? gridIndex : undefined,
        'grid-row': rowIndex !== 0 ? rowIndex : undefined,
      })}>
        <jwf-interaction-element
          id=${ifDefined(_id)}
          .container=${this}
          src=${this.client.urlForImage(image).url()}
          alt=${ifDefined(alt || undefined)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, item)}
          @click=${() => this.handleOpenDialog(item)}
        ></jwf-interaction-element>
      </div>
    `;
  }

  /** Iterate through all positions and place interactionElements. */
  private renderGridElements() {
    return html`
      <div id="main">
        ${repeat([...this.interactionsByPosition.keys()], (key) => {
          const elements = repeat(this.interactionsByPosition.get(key)!, (item) => this.renderInteractionElement(item));
          
          return html`
            <div class=${key}>
              ${when(key === 'bottom-right', () => html`
                <div class="wrapper">${elements}</div>
              `, () => html`${elements}`)}
            </div>
          `
        })}
      </div>
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
    return when(this.interactionsByPosition.size > 0 && !this.hasError,
      () => this.renderGridElements(),
      () => this.renderError()
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction': JwfInteraction;
  }
}