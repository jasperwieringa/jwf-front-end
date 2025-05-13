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
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js';
import {
  type JwfClient,
  clientContext,
} from '../../services/client-context.js';
import { emit } from '../../utilities/event.js';
import { JWF_EVENTS } from '../../utilities/constants/events.js';
import { hasItems } from "../../utilities/hasItems.js";
import { isMobile } from '../../utilities/mobile.js';
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
  private timerId: number | undefined;

  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private currentDate: Date = new Date();

  @state()
  private interactions: InteractionElement[] = [];

  @state()
  private hasError: boolean = false;

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    // Update the timer every second
    this.timerId = window.setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    // Query the images
    this.client.query(API_QUERIES.interactions)
      .then(results => {
        this.interactions = results;
      })
      .catch(() => this.hasError = true)
      .finally(() => emit(this, JWF_EVENTS.JWF_LOADED));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.timerId) {
      clearInterval(this.timerId);
    }
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
    return grouped;
  }

  /** Method that renders the elements to interact with for desktop. */
  private renderDesktopInteractions(item: InteractionElement) {
    const { image, _id } = item;
    const { gridIndex, rowIndex } = image;

    return html`
      <div style=${styleMap({
        'grid-column': gridIndex !== 0 ? gridIndex : undefined,
        'grid-row': rowIndex !== 0 ? rowIndex : undefined,
      })}>
        <jwf-interaction-element
          id=${ifDefined(_id)}
          .container=${this}
          .interactionElement=${item}
        ></jwf-interaction-element>
      </div>
    `;
  }

  /** Iterate through all positions and place interactionElements. */
  private renderDesktop() {
    const interactionsByPosition = this.groupInteractions(this.interactions);

    return html`
      <div id="desktop">
        ${repeat([...interactionsByPosition.keys()], (key) => {
          const elements = repeat(interactionsByPosition.get(key)!, (item) => this.renderDesktopInteractions(item));

          // Wrap the elements in the bottom-right
          return html`
            <div class=${key}>
              ${when(key === 'bottom-right', () => html`
                <div class="wrapper">${elements}</div>
              `, () => elements)}
            </div>
          `
        })}
      </div>
    `;
  }

  /** Iterate through all positions and place interactionElements. */
  private renderMobile() {
    return html`
      <div id="mobile">
        <div id="timeAndDate">
          <p class="time">
            <sl-format-date date=${this.currentDate} hour="numeric" minute="numeric" hour-format="24"></sl-format-date>
          </p>
          <p class="date">
            <sl-format-date date=${this.currentDate} month="long"  weekday="long" day="numeric"></sl-format-date>
          </p>
        </div>
        <div id="content">
          ${repeat(this.interactions, item => item._id, item => html`
            <jwf-interaction-element
              id=${ifDefined(item._id)}
              .container=${this}
              .interactionElement=${item}
              mobile
            ></jwf-interaction-element>
          `)}
        </div>
      </div>
    `
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
    return when(hasItems(this.interactions) && !this.hasError,
      () => when(!isMobile(),
        () => this.renderDesktop(),
        () => this.renderMobile()
      ),
      () => this.renderError()
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction': JwfInteraction;
  }
}