/** Render return type */
type Render = JSX.Element;

/** Store props and states */
type StoreItem = number | string | [] | object;
type StoreProps = {};
type StoreStates = { carts: [] };
//type StoreStates = { [key: string]: StoreItem };

/** Home props and states */
type HomeProps = {};
type HomeStates = {};

/** Header props and states */
type HeaderProps = {};
type HeaderStates = {
  key: string;
};

/** Footer props and states */
type FooterProps = {};
type FooterStates = {};

export type {
  Render,
  HomeProps,
  HomeStates,
  HeaderProps,
  HeaderStates,
  FooterProps,
  FooterStates,
  StoreProps,
  StoreStates,
  StoreItem,
};
