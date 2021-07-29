import { ASTList } from './ASTList';
import { ASTree } from './ASTree';

export class NullStmnt extends ASTList {
  constructor(c: ASTree[]) {
    super(c);
  }
}
