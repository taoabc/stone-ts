import { BasicParser } from '../BasicParser';
import { Lexer, Reader } from '../Lexer';

async function getLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/case/3');
  return new Lexer(reader);
}

async function test() {
  const lexer = await getLexer();
  const parser = new BasicParser();
  const tree = parser.parse(lexer);
  console.log(tree, tree.toString());
}

function main() {
  test();
}

main();
