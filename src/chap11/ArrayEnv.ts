import { Environment } from '../chap6/Environment';
import { StoneException } from '../stone/StoneException';
import { inject } from '../utils/inject';
import { EnvEx2 } from './EnvOptimizer';
import { Symbols } from './Symbols';

export class ArrayEnv extends Environment {
  protected values: unknown[] = [];
  constructor(size: number, protected outer: Environment | null) {
    super();
    this.values = new Array(size);
  }
  symbols(): Symbols {
    throw new StoneException('no symbols');
  }
  getNest(nest: number, index: number) {
    if (nest === 0) return this.values[index];
    else if (this.outer == null) return null;
    else return (this.outer as EnvEx2).getNest(nest - 1, index);
  }
  putNest(nest: number, index: number, value: unknown): void {
    if (nest === 0) this.values[index] = value;
    else if (this.outer == null)
      throw new StoneException('no outer environment');
    else (this.outer as EnvEx2).putNest(nest - 1, index, value);
  }
  get(name: string): unknown {
    this.error(name);
    return null;
  }
  put(name: string, value: unknown) {
    this.error(name);
  }
  putNew(name: string, value: unknown) {
    this.error(name);
  }
  where(name: string): unknown {
    this.error(name);
    return null;
  }
  setOuter(e: Environment) {
    this.outer = e;
  }
  private error(name: string) {
    throw new StoneException(`cannot access by name: ${name}`);
  }
}

inject(Environment.prototype, ArrayEnv.prototype);
