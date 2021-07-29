import { BasicParser } from '../BasicParser';
import { Lexer, Reader } from '../Lexer';
import { Token } from '../Token';

async function getLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/test/case/basic');
  return new Lexer(reader);
}

async function test() {
  const lexer = await getLexer();
  const parser = new BasicParser();
  while (lexer.peek(0) !== Token.EOF) {
    const tree = parser.parse(lexer);
    console.log(tree.toString());
  }
}

function main() {
  test();
}

main();
