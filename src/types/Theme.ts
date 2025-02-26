const THEMES = ['light', 'dark'] as const;
type themeTuple = typeof THEMES;
export type Theme = themeTuple[number];