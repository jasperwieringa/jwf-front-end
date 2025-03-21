import { css } from 'lit';
import componentStyles from '../../../styles/component.styles.js';

export default [
  componentStyles,
  css`
    :host,
    #main {
      display: inline-flex;
      justify-content: center;
      align-items: center;
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

    .image--has-image #loader {
      display: none;
    }

    #loader {
      width: 50px;
      height: 50px;
      animation: jwf-spinner 2s infinite ease;
      transform-style: preserve-3d;
    }

    #loader > div {
      background-color: rgba(244, 157, 55, 0.2);
      height: 100%;
      position: absolute;
      width: 100%;
      border: 2px solid rgb(244, 157, 55);
    }

    #loader div:nth-of-type(1) {
      transform: translateZ(-25px) rotateY(180deg);
    }

    #loader div:nth-of-type(2) {
      transform: rotateY(-270deg) translateX(50%);
      transform-origin: top right;
    }

    #loader div:nth-of-type(3) {
      transform: rotateY(270deg) translateX(-50%);
      transform-origin: center left;
    }

    #loader div:nth-of-type(4) {
      transform: rotateX(90deg) translateY(-50%);
      transform-origin: top center;
    }

    #loader div:nth-of-type(5) {
      transform: rotateX(-90deg) translateY(50%);
      transform-origin: bottom center;
    }

    #loader div:nth-of-type(6) {
      transform: translateZ(25px);
    }

    @keyframes jwf-spinner {
      0% {
        transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
      }

      50% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
      }

      100% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
      }
    }
  `,
];