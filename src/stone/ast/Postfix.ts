import { ASTList } from './ASTList';

export class Postfix extends ASTList {
  static CLASS_ID = 'Postfix';
  classId(): string {
    return 'Postfix';
  }
}
