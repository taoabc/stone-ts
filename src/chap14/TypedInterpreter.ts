import { ASTreeOptEx, EnvEx2 } from '../chap11/EnvOptimizer';
import { ResizableArrayEnv } from '../chap11/ResizableArrayEnv';
import { ASTreeEx } from '../chap6/BasicEvaluator';
import { BasicInterpreter } from '../chap6/BasicInterpreter';
import { Environment } from '../chap6/Environment';
import { NullStmnt } from '../stone/ast/NullStmnt';
import { BasicParser } from '../stone/BasicParser';
import { Token } from '../stone/Token';
import { TypedParser } from '../stone/TypedParser';
import { ASTreeTypeEx } from './TypeChecker';
import { TypeEnv } from './TypeEnv';
import { TypedNatives } from './TypedNatives';

export class TypedInterpreter {
  public static main(file: string): void {
    const te = new TypeEnv();
    this.run(
      file,
      new TypedParser(),
      new TypedNatives(te).environment(new ResizableArrayEnv()),
      te
    );
  }
  public static async run(
    file: string,
    bp: BasicParser,
    env: Environment,
    typeEnv: TypeEnv
  ) {
    const lexer = await BasicInterpreter.getLexer(file);
    while (lexer.peek(0) != Token.EOF) {
      const tree = bp.parse(lexer);
      if (!(tree instanceof NullStmnt)) {
        (tree as ASTreeOptEx).lookup((env as EnvEx2).symbols());
        const type = (tree as ASTreeTypeEx).typeCheck(typeEnv);
        const r = (tree as ASTreeEx).eval(env);
        console.log('=> ' + r + ' : ' + type);
      }
    }
  }
}
