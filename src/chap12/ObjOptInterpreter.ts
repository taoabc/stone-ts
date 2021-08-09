import { EnvOptInterpreter } from '../chap11/EnvOptInterpreter';
import { ResizableArrayEnv } from '../chap11/ResizableArrayEnv';
import { Natives } from '../chap8/Natives';
import { ClassParser } from '../stone/ClassParser';

export class ObjOptInterpreter extends EnvOptInterpreter {
  static main(file: string): void {
    this.run(
      file,
      new ClassParser(),
      new Natives().environment(new ResizableArrayEnv())
    );
  }
}
