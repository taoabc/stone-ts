import { ArrayEnv } from '../chap11/ArrayEnv';
import { OptFunction } from '../chap11/OptFunction';
import { Environment } from '../chap6/Environment';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { ParameterList } from '../stone/ast/ParameterList';
import { OptStoneObject } from './OptStoneObject';

export class OptMethod extends OptFunction {
  constructor(
    parameters: ParameterList,
    body: BlockStmnt,
    env: Environment,
    memorySize: number,
    protected self: OptStoneObject
  ) {
    super(parameters, body, env, memorySize);
  }
  makeEnv(): Environment {
    const e = new ArrayEnv(this.size, this._env);
    e.putNest(0, 0, this.self);
    return e;
  }
}
