import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class BinaryExpr extends ASTList {
  static CLASS_ID = 'BinaryExpr';
  left(): ASTree {
    return this.child(0);
  }
  operator(): string {
    return (this.child(1) as unknown as ASTLeaf).token().getText();
  }
  right(): ASTree {
    return this.child(2);
  }
  classId(): string {
    return '';
  }
}
