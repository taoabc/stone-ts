import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class PrimaryExpr extends ASTList {
  static create(c: ASTree[]) {
    return c.length === 1 ? c[0] : new PrimaryExpr(c);
  }
  classId(): string {
    return '';
  }
}
