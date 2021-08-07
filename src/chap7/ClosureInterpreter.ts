import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { ClosureParser } from '../stone/ClosureParser';
import { NestedEnv } from './NestedEnv';

export class ClosureInterpreter extends BasicInterpreter {
  static main(filename: string) {
    BasicInterpreter.run(filename, new ClosureParser(), new NestedEnv());
  }
}
