import React, { Component } from "react";
import { Render } from "../helpers/types";
import { Context } from "../components/stores/Store";
import { Loading } from "../helpers/MixFc";
import { Cart } from "../datas/Cart";
import { Helper } from "../helpers/Helper";

/** Home props and states */
export type HomeProps = {};
export type HomeStates = {
  loading: boolean;
};

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = Context;

  constructor(props: HomeProps) {
    super(props);
    this.state = { loading: true };
  }

  public render(): Render {
    const [{ user, loading, carts }] = this.context,
      clas = loading ? " center" : "";
    return (
      <div className={`home container${clas}`}>
        {loading || !user ? (
          <Loading bol={loading} />
        ) : (
          <>
            <div>{user.fullName()}</div>
            {/*<button onClick={() => this.test(carts)}>Click</button>*/}
          </>
        )}
      </div>
    );
  }

  private test(carts: Cart[]) {
    console.log(carts);
    const one = new Cart(Helper.clone(carts[0])),
      [, dispatch] = this.context;
    one.minus(2);
    dispatch({ cart: one });
  }
}
