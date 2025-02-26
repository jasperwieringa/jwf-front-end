import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { watch } from '../../../utilities/watch.js';
import { isDefined } from '../../../utilities/isDefined.js';
import { translate as t } from 'lit-i18n';
import styles from './rtt.styles.js';

import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

@customElement('jwf-rtt')
export default class Rtt extends LitElement {
  @property({ type: Object })
  target: Element = this.parentNode as Element;

  @state()
  show: boolean = false;

  @state()
  position: number = 0;

  @state()
  speed: number = 500;

  @state()
  ticking: boolean = false;

  @watch('target')
  handleTargetChange() {
    if (!isDefined(this.target)) throw new Error(t('general.rtt_no_target') as string);
    this.target.addEventListener('scroll', this._watch.bind(this));
  }

  static styles = styles;

  private _easeInOutQuad({
    currentTime,
    start,
    change,
    speed,
  }: {
    currentTime: number;
    start: number;
    change: number;
    speed: number;
  }) {
    currentTime /= speed / 2;
    if (currentTime < 1) {
      return (change / 2) * currentTime * currentTime + start;
    }
    currentTime--;
    return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
  }

  private _handleRTTClick() {
    const start = this.target.scrollTop;
    const change = this.position - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      this.target.scrollTop = this._easeInOutQuad({
        currentTime,
        start,
        change,
        speed: this.speed,
      });
      if (currentTime < this.speed) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  private _watch() {
    if (this.ticking) return;

    window.requestAnimationFrame(() => {
      this.show = this.target.scrollTop > 100;
      this.ticking = false;
    });
    this.ticking = true;
  }

  protected render() {
    return html`
      <div id="main" ?hidden=${(!this.show || undefined)}>
        <sl-tooltip content=${t('general.rtt')}>
          <sl-icon-button
            name="chevron-up"
            label=${t('general.rtt')}
            @click=${this._handleRTTClick}
          ></sl-icon-button>
        </sl-tooltip>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwf-rtt': Rtt;
  }
}
