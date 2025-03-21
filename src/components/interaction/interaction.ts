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
import { hasItems } from '../../utilities/hasItems.js';
import { JWF_EVENTS } from '../../utilities/constants/events.js';
import { Banner } from '../../types/pages/Banner.js';
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
  private _bannerElements?: Banner[];

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this._bannerElements = await this.client.query(API_QUERIES.banner);
    emit(this, JWF_EVENTS.JWF_LOADED);
  }

  private _renderBanner(item: Banner, index: number) {
    const { image } = item;

    return html`
      <jwf-image
        id="banner_${index}"
        src=${this.client.urlForImage(image).url()}
        alt=${ifDefined(image.alt || undefined)}
        width=${image.width ?? 'auto'}
        height=${image.height ?? 'auto'}
      ></jwf-image>
    `;
  }

  private _renderError() {
    return html`
      <div class="page--no-upload">
        <sl-alert variant="primary" open>
          <sl-icon slot="icon" name="info-circle"></sl-icon>
          <strong>${t('general.error')}</strong><br />
          ${t('section_errors.missing_banner')}
        </sl-alert>
      </div>
    `;
  }

  protected render() {
    return html`
      <div id="main">
        ${when(hasItems(this._bannerElements),
          () => repeat(this._bannerElements!, (item, index) => this._renderBanner(item, index)),
          () => this._renderError()
        )}  
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-interaction': JwfInteraction;
  }
}
