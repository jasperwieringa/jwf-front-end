import { isDefined } from "./isDefined";

/** Simple method to check whether a given value is an array and has items in it */
export function hasItems<T>(value: T | null | undefined): value is Exclude<T, null | undefined> & unknown[] {
  return isDefined(value) && Array.isArray(value) && value.length > 0;
}
