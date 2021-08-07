import { Fun } from './ast/Fun';
import { rule } from './Parser';
import { FuncParser } from './FuncParser';
import { astFactory } from '../utils/ASTFactory';

astFactory.setList(Fun);

export class ClosureParser extends FuncParser {
  constructor() {
    super();
    this.primary.insertChoice(
      rule(astFactory.getListCreator(Fun))
        .sep('fun')
        .ast(this.paramList)
        .ast(this.block)
    );
  }
}
