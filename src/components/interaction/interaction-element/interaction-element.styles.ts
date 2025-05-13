import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    :host {
      display: inline-flex;
      height: fit-content;
      justify-content: center;
      --filter: drop-shadow(0 0 10px rgb(244, 157, 55));
    }
    
    #main.mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      
      svg {
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.13);
        border-radius: var(--sl-border-radius-large);
      }
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