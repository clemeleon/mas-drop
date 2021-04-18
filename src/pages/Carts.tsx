/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { CartProductType } from "../datas/Cart";
import { ProductCard } from "../components/ProductCard";
import { Helper } from "../helpers/Helper";
export type CartsProps = {};

export type CartsStates = {};

export class Carts extends Component<CartsProps, CartsStates> {
  public static contextType = Context;

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
          <ProductCard cart={cart} bol={true} cat={false} products={pros} />
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
