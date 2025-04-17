import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { provide } from '@lit/context';
import { clientContext } from '../services/client-context.js';
import { JwfClient } from '../services/JwfClient.ts';
import { Theme } from '../types/Theme.js';
import '../assets/translations/translations.js';
import styles from './app.styles.js';

import './interaction/interaction.js';
import './common/loader/loader.js';
import './common/rtt/rtt.js';
import type Dialog from './common/dialog/dialog.js';
import './common/dialog/dialog.js';

@customElement('jwf-app')
export default class App extends LitElement {
  @provide({ context: clientContext })
  client = new JwfClient();

  @property({ type: String, reflect: true })
  theme: Theme = 'dark';

  @state()
  private _loading: boolean = true;

  @query('#dialog')
  _dialogRef?: Dialog;

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

  // Used to store each loaded page element in the _loadedPageElements Map object
  private _handleLoaded() {
    this._loading = false;
  }

  /** Method that opens the dialog */
  private _handleOpenDialog(e: CustomEvent) {
    this._dialogRef!.open(e.detail);
  }

  /** Method that renders a JWF loader */
  private _renderLoader() {
    return html`<jwf-loader></jwf-loader>`;
  }

  protected render() {
    return html`
      <main
        id="main"
        class="container sl-theme-${this.theme}"
        role="main"
        @keydown=${this._handleKeyDown}
        @jwf-open-dialog=${this._handleOpenDialog}
      >
        <jwf-interaction ?hidden=${this._loading} @jwf-loaded=${this._handleLoaded}></jwf-interaction>
        <jwf-dialog id="dialog"></jwf-dialog>
        ${when(this._loading, () => this._renderLoader())}
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-app': App;
  }
}
