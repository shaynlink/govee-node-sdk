'use strict';

/**
 * Toolbox class
 */
export default class Util {
  /**
   * Check if two object is equal
   * @param {any} object1
   * @param {any} object2
   * @return {boolean}
   */
  public static equalObject(object1: any, object2: any): boolean {
    return Object
        .keys(object1)
        .every((value) => {
          return object1[value] == object2[value];
        });
  };
}
