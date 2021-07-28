/**
 * stone 语法定义
 * primary　　: "(" expr ")" | NUMBER | IDENTIFIER | STRING
 * factor　　 : "-" primary | primary
 * expr　　　 : factor { OP factor }
 * block　　　: "{" [ statement ] {(";" | EOL) [ statement ]} "}"
 * simple　 　: expr
 * statement　: "if" expr block [ "else" block ]
 * 　　　　　　| "while" expr block
 * 　　　　　　| simple
 * program　　: [ statement ] (";" | EOL)
 */
import { ASTLeaf } from './ast/ASTLeaf';
import { ASTList } from './ast/ASTList';
import { ASTree } from './ast/ASTree';
import { BinaryExpr } from './ast/BinaryExpr';
import { BlockStmnt } from './ast/BlockStmnt';
import { IfStmnt } from './ast/IfStmnt';
import { Name } from './ast/name';
import { NegativeExpr } from './ast/NegativeExpr';
import { NullStmnt } from './ast/NullStmnt';
import { NumberLiteral } from './ast/NumberLiteral';
import { PrimaryExpr } from './ast/PrimaryExpr';
import { StringLiteral } from './ast/StringLiteral';
import { WhileStmnt } from './ast/WhileStmnt';
import { Lexer } from './Lexer';
import {
  FnCreateASTLeaf,
  FnCreateASTList,
  Operators,
  Parser,
  rule,
} from './Parser';
import { Token } from './Token';

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

export class BasicParser {
  private program: Parser;

  constructor() {
    const reserved: Set<string> = new Set();
    reserved.add(';');
    reserved.add('}');
    reserved.add(Token.EOL);

    const operators = new Operators();
    operators.add('=', 1, Operators.RIGHT);
    operators.add('==', 2, Operators.LEFT);
    operators.add('>', 2, Operators.LEFT);
    operators.add('<', 2, Operators.LEFT);
    operators.add('+', 3, Operators.LEFT);
    operators.add('-', 3, Operators.LEFT);
    operators.add('*', 4, Operators.LEFT);
    operators.add('/', 4, Operators.LEFT);
    operators.add('%', 4, Operators.LEFT);

    const expr0: Parser = rule();
    const primary = rule(PrimaryExpr.create).or(
      rule().sep('(').ast(expr0).sep(')'),
      rule().number(leafCreate(NumberLiteral)),
      rule().identifier(reserved, leafCreate(Name)),
      rule().string(leafCreate(StringLiteral))
    );
    const factor = rule().or(
      rule(listCreate(NegativeExpr)).sep('-').ast(primary),
      primary
    );
    const expr = expr0.expression(listCreate(BinaryExpr), factor, operators);

    const statement0 = rule();
    const block = rule(listCreate(BlockStmnt))
      .sep('{')
      .option(statement0)
      .repeat(rule().sep(';', Token.EOL).option(statement0))
      .sep('}');
    const simple = rule(PrimaryExpr.create).ast(expr);
    const statement = statement0.or(
      rule(listCreate(IfStmnt))
        .sep('if')
        .ast(expr)
        .ast(block)
        .option(rule().sep('else').ast(block)),
      rule(listCreate(WhileStmnt)).sep('while').ast(expr).ast(block),
      simple
    );

    this.program = rule()
      .or(statement, rule(listCreate(NullStmnt)))
      .sep(';', Token.EOL);
  }
  parse(lexer: Lexer) {
    return this.program.parse(lexer);
  }
}
