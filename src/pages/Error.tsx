/**
 * Package: mas-drop.
 * 12 April 2021
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";

export type ErrorProps = { mgs: string };

export type ErrorStates = {};

export class Error extends Component<ErrorProps, ErrorStates> {
  render() {
    const { mgs } = this.props;
    return (
      <div className={"container error center"}>
        <div>
          <h3>404 not found!</h3>
          <p>{mgs}</p>
          <Link to={"/"}>Home</Link>
          <Link to={"/products"}>Products</Link>
        </div>
      </div>
    );
  }
}
