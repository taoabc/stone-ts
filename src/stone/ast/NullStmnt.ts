import { ASTList } from './ASTList';

export class NullStmnt extends ASTList {
  static CLASS_ID = 'NullStmnt';
  classId(): string {
    return '';
  }
}
