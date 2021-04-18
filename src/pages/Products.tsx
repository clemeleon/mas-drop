/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { Loading } from "../helpers/MixFc";
import { ProductCard } from "../components/ProductCard";
export type ProductsStates = {
  products: Product[];
  loading: boolean;
};
export type ProductsProps = {};

export class Products extends Component<ProductsProps, ProductsStates> {
  public static contextType = Context;

  render() {
    const [{ loading, products, user, cart }] = this.context,
      bol = user && cart,
      clas = loading ? " center" : "";
    return (
      <div className={`products container${clas}`}>
        {!loading ? (
          <ProductCard cart={cart} bol={bol} cat={true} products={products} />
        ) : (
          <Loading bol={loading} />
        )}
      </div>
    );
  }
}
