import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';
import { ASTree } from './ASTree';
import { TypeTag } from './TypedTag';

export class VarStmnt extends ASTList {
  static CLASS_ID = 'VarStmnt';
  name(): string {
    return (this.child(0) as ASTLeaf).token().getText();
  }
  type(): TypeTag {
    return this.child(1) as TypeTag;
  }
  initializer(): ASTree {
    return this.child(2);
  }
  toString(): string {
    return `(var ${this.name()} ${this.type()} ${this.initializer()})`;
  }
}
