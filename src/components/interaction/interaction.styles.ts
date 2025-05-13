import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    #desktop {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
      
      > div {
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
          display: grid;
          height: 100%;
          width: 100%;
        }
      }
      
    }
    
    #mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sl-spacing-3x-large);
      height: 100svh;
      width: 100%;

      #timeAndDate {
        width: 100%;
        text-align: center;

        .time {
          font-size: var(--sl-font-size-4x-large);
          margin: var(--sl-spacing-x-large) 0 0 0;
        }

        .date {
          font-size: var(--sl-font-size-medium);
          margin: 0;
        }
      }

      #content {
        height: 100%;
        width: 100%;
        padding: var(--sl-spacing-large);
        display: grid;
        grid-auto-rows: max-content;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--sl-spacing-medium);
      }
    }
  `
]