import { ASTreeEx, BinaryEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { EnvEx, PrimaryEx } from '../chap7/FuncEvaluator';
import { NestedEnv } from '../chap7/NestedEnv';
import { BinaryExpr } from '../stone/ast/BinaryExpr';
import { ClassBody } from '../stone/ast/ClassBody';
import { ClassStmnt } from '../stone/ast/ClassStmnt';
import { Dot } from '../stone/ast/Dot';
import { PrimaryExpr } from '../stone/ast/PrimaryExpr';
import { StoneException } from '../stone/StoneException';
import { inject } from '../utils/inject';
import { ClassInfo } from './ClassInfo';
import { StoneObject } from './StoneObject';
import '../chap7/FuncEvaluator';

export class ClassStmntEx extends ClassStmnt {
  eval(env: Environment): unknown {
    const ci = new ClassInfo(this, env);
    (env as EnvEx).put(this.name(), ci);
    return this.name();
  }
}
export class ClassBodyEx extends ClassBody {
  eval(env: Environment): unknown {
    for (const t of this.children()) (t as ASTreeEx).eval(env);
    return null;
  }
}
export class DotEx extends Dot {
  eval(env: Environment, value: unknown): unknown {
    const member = this.name();
    if (value instanceof ClassInfo) {
      if ('new' === member) {
        const ci = value as ClassInfo;
        const e = new NestedEnv(ci.environment());
        const so = new StoneObject(e);
        e.putNew('this', so);
        this.initObject(ci, e);
        return so;
      }
    } else if (value instanceof StoneObject) {
      return (value as StoneObject).read(member);
    }
    return new StoneException('bad member access: ' + member, this);
  }
  protected initObject(ci: ClassInfo, env: Environment): void {
    const superClass = ci.superClass();
    if (superClass != null) this.initObject(superClass, env);
    (ci.body() as ClassBodyEx).eval(env);
  }
}
export class AssignEx extends BinaryEx {
  // 计算 object.left = rvalue
  protected computeAssign(env: Environment, rvalue: unknown): unknown {
    const le = this.left();
    if (le instanceof PrimaryExpr) {
      const p = le as PrimaryEx;
      if (p.hasPostfix(0) && p.postfix(0) instanceof Dot) {
        const t = p.evalSubExpr(env, 1);
        if (t instanceof StoneObject)
          return this.setField(t as StoneObject, p.postfix(0) as Dot, rvalue);
      }
    }
    return super.computeAssign(env, rvalue);
  }
  protected setField(obj: StoneObject, expr: Dot, rvalue: unknown): unknown {
    const name = expr.name();
    try {
      obj.write(name, rvalue);
      return rvalue;
    } catch (e) {
      throw new StoneException(
        'bad member access: ' + this.location() + ': ' + name
      );
    }
  }
}

inject(ClassStmnt.prototype, ClassStmntEx.prototype);
inject(ClassBody.prototype, ClassBodyEx.prototype);
inject(Dot.prototype, DotEx.prototype);
inject(BinaryExpr.prototype, AssignEx.prototype);
