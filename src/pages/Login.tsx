/**
 * Package: mas-drop.
 * 10 April 2021
 */
import { Component } from "react";
import { User } from "../datas/User";
import { Render } from "../helpers/types";
import { Context } from "../components/stores/Store";
export type LoginProps = {};
export type LoginStates = {};
export class Login extends Component<LoginProps, LoginStates> {
  public static contextType = Context;

  private login = async (id: number): Promise<void> => {
    const [, dispatch] = this.context;
    dispatch({ id });
  };

  public render(): Render {
    const [{ users }] = this.context;
    return (
      <div className={"login"}>
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
                {user.parent === 0 ? (
                  ""
                ) : (
                  <p>
                    Cart items:{" "}
                    {user.cart ? `${user.cart?.proCarts.length}` : 0}
                  </p>
                )}
                <div className={"btn"}>
                  <button
                    onClick={() => this.login(user.id)}
                  >{`Login as ${user.firstName()}`}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
