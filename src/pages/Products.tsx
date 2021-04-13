/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Helper } from "../helpers/Helper";
import { HomeProps, HomeStates } from "./Home";
import { Schema } from "../components/stores/Schema";
import { Product } from "../datas/Product";
import { User } from "../datas/User";
import { Link } from "react-router-dom";
export type ProductsStates = {
  products: Product[];
  loading: boolean;
};
export type ProductsProps = {};

export class Products extends Component<ProductsProps, ProductsStates> {
  public static contextType = Context;

  public state = {
    products: [],
    loading: true,
  };

  shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    nextState: Readonly<HomeStates>,
    nextContext: any
  ): boolean {
    return nextState && !Helper.compare(this.state, nextState);
  }

  public async componentDidMount() {
    const [{ user, db }] = this.context;
    let products: Product[] = [];
    console.log(user);
    if (user) {
      products = await db().products([], [], {}, [0, 10]);
    }
    this.setState({ products, loading: false });
  }

  render() {
    const { products }: { products: Product[] } = this.state;
    return (
      <div className={"products container"}>
        <div className={"list"}>
          {products.map((pro) => (
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
      </div>
    );
  }
}
