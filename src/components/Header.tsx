import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { Context, StoreStates } from "./stores/Store";
import basket from "../icons/basket.svg";
import login from "../icons/login.svg";
import logout from "../icons/logout.svg";
import logo from "../icons/logo.svg";
import { Cart, CartProduct } from "../datas/Cart";
import { Helper } from "../helpers/Helper";

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
    dispatch({ state: { id: 0 } });
  };

  public render(): Render {
    const [{ user, cart }] = this.context,
      auth = user,
      count = cart instanceof Cart ? Helper.cartCount(cart) : 0;
    return (
      <header className={"header"}>
        <div className={"logo"}>
          <Link to={"/"} style={{ backgroundImage: `url("${logo}")` }} />
        </div>

        <div className={"nav"}>
          <nav>
            <Link to={"/products"}>
              <span className={"icon"} />
              <span className={"txt"}>Products</span>
            </Link>
            {auth && cart ? (
              <Link to={"/carts"}>
                <span
                  className={"icon"}
                  style={{ backgroundImage: `url("${basket}")` }}
                >
                  <span className={"count"}>{count}</span>
                </span>
                <span className={"txt"}>Cart</span>
              </Link>
            ) : (
              ""
            )}
            {auth ? (
              <a
                href={"/logout"}
                onClick={(e) => {
                  e.preventDefault();
                  this.logout();
                }}
              >
                <span
                  className={"icon"}
                  style={{ backgroundImage: `url("${logout}")` }}
                />
                <span className={"txt"}>Logout</span>
              </a>
            ) : (
              <Link to={"/"}>
                <span
                  className={"icon"}
                  style={{ backgroundImage: `url("${login}")` }}
                />
                <span className={"txt"}>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
    );
  }
}
