import { Environment } from '../chap6/Environment';
import { EnvEx } from '../chap7/FuncEvaluator';
import { ArrayEnv } from './ArrayEnv';
import { Symbols } from './Symbols';
import { inject } from '../utils/inject';

import './ArrayEnv';
// JS数组本身是不定长的
export class ResizableArrayEnv extends ArrayEnv {
  protected names: Symbols;
  constructor() {
    super(10, null);
    this.names = new Symbols();
  }
  symbols(): Symbols {
    return this.names;
  }
  get(name: string): unknown {
    const i = this.names.find(name);
    if (i == null) {
      if (this.outer == null) return null;
      else return this.outer.get(name);
    } else return this.values[i];
  }
  put(name: string, value: unknown): void {
    let e = this.where(name);
    if (e == null) e = this;
    (e as EnvEx).putNew(name, value);
  }
  putNew(name: string, value: unknown): void {
    this.assign(this.names.putNew(name), value);
  }
  where(name: string): Environment | null {
    if (this.names.find(name) != null) return this;
    else if (this.outer == null) return null;
    else return (this.outer as EnvEx).where(name);
  }
  putNest(nest: number, index: number, value: unknown): void {
    if (nest == 0) this.assign(index, value);
    // super 会先调用自己的，这时直接判断Nest不为0，再调用outer的putNest，此时outer也为ResizableArrayEnv
    // 本质上这个类似于 outer.putNest(nest - 1, index, value);
    else super.putNest(nest, index, value);
  }
  assign(index: number, value: unknown): void {
    // JS不需要按照两倍的增长来计算大小
    // if (index >= this.values.length) {
    //   let newLen = this.values.length * 2;
    //   if (index >= newLen) newLen = index + 1;
    // }
    this.values[index] = value;
  }
}

inject(Environment.prototype, ResizableArrayEnv.prototype);
