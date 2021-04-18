import React, { Component } from "react";
import { Render } from "../helpers/types";

/** Footer props and states */
export type FooterProps = {};
export type FooterStates = {};

export class Footer extends Component<FooterProps, FooterStates> {
  private static reserved() {
    const date = new Date();
    return "©" + date.getFullYear() + " All rights reserved";
  }

  render(): Render {
    return (
      <footer className={"footer"}>
        <p>Mas Drop {Footer.reserved()}</p>
      </footer>
    );
  }
}
