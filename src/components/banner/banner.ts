import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
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
import styles from './banner.styles.js';

import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

/**
 * @event jwf-loaded - An event fired when the component is done loading.
 */
@customElement('jwf-banner')
export default class Banner extends LitElement {
  @consume({ context: clientContext })
  @property({ attribute: false })
  public client!: JwfClient;

  @state()
  private _banners?: Banner[];

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this._banners = await this.client.query(API_QUERIES.banner);
    emit(this, JWF_EVENTS.JWF_LOADED);
  }

  private _renderBanner(item: Banner, index: number) {
    const { image } = item;

    return html`
      <sl-carousel-item aria-labelledby=${ifDefined(image.alt ? `carousel_${index}` : undefined)}>
        <img
          id="carousel_${index}"
          class=${classMap({
            'carousel-image': true,
            blur: image.blur,
          })}
          alt=${ifDefined(image.alt || undefined)}
          src=${this.client.urlForImage(image).url()}
        />
        <div class="carousel--content">
          <h1>${item.title}</h1>
          <h2>${item.subTitle}</h2>
        </div>
      </sl-carousel-item>
    `;
  }

  private _renderCarousel(banners: Banner[]) {
    return html`
      <sl-carousel id="main" pagination>
        ${repeat(banners, (item, index) => this._renderBanner(item, index))}
      </sl-carousel>
    `;
  }

  protected render() {
    return when(
      hasItems(this._banners),
      () => this._renderCarousel(this._banners!),
      () => html`
        <div class="page--no-upload">
          <sl-alert variant="primary" open>
            <sl-icon slot="icon" name="info-circle"></sl-icon>
            <strong>${t('general.error')}</strong><br />
            ${t('section_errors.missing_banner')}
          </sl-alert>
        </div>
      `
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-banner': Banner;
  }
}
