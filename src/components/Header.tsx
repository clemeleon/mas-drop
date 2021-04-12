import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { StoreContext, StoreStates } from "./stores/Store";

/** Header props and states */
export type HeaderProps = {};
export type HeaderStates = {
  key: string;
};

export class Header extends Component<HeaderProps, HeaderStates> {
  public static contextType = StoreContext;
  private logout = (): void => {
    const {
      set,
    }: {
      set: (state: StoreStates) => boolean;
    } = this.context;
    set({ id: 0 });
  };

  public render(): Render {
    const { id }: { id: number } = this.context;
    return (
      <header>
        <div className={"logo"}>
          <Link to={"/"}>logo</Link>
        </div>
        {id > 0 ? (
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
