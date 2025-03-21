import { css } from 'lit';
import componentStyles from '../styles/component.styles.js';
import darkStyles from '../styles/dark.styles.js';
import lightStyles from '../styles/light.styles.js';
import { mobileBreakpoint } from '../styles/constants/constants.js';

export default [
  lightStyles,
  darkStyles,
  componentStyles,
  css`
    #main {
      height: 100svh;
      color: var(--sl-color-neutral-900);
      background-color: var(--jwf-color-background);

      backdrop-filter: blur(5px) saturate(50%);
    }

    #pageElements {
      height: inherit;
      overflow-y: auto;
    }

    jwf-rtt {
      display: none
    }

    /* Small devices and up */
    @media (min-width: ${mobileBreakpoint}rem) {
      jwf-rtt {
        display: unset;
      }
    }
  `,
];
