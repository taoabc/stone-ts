import { NestedEnv } from '../chap7/NestedEnv';
import { Natives } from '../chap8/Natives';
import { ClassInterpreter } from '../chap9/ClassInterpreter';
import { ArrayParser } from '../stone/ArrayParser';
import '../chap7/ClosureEvaluator';
import '../chap8/NativeEvaluator';
import '../chap9/ClassEvaluator';
import './ArrayEvaluator';

export class ArrayInterpreter extends ClassInterpreter {
  static main() {
    this.run(
      './src/chap10/array.stone',
      new ArrayParser(),
      new Natives().environment(new NestedEnv())
    );
  }
}
