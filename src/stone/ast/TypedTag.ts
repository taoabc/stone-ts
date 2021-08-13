import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';

export class TypeTag extends ASTList {
  static CLASS_ID = 'TypeTag';
  static UNDEF = '<Undef>';
  type(): string {
    if (this.numChildren() > 0) {
      return (this.child(0) as ASTLeaf).token().getText();
    } else {
      return TypeTag.UNDEF;
    }
  }
  toString(): string {
    return ':' + this.type();
  }
}
