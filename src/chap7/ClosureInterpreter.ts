import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { ClosureParser } from '../stone/ClosureParser';
import { NestedEnv } from './NestedEnv';
import './ClosureEvaluator';

export class ClosureInterpreter extends BasicInterpreter {
  static main() {
    BasicInterpreter.run(
      './src/chap7/closure',
      new ClosureParser(),
      new NestedEnv()
    );
  }
}
