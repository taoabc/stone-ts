import { ASTree } from './ASTree';
import { Postfix } from './Postfix';

// just one child [index]
export class ArrayRef extends Postfix {
  index(): ASTree {
    return this.child(0);
  }
  toString(): string {
    return `[${this.index()}]`;
  }
}
