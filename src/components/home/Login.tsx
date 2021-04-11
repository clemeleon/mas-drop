/**
 * Package: mas-drop.
 * 10 April 2021
 */
import { Component } from "react";
import { User } from "../../datas/User";
import { Schema } from "../stores/Schema";
import { StoreContext } from "../stores/Store";
import { Render } from "../../helpers/types";
export type LoginProps = { login: (id: number) => void };
export type LoginStates = {
  users: User[];
};
export class Login extends Component<LoginProps, LoginStates> {
  public static contextType = StoreContext;
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      users: [],
    };
  }

  public async componentDidMount() {
    const { db }: { db: () => Schema } = this.context;
    const users = await db().all<User>("users");
    this.setState({
      users: users.sort((a, b) => (a.parent > b.parent ? 1 : -1)),
    });
  }

  public render(): Render {
    const { users } = this.state,
      { login } = this.props;
    return (
      <div>
        <h1>All Users</h1>
        <div className={"users"}>
          {users.map((user) => (
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
                <div className={"btn"}>
                  <button
                    onClick={() => login(user.id)}
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
