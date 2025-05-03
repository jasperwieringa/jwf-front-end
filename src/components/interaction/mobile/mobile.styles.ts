import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.ts';

export default [
  componentStyles,
  css`
    :host {
      justify-self: center;
      align-self: center;
    }
    
    /* Container styles */
    .container {
      color: var(--sl-color-neutral-1000);
      user-select: none;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 400px;
      width: 210px;
      border: 4px solid black;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.13);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .time {
      font-size: 2.5rem;
      margin: 1.5rem 0 -12px;
    }

    .date {
      font-size: 12px;
    }

    .fingerprint {
      position: absolute;
      bottom: 3rem;
    }

    .phone {
      position: absolute;
      bottom: 10px;
      left: 10px;
      padding: 4px;
      background-color: rgb(209, 218, 218);
      border-radius: 6px;
    }

    .camera {
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 4px;
      background-color: rgb(209, 218, 218);
      border-radius: 6px;
    }

    /* Top border styles */
    .top-border {
      border: 1px solid black;
      background-color: black;
      width: 80px;
      height: 8px;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }

    /* Right border styles */
    .right-border {
      position: absolute;
      border: 4px solid black;
      right: -8px;
      border-radius: 0.375rem;
    }

    /* Top right border */
    .right-border.top {
      top: 56px;
      height: 28px;
    }
  `
]