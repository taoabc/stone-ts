export interface Environment {
  put(name: string, value: unknown): void;
  get(name: string): unknown;
}
