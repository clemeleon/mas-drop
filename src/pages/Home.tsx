import React, { Component } from "react";
import { HomeProps, HomeStates, Render } from "../helpers/types";
import { StoreContext } from "../components/Store";

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = StoreContext;
  state = { carts: [], make: "" };

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
