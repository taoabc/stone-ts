import { astFactory } from '../utils/ASTFactory';
import { Arguments } from './ast/Arguments';
import { DefStmnt } from './ast/DefStmnt';
import { ParameterList } from './ast/ParameterList';
import { BasicParser } from './BasicParser';
import { rule } from './Parser';

astFactory.setList(ParameterList, DefStmnt, Arguments);

export class FuncParser extends BasicParser {
  protected param = rule().identifier(this.reserved);
  protected params = rule(astFactory.getListCreator(ParameterList))
    .ast(this.param)
    .repeat(rule().sep(',').ast(this.param));
  protected paramList = rule().sep('(').maybe(this.params).sep(')'); // 形参定义
  protected def = rule(astFactory.getListCreator(DefStmnt))
    .sep('def')
    .identifier(this.reserved)
    .ast(this.paramList)
    .ast(this.block);
  // 实参调用
  protected args = rule(astFactory.getListCreator(Arguments))
    .ast(this.expr)
    .repeat(rule().sep(',').ast(this.expr));
  protected postfix = rule().sep('(').maybe(this.args).sep(')');

  constructor() {
    super();
    this.reserved.add(')');
    this.primary.repeat(this.postfix); // primary maybe func()
    this.simple.option(this.args);
    // insertChoice后的结果如下，只是为了本文的拆分，定义了insertChoice
    // Parser program = rule().or(def, statement, rule(NullStmnt.class))
    //                    .sep(";", Token.EOL);
    this.program.insertChoice(this.def);

    // this.program = rule()
    //   .ast(
    //     rule(PrimaryExpr.create)
    //       .identifier(this.reserved, leafCreate(Name))
    //       .repeat(this.postfix)
    //   )
    //   .sep(';', '\\n');
  }
}
