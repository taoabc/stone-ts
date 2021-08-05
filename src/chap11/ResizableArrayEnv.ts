import { Environment } from '../chap6/Environment';
import { EnvEx } from '../chap7/FuncEvaluator';
import { ArrayEnv } from './ArrayEnv';
import { Symbols } from './Symbols';

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
    if (i == null)
      if (this.outer == null) return null;
      else return this.outer.get(name);
    else return this.values[i];
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
    else super.putNest(nest, index, value);
  }
  assign(index: number, value: unknown): void {
    // if (index >= this.values.length) {
    //   let newLen = this.values.length * 2;
    //   if (index >= newLen) newLen = index + 1;
    // }
    this.values[index] = value;
  }
}
