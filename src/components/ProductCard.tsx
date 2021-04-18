/**
 * Package: mas-drop.
 * 16 April 2021
 */
import React, { Component } from "react";
import { Product } from "../datas/Product";
import { Context } from "./stores/Store";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";
import { CartAction } from "../helpers/MixFc";
import { Cart } from "../datas/Cart";
import { Helper } from "../helpers/Helper";

type ProductCardProps = {
  bol: boolean;
  cat: boolean;
  cart: Cart | undefined;
  products: Product[];
  id?: number;
};

class ProductCard extends Component<ProductCardProps, {}> {
  public static contextType = Context;

  public render(): Render {
    let [, dispatch] = this.context,
      { bol, cat, products, id = 0, cart } = this.props;
    return (
      <div className={"list"}>
        {products.map((pro: Product) => (
          <div key={pro.id} className={"product"}>
            <div
              className={"img"}
              style={{ backgroundImage: `url("${pro.image}")` }}
            />
            <div className={"detail"}>
              <Link to={`/product/${pro.slug()}`}>
                <h1>{pro.name()}</h1>
              </Link>
              <p>{pro.note()}</p>

              {cat ? (
                <div className={"category"}>
                  <span>{pro.category}</span>
                </div>
              ) : (
                ""
              )}

              <div className={bol ? "focus" : "focus right"}>
                <div className={"price"}>
                  <span>€{pro.price}</span>
                </div>
                {bol ? (
                  <CartAction dispatch={dispatch} cart={cart} product={pro} />
                ) : (
                  ""
                )}
              </div>
              {id > 0 && cart ? (
                cart.approved(pro.id) ? (
                  <button
                    onClick={() =>
                      Helper.cartAction(dispatch, "cancel", cart, pro.id)
                    }
                  >
                    {"Cancel"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      Helper.cartAction(dispatch, "accept", cart, pro.id)
                    }
                  >
                    {"Accept"}
                  </button>
                )
              ) : cart && cart.approved(pro.id) ? (
                <p className={"note"}>{"Item already approved by parent!"}</p>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export { ProductCard };
export type { ProductCardProps };
