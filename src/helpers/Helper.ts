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
}
