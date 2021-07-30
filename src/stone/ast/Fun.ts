import { ASTList } from './ASTList';
import { BlockStmnt } from './BlockStmnt';
import { ParameterList } from './ParameterList';

// [parametersList, block]
export class Fun extends ASTList {
  parameters(): ParameterList {
    return this.child(0) as ParameterList;
  }
  body(): BlockStmnt {
    return this.child(1) as BlockStmnt;
  }
  toString(): string {
    return `(fun ${this.parameters()} ${this.body()})`;
  }

  classId(): string {
    return '';
  }
}
