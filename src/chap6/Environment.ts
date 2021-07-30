export class Environment {
  put(name: string, value: unknown): void {
    throw new Error('Environment not impl');
  }
  get(name: string): unknown {
    throw new Error('Environment not impl');
  }
}
