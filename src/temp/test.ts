import { ArrayLiteral } from '../stone/ast/ArrayLiteral';
import { NumberLiteral } from '../stone/ast/NumberLiteral';
import { StringLiteral } from '../stone/ast/StringLiteral';
import { leafCreate, listCreate } from '../stone/BasicParser';
import { Lexer, Reader } from '../stone/Lexer';
import { rule } from '../stone/Parser';

async function getLexer() {
  const r = new Reader();
  await r.fromFile('./src/temp/code');
  return new Lexer(r);
}

async function main() {
  const primary = rule().string(leafCreate(StringLiteral));
  // const primary = rule().number(leafCreate(NumberLiteral));

  const program = rule(listCreate(ArrayLiteral))
    .ast(primary)
    .repeat(rule().sep(',').ast(primary));

  const lexer = await getLexer();
  const t = program.parse(lexer);
  console.log(t);
}

main();
