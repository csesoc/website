/**
 * Bind operation in functional programming
 *
 * @param f - the function to apply on the value
 * @param y - the value
 * @returns the return value of the function with y passed in if y is not undefined else undefined
 */
export const bind = <T, V>(f: (x: T) => V, y: T | undefined): V | undefined =>
  y !== undefined ? f(y) : undefined;
