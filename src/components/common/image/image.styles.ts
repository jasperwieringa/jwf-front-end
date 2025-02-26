import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    :host {
      width: 100%;
    }

    img {
      display: none;
    }

    .image--has-image img {
      width: 100%;
      height: 100%;
      display: block;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      object-fit: cover;
    }

    #loader {
      --cross-height: 150px;
      --cross-width: 80px;
    }

    .image--has-image #loader {
      display: none;
    }
  `,
];