import { BinaryEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { ASTList } from '../stone/ast/ASTList';
import { ASTree } from '../stone/ast/ASTree';
import { BinaryExpr } from '../stone/ast/BinaryExpr';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { Fun } from '../stone/ast/Fun';
import { Name } from '../stone/ast/name';
import { ParameterList } from '../stone/ast/ParameterList';
import { StoneException } from '../stone/StoneException';
import { Token } from '../stone/Token';
import { inject } from '../utils/inject';
import { OptFunction } from './OptFunction';
import { Symbols } from './Symbols';

export class EnvEx2 extends Environment {
  symbols(): Symbols {
    throw new Error('not impl');
  }
  putNest(nest: number, index: number, value: unknown): void {
    throw new Error('not impl');
  }
  getNest(nest: number, index: number): unknown {
    throw new Error('not impl');
  }
  putNew(name: string, value: unknown): void {
    throw new Error('not impl');
  }
  where(name: string): Environment {
    throw new Error('not impl');
  }
}
export class ASTreeOptEx extends ASTree {
  lookup(syms: Symbols): void {
    throw new Error('not impl');
  }
}
export class ASTListEx extends ASTList {
  lookup(syms: Symbols): void {
    for (const t of this.children()) (t as ASTreeOptEx).lookup(syms);
  }
}
export class DefStmntEx extends DefStmnt {
  // 函数体
  protected index: number = 0;
  protected size: number = 0;
  lookup(syms: Symbols): void {
    this.index = syms.putNew(this.name());
    this.size = FunEx.lookupSize(syms, this.parameters(), this.body());
  }
  eval(env: Environment): unknown {
    (env as EnvEx2).putNest(
      0,
      this.index,
      new OptFunction(this.parameters(), this.body(), env, this.size)
    );
    return this.name();
  }
}
export class FunEx extends Fun {
  protected size: number = -1;
  lookup(syms: Symbols): void {
    this.size = FunEx.lookupSize(syms, this.parameters(), this.body());
  }
  eval(env: Environment): unknown {
    return new OptFunction(this.parameters(), this.body(), env, this.size);
  }
  static lookupSize(
    syms: Symbols,
    params: ParameterList,
    body: BlockStmnt
  ): number {
    const newSyms = new Symbols(syms);
    (params as ParamsEx).lookup(newSyms);
    (body as ASTListEx).lookup(newSyms); // todo 可能有问题
    return newSyms.size();
  }
}
export class ParamsEx extends ParameterList {
  protected offsets: number[] = [];
  lookup(syms: Symbols): void {
    const s = this.size();
    for (let i = 0; i < s; i++) {
      this.offsets[i] = syms.putNew(this.name(i));
    }
  }
  eval(env: Environment, index: number, value: unknown): void {
    (env as EnvEx2).putNest(0, this.offsets[index], value);
  }
}
export class NameEx extends Name {
  protected static UNKNOWN: number = -1;
  protected nest: number = 0;
  protected index: number;
  constructor(t: Token) {
    super(t);
    this.index = NameEx.UNKNOWN;
  }
  lookup(syms: Symbols): void {
    const loc = syms.get(this.name());
    if (loc == null)
      throw new StoneException(`undefined name: ${this.name()}`, this);
    else {
      this.nest = loc.nest;
      this.index = loc.index;
    }
  }
  lookupForAssign(syms: Symbols): void {
    const loc = syms.put(this.name());
    this.nest = loc.nest;
    this.index = loc.index;
  }
  eval(env: Environment): unknown {
    if (this.index === NameEx.UNKNOWN) return env.get(this.name());
    else return (env as EnvEx2).getNest(this.nest, this.index);
  }
  evalForAssign(env: Environment, value: unknown): void {
    if (this.index === NameEx.UNKNOWN) return env.put(this.name(), value);
    else (env as EnvEx2).putNest(this.nest, this.index, value);
  }
}
export class BinaryEx2 extends BinaryEx {
  lookup(syms: Symbols): void {
    const left = this.left();
    if ('=' === this.operator()) {
      if (left instanceof Name) {
        (left as NameEx).lookupForAssign(syms);
        (this.right() as ASTreeOptEx).lookup(syms);
        return;
      }
    }
    (left as ASTreeOptEx).lookup(syms);
    (this.right() as ASTreeOptEx).lookup(syms);
  }
  protected computeAssign(env: Environment, rvalue: unknown): unknown {
    const l = this.left();
    if (l instanceof Name) {
      (l as NameEx).evalForAssign(env, rvalue);
      return rvalue;
    } else return super.computeAssign(env, rvalue);
  }
}
inject(Environment.prototype, EnvEx2.prototype);
inject(ASTree.prototype, ASTreeOptEx.prototype);
inject(ASTList.prototype, ASTListEx.prototype);
inject(DefStmnt.prototype, DefStmntEx.prototype);
inject(Fun.prototype, FunEx.prototype);
inject(ParameterList.prototype, ParamsEx.prototype);
inject(Name.prototype, NameEx.prototype);
inject(BinaryExpr.prototype, BinaryEx2.prototype);
