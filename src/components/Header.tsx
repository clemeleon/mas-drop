import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { Context, StoreStates } from "./stores/Store";

/** Header props and states */
export type HeaderProps = {};
export type HeaderStates = {};

export class Header extends Component<HeaderProps, HeaderStates> {
  public static contextType = Context;

  private update = ({ user }: StoreStates): void => {
    this.setState({ user });
  };

  private logout = (): void => {
    const [, dispatch] = this.context;
    dispatch({ id: 0 });
  };

  public render(): Render {
    const [{ user }] = this.context,
      auth = user;
    return (
      <header>
        <div className={"logo"}>
          <Link to={"/"}>logo</Link>
        </div>

        <div className={"nav"}>
          <nav>
            <Link to={"/products"}>Products</Link>
            {auth ? <Link to={"/carts"}>Carts</Link> : ""}
            {auth ? (
              <a
                href={"/logout"}
                onClick={(e) => {
                  e.preventDefault();
                  this.logout();
                }}
              >
                Logout
              </a>
            ) : (
              <Link to={"/"}>Login</Link>
            )}
          </nav>
        </div>
      </header>
    );
  }
}
