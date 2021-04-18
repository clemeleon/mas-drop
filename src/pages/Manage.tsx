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

class Manage extends Component {
  public static contextType = Context;
  render() {
    const [{ user, loading, users, carts, products }] = this.context,
      children = users.filter((u: User) => u.parent === user.id),
      panels = children.map((u: User, i: number) => {
        const cart: Cart = carts.find((c: Cart) => c.userId === u.id),
          pros = cart.products.map((p: CartProductType) => {
            return products.find((p1: Product) => p1.id === p.productId);
          });
        return {
          label: u.fullName(),
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
      }),
      clas = loading ? " center" : "";
    return (
      <div className={`manage container${clas}`}>
        {loading || !user ? (
          <Loading bol={loading} />
        ) : (
          <>
            <h1>Manage Children Carts</h1>
            <div className={""}>
              <Accordion multiple={true} panels={panels} />
            </div>
          </>
        )}
      </div>
    );
  }
}

export { Manage };
