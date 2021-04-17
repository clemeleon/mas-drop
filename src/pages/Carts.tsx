/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { Cart, CartProduct, CartProductType } from "../datas/Cart";
import remove from "../icons/delete.svg";
import minus from "../icons/minus.svg";
import plus from "../icons/plus.svg";
import basket from "../icons/basket.svg";
import { ProductCard } from "../components/ProductCard";
import { Helper } from "../helpers/Helper";
export type CartsProps = {};

export type CartsStates = {};

export class Carts extends Component<CartsProps, CartsStates> {
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
        return (
          <div className={"cart"}>
            <button
              onClick={async () => await this.action("minus", cart, product.id)}
            >
              <img src={pro.quantity === 1 ? remove : minus} alt={"minus"} />
            </button>
            <span className={"count"}>{pro.quantity}</span>
            <button
              onClick={async () => await this.action("plus", cart, product.id)}
            >
              <img src={plus} alt={"plus"} />
            </button>
          </div>
        );
      }
    }
    return "";
  }

  /*render() {
    const [{ cart, products }] = this.context,
      proCarts = cart.products.map((p: CartProductType) => {
        return {
          cart: p,
          product: products.find((p1: Product) => p1.id === p.productId),
        };
      });
    return (
      <div className={"carts container"}>
        <div className={"list"}>
          <h1>{"Shopping List"}</h1>
          <div className={"cart-products"}>
            {proCarts.map(
              (one: { cart: CartProductType; product: Product }, i: number) => (
                <div className={"product"} key={i}>
                  <div
                    className={"pic"}
                    style={{ backgroundImage: `url("${one.product.image}")` }}
                  >
                  </div>
                  <div className={"detail"}>
                    <h4>{one.product.title}</h4>
                    <div className={"focus"}>
                      <div className={"price"}>
                        <span>€{one.product.price}</span>
                      </div>
                      {this.cart(one.product, cart)}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className={"sum"}></div>
      </div>
    );
  }*/

  render() {
    const [{ cart, products, user }] = this.context,
      pros = cart.products.map((p: CartProductType) => {
        return products.find((p1: Product) => p1.id === p.productId);
      }),
      [amount, total, accepted] = Helper.cartTotal(cart, pros);
    return (
      <main className={"carts container"}>
        <h1>{`${user.firstName()}'s Cart`}</h1>
        <div className={"cart-products"}>
          <ProductCard bol={true} cat={false} products={pros} />
          <aside className={"info"}>
            <h3>Summary</h3>
            <div className={"sum-list"}>
              <div className={"sum-info"}>
                <span>Items ({total})</span>
                <span>€{amount}</span>
              </div>
              <div className={"sum-info"}>
                <span>Accepted Items</span>
                <span>({accepted})</span>
              </div>
              <div className={"total"}>
                <span>SubTotal</span>
                <span>€{amount}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    );
  }
}
