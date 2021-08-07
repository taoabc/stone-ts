import { ASTLeaf } from './ASTLeaf';
import { ASTList } from './ASTList';
import { BlockStmnt } from './BlockStmnt';
import { ParameterList } from './ParameterList';

// [name, parameters, body]
export class DefStmnt extends ASTList {
  static CLASS_ID = 'DefStmnt';
  name(): string {
    return (this.child(0) as ASTLeaf).token().getText();
  }
  parameters(): ParameterList {
    return this.child(1) as ParameterList;
  }
  body(): BlockStmnt {
    return this.child(2) as BlockStmnt;
  }
  toString(): string {
    return `(def ${this.name()} ${this.parameters()} ${this.body()})`;
  }

  classId(): string {
    return '';
  }
}
