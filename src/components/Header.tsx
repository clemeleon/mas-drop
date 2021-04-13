import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { Context, StoreStates } from "./stores/Store";
import { User } from "../datas/User";

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
    const [state] = this.context,
      { user } = state;
    return (
      <header>
        <div className={"logo"}>
          <Link to={"/"}>logo</Link>
        </div>
        {user ? (
          <div className={"nav"}>
            <nav>
              <Link to={"/products"}>Products</Link>
              <Link to={"/carts"}>Carts</Link>
              <a
                href={"/logout"}
                onClick={(e) => {
                  e.preventDefault();
                  this.logout();
                }}
              >
                Logout
              </a>
            </nav>
          </div>
        ) : (
          ""
        )}
      </header>
    );
  }
}
