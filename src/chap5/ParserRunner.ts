import { BasicParser } from '../stone/BasicParser';
import { Lexer, Reader } from '../stone/Lexer';
import { Token } from '../stone/Token';

async function getLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/chap5/basic');
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
