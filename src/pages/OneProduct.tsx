/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { Loading } from "../helpers/MixFc";
import { Error } from "./Error";

export type ProductProps = { name: string };

export type ProductStates = {};

export class OneProduct extends Component<ProductProps, ProductStates> {
  public static contextType = Context;

  componentDidMount() {}

  render() {
    const { name } = this.props,
      [{ loading, products }] = this.context,
      product = products.find((pro: Product) => pro.slug() === name),
      clas = product ? "" : " center";
    return (
      <div className={`product container${clas}`}>
        {loading ? (
          <Loading bol={loading} />
        ) : product ? (
          OneProduct.product(product)
        ) : (
          <Error mgs={`product with the name of (${name}) not found!`} />
        )}
      </div>
    );
  }

  private static product(product: Product) {
    return (
      <div className={"inner"}>
        <h3>{product.name()}</h3>
        <div
          className={"img"}
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        <div className={"cart-option"}>cart</div>
        <div className={"detail"}></div>
      </div>
    );
  }
}

export default OneProduct;
