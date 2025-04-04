import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    :host {
      display: inline-flex;
      justify-content: center;
    }
    
    img {
      display: none;
    }

    :host([has-image]) img {
      display: block;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    :host([has-image]) #loader {
      display: none;
    }
    
    #loader {
      font-size: 6rem;
      --indicator-color: var(--sl-color-primary-600);
      --track-width: 4px;
    }
  `,
];