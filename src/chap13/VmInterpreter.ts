import { EnvOptInterpreter } from '../chap11/EnvOptInterpreter';
import { Natives } from '../chap8/Natives';
import { FuncParser } from '../stone/FuncParser';
import { StoneVMEnv } from './StoneVMEnv';

export class VmInterpreter extends EnvOptInterpreter {
  static main(file: string): void {
    this.run(
      file,
      new FuncParser(),
      new Natives().environment(new StoneVMEnv(100000, 100000, 1000))
    );
  }
}
