import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { FuncParser } from '../stone/FuncParser';
import { NestedEnv } from './NestedEnv';
import './FuncEvaluator';

export class FuncInterpreter extends BasicInterpreter {
  static main() {
    BasicInterpreter.run('./src/chap7/code', new FuncParser(), new NestedEnv());
  }
}
