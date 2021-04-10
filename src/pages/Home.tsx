import React, { Component } from "react";
import { Render } from "../helpers/types";
import { StoreContext } from "../components/stores/Store";
import { Helper } from "../helpers/Helper";
import {Schema} from "../components/stores/Schema";

/** Home props and states */
export type HomeProps = {};
export type HomeStates = {};

export class Home extends Component<HomeProps, HomeStates> {
  public static contextType = StoreContext;
  public state = { users: [], user: {} };

  private schema: Schema | undefined;

  constructor(props: HomeProps) {
    super(props);
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
    this.schema = this.context.schema;
  }

  public click = async (): Promise<void> => {
    console.log(this.schema);
  };

  public render(): Render {
    return (
      <div>
        <h1>Home</h1>
        <button onClick={this.click}>click</button>
      </div>
    );
  }
}
