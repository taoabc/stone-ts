import { astFactory } from '../utils/ASTFactory';
import { TypeTag } from './ast/TypedTag';
import { VarStmnt } from './ast/VarStmnt';
import { FuncParser } from './FuncParser';
import { rule } from './Parser';

astFactory.setList(TypeTag, VarStmnt);

export class TypedParser extends FuncParser {
  protected typeTag = rule(astFactory.getListCreator(TypeTag))
    .sep(':')
    .identifier(this.reserved);
  protected variable = rule(astFactory.getListCreator(VarStmnt))
    .sep('var')
    .identifier(this.reserved)
    .maybe(this.typeTag)
    .sep('=')
    .ast(this.expr);
  constructor() {
    super();
    this.reserved.add(':');
    this.param.maybe(this.typeTag);
    this.def
      .resetElement()
      .sep('def')
      .identifier(this.reserved)
      .ast(this.paramList)
      .maybe(this.typeTag)
      .ast(this.block);
    this.statement.insertChoice(this.variable);
  }
}
