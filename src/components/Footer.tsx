import React, { Component } from "react";
import { Render } from "../helpers/types";

/** Footer props and states */
export type FooterProps = {};
export type FooterStates = {};

export class Footer extends Component<FooterProps, FooterStates> {
  render(): Render {
    return <footer>footer</footer>;
  }
}
