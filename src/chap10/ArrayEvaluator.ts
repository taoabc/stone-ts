import { ASTreeEx, BinaryEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { PrimaryEx } from '../chap7/FuncEvaluator';
import { ArrayLiteral } from '../stone/ast/ArrayLiteral';
import { ArrayRef } from '../stone/ast/ArrayRef';
import { StoneException } from '../stone/StoneException';
import { astFactory } from '../utils/ASTFactory';

export class ArrayListEx extends ArrayLiteral {
  eval(env: Environment): unknown {
    // const s = this.numChildren(); JS 不需要指定长度
    const res = [];
    let i = 0;
    for (const t of this.children()) res[i++] = (t as ASTreeEx).eval(env);
    return res;
  }
}
export class ArrayRefEx extends ArrayRef {
  eval(env: Environment, value: unknown): unknown {
    if (Array.isArray(value)) {
      const index = (this.index() as ASTreeEx).eval(env);
      if (typeof index === 'number') return value[index];
    }
    throw new StoneException('bad array access', this);
  }
}
export class AssignEx extends BinaryEx {
  protected computeAssign(env: Environment, rvalue: unknown): unknown {
    const le = this.left();
    if (le instanceof PrimaryEx) {
      const p = le as PrimaryEx;
      if (p.hasPostfix(0) && p.postfix(0) instanceof ArrayRef) {
        const a = p.evalSubExpr(env, 1);
        if (Array.isArray(a)) {
          const aref = p.postfix(0) as ArrayRef;
          const index = (aref.index() as ASTreeEx).eval(env);
          if (typeof index === 'number') {
            a[index] = rvalue;
            return rvalue;
          }
        }
      }
    }
    return super.computeAssign(env, rvalue);
  }
}

export function EnableArrayEvaluator() {
  astFactory.setList(ArrayListEx, ArrayRefEx, AssignEx);
}
