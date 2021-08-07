import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { ClosureParser } from '../stone/ClosureParser';
import { NestedEnv } from '../chap7/NestedEnv';
import { Natives } from './Natives';
import './NativeEvaluator';

export class NativeInterpreter extends BasicInterpreter {
  static main(filename: string) {
    this.run(
      filename,
      new ClosureParser(),
      new Natives().environment(new NestedEnv())
    );
  }
}
