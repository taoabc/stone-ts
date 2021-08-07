import { ASTLeaf } from './ASTLeaf';

export class Name extends ASTLeaf {
  static CLASS_ID = 'Name';
  // constructor(t: Token) {
  //   super(t);
  // }
  name(): string {
    return this.token().getText();
  }
}
