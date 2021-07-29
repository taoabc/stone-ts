export class ASTree {
  child(i: number): ASTree {
    throw new Error('ASTree not implemented');
  }
  numChildren(): number {
    throw new Error('ASTree not implemented');
  }
  children(): ASTree[] {
    throw new Error('ASTree not implemented');
  }
  location(): string | null {
    throw new Error('ASTree not implemented');
  }
  toString(): string {
    throw new Error('ASTree not implemented');
  }
  classId(): string {
    throw new Error('ASTree not implemented');
  }
}
