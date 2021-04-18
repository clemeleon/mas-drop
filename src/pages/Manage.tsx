/**
 * Package: mas-drop.
 * 17 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Loading } from "../helpers/MixFc";
import { Accordion } from "../components/accordion/Accordion";
import { User } from "../datas/User";
import { Cart, CartProductType } from "../datas/Cart";
import { Product } from "../datas/Product";
import { ProductCard } from "../components/ProductCard";
import { Helper } from "../helpers/Helper";

class Manage extends Component {
  public static contextType = Context;

  private calculate(): any {
    let infos: {
      amount: number;
      qty: number;
      count: number;
      accepted: number;
    }[] = [];
    const [{ user, loading, users, carts, products }] = this.context,
      children = users.filter((u: User) => u.parent === user.id),
      panels = children.map((u: User, i: number) => {
        const cart: Cart = carts.find((c: Cart) => c.userId === u.id),
          pros = cart.products.map((p: CartProductType) => {
            return products.find((p1: Product) => p1.id === p.productId);
          }),
          [amount, total, accepted, amountAccepted] = Helper.cartTotal(
            cart,
            pros
          );
        infos.push({
          amount,
          qty: total,
          count: accepted,
          accepted: amountAccepted,
        });
        return {
          label: (
            <>
              <span>{u.fullName()}</span>
              <span>
                Items: {total} / Total: €{amount}
              </span>
              <span>
                Accepted: {accepted} / Total: €{amountAccepted}
              </span>
            </>
          ),
          content: (
            <ProductCard
              cart={cart}
              key={i}
              bol={true}
              cat={false}
              products={pros}
              id={cart.id}
            />
          ),
        };
      });
    return [loading, user, panels, Helper.cartReduce(infos)];
  }

  render() {
    const [loading, user, panels, sums] = this.calculate(),
      clas = loading ? " center" : "";
    return (
      <div className={`manage container${clas}`}>
        {loading || !user ? (
          <Loading bol={loading} />
        ) : (
          <>
            <h1>Manage Children Carts</h1>
            <div className={"info"}>
              <div className={"all-items"}>
                <h3>All Items</h3>
                <div className={"items"}>
                  <div>
                    <span>Total Amount: </span>
                    <span>€{sums[0]}</span>
                  </div>
                  <div>
                    <span>Total Items: </span>
                    <span>{sums[1]}</span>
                  </div>
                </div>
              </div>
              <div className={"accepted"}>
                <h3>Accepted Items</h3>
                <div className={"items"}>
                  <div>
                    <span>Total: </span>
                    <span>{sums[2]}</span>
                  </div>
                  <div>
                    <span>Amount: </span>
                    <span>€{sums[3]}</span>
                  </div>
                </div>
              </div>
            </div>
            <Accordion multiple={true} panels={panels} />
          </>
        )}
      </div>
    );
  }
}

export { Manage };
