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

export type ProductStates = { product: Product | undefined; loading: boolean };

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
          "found"
        ) : (
          <Error mgs={`product with the name of (${name}) not found!`} />
        )}
      </div>
    );
  }
}

export default OneProduct;
