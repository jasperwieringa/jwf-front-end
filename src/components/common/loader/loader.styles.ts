import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    #main {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .loader {
      display: flex;
      gap: var(--sl-spacing-small);
      font-size: 25px;
      height: 40px;
      overflow: hidden;
      
      p {
        margin: 0;
      }

      .word {
        display: block;
        color: var(--jwf-color-primary);
        animation: spin_jwf 4s infinite;
      }
    }
    
    @keyframes spin_jwf {
      10% {
        -webkit-transform: translateY(-102%);
        transform: translateY(-102%);
      }

      25% {
        -webkit-transform: translateY(-100%);
        transform: translateY(-100%);
      }

      35% {
        -webkit-transform: translateY(-202%);
        transform: translateY(-202%);
      }

      50% {
        -webkit-transform: translateY(-200%);
        transform: translateY(-200%);
      }

      60% {
        -webkit-transform: translateY(-302%);
        transform: translateY(-302%);
      }

      75% {
        -webkit-transform: translateY(-300%);
        transform: translateY(-300%);
      }

      85% {
        -webkit-transform: translateY(-402%);
        transform: translateY(-402%);
      }

      100% {
        -webkit-transform: translateY(-400%);
        transform: translateY(-400%);
      }
    }

  `,
];
