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
            <div>
              <span>{u.fullName()}</span>
              <span>
                <span>
                  Items: {total}/Accepted: {accepted}
                </span>
                <span>
                  Total: €{amount} / Total Accepted: €{amountAccepted}
                </span>
              </span>
            </div>
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
    /*let infos: {
        amount: number;
        total: number;
        accepted: number;
        amountAccepted: number;
      }[] [];
      /*const [{ user, loading, users, carts, products }] = this.context,
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
          infos.push({ amount, total, accepted, amountAccepted });
          return {
            label: (
              <div>
                <span>{u.fullName()}</span>
                <span>
                  <span>
                    Items: {total}/Accepted: {accepted}
                  </span>
                  <span>
                    Total: €{amount} / Total Accepted: €{amountAccepted}
                  </span>
                </span>
              </div>
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
        }),*/
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
              <div>
                <span>Total Amount: </span>
                <span>€{sums[0]}</span>
              </div>
              <div>
                <span>Total Items: </span>
                <span>{sums[1]}</span>
              </div>
              <div>
                <span>Total Confirmed: </span>
                <span>{sums[2]}</span>
              </div>
              <div>
                <span>Total Amount of confirmed: </span>
                <span>€{sums[3]}</span>
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
