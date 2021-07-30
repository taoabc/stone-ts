import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';

export class ParameterList extends ASTList {
  name(i: number): string {
    return (this.child(i) as ASTLeaf).token().getText();
  }
  size(): number {
    return this.numChildren();
  }
}
