import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { NestedEnv } from '../chap7/NestedEnv';
import { Natives } from '../chap8/Natives';
import { ClassParser } from '../stone/ClassParser';
import './ClassEvaluator';
import '../chap8/NativeEvaluator';

export class ClassInterpreter extends BasicInterpreter {
  static main(filename: string) {
    BasicInterpreter.run(
      filename,
      new ClassParser(),
      new Natives().environment(new NestedEnv())
    );
  }
}
