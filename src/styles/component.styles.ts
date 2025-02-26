import { css } from 'lit';
import { mobileBreakpoint } from './constants/constants.js';

export default css`
  :host {
    position: relative;
    box-sizing: border-box;
    font-family: 'Signika', sans-serif;
    font-weight: var(--sl-font-weight-normal);
    font-size: var(--sl-font-size-medium);
    line-height: var(--sl-line-height-normal);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    --spacing: var(--sl-spacing-x-large);
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }

  /* Small devices and up */
  @media (min-width: ${mobileBreakpoint}rem) {
    :host {
      --spacing: var(--sl-spacing-3x-large);
    }
  }

  /* Overwrite the default scrollbar */
  ::-webkit-scrollbar {
    width: 21px;
    height: 21px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--sl-color-neutral-0);
    border-radius: 21px;
    overflow: auto;
  }

  /* Overwrite the white square on the bottom-right */
  ::-webkit-scrollbar-corner {
    background-color: var(--sl-color-neutral-0);
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--sl-color-gray-500);
    border-radius: 21px;
    overflow: auto;
    border: 0.5rem solid transparent;
    background-clip: padding-box;
    min-height: 5rem;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--sl-color-gray-600);
  }
`;
