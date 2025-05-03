import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    sl-dialog::part(title) {
      font-size: var(--sl-font-size-2x-large);
      color: var(--sl-color-primary-600);
    }
    
    sl-dialog::part(body) {
      padding-top: 0;
    }
    
    ul {
      padding-inline-start: 0;
      list-style: none;
    }
  `
]