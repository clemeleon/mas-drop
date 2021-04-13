/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Product } from "../datas/Product";
import { Link } from "react-router-dom";
import { Loading } from "../helpers/MixFc";
export type ProductsStates = {
  products: Product[];
  loading: boolean;
};
export type ProductsProps = {};

export class Products extends Component<ProductsProps, ProductsStates> {
  public static contextType = Context;

  render() {
    const [{ loading, products }] = this.context,
      clas = loading ? " center" : "";
    return (
      <div className={`products container${clas}`}>
        {!loading ? (
          <div className={"list"}>
            {products.map((pro: Product) => (
              <div key={pro.id} className={"product"}>
                <Link to={`/product/${pro.slug()}`}>
                  <div
                    className={"img"}
                    style={{ backgroundImage: `url("${pro.image}")` }}
                  />
                  <div className={"detail"}>
                    <h5>{pro.name()}</h5>
                  </div>
                </Link>
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
