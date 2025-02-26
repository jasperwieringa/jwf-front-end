import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';
import {
  mobileBreakpoint,
  tabletBreakpoint,
} from '../../styles/constants/constants.js';

export default [
  componentStyles,
  css`
    #main,
    #main > sl-carousel-item {
      height: 100%;
      overflow: hidden;
    }

    #main::part(base) {
      gap: 0;
    }

    #main::part(pagination) {
      z-index: 1;
      margin-top: calc(var(--sl-spacing-4x-large) * -1);
    }

    #main::part(pagination-item) {
      background-color: var(--sl-color-orange-800);
    }

    #main::part(pagination-item--active) {
      background-color: var(--sl-color-orange-700);
    }

    sl-carousel-item {
      position: relative;
    }

    .blur {
      filter: blur(5px);
    }

    .carousel--content {
      display: grid;
      width: 100%;
      gap: var(--sl-spacing-x-large);
      backdrop-filter: blur(5px) saturate(50%);
      position: absolute;
      text-align: center;
      text-wrap: pretty;
      padding: var(--sl-spacing-x-large);
      line-height: var(--sl-line-height-dense);
    }

    h1 {
      font-size: var(--sl-font-size-3x-large);
    }

    h2 {
      font-size: var(--sl-font-size-x-large);
    }

    /* Small devices and up */
    @media (min-width: ${mobileBreakpoint}rem) {
      h1 {
        font-size: 5rem;
      }

      h2 {
        font-size: var(--sl-font-size-2x-large);
      }
    }

    /* Medium devices and up */
    @media (min-width: ${tabletBreakpoint}rem) {
      h1 {
        font-size: 7rem;
      }

      h2 {
        font-size: var(--sl-font-size-3x-large);
      }
    }
  `,
];
