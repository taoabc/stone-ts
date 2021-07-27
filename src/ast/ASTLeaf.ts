import { Token } from '../Token';
import { ASTree } from './ASTree';

export class ASTLeaf implements ASTree {
  static CLASS_ID = 'ASTLeaf';
  constructor(protected _token: Token) {}
  child(i: number): ASTree {
    throw new Error('leaf has no child');
  }
  numChildren(): number {
    return 0;
  }
  children(): ASTree[] {
    return [];
  }
  toString(): string {
    return this._token.getText();
  }
  location(): string {
    return 'at line ' + this._token.getLineNumber();
  }
  token(): Token {
    return this._token;
  }
  classId(): string {
    return ASTLeaf.CLASS_ID;
  }
}
