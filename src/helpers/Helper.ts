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

  static typeCompare(): boolean {
    return false;
  }
}
