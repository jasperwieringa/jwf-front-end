import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    sl-dialog::part(title) {
      font-size: var(--sl-font-size-2x-large);
    }
    
    sl-dialog::part(title) {
      color: var(--sl-color-primary-600);
    }
  `
]