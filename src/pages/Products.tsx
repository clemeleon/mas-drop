/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { Link } from "react-router-dom";
import { Loading } from "../helpers/MixFc";
import { Cart } from "../datas/Cart";
export type ProductsStates = {
  products: Product[];
  loading: boolean;
};
export type ProductsProps = {};

export class Products extends Component<ProductsProps, ProductsStates> {
  public static contextType = Context;

  private action = async (
    type: string,
    cart: Cart,
    pro: Product
  ): Promise<void> => {
    if (type === "add") {
      cart.add(pro.id);
    } else if (type === "plus") {
      cart.plus(pro.id);
    } else {
      cart.minus(pro.id);
    }
    const [, dispatch] = this.context;
    dispatch({ cart: cart });
  };

  private cart(product: Product, cart?: Cart) {
    if (cart instanceof Cart) {
      const pro = cart.products.find((p) => p.productId === product.id);
      if (pro) {
        return (
          <div className={"cart"}>
            <button
              onClick={async () => await this.action("plus", cart, product)}
            >
              +
            </button>
            <span className={"count"}>{pro.quantity}</span>
            <button
              onClick={async () => await this.action("minus", cart, product)}
            >
              -
            </button>
          </div>
        );
      } else {
        return (
          <div className={"cart wide"}>
            <button
              onClick={async () => await this.action("add", cart, product)}
            >
              Add to cart
            </button>
          </div>
        );
      }
    }
    return "";
  }

  render() {
    const [{ loading, products, user, cart }] = this.context,
      bol = user && cart,
      clas = loading ? " center" : "";
    return (
      <div className={`products container${clas}`}>
        {!loading ? (
          <div className={"list"}>
            {products.map((pro: Product) => (
              <div key={pro.id} className={"product"}>
                <div
                  className={"img"}
                  style={{ backgroundImage: `url("${pro.image}")` }}
                />
                <div className={"detail"}>
                  <Link to={`/product/${pro.slug()}`}>
                    <h5>{pro.name()}</h5>
                  </Link>
                  <p>{pro.note()}</p>

                  <div className={bol ? "focus" : "focus right"}>
                    <div className={"price"}>
                      <span>€{pro.price}</span>
                    </div>
                    {bol ? this.cart(pro, cart) : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Loading bol={loading} />
        )}
      </div>
    );
  }
}
