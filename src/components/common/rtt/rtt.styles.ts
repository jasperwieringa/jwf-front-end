import { css } from 'lit';
import componentStyles from '../../../styles/component.styles';

export default [
  componentStyles,
  css`
    :host {
      position: fixed;
      right: var(--sl-spacing-3x-large);
      bottom: var(--sl-spacing-2x-large);
    }

    sl-icon-button {
        font-size: var(--sl-font-size-2x-large);
    }
  `,
];
