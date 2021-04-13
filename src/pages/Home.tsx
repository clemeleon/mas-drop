import React, { Component } from "react";
import { Render } from "../helpers/types";
import { Helper } from "../helpers/Helper";
import { User } from "../datas/User";
import { Login } from "../components/home/Login";
import { Schema } from "../components/stores/Schema";
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

  shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    nextState: Readonly<HomeStates>,
    nextContext: any
  ): boolean {
    return nextState && Helper.state(this.state, nextState);
  }

  private login = async (id: number): Promise<void> => {
    const {
      set,
    }: {
      set: (state: { [key: string]: any }) => void;
    } = this.context;
    set({ id });
  };

  public render(): Render {
    const [{ user, db, loading }] = this.context;
    return (
      <div className={"home container"}>
        {loading ? (
          "Loading!"
        ) : user ? (
          <div>{user.fullName()}</div>
        ) : (
          <Login login={this.login} db={db} />
        )}
      </div>
    );
  }
}
