import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';
// import { mobileBreakpoint, tabletBreakpoint } from '../../styles/constants/constants.js';

export default [
  componentStyles,
  css`
    #main {
      display: grid;
    }
    
    #main div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Assign specific positions */
    .top-left {
      grid-column: 1;
      grid-row: 1;
    }

    .top-right {
      grid-column: 3;
      grid-row: 1;
    }

    .center {
      grid-column: 2;
      grid-row: 1 / span 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bottom-left {
      grid-column: 1;
      grid-row: 2;
    }

    .bottom-right {
      grid-column: 3;
      grid-row: 2;
    }
  `
]