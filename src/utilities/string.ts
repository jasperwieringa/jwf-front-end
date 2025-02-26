import { isDefined } from './isDefined';

/** This method counts the words in a string */
export function countWords(string?: string): number {
  return checkForString(string).trim().split(/\s+/).length;
}

/** This method splits a string by newlines and returns each line separately */
export function splitByNewLine(string?: string): string[] {
  return checkForString(string).split('\n');
}

/**
 * This method removes several types of directionality and zero-width characters,
 * without unwanted Unicode characters affecting the layout or readability.
 * */
export function removeUnicodeCharacters(string?: string): string {
  return checkForString(string).replace(/[\u200B-\u200F\u202A-\u202E]/g, '');
}

/** This method checks if the given property is defined and throws an error otherwise */
function checkForString(string?: string) {
  if (!isDefined(string)) {
    throw new Error(`Expected a string, but received ${string}`);
  }
  return string;
}