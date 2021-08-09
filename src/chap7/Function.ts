import { Environment } from '../chap6/Environment';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { ParameterList } from '../stone/ast/ParameterList';
import { NestedEnv } from './NestedEnv';

export class Func {
  constructor(
    protected _parameters: ParameterList,
    protected _body: BlockStmnt,
    protected _env: Environment
  ) {}
  parameters(): ParameterList {
    return this._parameters;
  }
  body(): BlockStmnt {
    return this._body;
  }
  env(): Environment {
    return this._env;
  }
  makeEnv(): Environment {
    return new NestedEnv(this._env);
  }
  toString(): string {
    return `<fun:${this}>`;
  }
}
