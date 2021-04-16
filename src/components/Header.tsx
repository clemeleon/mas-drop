import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { Context, StoreStates } from "./stores/Store";
import basket from "../icons/basket.svg";
import login from "../icons/login.svg";
import logout from "../icons/logout.svg";
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
      <header>
        <div className={"logo"}>
          <Link to={"/"}>logo</Link>
        </div>

        <div className={"nav"}>
          <nav>
            <Link to={"/products"}>Products</Link>
            {auth && cart ? (
              <Link to={"/carts"}>
                <span>
                  <img src={basket} />
                </span>
                <span className={"count"}>{count}</span>
                <span>Cart</span>
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
                <span className={"icon"}>
                  <img src={logout} />
                </span>
                <span>Logout</span>
              </a>
            ) : (
              <Link to={"/"}>
                <span className={"icon"}>
                  <img src={login} />
                </span>
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
    );
  }
}
