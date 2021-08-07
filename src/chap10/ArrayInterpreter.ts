import { NestedEnv } from '../chap7/NestedEnv';
import { Natives } from '../chap8/Natives';
import { ClassInterpreter } from '../chap9/ClassInterpreter';
import { ArrayParser } from '../stone/ArrayParser';

export class ArrayInterpreter extends ClassInterpreter {
  static main(filename: string) {
    this.run(
      filename,
      new ArrayParser(),
      new Natives().environment(new NestedEnv())
    );
  }
}
