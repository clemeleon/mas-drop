/**
 * Package: mas-drop.
 * 16 April 2021
 */
import React, { Component } from "react";
import { Product } from "../datas/Product";
import { Cart } from "../datas/Cart";
import remove from "../icons/delete.svg";
import minus from "../icons/minus.svg";
import plus from "../icons/plus.svg";
import { Context } from "./stores/Store";
import { Link } from "react-router-dom";
import { Render } from "../helpers/types";

type ProductCardProps = { bol: boolean; cat: boolean; products: Product[] };

class ProductCard extends Component<ProductCardProps, {}> {
  public static contextType = Context;

  private action = async (
    type: string,
    cart: Cart,
    id: number
  ): Promise<void> => {
    if (type === "add") {
      cart.add(id);
    } else if (type === "plus") {
      cart.plus(id);
    } else {
      cart.minus(id);
    }
    const [, dispatch] = this.context;
    dispatch({ cart: cart });
  };

  private cart(product: Product, cart?: Cart) {
    if (cart instanceof Cart) {
      const pro = cart.products.find((p) => p.productId === product.id);
      if (pro) {
        const stop = pro.approved;
        return stop ? (
          ""
        ) : (
          <div className={"cart"}>
            <button
              className={stop ? "stop" : ""}
              disabled={stop}
              onClick={async () => await this.action("minus", cart, product.id)}
            >
              <img src={pro.quantity === 1 ? remove : minus} alt={"minus"} />
            </button>
            <span className={"count"}>{pro.quantity}</span>
            <button
              className={stop ? "stop" : ""}
              disabled={stop}
              onClick={async () => await this.action("plus", cart, product.id)}
            >
              <img src={plus} alt={"plus"} />
            </button>
          </div>
        );
      } else {
        return (
          <div className={"cart wide"}>
            <button
              onClick={async () => await this.action("add", cart, product.id)}
            >
              Add to cart
            </button>
          </div>
        );
      }
    }
    return "";
  }
  public render(): Render {
    const [{ cart }] = this.context,
      { bol, cat, products } = this.props;
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
                {bol ? this.cart(pro, cart) : ""}
              </div>
              {cart.approved(pro.id) ? (
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
