/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { StoreContext } from "../components/stores/Store";
import { Product } from "../datas/Product";

export type ProductProps = { name: string };

export type ProductStates = { product: Product | undefined };

export class OneProduct extends Component<ProductProps, ProductStates> {
  public static contextType = StoreContext;
  render() {
    return <div></div>;
  }
}

export default OneProduct;
