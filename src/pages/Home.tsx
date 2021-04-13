import React, { Component } from "react";
import { Render } from "../helpers/types";
import { Helper } from "../helpers/Helper";
import { Login } from "../components/home/Login";
import { Context } from "../components/stores/Store";

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

  private login = async (id: number): Promise<void> => {
    const [, dispatch] = this.context;
    dispatch({ id });
  };

  public render(): Render {
    const [{ user, loading }] = this.context;
    return (
      <div className={"home container"}>
        {loading ? (
          "Loading!"
        ) : user ? (
          <div>{user.fullName()}</div>
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}
