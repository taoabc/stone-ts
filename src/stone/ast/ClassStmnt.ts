import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';
import { ClassBody } from './ClassBody';

export class ClassStmnt extends ASTList {
  name(): string {
    return (this.child(0) as ASTLeaf).token().getText();
  }
  superClass(): string | null {
    if (this.numChildren() < 3) return null;
    else return (this.child(1) as ASTLeaf).token().getText();
  }
  body(): ClassBody {
    return this.child(this.numChildren() - 1) as ClassBody;
  }
  toString(): string {
    let parent = this.superClass();
    if (parent == null) parent = '*';
    return `(class ${this.name()} ${parent} ${this.body()})`;
  }
}
