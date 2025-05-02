import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    :host {
      display: inline-flex;
      justify-content: center;
      --filter: drop-shadow(0 0 10px rgb(244, 157, 55));
    }

    #main:focus-visible {
      outline: none;
      box-shadow: none;
      
      svg {
        filter: var(--filter);
      }
    }
    
    svg:hover {
      filter: var(--filter);
    }
    
    #loader {
      font-size: 6rem;
      --indicator-color: var(--sl-color-primary-600);
      --track-width: 4px;
    }
  `,
];