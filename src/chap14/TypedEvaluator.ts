import {
  ASTreeOptEx,
  DefStmntEx,
  EnvEx2,
  ParamsEx,
} from '../chap11/EnvOptimizer';
import { Symbols } from '../chap11/Symbols';
import { ASTreeEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { ASTLeaf } from '../stone/ast/ASTLeaf';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { TypeTag } from '../stone/ast/TypedTag';
import { VarStmnt } from '../stone/ast/VarStmnt';
import { astFactory } from '../utils/ASTFactory';

export class DefStmntEx2 extends DefStmntEx {
  type(): TypeTag {
    return this.child(2) as TypeTag;
  }
  body(): BlockStmnt {
    return this.child(3) as BlockStmnt;
  }
  toString(): string {
    return `(def ${this.name()} ${this.parameters()} ${this.type()} ${this.body()})`;
  }
}
export class ParamListEx extends ParamsEx {
  name(i: number): string {
    return (this.child(i) as ASTLeaf).token().getText();
  }
  typeTag(i: number): TypeTag {
    return this.child(i).child(1) as TypeTag;
  }
}
export class VarStmntEx extends VarStmnt {
  protected index: number = 0;
  lookup(syms: Symbols): void {
    this.index = syms.putNew(this.name());
    (this.initializer() as ASTreeOptEx).lookup(syms);
  }
  eval(env: Environment): unknown {
    const value = (this.initializer() as ASTreeEx).eval(env);
    (env as EnvEx2).putNest(0, this.index, value);
    return value;
  }
}

export function EnableTypedEvaluator() {
  astFactory.setList(DefStmntEx2, ParamListEx, VarStmntEx);
}
