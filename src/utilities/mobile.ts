import { mobileBreakpoint } from '../styles/constants/constants.js';

export function isMobile() {
  return window.matchMedia(`(max-width: ${mobileBreakpoint}rem)`).matches;
}