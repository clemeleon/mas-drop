import React, { Component } from "react";
import { HomeProps, HomeStates, Render } from "../helpers/types";
import { StoreContext } from "../components/Store";

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = StoreContext;
  public click = () => {
    this.context.set("make", "update");
  };

  public render(): Render {
    return (
      <div>
        <h1>Home</h1>
        <button onClick={this.click}>click</button>
      </div>
    );
  }
}
