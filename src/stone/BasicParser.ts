/**
 * { pat } 模式 pat 至少重复0 次
 * [ pat ] 与重复出现0 次或1 次的模式 pat 匹配
 * pat1 | pat2 与 pat1或 pat2 匹配
 * ()将括号内视为一个完整的模式
 *
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
import { astFactory } from '../utils/ASTFactory';
import { ASTLeaf } from './ast/ASTLeaf';
import { ASTList } from './ast/ASTList';
import { ASTree } from './ast/ASTree';
import { BinaryExpr } from './ast/BinaryExpr';
import { BlockStmnt } from './ast/BlockStmnt';
import { IfStmnt } from './ast/IfStmnt';
import { Name } from './ast/Name';
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

export function listCreate<T extends ASTList>(
  classType: new (t: ASTree[]) => T
): FnCreateASTList {
  return (t: ASTree[]) => new classType(t);
}

// export function leafCreate<T extends ASTLeaf>(
//   classType: new (t: Token) => T
// ): FnCreateASTLeaf {
//   return (t: Token) => new classType(t);
// }

export function leafCreate(classType: typeof ASTLeaf): FnCreateASTLeaf {
  return (t: Token) => new classType(t);
}

function createPrimaryExpr(c: ASTree[]): ASTree {
  if (c.length === 1) return c[0];
  const PrimaryC = astFactory.getList(PrimaryExpr);
  return new PrimaryC(c);
}

astFactory.setLeaf(ASTLeaf, NumberLiteral, Name, StringLiteral);

astFactory.setList(
  ASTList,
  PrimaryExpr,
  NegativeExpr,
  BinaryExpr,
  BlockStmnt,
  IfStmnt,
  WhileStmnt,
  NullStmnt
);
astFactory.setListCreator(PrimaryExpr, createPrimaryExpr);

export class BasicParser {
  protected reserved: Set<string> = new Set();
  protected operators = new Operators();
  // 注意这里使用的引用
  protected expr0: Parser = rule();
  protected primary = rule(astFactory.getListCreator(PrimaryExpr)).or(
    rule().sep('(').ast(this.expr0).sep(')'),
    rule().number(astFactory.getLeafCreator(NumberLiteral)),
    rule().identifier(this.reserved, astFactory.getLeafCreator(Name)),
    rule().string(astFactory.getLeafCreator(StringLiteral))
  );
  protected factor = rule().or(
    rule(astFactory.getListCreator(NegativeExpr)).sep('-').ast(this.primary),
    this.primary
  );
  protected expr = this.expr0.expression(
    astFactory.getListCreator(BinaryExpr),
    this.factor,
    this.operators
  );
  protected statement0 = rule();
  protected block = rule(astFactory.getListCreator(BlockStmnt))
    .sep('{')
    .option(this.statement0)
    .repeat(rule().sep(';', Token.EOL).option(this.statement0))
    .sep('}');
  protected simple = rule(astFactory.getListCreator(PrimaryExpr)).ast(
    this.expr
  );
  protected statement = this.statement0.or(
    rule(astFactory.getListCreator(IfStmnt))
      .sep('if')
      .ast(this.expr)
      .ast(this.block)
      .option(rule().sep('else').ast(this.block)),
    rule(astFactory.getListCreator(WhileStmnt))
      .sep('while')
      .ast(this.expr)
      .ast(this.block),
    this.simple
  );

  protected program = rule()
    .or(this.statement, rule(astFactory.getListCreator(NullStmnt)))
    .sep(';', Token.EOL);

  constructor() {
    this.reserved.add(';');
    this.reserved.add('}');
    this.reserved.add(Token.EOL);

    this.operators.add('=', 1, Operators.RIGHT);
    this.operators.add('==', 2, Operators.LEFT);
    this.operators.add('>', 2, Operators.LEFT);
    this.operators.add('<', 2, Operators.LEFT);
    this.operators.add('+', 3, Operators.LEFT);
    this.operators.add('-', 3, Operators.LEFT);
    this.operators.add('*', 4, Operators.LEFT);
    this.operators.add('/', 4, Operators.LEFT);
    this.operators.add('%', 4, Operators.LEFT);
  }
  parse(lexer: Lexer) {
    return this.program.parse(lexer);
  }
}
