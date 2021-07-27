import { Token } from '../Token';
import { ASTLeaf } from './ASTLeaf';

export class NumberLiteral extends ASTLeaf {
  constructor(t: Token) {
    super(t);
  }
  value(): number {
    return this.token().getNumber();
  }
}
