'use strict';

import type {Directives, StopOrder} from './Clock-definition';

/**
 * Clock for Timeout
 */
export default class Clock {
  public memory: {cb: (() => void), hash: string}[];
  public directive: Directives;
  public timeout: NodeJS.Timer | undefined;
  private core: () => void;
  public cadence: number;
  public MAX_SUPPORTED_TIME: number;
  /**
   * instance
   */
  constructor() {
    this.memory = [];
    this.directive = [];
    this.MAX_SUPPORTED_TIME = 2147483647;

    this.core = async () => {
      const [order, cmd] = this.directive.at(0) ?? [];
      const {cb, hash} = this.memory.at(0) ?? {};

      if (order == 'STOP' && hash == cmd?.hash) {
        await new Promise((resolve) => setTimeout(resolve, cmd?.timeout));
        this.directive.shift();
      }

      if (!!cb && !(order == 'DESTROY' && cmd)) {
        await cb();
      }

      this.memory.shift();

      clearTimeout(this.timeout);

      if (order != 'DESTROY' && this.memory.length > 0) {
        this.timeout = setTimeout(this.core, this.cadence);
      } else {
        this.timeout = undefined;
      }
    };

    this.cadence = 1; // ms

    this.timeout = setTimeout(this.core, this.cadence);
  }

  /**
   * @param {Function} cb
   * @param {string} hash
   * @return {this}
   */
  public push(cb: () => void, hash: string) {
    this.memory.push({cb, hash});
    if (!this.timeout) {
      this.timeout = setTimeout(this.core, this.cadence);
    }
    return this;
  }

  /**
   * @param {'STOP' | 'DESTROY'} order
   * @param {boolean | number} command
   * @return {this}
   */
  public pushDirective<
  T extends 'STOP' | 'DESTROY'
  >(...args: T extends 'STOP' ? StopOrder : ['DESTROY', boolean]) {
    this.directive.push(args);
    return this;
  }

  /**
   * @param {string} hash
   * @return {boolean}
   */
  public hasDirectiveFromHash(hash: string): boolean {
    return this.directive
        .some(([order, cmd]) => order == 'STOP' && cmd.hash == hash);
  }

  /**
   * @return {this}
   */
  public flush() {
    this.memory.splice(0, this.memory.length - 1);
    return this;
  }

  /**
   * @param {boolean} immediat
   * @return {this}
   */
  public destroy(immediat = false) {
    if (immediat) {
      this.flush();
      clearTimeout(this.timeout);
      this.pushDirective<'DESTROY'>('DESTROY', immediat);
    } else {
      process.nextTick(() => {
        this.push(() => {
          this.pushDirective<'DESTROY'>('DESTROY', immediat);
        }, '');
      });
    }
    return this;
  }
}
