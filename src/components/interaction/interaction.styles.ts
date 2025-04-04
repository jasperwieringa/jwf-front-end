import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    #main {
      position:absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    
    sl-dialog::part(title) {
      font-size: var(--sl-font-size-2x-large);
    }
    
    sl-button::part(base) {
      color: var(--sl-color-primary-100);
    }
  `
]