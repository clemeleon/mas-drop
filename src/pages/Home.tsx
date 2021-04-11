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

  /*public async componentDidMount() {
    const { schema }: { schema: Schema } = this.context;
    console.log(
      await schema.all<User>("users", ["username"])
    );
    console.log(
      await schema.all<Product>("products", ["category"])
    );
    const cart = await schema.get<Cart>("carts", [], { id: 1 });
    if (cart instanceof Cart) {
      const pro = cart?.products[0];
      console.log(cart, pro);
      pro.quantity = 20;
      await schema.set("carts", cart as Cart, { products: [] });
      console.log(
        await schema.get<Cart>("carts", [], { id: 1 })
      );
    }
  }*/

  public async componentDidMount() {
    let {
        get,
        db,
      }: { get: () => StoreStates; db: () => Schema } = this.context,
      user = undefined,
      { id } = get();
    if (id > 0) {
      user = await db().get<User>("users", [], { id });
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
      const user =
        id > 0 ? await db().get<User>("users", [], { id }) : undefined;
      if (user instanceof User) {
        this.setState({ user });
      }
    }
  };

  public render(): Render {
    const { user } = this.state;
    return (
      <div className={"home container"}>
        {user ? <div /> : <Login login={this.login} />}
      </div>
    );
  }
}
