import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class IfStmnt extends ASTList {
  // constructor(c: ASTree[]) {
  //   super(c);
  // }
  condition() {
    return this.child(0);
  }
  thenBlock() {
    return this.child(1);
  }
  elseBlock() {
    return this.numChildren() > 2 ? this.child(2) : null;
  }
  toString() {
    return (
      '(if ' +
      this.condition() +
      ' ' +
      this.thenBlock() +
      ' else ' +
      this.elseBlock() +
      ')'
    );
  }
  classId(): string {
    return '';
  }
}
