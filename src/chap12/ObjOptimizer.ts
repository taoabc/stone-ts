import { ArrayEnv } from '../chap11/ArrayEnv';
import {
  ASTListEx,
  ASTreeOptEx,
  DefStmntEx,
  EnvEx2,
  NameEx,
  ParamsEx,
} from '../chap11/EnvOptimizer';
import { Symbols } from '../chap11/Symbols';
import { ASTreeEx, BinaryEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { EnvEx, PrimaryEx } from '../chap7/FuncEvaluator';
import { ClassBody } from '../stone/ast/ClassBody';
import { ClassStmnt } from '../stone/ast/ClassStmnt';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { Dot } from '../stone/ast/Dot';
import { PrimaryExpr } from '../stone/ast/PrimaryExpr';
import { StoneException } from '../stone/StoneException';
import { astFactory } from '../utils/ASTFactory';
import { MemberSymbols } from './MemberSymbols';
import { OptClassInfo } from './OptClassInfo';
import { OptStoneObject } from './OptStoneObject';
import { SymbolThis } from './SymbolThis';

export class ClassStmntEx extends ClassStmnt {
  lookup(syms: Symbols): void {}
  eval(env: Environment): unknown {
    const methodNames = new MemberSymbols(
      (env as EnvEx2).symbols(),
      MemberSymbols.METHOD
    );
    const fieldNames = new MemberSymbols(methodNames, MemberSymbols.FILED);
    const ci = new OptClassInfo(this, env, methodNames, fieldNames);
    (env as EnvEx2).put(this.name(), ci);
    const methods: DefStmnt[] = new Array();
    if (ci.superClass() != null)
      ci.superClass().copyTo(fieldNames, methodNames, methods);
    const newSyms = new SymbolThis(fieldNames);
    (this.body() as ClassBodyEx).lookup(
      newSyms,
      methodNames,
      fieldNames,
      methods
    );
    ci.setMethods(methods);
    return this.name();
  }
}
export class ClassBodyEx extends ClassBody {
  eval(env: Environment): unknown {
    for (const t of this.children()) {
      if (!(t instanceof DefStmnt)) {
        (t as ASTreeEx).eval(env);
      }
    }
    return null;
  }
  lookup(
    syms: Symbols,
    methodNames: Symbols,
    fieldNames: Symbols,
    methods: DefStmnt[]
  ): void {
    for (const t of this.children()) {
      if (t instanceof DefStmnt) {
        const oldSize = methodNames.size();
        const i = methodNames.putNew(t.name());
        if (i >= oldSize) methods.push(t);
        else methods[i] = t;
        (t as DefStmntEx2).lookupAsMethod(fieldNames);
      } else (t as ASTreeOptEx).lookup(syms);
    }
  }
}
export class DefStmntEx2 extends DefStmntEx {
  locals(): number {
    return this.size;
  }
  lookupAsMethod(syms: Symbols): void {
    const newSyms = new Symbols(syms);
    newSyms.putNew(SymbolThis.NAME);
    (this.parameters() as ParamsEx).lookup(newSyms);
    (this.body() as ASTListEx).lookup(newSyms);
    this.size = newSyms.size();
  }
}
export class DotEx extends Dot {
  eval(env: Environment, value: unknown): unknown {
    const member = this.name();
    if (value instanceof OptClassInfo) {
      if ('new' === member) {
        const ci = value;
        const newEnv = new ArrayEnv(1, ci.environment());
        const so = new OptStoneObject(ci, ci.size());
        newEnv.putNest(0, 0, so);
        this.initObject(ci, so, newEnv);
        return so;
      }
    } else if (value instanceof OptStoneObject) {
      return value.read(member);
    }
    throw new StoneException('bad member access: ' + member, this);
  }
  initObject(ci: OptClassInfo, obj: OptStoneObject, env: Environment): void {
    if (ci.superClass() != null) this.initObject(ci.superClass(), obj, env);
    (ci.body() as ClassBodyEx).eval(env);
  }
}
export class NameEx2 extends NameEx {
  eval(env: Environment): unknown {
    if (this.index === NameEx.UNKNOWN) return env.get(this.name());
    else if (this.nest === MemberSymbols.FILED)
      return this.getThis(env).readIndex(this.index);
    else if (this.nest === MemberSymbols.METHOD)
      return this.getThis(env).method(this.index);
    else return (env as EnvEx2).getNest(this.nest, this.index);
  }
  evalForAssign(env: Environment, value: unknown): void {
    if (this.index === NameEx.UNKNOWN) (env as EnvEx2).put(this.name(), value);
    else if (this.nest === MemberSymbols.FILED)
      this.getThis(env).writeIndex(this.index, value);
    else if (this.nest === MemberSymbols.METHOD)
      throw new StoneException('cannot update a method: ' + this.name(), this);
    else (env as EnvEx2).putNest(this.nest, this.index, value);
  }
  getThis(env: Environment): OptStoneObject {
    return (env as EnvEx2).getNest(0, 0) as OptStoneObject;
  }
}
export class AssignEx extends BinaryEx {
  computeAssign(env: Environment, rvalue: unknown): unknown {
    const le = this.left();
    if (le instanceof PrimaryExpr) {
      const p = le as PrimaryEx;
      if (p.hasPostfix(0) && p.postfix(0) instanceof Dot) {
        const t = (le as PrimaryEx).evalSubExpr(env, 1);
        if (t instanceof OptStoneObject)
          return this.setField(
            t as OptStoneObject,
            p.postfix(0) as Dot,
            rvalue
          );
      }
    }
    return super.computeAssign(env, rvalue);
  }
  setField(obj: OptStoneObject, expr: Dot, rvalue: unknown): unknown {
    const name = expr.name();
    try {
      obj.write(name, rvalue);
      return rvalue;
    } catch (e) {
      throw new StoneException('bad member access: ' + name, this);
    }
  }
}

export function EnableObjOptimizer() {
  astFactory.setLeaf(NameEx2);
  astFactory.setList(ClassStmntEx, ClassBodyEx, DefStmntEx2, DotEx, AssignEx);
}
