import React, { Component } from "react";
import { Render } from "../helpers/types";
import { StoreContext } from "../components/Stores/Store";
import { Helper } from "../helpers/Helper";

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

  componentDidMount() {
    const { carts, make } = this.context.pick({ carts: [], make: "" });
    this.setState({ carts, make });
  }

  public click = () => {
    this.context.set(
      "make",
      "update",
      ({ carts, make }: { carts: []; make: string }) => {
        this.setState({ carts, make });
      }
    );
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
