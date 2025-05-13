import { LitElement, html} from "lit";
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js';
import styles from './mobile.styles.ts';

@customElement('jwf-mobile')
export default class Mobile extends LitElement {
  private timerId: number | undefined;

  @state()
  private currentDate: Date = new Date();

  connectedCallback() {
    super.connectedCallback();
    // Update every second (adjust if you only want to update by minute or day)
    this.timerId = window.setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  static styles = styles;

  render() {
    return html`
      <div class="container">
        <span class="top-border"></span>
        <div id="timeAndDate">
          <p class="time">
            <sl-format-date .date=${this.currentDate} hour="numeric" minute="numeric" hour-format="24"></sl-format-date>
          </p>
          <p class="date">
            <sl-format-date .date=${this.currentDate} month="long"  weekday="long" day="numeric"></sl-format-date>
          </p>
        </div>
        <div id="content">
          <svg
            class="fingerprint"
            width="26px"
            height="26px"
            viewBox="0 0 0.488 0.488"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.409 0.114a0.196 0.196 0 0 1 0.027 0.122v0.024c0 0.026 0.007 0.051 0.019 0.073M0.146 0.212c0 -0.026 0.01 -0.051 0.028 -0.069a0.096 0.096 0 0 1 0.068 -0.029c0.026 0 0.05 0.01 0.068 0.029s0.028 0.043 0.028 0.069v0.024c0 0.053 0.017 0.104 0.048 0.146m-0.145 -0.17v0.049A0.343 0.343 0 0 0 0.303 0.455M0.146 0.309A0.442 0.442 0 0 0 0.189 0.455m-0.118 -0.049c-0.016 -0.055 -0.024 -0.113 -0.022 -0.17V0.212a0.195 0.195 0 0 1 0.026 -0.098 0.194 0.194 0 0 1 0.071 -0.072 0.192 0.192 0 0 1 0.194 0"
              stroke="#000000"
              stroke-linecap="square"
              stroke-linejoin="round"
              stroke-width="0.0325"
            ></path>
          </svg>
        </div>
        <div id="bottom">
          <svg
            class="camera"
            width="24"
            height="24"
            viewBox="0 0 0.72 0.72"
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.57.18H.522L.492.15A.1.1 0 0 0 .42.12H.3a.1.1 0 0 0-.072.03l-.03.03H.15a.09.09 0 0 0-.09.09v.24C.06.56.1.6.15.6h.42C.62.6.66.56.66.51V.27A.09.09 0 0 0 .57.18m-.21.3a.105.105 0 1 1 0-.21.105.105 0 0 1 0 .21M.54.339a.039.039 0 1 1 0-.078.039.039 0 0 1 0 .078"
            ></path>
          </svg>
          <svg
            class="phone"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            xml:space="preserve"
            width="24"
            height="24"
          >
            <path
              fill="none"
              stroke="#000"
              stroke-width="1.5"
              stroke-miterlimit="10"
              d="m10.2 6.375-3.075-3.15c-.375-.3-.9-.3-1.275 0l-2.325 2.4c-.525.45-.675 1.2-.45 1.8.6 1.725 2.175 5.175 5.25 8.25s6.525 4.575 8.25 5.25c.675.225 1.35.075 1.875-.375l2.325-2.325c.375-.375.375-.9 0-1.275L17.7 13.875c-.375-.375-.9-.375-1.275 0L14.55 15.75s-2.1-.9-3.75-2.475-2.475-3.75-2.475-3.75L10.2 7.65c.375-.375.375-.975 0-1.275z"
            ></path>
          </svg>
        </div>
        <span class="right-border top"></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-mobile': Mobile
  }
}


