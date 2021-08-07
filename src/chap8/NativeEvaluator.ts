import { Environment } from '../chap6/Environment';
import { ArgumentsEx } from '../chap7/FuncEvaluator';
import { ASTreeEx } from '../chap6/BasicEvaluator';
import { NativeFunction } from './NativeFunction';
import { astFactory } from '../utils/ASTFactory';

export class NativeArgEx extends ArgumentsEx {
  eval(callerEnv: Environment, value: unknown) {
    if (!(value instanceof NativeFunction)) return super.eval(callerEnv, value);

    const func = value as NativeFunction;
    // JS 不需要判断参数个数
    // const nParams = func.numOfParameters();
    // if (this.size() != nParams)
    //   throw new StoneException('bad number of arguments', this);
    const args: unknown[] = [];
    for (const a of this.children()) {
      const ae = a as ASTreeEx;
      args.push(ae.eval(callerEnv));
    }
    return func.invoke(args, this);
  }
}

export function EnableNativeEvaluator() {
  astFactory.setList(NativeArgEx);
}
