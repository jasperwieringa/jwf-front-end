import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { until } from 'lit/directives/until.js';
import { provide } from '@lit/context';
import { clientContext } from '../services/client-context.js';
import { JwfClient } from '../services/JwfClient.ts';
import { API_QUERIES } from '../services/apiQueries.ts';
import { isDefined } from '../utilities/isDefined.js';
import { Theme } from '../types/Theme.js';
import '../assets/translations/translations.js';
import styles from './app.styles.js';

import './common/image/image.js';
import './common/loader/loader.js';
import './common/rtt/rtt.js';

@customElement('jwf-app')
export default class App extends LitElement {
  @provide({ context: clientContext })
  client = new JwfClient();

  @property({ type: String, reflect: true })
  theme: Theme = 'dark';

  @state()
  private _loading: boolean = false;

  @state()
  private _background = this._fetchBackGroundImage();

  @query('#pageElements')
  _sectionsRef?: HTMLElement;

  /** @internal Keep track of the loaded page elements */
  private _loadedPageElements: Map<string, boolean> = new Map();

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  // Ensure that there is never a focus trapped when pressing Escape
  private _handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      (document.activeElement as any).blur();
    }
  }

  /** Method that renders the background image */
  private async _fetchBackGroundImage() {
    const banners = await this.client.query(API_QUERIES.banner);
    const { image, alt } = banners[0];
    return html`
      <jwf-image
        src=${this.client.urlForImage(image).url()}
        alt=${alt}
        width="100%"
        height="100%"
      ></jwf-image>
    `
  }

  // Used to store each loaded page element in the _loadedPageElements Map object
  private _handleElementLoaded(event: CustomEvent) {
    const tagName = (event.target as HTMLElement).tagName.toLowerCase();
    this._loadedPageElements.set(tagName, true);

    if (this._allElementsLoaded()) {
      this._loading = false;
      this._loadedPageElements.clear();
    }
  }

  // Are all page elements loaded?
  private _allElementsLoaded() {
    // const contactReady = this._loadedPageElements.has('jwf-contact');
    return true;
  }

  /** Method that renders all page elements */
  private _renderPageElements() {
    return html`
      <div id="pageElements" ?hidden=${this._loading} @jwf-loaded=${this._handleElementLoaded}>
        ${until(this._background, '')}
        <!-- Elements here -->
      </div>
    `
  }

  /** Method that renders a JWF loader */
  private _renderLoader() {
    return html`<jwf-loader></jwf-loader>`;
  }

  /** Method that renders a return to top button */
  private _renderReturnToTop() {
    return html`
      <jwf-rtt .target=${this._sectionsRef!}></jwf-rtt>
    `;
  }

  protected render() {
    return html`
      <main
        id="main"
        class="container sl-theme-${this.theme}"
        role="main"
        @keydown=${this._handleKeyDown}
      >
        ${this._renderPageElements()}
        ${when(this._loading, () => this._renderLoader())}
        ${when(isDefined(this._sectionsRef), () => this._renderReturnToTop())}
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-app': App;
  }
}
