import { NullStmnt } from '../stone/ast/NullStmnt';
import { BasicParser } from '../stone/BasicParser';
import { Lexer, Reader } from '../stone/Lexer';
import { Token } from '../stone/Token';
import { BasicEnv } from './BasicEnv';
import { ASTreeEx } from './BasicEvaluator';
import { Environment } from './Environment';

export class BasicInterpreter {
  static main(filename: string) {
    BasicInterpreter.run(filename, new BasicParser(), new BasicEnv());
  }
  static async run(filename: string, bp: BasicParser, env: Environment) {
    const lexer = await BasicInterpreter.getLexer(filename);
    while (lexer.peek(0) !== Token.EOF) {
      const t = bp.parse(lexer);
      if (!(t instanceof NullStmnt)) {
        const r = (t as ASTreeEx).eval(env);
        console.log(r);
      }
    }
  }
  static async getLexer(filename: string) {
    const reader = new Reader();
    await reader.fromFile(filename);
    return new Lexer(reader);
  }
}
