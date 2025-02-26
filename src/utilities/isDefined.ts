/** Simple method to check whether a given value is not undefined or null */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
