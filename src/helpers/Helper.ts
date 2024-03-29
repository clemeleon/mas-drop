import { Cart, CartProductType } from "../datas/Cart";
import { Product } from "../datas/Product";

export class Helper {
  /**Compare two values if they are same*/
  static compare = (one: any, two: any): boolean => {
    if (!one || !two) {
      if (one) {
        return false;
      } else if (two) {
        return false;
      }
      return true;
    }
    return JSON.stringify(one) === JSON.stringify(two);
  };

  static strLower(str: string): string {
    if (str.length === 0) {
      return str;
    }
    return str.toLowerCase();
  }

  static strUpper(str: string): string {
    if (str.length === 0) {
      return str;
    }
    return str.toUpperCase();
  }

  static strFirstUpper(str: string): string {
    if (str.length === 0) {
      return str;
    }
    return this.strUpper(str.charAt(0)) + str.slice(1);
  }

  static slug(str: string): string {
    if (!str || str === "") {
      return "";
    }
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  }

  static truncate(text: string, limit: number, suffix: string = "..."): string {
    if (text.length === 0) {
      return "";
    }
    const txt = text.replace(/(<([^>]+)>)/gi, "");
    if (txt.length <= limit) {
      return txt;
    }
    const temps = txt.split(" "),
      len = suffix.length,
      max = limit - len;
    let str: string = "";
    for (const temp of temps) {
      const count = max - str.length;
      if (count + len < len) {
        break;
      }
      str = str + ` ${temp}`;
    }
    return str + suffix;
  }

  /**
   * Check if state really changed
   * @param state
   * @param nextState
   */
  static state(
    state: { [key: string]: any },
    nextState: { [key: string]: any }
  ): boolean {
    let bol = false;
    for (const [key, val] of Object.entries(state)) {
      if (nextState.hasOwnProperty(key)) {
        bol = !this.compare(nextState[key], val);
        if (bol) {
          break;
        }
      }
    }
    return bol;
  }

  static clone<T>(clone: any): T {
    return JSON.parse(JSON.stringify(clone));
  }

  static cartCount(cart: Cart): number {
    const counts = cart.products.map((c) => c.quantity);
    if (counts.length === 0) {
      return 0;
    }
    return counts.reduce((one, two) => one + two);
  }

  static cartTotal(
    cart: Cart,
    products: Product[]
  ): [number, number, number, number] {
    const content = cart.products.map((p: CartProductType) => {
      const product: Product | undefined = products.find(
        (p1: Product) => p1.id === p.productId
      );
      if (!product) {
        return { qty: 0, amount: 0, count: 0, accepted: 0 };
      }
      return {
        qty: p.quantity,
        amount: product.price * p.quantity,
        count: p.approved ? p.quantity : 0,
        accepted: p.approved ? product.price * p.quantity : 0,
      };
    });
    return Helper.cartReduce(content);
  }

  static cartReduce(
    content: Array<{
      qty: number;
      amount: number;
      count: number;
      accepted: number;
    }>
  ): [number, number, number, number] {
    if (content.length === 0) {
      return [0, 0, 0, 0]
    }
    const amounts = (content.length === 0) ? [0] : content.map(({ amount }) => amount),
      total = content.map(({ qty }) => qty),
      amount = amounts.reduce((tot, b) => tot + b),
      counts = content.map(({ count }) => (!count ? 0 : count)),
      count = counts.reduce((tot, c) => tot + c),
      accepted = content.map(({ accepted }) => accepted),
      accept = accepted.reduce((tot, a) => tot + a);
    return [
      Math.round((amount + Number.EPSILON) * 100) / 100,
      total.reduce((tot, b) => tot + b),
      count,
      Math.round((accept + Number.EPSILON) * 100) / 100,
    ];
  }

  static cartAction(
    dispatch: Function,
    type: string,
    cart: Cart | undefined,
    id: number
  ): void {
    if (!cart) {
      return;
    }
    const temp: Cart = new Cart(Helper.clone(cart));
    if (type === "add") {
      temp.add(id);
    } else if (type === "plus") {
      temp.plus(id);
    } else if (type === "minus") {
      temp.minus(id);
    } else if (type === "accept") {
      temp.changeStatus(id, true);
    } else if (type === "cancel") {
      temp.changeStatus(id, false);
    }
    dispatch({ cart: temp });
  }
}
