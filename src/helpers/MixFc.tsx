/**
 * Package: mas-drop.
 * 13 April 2021
 */
import React, { ReactNode, ComponentType, FC } from "react";
import { Render } from "./types";
import { Error } from "../pages/Error";
import { ProductParams } from "../App";
import { Product } from "../datas/Product";
import { Cart } from "../datas/Cart";
import remove from "../icons/delete.svg";
import minus from "../icons/minus.svg";
import plus from "../icons/plus.svg";
import { Helper } from "./Helper";

const Loading: FC<{ bol: boolean }> = ({ bol }): Render => {
    return (
      <div className={`${bol ? "loading show" : "loading"}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  },
  Auth: FC<{
    lose: boolean;
    condition: boolean;
    main: ReactNode | ComponentType;
    other: ReactNode;
  }> = ({ lose, condition, main, other }): Render => {
    return <>{!lose && condition ? main : other}</>;
  },
  Conditional: FC<{
    params: ProductParams;
    action: (params: { [key: string]: any }) => Render;
    names: string[];
    uri: string;
  }> = ({ params, action, names, uri }): Render => {
    const datas: ProductParams = {},
      mgs = `Url not found with the path of ${uri}`;
    for (const [key, val] of Object.entries(params)) {
      if (names.includes(key)) {
        datas[key] = val;
      }
    }
    return (
      <>
        {Object.keys(params).length === Object.keys(datas).length &&
        Object.keys(datas).length === names.length ? (
          action(datas)
        ) : (
          <Error mgs={mgs} />
        )}
      </>
    );
  },
  CartAction: FC<{
    dispatch: Function;
    product: Product;
    cart?: Cart;
  }> = ({ dispatch, product, cart }): Render => {
    if (cart instanceof Cart) {
      const pro = cart.products.find((p) => p.productId === product.id);
      if (pro) {
        const stop = pro.approved;
        return stop ? (
          <></>
        ) : (
          <div className={"cart"}>
            <button
              className={stop ? "stop" : ""}
              disabled={stop}
              onClick={() =>
                Helper.cartAction(dispatch, "minus", cart, product.id)
              }
            >
              <img src={pro.quantity === 1 ? remove : minus} alt={"minus"} />
            </button>
            <span className={"count"}>{pro.quantity}</span>
            <button
              className={stop ? "stop" : ""}
              disabled={stop}
              onClick={() =>
                Helper.cartAction(dispatch, "plus", cart, product.id)
              }
            >
              <img src={plus} alt={"plus"} />
            </button>
          </div>
        );
      } else {
        return (
          <div className={"cart wide"}>
            <button
              onClick={() =>
                Helper.cartAction(dispatch, "add", cart, product.id)
              }
            >
              Add to cart
            </button>
          </div>
        );
      }
    }
    return <></>;
  };

export { Loading, Auth, Conditional, CartAction };
