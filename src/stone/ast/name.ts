import { Token } from '../Token';
import { ASTLeaf } from './ASTLeaf';

export class Name extends ASTLeaf {
  // constructor(t: Token) {
  //   super(t);
  // }
  name(): string {
    return this.token().getText();
  }
}
