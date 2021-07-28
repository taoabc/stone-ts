import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class NegativeExpr extends ASTList {
  constructor(c: ASTree[]) {
    super(c);
  }
  operand() {
    return this.child(0);
  }
  toString() {
    return '-' + this.operand();
  }
}
