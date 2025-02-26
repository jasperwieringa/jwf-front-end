import { html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import { translate as t } from 'lit-i18n';
import styles from "./loader.styles.js";

@customElement('jwf-loader')
export default class Loader extends LitElement {
  static styles = styles;

  protected render() {
    return html`
      <div id="main">
        <div class="container">
          <div class="loader--device"></div>
          <div class="loader--device"></div>
          <div class="loader--device"></div>
        </div>
        <div class="text"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jwf-loader": Loader;
  }
}
