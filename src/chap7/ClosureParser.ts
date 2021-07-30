import { Fun } from '../stone/ast/Fun';
import { listCreate } from '../stone/BasicParser';
import { rule } from '../stone/Parser';
import { FuncParser } from '../stone/FuncParser';

export class ClosureParser extends FuncParser {
  constructor() {
    super();
    this.primary.insertChoice(
      rule(listCreate(Fun)).sep('fun').ast(this.paramList).ast(this.block)
    );
  }
}
