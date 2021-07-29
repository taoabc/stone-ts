import { NullStmnt } from '../stone/ast/NullStmnt';
import { BasicParser } from '../stone/BasicParser';
import { Lexer, Reader } from '../stone/Lexer';
import { Token } from '../stone/Token';
import { BasicEnv } from './BasicEnv';
import { ASTreeEx } from './BasicEvaluator';
import './BasicEvaluator';

async function getLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/chap6/stone');
  return new Lexer(reader);
}

async function test() {
  const lexer = await getLexer();
  const parser = new BasicParser();
  const env = new BasicEnv();
  while (lexer.peek(0) !== Token.EOF) {
    const t = parser.parse(lexer);
    if (!(t instanceof NullStmnt)) {
      const r = (t as ASTreeEx).eval(env);
      console.log(r);
    }
  }
}

function main() {
  test();
}

main();
