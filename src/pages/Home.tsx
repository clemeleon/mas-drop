import React, { Component } from "react";
import { Render } from "../helpers/types";
import { Login } from "../components/home/Login";
import { Context } from "../components/stores/Store";
import { Loading } from "../helpers/MixFc";

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
    const [{ user, loading }] = this.context,
      clas = loading ? " center" : "";
    return (
      <div className={`home container${clas}`}>
        {loading ? (
          <Loading bol={loading} />
        ) : user ? (
          <div>{user.fullName()}</div>
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}
