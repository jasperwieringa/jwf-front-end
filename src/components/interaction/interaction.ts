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
import { watch } from "../../utilities/watch.js";
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

  @state()
  private _topLeftBanners: Banner[] = [];

  @state()
  private _topRightBanners: Banner[] = [];

  @state()
  private _centerBanners: Banner[] = [];

  @state()
  private _bottomLeftBanners: Banner[] = [];

  @state()
  private _bottomRightBanners: Banner[] = [];

  @watch('_bannerElements', { waitUntilFirstUpdate: true })
  handleBannerElementsChange() {
    this._bannerElements!.forEach(element => {
      if (element.image.positionGroup === 'top-left') this._topLeftBanners.push(element);
      if (element.image.positionGroup === 'top-right') this._topRightBanners.push(element);
      if (element.image.positionGroup === 'center') this._centerBanners.push(element);
      if (element.image.positionGroup === 'bottom-left') this._bottomLeftBanners.push(element);
      if (element.image.positionGroup === 'bottom-right') this._bottomRightBanners.push(element);
    })
  }

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this._bannerElements = await this.client.query(API_QUERIES.banner);
    emit(this, JWF_EVENTS.JWF_LOADED);
  }

  private _renderBanner(item: Banner, index: number) {
    const { image } = item;
    const { width, height, alt } = image;

    return html`
      <jwf-image
        id="banner_${index}"
        src=${this.client.urlForImage(image).url()}
        alt=${ifDefined(alt || undefined)}
        width=${width ?? 'auto'}
        height=${height ?? 'auto'}
      ></jwf-image>
    `;
  }

  private _renderGridElements() {
    return html`
      <div id="main">
        <div>${repeat(this._topLeftBanners!, (item, index) => this._renderBanner(item, index))}</div>
        <div class="row-span-2">${repeat(this._centerBanners!, (item, index) => this._renderBanner(item, index))}</div>
        <div>${repeat(this._topRightBanners!, (item, index) => this._renderBanner(item, index))}</div>
        <div>${repeat(this._bottomLeftBanners!, (item, index) => this._renderBanner(item, index))}</div>
        <div>${repeat(this._bottomRightBanners!, (item, index) => this._renderBanner(item, index))}</div>
      </div>
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
    return when(hasItems(this._bannerElements),
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
