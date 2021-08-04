import { ASTLeaf } from './ASTLeaf';
import { Postfix } from './Postfix';

export class Dot extends Postfix {
  name(): string {
    return (this.child(0) as ASTLeaf).token().getText();
  }
  toSTring() {
    return '.' + this.name();
  }
}
