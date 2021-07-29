import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class WhileStmnt extends ASTList {
  // constructor(c: ASTree[]) {
  //   super(c);
  // }
  condition() {
    return this.child(0);
  }
  body() {
    return this.child(1);
  }
  toString() {
    return '(while ' + this.condition() + ' ' + this.body() + ')';
  }
}
