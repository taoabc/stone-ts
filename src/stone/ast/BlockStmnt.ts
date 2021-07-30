import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class BlockStmnt extends ASTList {
  // constructor(c: ASTree[]) {
  //   super(c);
  // }

  classId(): string {
    return '';
  }
}
