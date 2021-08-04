import { Fun } from './ast/Fun';
import { listCreate } from './BasicParser';
import { rule } from './Parser';
import { FuncParser } from './FuncParser';

export class ClosureParser extends FuncParser {
  constructor() {
    super();
    this.primary.insertChoice(
      rule(listCreate(Fun)).sep('fun').ast(this.paramList).ast(this.block)
    );
  }
}
