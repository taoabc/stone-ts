import '../chap6/BasicEvaluator';
import { ASTreeEx, BlockEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { Arguments } from '../stone/ast/Arguments';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { ParameterList } from '../stone/ast/ParameterList';
import { Postfix } from '../stone/ast/Postfix';
import { PrimaryExpr } from '../stone/ast/PrimaryExpr';
import { StoneException } from '../stone/StoneException';
import { inject } from '../utils/inject';
import { Func } from './Function';

export class FuncEvaluator {}

export class EnvEx extends Environment {
  putNew(name: string, value: unknown) {
    throw new Error('EnvEx not impl');
  }
  where(name: string): Environment | null {
    throw new Error('EnvEx not impl');
  }
  setOuter(e: Environment) {
    throw new Error('EnvEx not impl');
  }
}
class DefStmntEx extends DefStmnt {
  eval(env: Environment): unknown {
    (env as EnvEx).putNew(
      this.name(),
      new Func(this.parameters(), this.body(), env)
    );
    return this.name();
  }
}
// [id, (), (), ...]
// nest 从0开始
class PrimaryEx extends PrimaryExpr {
  operand() {
    return this.child(0);
  }
  // 依次取调用，比如 f(1)(0)
  // postfix(0) => f(1)(0) postfix(1) => f(1)
  postfix(nest: number) {
    return this.child(this.numChildren() - nest - 1) as Postfix;
  }
  hasPostfix(nest: number) {
    return this.numChildren() - nest > 1;
  }
  eval(env: Environment): unknown {
    return this.evalSubExpr(env, 0);
  }
  evalSubExpr(env: Environment, nest: number): unknown {
    if (this.hasPostfix(nest)) {
      const target = this.evalSubExpr(env, nest + 1);
      return (this.postfix(nest) as PostfixEx).eval(env, target);
    } else return (this.operand() as ASTreeEx).eval(env);
  }
}
class PostfixEx extends Postfix {
  eval(env: Environment, value: unknown): unknown {
    throw new Error('PostfixEx not impl');
  }
}
// 实参
class ArgumentsEx extends Arguments {
  eval(callerEnv: Environment, value: unknown) {
    if (!(value instanceof Func)) {
      throw new StoneException('bad function', this);
    }
    const func = value as Func;
    const params = func.parameters();
    if (this.size() != params.size())
      throw new StoneException('bad number of arguments', this);
    const newEnv = func.makeEnv();
    let num = 0;
    // 将实参填充到环境中
    for (const a of this.children())
      (params as ParamsEx).eval(newEnv, num++, (a as ASTreeEx).eval(callerEnv));
    return (func.body() as BlockEx).eval(newEnv);
  }
}
// 形参
class ParamsEx extends ParameterList {
  eval(env: Environment, index: number, value: unknown) {
    (env as EnvEx).putNew(this.name(index), value);
  }
}

inject(Environment.prototype, EnvEx.prototype);
inject(DefStmnt.prototype, DefStmntEx.prototype);
inject(PrimaryExpr.prototype, PrimaryEx.prototype);
inject(Postfix.prototype, PostfixEx.prototype);
inject(Arguments.prototype, ArgumentsEx.prototype);
inject(ParameterList.prototype, ParamsEx.prototype);
