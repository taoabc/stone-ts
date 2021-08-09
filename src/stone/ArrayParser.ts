import { astFactory } from '../utils/ASTFactory';
import { ArrayLiteral } from './ast/ArrayLiteral';
import { ArrayRef } from './ast/ArrayRef';
import { FuncParser } from './FuncParser';
import { rule } from './Parser';

astFactory.setList(ArrayLiteral, ArrayRef);

export class ArrayParser extends FuncParser {
  protected elements = rule(astFactory.getListCreator(ArrayLiteral))
    .ast(this.expr)
    .repeat(rule().sep(',').ast(this.expr));
  constructor() {
    super();
    this.reserved.add(']');
    this.primary.insertChoice(rule().sep('[').maybe(this.elements).sep(']'));
    this.postfix.insertChoice(
      rule(astFactory.getListCreator(ArrayRef)).sep('[').ast(this.expr).sep(']')
    );
  }
}
