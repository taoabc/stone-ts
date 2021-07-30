import { Environment } from '../chap6/Environment';
import { Fun } from '../stone/ast/Fun';
import { inject } from '../utils/inject';
import { Func } from './Function';
import '../chap6/BasicEvaluator';
import './FuncEvaluator';

export class FunEx extends Fun {
  eval(env: Environment): unknown {
    return new Func(this.parameters(), this.body(), env);
  }
}

inject(Fun.prototype, FunEx.prototype);
