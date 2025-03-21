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
    
    #main div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .row-span-2 {
      grid-row: span 2;
    }
  `
]