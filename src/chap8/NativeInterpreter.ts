import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { ClosureParser } from '../chap7/ClosureParser';
import { NestedEnv } from '../chap7/NestedEnv';
import { Natives } from './Natives';
import './NativeEvaluator';

export class NativeInterpreter extends BasicInterpreter {
  static main() {
    this.run(
      './src/chap8/fib.stone',
      new ClosureParser(),
      new Natives().environment(new NestedEnv())
    );
  }
}
