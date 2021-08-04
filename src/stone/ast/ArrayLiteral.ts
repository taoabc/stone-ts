import { ASTList } from "./ASTList";

export class ArrayLiteral extends ASTList {
  size(): number { return this.numChildren();}
  classId(): string { return 'ArrayLiteral';}
}
