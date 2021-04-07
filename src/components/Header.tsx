import React, { Component } from "react";
import { HeaderProps, HeaderStates, Render } from "../helpers/types";

export class Header extends Component<HeaderProps, HeaderStates> {
  render(): Render {
    return <header>{"header"}</header>;
  }
}
