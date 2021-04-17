/**
 * Package: mas-drop.
 * 17 April 2021
 */
import React, { Component } from "react";
import { Context } from "../components/stores/Store";
import { Loading } from "../helpers/MixFc";

class Manage extends Component {
  public static contextType = Context;
  render() {
    const [{ user, loading, carts }] = this.context,
      clas = loading ? " center" : "";
    return (
      <div className={`manage container${clas}`}>
        {loading || !user ? (
          <Loading bol={loading} />
        ) : (
          <>
            <h1>Manage Children Carts</h1>
          </>
        )}
      </div>
    );
  }
}

export { Manage };
