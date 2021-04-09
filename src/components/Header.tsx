import React, { Component } from "react";
import { Render } from "../helpers/types";

/** Header props and states */
export type HeaderProps = {};
export type HeaderStates = {
  key: string;
};

export class Header extends Component<HeaderProps, HeaderStates> {
  public render(): Render {
    return <header>{"header"}</header>;
  }
}
