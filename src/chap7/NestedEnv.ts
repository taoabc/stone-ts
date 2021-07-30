import { Environment } from '../chap6/Environment';
import { EnvEx } from './FuncEvaluator';

export class NestedEnv implements Environment {
  protected values: Map<string, unknown> = new Map();
  constructor(private outer?: Environment) {}
  setOuter(e: Environment): void {
    this.outer = e;
  }
  put(name: string, value: unknown): void {
    let e = this.where(name);
    if (e == null) e = this;
    (e as EnvEx).putNew(name, value);
  }
  get(name: string): unknown {
    const v = this.values.get(name);
    if (v == null && this.outer != null) return this.outer.get(name);
    else return v;
  }
  putNew(name: string, value: unknown): void {
    this.values.set(name, value);
  }
  where(name: string): Environment | null {
    if (this.values.has(name)) return this;
    else if (this.outer != null) return (this.outer as EnvEx).where(name);
    else return null;
  }
}
