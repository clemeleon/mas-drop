import React, { Component } from "react";
import { Render } from "../helpers/types";
import { StoreContext, StoreStates } from "../components/stores/Store";
import { Helper } from "../helpers/Helper";
import { User } from "../datas/User";
import { Login } from "../components/home/Login";
import { Schema } from "../components/stores/Schema";

/** Home props and states */
export type HomeProps = {};
export type HomeStates = {
  user: User | undefined;
  loading: boolean;
};

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = StoreContext;

  constructor(props: HomeProps) {
    super(props);
    this.state = { user: undefined, loading: true };
  }

  shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    nextState: Readonly<HomeStates>,
    nextContext: any
  ): boolean {
    return nextState && !Helper.compare(this.state, nextState);
  }

  public async componentDidMount() {
    let { id, db }: { id: number; db: () => Schema } = this.context,
      user = undefined;
    if (id > 0) {
      user = await db().user({ id }, true);
      if (db().isError()) {
      }
    }
    this.setState({ user, loading: false });
  }

  private login = async (id: number): Promise<void> => {
    const {
      db,
      set,
    }: {
      db: () => Schema;
      set: (state: StoreStates) => boolean;
    } = this.context;
    if (set({ id })) {
      const user = id > 0 ? await db().user({ id }, true) : undefined;
      if (user instanceof User) {
        this.setState({ user });
      }
    }
  };

  public render(): Render {
    const { user } = this.state,
      {
        id,
        db,
      }: {
        id: number;
        db: () => Schema;
      } = this.context;
    return (
      <div className={"home container"}>
        {id > 0 ? (
          user ? (
            <div>{user.fullName()}</div>
          ) : (
            "please wait"
          )
        ) : (
          <Login login={this.login} db={db} />
        )}
      </div>
    );
  }
}
