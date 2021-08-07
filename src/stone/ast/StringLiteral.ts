import { Token } from '../Token';
import { ASTLeaf } from './ASTLeaf';

export class StringLiteral extends ASTLeaf {
  static CLASS_ID = 'StringLiteral';
  // constructor(t: Token) {
  //   super(t);
  // }
  value() {
    return this.token().getText();
  }
}
