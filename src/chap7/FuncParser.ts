import { Arguments } from '../stone/ast/Arguments';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { ParameterList } from '../stone/ast/ParameterList';
import { BasicParser, listCreate } from '../stone/BasicParser';
import { rule } from '../stone/Parser';

export class FuncParser extends BasicParser {
  private param = rule().identifier(this.reserved);
  private params = rule(listCreate(ParameterList))
    .ast(this.param)
    .repeat(rule().sep(',').ast(this.param));
  private paramList = rule().sep('(').maybe(this.params).sep(')'); // 形参定义
  private def = rule(listCreate(DefStmnt))
    .sep('def')
    .identifier(this.reserved)
    .ast(this.paramList)
    .ast(this.block);
  // 实参调用
  private args = rule(listCreate(Arguments))
    .ast(this.expr)
    .repeat(rule().sep(',').ast(this.expr));
  private postfix = rule().sep('(').maybe(this.args).sep(')');

  constructor() {
    super();
    this.reserved.add(')');
    this.primary.repeat(this.postfix); // primary maybe func()
    this.simple.option(this.args);
    // insertChoice后的结果如下，只是为了本文的拆分，定义了insertChoice
    // Parser program = rule().or(def, statement, rule(NullStmnt.class))
    //                    .sep(";", Token.EOL);
    this.program.insertChoice(this.def);
  }
}
