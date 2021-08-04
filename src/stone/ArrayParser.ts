import { ArrayLiteral } from './ast/ArrayLiteral';
import { ArrayRef } from './ast/ArrayRef';
import { listCreate } from './BasicParser';
import { FuncParser } from './FuncParser';
import { rule } from './Parser';

// TODO [stirng, stirng] 有BUG
export class ArrayParser extends FuncParser {
  protected elements = rule(listCreate(ArrayLiteral))
    .ast(this.expr)
    .repeat(rule().sep(',').ast(this.expr));
  constructor() {
    super();
    this.reserved.add(']');
    this.primary.insertChoice(rule().sep('[').maybe(this.elements).sep(']'));
    this.postfix.insertChoice(
      rule(listCreate(ArrayRef)).sep('[').ast(this.expr).sep(']')
    );
  }
}
