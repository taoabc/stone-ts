import { ASTLeaf } from './ast/ASTLeaf';
import { ASTList } from './ast/ASTList';
import { ASTree } from './ast/ASTree';
import { Lexer } from './Lexer';
import { ParseException } from './ParseException';
import { Token } from './Token';

export type FnCreateASTLeaf = (token: Token) => ASTree;
export type FnCreateASTList = (list: ASTree[]) => ASTree;

interface Element {
  parse(lexer: Lexer, res: ASTree[]): void;
  match(lexer: Lexer): boolean;
  // TODO 先使用判断来解决多态问题
  // isOrTree(): boolean;
}

class Tree implements Element {
  constructor(private parser: Parser) {}
  parse(lexer: Lexer, res: ASTree[]): void {
    res.push(this.parser.parse(lexer));
  }
  match(lexer: Lexer): boolean {
    return this.parser.match(lexer);
  }
}

class OrTree implements Element {
  constructor(private parsers: Parser[]) {}
  parse(lexer: Lexer, res: ASTree[]): void {
    const p = this.choose(lexer);
    if (p == null) throw new ParseException(lexer.peek(0));
    else res.push(p.parse(lexer));
  }
  match(lexer: Lexer): boolean {
    return this.choose(lexer) != null;
  }
  choose(lexer: Lexer): Parser | void {
    for (const p of this.parsers) {
      if (p.match(lexer)) {
        return p;
      }
    }
  }
  insert(p: Parser): void {
    this.parsers.unshift(p);
  }
}

class Repeat implements Element {
  constructor(private parser: Parser, private onlyOnce: boolean) {}
  parse(lexer: Lexer, res: ASTree[]): void {
    while (this.parser.match(lexer)) {
      const t = this.parser.parse(lexer);
      // not just ASTList or is leaf
      // TODO 这个地方的判断要千万小心
      if (t.classId() !== ASTList.CLASS_ID || t.numChildren() > 0) res.push(t);
      if (this.onlyOnce) break;
    }
  }
  match(lexer: Lexer): boolean {
    return this.parser.match(lexer);
  }
}

class AToken implements Element {
  private factory: Factory;
  constructor(fnCreate?: FnCreateASTLeaf) {
    fnCreate = fnCreate || ((token: Token) => new ASTLeaf(token));
    this.factory = Factory.getForASTLeaf(fnCreate);
  }
  parse(lexer: Lexer, res: ASTree[]): void {
    const t = lexer.read();
    if (this.test(t)) {
      const leaf = this.factory.make(t);
      res.push(leaf);
    } else {
      throw new ParseException(t);
    }
  }
  match(lexer: Lexer): boolean {
    return this.test(lexer.peek(0));
  }
  test(t: Token): boolean {
    throw new Error('except subclass impl');
  }
}

class IdToken extends AToken {
  constructor(private reserved: Set<string>, fnCreate?: FnCreateASTLeaf) {
    super(fnCreate);
  }
  test(t: Token): boolean {
    return t.isIdentifier() && !this.reserved.has(t.getText());
  }
}

class NumToken extends AToken {
  constructor(fnCreate?: FnCreateASTLeaf) {
    super(fnCreate);
  }
  test(t: Token): boolean {
    return t.isNumber();
  }
}

class StrToken extends AToken {
  constructor(fnCreate?: FnCreateASTLeaf) {
    super(fnCreate);
  }
  test(t: Token): boolean {
    return t.isString();
  }
}

class Leaf implements Element {
  constructor(private tokens: string[]) {}
  parse(lexer: Lexer, res: ASTree[]): void {
    const t = lexer.read();
    if (t.isIdentifier()) {
      for (const token of this.tokens) {
        if (t.getText() === token) {
          this.find(res, t);
          return;
        }
      }
    }

    if (this.tokens.length > 0)
      throw new ParseException(t, this.tokens[0] + ' exptected.');
    else throw new ParseException(t);
  }
  match(lexer: Lexer): boolean {
    const t = lexer.peek(0);
    if (t.isIdentifier()) {
      for (const token of this.tokens) {
        if (t.getText() === token) {
          return true;
        }
      }
    }
    return false;
  }
  find(res: ASTree[], t: Token): void {
    res.push(new ASTLeaf(t));
  }
}

class Skip extends Leaf {
  constructor(t: string[]) {
    super(t);
  }
  find(res: ASTree[], t: Token): void {}
}

class Precedence {
  constructor(public value: number, public leftAssoc: boolean) {}
}

export class Operators extends Map<string, Precedence> {
  static LEFT = true;
  static RIGHT = false;
  add(name: string, prec: number, leftAssoc: boolean) {
    this.set(name, new Precedence(prec, leftAssoc));
  }
}

class Expr implements Element {
  private factory: Factory;
  constructor(
    fnCreate: FnCreateASTList | undefined,
    private factor: Parser,
    private ops: Operators
  ) {
    this.factory = Factory.getForASTList(fnCreate);
  }
  // 最终只求出一个节点 right
  parse(lexer: Lexer, res: ASTree[]): void {
    let right = this.factor.parse(lexer);
    let prec: Precedence | void;
    // 循环向后求right
    while ((prec = this.nextOperator(lexer)) != null)
      right = this.doShift(lexer, right, prec.value);
    res.push(right);
  }
  match(lexer: Lexer): boolean {
    return this.factor.match(lexer);
  }
  doShift(lexer: Lexer, left: ASTree, prec: number): ASTree {
    const list: ASTree[] = [];
    list.push(left);
    list.push(new ASTLeaf(lexer.read()));
    let right = this.factor.parse(lexer);
    let next: Precedence | void;
    while (
      (next = this.nextOperator(lexer)) != null &&
      this.rightIsExpr(prec, next)
    )
      right = this.doShift(lexer, right, next.value);
    list.push(right);
    return this.factory.make(list);
  }
  nextOperator(lexer: Lexer): Precedence | void {
    const t = lexer.peek(0);
    if (t.isIdentifier()) {
      return this.ops.get(t.getText());
    }
  }
  rightIsExpr(prec: number, nextPrec: Precedence): boolean {
    if (nextPrec.leftAssoc) return prec < nextPrec.value;
    else return prec <= nextPrec.value;
  }
}

type FnMake0 = (arg: ASTree[] | Token) => ASTree;
class Factory {
  constructor(private make0: FnMake0) {}

  static getForASTLeaf(fnCreate: FnCreateASTLeaf): Factory {
    let make0: FnMake0 = (arg: ASTree[] | Token) => {
      if (Array.isArray(arg)) throw new Error('except Token');
      return fnCreate(arg);
    };
    return new Factory(make0);
  }

  static getForASTList(fnCreate?: FnCreateASTList): Factory {
    let make0: FnMake0;
    if (fnCreate == null) {
      make0 = (arg: ASTree[] | Token) => {
        if (!Array.isArray(arg)) throw new Error('except ASTree[]');
        if (arg.length === 1) return arg[0];
        else return new ASTList(arg);
      };
    } else {
      make0 = (arg: ASTree[] | Token) => {
        if (!Array.isArray(arg)) throw new Error('except ASTree[]');
        return fnCreate(arg);
      };
    }
    return new Factory(make0);
  }

  make(arg: ASTree[] | Token): ASTree {
    return this.make0(arg);
  }
}

export class Parser {
  // element 为孩子规则
  private elements: Element[] = [];
  // 最终由factory来生成ASTree
  private factory!: Factory;
  static from(p: Parser): Parser {
    let parser = new Parser();
    parser.elements = p.elements;
    parser.factory = p.factory;
    return parser;
  }
  parse(lexer: Lexer): ASTree {
    const results: ASTree[] = [];
    for (const e of this.elements) e.parse(lexer, results);
    // 生成parser对应的根节点
    return this.factory.make(results);
  }
  match(lexer: Lexer): boolean {
    if (this.elements.length === 0) return true;
    else {
      const e = this.elements[0];
      return e.match(lexer);
    }
  }
  resetElement(): Parser {
    this.elements = [];
    return this;
  }
  reset(fnCreate?: FnCreateASTList): Parser {
    this.elements = [];
    this.factory = Factory.getForASTList(fnCreate);
    return this;
  }
  number(fnCreate?: FnCreateASTLeaf): Parser {
    this.elements.push(new NumToken(fnCreate));
    return this;
  }
  identifier(reserved: Set<string>, fnCreate?: FnCreateASTLeaf): Parser {
    this.elements.push(new IdToken(reserved, fnCreate));
    return this;
  }
  string(fnCreate?: FnCreateASTLeaf): Parser {
    this.elements.push(new StrToken(fnCreate));
    return this;
  }
  token(...pat: string[]): Parser {
    this.elements.push(new Leaf(pat));
    return this;
  }
  sep(...pat: string[]): Parser {
    this.elements.push(new Skip(pat));
    return this;
  }
  // 向语法规则中添加非终结符 p
  ast(p: Parser): Parser {
    this.elements.push(new Tree(p));
    return this;
  }
  or(...p: Parser[]): Parser {
    this.elements.push(new OrTree(p));
    return this;
  }
  maybe(p: Parser): Parser {
    const p2 = Parser.from(p);
    p2.resetElement();
    this.elements.push(new OrTree([p, p2]));
    return this;
  }
  option(p: Parser): Parser {
    this.elements.push(new Repeat(p, true));
    return this;
  }
  repeat(p: Parser): Parser {
    this.elements.push(new Repeat(p, false));
    return this;
  }
  // 特殊的表达式类型，需要接收工厂函数、子表达式、操作符
  expression(
    fnCreate: FnCreateASTList | undefined,
    subexp: Parser,
    operators: Operators
  ): Parser {
    this.elements.push(new Expr(fnCreate, subexp, operators));
    return this;
  }
  // 语法规则起始处的 or添加新的分支选项
  insertChoice(p: Parser): Parser {
    const e = this.elements[0];
    if (e instanceof OrTree) (e as OrTree).insert(p);
    else {
      const otherwise = Parser.from(this);
      this.reset();
      this.or(p, otherwise);
    }
    return this;
  }
}

// 根节点只可能为list节点
// rule 不传，则表示创建一个ASTList，而创建一个ASTList会根据是否只有一个children来进行
// rule 如果有值，则只能接收一个 ASTList 或者派生类的工厂函数
// rule 的参数表示是一个什么样的节点，如果不传入，则在只有一个子节点的时候，直接返回该子节点
// 但是对于NegativeExpr，则不能这样
// 如果调用需要返回Stmnt，需要考虑传入工厂函数
export function rule(fnCreate?: FnCreateASTList): Parser {
  let p = new Parser();
  p.reset(fnCreate);
  return p;
}
