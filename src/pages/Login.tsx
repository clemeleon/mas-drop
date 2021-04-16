/**
 * Package: mas-drop.
 * 10 April 2021
 */
import React, { Component } from "react";
import { User } from "../datas/User";
import { Render } from "../helpers/types";
import { Context } from "../components/stores/Store";
import { Loading } from "../helpers/MixFc";
export type LoginProps = {};
export type LoginStates = {};
export class Login extends Component<LoginProps, LoginStates> {
  public static contextType = Context;

  private login = async (id: number): Promise<void> => {
    const [, dispatch] = this.context;
    dispatch({ state: { id } });
  };

  public render(): Render {
    const [{ loading, users }] = this.context;
    return (
      <div className={"container login"}>
        {loading || users.length === 0 ? (
          <Loading bol={loading} />
        ) : (
          <>
            <h1>List of users</h1>
            <div className={"users"}>
              {users.map((user: User) => (
                <div key={user.id} className={"user"}>
                  <div
                    className={"pic"}
                    style={{ backgroundImage: `url("images/pic.jpg")` }}
                  >
                    {/*<img src={"images/pic.jpg"} />*/}
                  </div>
                  <div className={"detail"}>
                    <h4>{user.fullName()}</h4>
                    <p>{user.type()}</p>
                    {/*{user.parent === 0 ? (*/}
                    {/*  ""*/}
                    {/*) : (*/}
                    {/*  <p>*/}
                    {/*    Cart items:{" "}*/}
                    {/*    {user.cart ? `${user.cart?.products.length}` : 0}*/}
                    {/*  </p>*/}
                    {/*)}*/}
                    <div className={"btn"}>
                      <button
                        onClick={() => this.login(user.id)}
                      >{`Login as ${user.firstName()}`}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
