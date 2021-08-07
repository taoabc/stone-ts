import { ASTList } from './ASTList';

export class NegativeExpr extends ASTList {
  static CLASS_ID = 'NegativeExpr';
  operand() {
    return this.child(0);
  }
  toString() {
    return '-' + this.operand();
  }
  classId(): string {
    return '';
  }
}
