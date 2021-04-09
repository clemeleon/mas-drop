import React, { Component } from "react";
import { Render } from "../helpers/types";
import { StoreContext } from "../components/Stores/Store";
import { Helper } from "../helpers/Helper";
import { Product } from "../datas/Product";

/** Home props and states */
export type HomeProps = {};
export type HomeStates = {};

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = StoreContext;
  state = { carts: [], make: "" };

  shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    nextState: Readonly<HomeStates>,
    nextContext: any
  ): boolean {
    return nextState && !Helper.compare(this.state, nextState);
  }

  public componentDidMount() {
    //console.log(await this.context.get("products", [], { id: 6 }));
    //console.log(await this.context.get("carts", [], { id: 1 }));
    //console.log(await this.context.get("users", [], { id: 6 }));
  }

  public click = () => {
    this.context.get("products", [], { id: 6 }).then((res: Product) => {
      console.log(res);
    });
  };

  public render(): Render {
    console.log(this.state);
    return (
      <div>
        <h1>Home</h1>
        <button onClick={this.click}>click</button>
      </div>
    );
  }
}
