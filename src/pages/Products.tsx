/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { StoreContext } from "../components/stores/Store";
import { Helper } from "../helpers/Helper";
import { HomeProps, HomeStates } from "./Home";
import { Schema } from "../components/stores/Schema";
import { Product } from "../datas/Product";
import { User } from "../datas/User";
import { Link } from "react-router-dom";
export type ProductsStates = {
  products: Product[];
  loading: boolean;
  user: User | undefined;
};
export type ProductsProps = {};

export class Products extends Component<ProductsProps, ProductsStates> {
  public static contextType = StoreContext;

  public state = {
    user: undefined,
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
    let { id, db }: { id: number; db: () => Schema } = this.context,
      user = undefined,
      products: Product[] = [];
    if (id > 0) {
      user = await db().user({ id }, true);
      products = await db().products();
    }
    this.setState({ user, products, loading: false });
  }

  render() {
    const {
      user,
      products,
    }: { user: User | undefined; products: Product[] } = this.state;
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
