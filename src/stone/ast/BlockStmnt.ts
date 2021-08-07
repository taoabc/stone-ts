import { ASTList } from './ASTList';

export class BlockStmnt extends ASTList {
  static CLASS_ID = 'BlockStmnt';

  classId(): string {
    return '';
  }
}
