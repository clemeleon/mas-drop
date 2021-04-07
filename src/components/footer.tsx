import React, {Component} from "react";
import {FooterProps, FooterStates, Render} from "./types";

export class Footer extends Component<FooterProps, FooterStates> {
  render(): Render {
    return <footer>footer</footer>;
  }
}
