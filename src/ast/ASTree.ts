export interface ASTree {
  child(i: number): ASTree;
  numChildren(): number;
  children(): ASTree[];
  location(): string | null;
  toString(): string;
  classId(): string;
}
