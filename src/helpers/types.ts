/** Render return type */

type Render = JSX.Element;

type valueOf<V> = V[keyof V];

export type { Render, valueOf };
