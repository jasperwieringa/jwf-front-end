import { LitElement, html} from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { toHTML } from '@portabletext/to-html';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import styles from './dialog.styles.js';

@customElement('jwf-dialog')
export default class Dialog extends LitElement {
  @state()
  private _label?: string;

  @state()
  private _content?: string;

  @state()
  private _open: boolean = false;

  static styles = styles;

  /** Public method to open the dialog */
  public open({ title, description }: any) {
    this._label = title;
    this._content = toHTML(description);
    this._open = true;
  }

  /** Public method to close the dialog */
  public close() {
    this._label = undefined;
    this._content = undefined;
    this._open = false;
  }

  render() {
    return html`
      <sl-dialog 
        .label=${this._label ?? ''} 
        ?open=${this._open}
        @sl-hide=${this.close}
      >
        <div id="content">${unsafeHTML(this._content)}</div>
        <sl-button slot="footer" variant="primary" outline @click=${this.close}>Close</sl-button>
      </sl-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-dialog': Dialog
  }
}


