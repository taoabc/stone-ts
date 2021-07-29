import { ASTree } from './ASTree';

export class ASTList implements ASTree {
  static CLASS_ID = 'ASTList';
  constructor(protected _children: ASTree[]) {}

  child(i: number): ASTree {
    return this._children[i];
  }
  numChildren(): number {
    return this._children.length;
  }
  children(): ASTree[] {
    return this._children;
  }
  location(): string | null {
    for (const child of this._children) {
      const s = child.location();
      if (s != null) {
        return s;
      }
    }
    return null;
  }
  toString(): string {
    let str = '(';
    let sep = '';
    for (const child of this._children) {
      str += sep + child.toString();
      sep = ' ';
    }
    str += ')';
    return str;
  }
  classId(): string {
    return ASTList.CLASS_ID;
  }
}
