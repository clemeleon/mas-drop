import React, { Component } from "react";
import { HeaderProps, HeaderStates, Render } from "../helpers/types";

export class Header extends Component<HeaderProps, HeaderStates> {
  public render(): Render {
    return <header>{"header"}</header>;
  }
}
