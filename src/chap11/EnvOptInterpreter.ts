import { ASTreeEx } from '../chap6/BasicEvaluator';
import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { Environment } from '../chap6/Environment';
import '../chap8/NativeEvaluator';
import { Natives } from '../chap8/Natives';
import { NullStmnt } from '../stone/ast/NullStmnt';
import { BasicParser } from '../stone/BasicParser';
import { ClosureParser } from '../stone/ClosureParser';
import { Token } from '../stone/Token';
import { ASTreeOptEx, EnvEx2 } from './EnvOptimizer';
import './ResizableArrayEnv';
import { ResizableArrayEnv } from './ResizableArrayEnv';

export class EnvOptInterpreter extends BasicInterpreter {
  static main() {
    this.run(
      './src/chap8/fib.stone',
      new ClosureParser(),
      new Natives().environment(new ResizableArrayEnv())
    );
  }
  static async run(filename: string, bp: BasicParser, env: Environment) {
    const lexer = await BasicInterpreter.getLexer(filename);
    while (lexer.peek(0) !== Token.EOF) {
      const t = bp.parse(lexer);
      if (!(t instanceof NullStmnt)) {
        (t as ASTreeOptEx).lookup((env as EnvEx2).symbols());
        const r = (t as ASTreeEx).eval(env);
        console.log(r);
      }
    }
  }
}
