// Type definitions for the option type
export type Option<T> = T | undefined;
export const Some = <T>(x: T) : Option<T> => x;
export const None = <T>() : Option<T> => undefined;

// Optional Bind functions
export const bind = <T, V>(f: (x: T) => V, y: Option<T>): Option<V> =>
    y !== undefined
        ? Some(f(y))
        : None();