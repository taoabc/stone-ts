import { Environment } from '../chap6/Environment';
import { Fun } from '../stone/ast/Fun';
import { Func } from './Function';
import { astFactory } from '../utils/ASTFactory';

export class FunEx extends Fun {
  eval(env: Environment): unknown {
    return new Func(this.parameters(), this.body(), env);
  }
}

export function EnableClosureEvaluator() {
  astFactory.setList(FunEx);
}
