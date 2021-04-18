import React, { Component } from "react";
import { Render } from "../helpers/types";
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

  public render(): Render {
    const [{ user, loading }] = this.context,
      clas = loading ? " center" : "";
    return (
      <div className={`home container${clas}`}>
        {loading || !user ? (
          <Loading bol={loading} />
        ) : (
          <>
            <div
              className={"image"}
              style={{ backgroundImage: `url("images/shop.jpg")` }}
            />
            <h2>Welcome {user.fullName()}</h2>
          </>
        )}
      </div>
    );
  }
}
