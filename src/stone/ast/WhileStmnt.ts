import { ASTList } from './ASTList';

export class WhileStmnt extends ASTList {
  static CLASS_ID = 'WhileStmnt';
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
  classId(): string {
    return '';
  }
}
