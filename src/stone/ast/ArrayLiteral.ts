import { ASTList } from './ASTList';

export class ArrayLiteral extends ASTList {
  static CLASS_ID = 'ArrayLiteral';
  size(): number {
    return this.numChildren();
  }
  classId(): string {
    return 'ArrayLiteral';
  }
}
