import { Environment } from '../chap6/Environment';
import { Func } from '../chap7/Function';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { ParameterList } from '../stone/ast/ParameterList';

export class VmFunction extends Func {
  constructor(
    parameters: ParameterList,
    body: BlockStmnt,
    env: Environment,
    protected _entry: number
  ) {
    super(parameters, body, env);
  }
  entry(): number {
    return this._entry;
  }
}
