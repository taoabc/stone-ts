import { Token } from '../Token';
import { ASTLeaf } from './ASTLeaf';

export class StringLiteral extends ASTLeaf {
  // constructor(t: Token) {
  //   super(t);
  // }
  value() {
    return this.token().getText();
  }
}
