import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { FuncParser } from '../stone/FuncParser';
import { NestedEnv } from './NestedEnv';

export class FuncInterpreter extends BasicInterpreter {
  static main(filename: string) {
    BasicInterpreter.run(filename, new FuncParser(), new NestedEnv());
  }
}
