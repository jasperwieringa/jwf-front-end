import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { translate as t } from 'lit-i18n';
import { consume } from '@lit/context';
import {
  type JwfClient,
  clientContext,
} from '../../services/client-context.js';
import { emit } from '../../utilities/event.js';
import { JWF_EVENTS } from '../../utilities/constants/events.js';
import { InteractionElement } from '../../types/pages/InteractionElement.js';
import { API_QUERIES } from '../../services/apiQueries.js';
import styles from './interaction.styles.js';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '../common/image/image.js';

/**
 * @event jwf-loaded - An event fired when the component is done loading.
 */
@customElement('jwf-interaction')
export default class JwfInteraction extends LitElement {
  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private _interactionsByPosition: Map<string, InteractionElement[]> = new Map();

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    const interactions = await this.client.query(API_QUERIES.interactions);
    this._groupInteractions(interactions);
    emit(this, JWF_EVENTS.JWF_LOADED);
  }

  /** Method that groups interactions by their provided positionGroup. */
  private _groupInteractions(interactions) {
    const grouped = new Map<string, InteractionElement[]>();
    interactions.forEach((element: InteractionElement) => {
      const position = element.image.positionGroup;
      if (!grouped.has(position)) {
        grouped.set(position, []);
      }
      grouped.get(position)!.push(element);
    });
    this._interactionsByPosition = grouped;
  }

  /** Method that renders the element to interact with. */
  private _renderInteractionElement(item: InteractionElement) {
    const { image, _id } = item;
    const { width, height, alt } = image;

    return html`
      <jwf-image
        id=${ifDefined(_id)}
        tabindex="0"
        src=${this.client.urlForImage(image).url()}
        alt=${ifDefined(alt || undefined)}
        width=${width ?? 'auto'}
        height=${height ?? 'auto'}
      ></jwf-image>
    `;
  }

  /** Iterate through all positions and place interactionElements. */
  private _renderGridElements() {
    return html`
      <div id="main">
        ${repeat([...this._interactionsByPosition.keys()], (key) => html`
          <div class=${key}>
            ${repeat(this._interactionsByPosition.get(key), (item) => this._renderInteractionElement(item))}
          </div>
        `)}
      </div>
    `;
  }

  private _renderError() {
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
    return when(this._interactionsByPosition.size > 0,
      () => this._renderGridElements(),
      () => this._renderError()
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction': JwfInteraction;
  }
}
