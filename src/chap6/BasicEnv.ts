import { Environment } from './Environment';

export class BasicEnv implements Environment {
  private values: Map<string, unknown> = new Map();
  put(key: string, value: unknown): void {
    this.values.set(key, value);
  }
  get(key: string): unknown {
    return this.values.get(key);
  }
}
