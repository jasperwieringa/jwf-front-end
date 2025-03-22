import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';
// import { mobileBreakpoint, tabletBreakpoint } from '../../styles/constants/constants.js';

export default [
  componentStyles,
  css`
    #main {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
    }
    
    #main > div {
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
    }

    .bottom-left {
      grid-column: 1;
      grid-row: 2;
    }

    .bottom-right {
      grid-column: 3;
      grid-row: 2;
      
      .wrapper {
        height: 100%;
        width: 100%;
        display: grid;
      }
    }
  `
]