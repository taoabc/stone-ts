export interface HeapMemory {
  read(index: number): unknown;
  write(index: number, v: unknown): void;
}
