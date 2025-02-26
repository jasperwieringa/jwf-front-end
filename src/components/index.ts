import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { provide } from '@lit/context';
import { clientContext } from '../services/client-context.js';
import { JwfClient } from '../services/JwfClient.ts';
import { isDefined } from '../utilities/isDefined.js';
import { Theme } from '../types/Theme.js';
import '../assets/translations/translations.js';
import styles from './index.styles.js';

@customElement('jwf-app')
export default class Index extends LitElement {
  @provide({ context: clientContext })
  client = new JwfClient();

  @property({ type: String, reflect: true })
  theme: Theme = 'dark';

  @state()
  private _loading: boolean = true;

  @query('#pageElements')
  _sectionsRef?: HTMLElement;

  /** @internal Keep track of the loaded page elements */
  private _loadedPageElements: Map<string, boolean> = new Map();

  static styles = styles;

  connectedCallback(): void {
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
    const bannerReady = this._loadedPageElements.has('jwf-banner');
    // const contactReady = this._loadedPageElements.has('jwf-contact');
    return bannerReady;
  }

  protected render() {
    return html`
      <main
        id="main"
        class="container sl-theme-${this.theme}"
        role="main"
        @keydown=${this._handleKeyDown}
      >
        <div
          id="pageElements"
          @jwf-loaded=${this._handleElementLoaded}
          ?hidden=${this._loading}
        >
          <jwf-banner></jwf-banner>
        </div>
        <jwf-loader ?hidden=${!this._loading}></jwf-loader>
        ${when(
          isDefined(this._sectionsRef),
          () => html`
            <jwf-rtt .target=${this._sectionsRef!}></jwf-rtt>`
        )}
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-app': Index;
  }
}
