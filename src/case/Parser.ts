import { ASTLeaf } from '../ast/ASTLeaf';
import { ASTList } from '../ast/ASTList';
import { ASTree } from '../ast/ASTree';
import { BinaryExpr } from '../ast/BinaryExpr';
import { NumberLiteral } from '../ast/NumberLiteral';
import { PrimaryExpr } from '../ast/PrimaryExpr';
import { Lexer, Reader } from '../Lexer';
import { FnCreateASTLeaf, FnCreateASTList, Operators, rule } from '../Parser';
import { Token } from '../Token';

function listCreate<T extends ASTList>(
  classType: new (t: ASTree[]) => T
): FnCreateASTList {
  return (t: ASTree[]) => new classType(t);
}

function leafCreate<T extends ASTLeaf>(
  classType: new (t: Token) => T
): FnCreateASTLeaf {
  return (t: Token) => new classType(t);
}

async function getLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/case/2');
  return new Lexer(reader);
}

async function main() {
  const operators = new Operators();
  operators.add('+', 3, Operators.LEFT);
  const program = rule(PrimaryExpr.create).expression(
    listCreate(BinaryExpr),
    rule().number(leafCreate(NumberLiteral)),
    operators
  );

  const lexer = await getLexer();
  const tree = program.parse(lexer);
  console.log(tree);
}

main();
