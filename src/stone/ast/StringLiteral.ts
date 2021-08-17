import { ASTLeaf } from './ASTLeaf';

export class StringLiteral extends ASTLeaf {
  static CLASS_ID = 'StringLiteral';

  value() {
    return this.token().getText();
  }
}
