import { html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import styles from "./loader.styles.js";

@customElement('jwf-loader')
export default class Loader extends LitElement {
  static styles = styles;

  protected render() {
    return html`
      <div id="main">
        <div class="loader">
          <p>loading</p>
          <div class="words">
            <span class="word">buttons</span>
            <span class="word">forms</span>
            <span class="word">switches</span>
            <span class="word">cards</span>
            <span class="word">buttons</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jwf-loader": Loader;
  }
}
