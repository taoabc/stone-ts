import { Environment } from '../chap6/Environment';
import { Func } from '../chap7/Function';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { ParameterList } from '../stone/ast/ParameterList';
import { ArrayEnv } from './ArrayEnv';

export class OptFunction extends Func {
  constructor(
    parameters: ParameterList,
    body: BlockStmnt,
    env: Environment,
    protected size: number
  ) {
    super(parameters, body, env);
  }
  makeEnv(): Environment {
    return new ArrayEnv(this.size, this.env());
  }
}
