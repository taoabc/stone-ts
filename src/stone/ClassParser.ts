import { ClassBody } from './ast/ClassBody';
import { ClassStmnt } from './ast/ClassStmnt';
import { Dot } from './ast/Dot';
import { listCreate } from './BasicParser';
import { ClosureParser } from './ClosureParser';
import { rule } from './Parser';
import { Token } from './Token';

export class ClassParser extends ClosureParser {
  protected member = rule().or(this.def, this.simple);
  protected classBody = rule(listCreate(ClassBody))
    .sep('{')
    .option(this.member)
    .repeat(rule().sep(';', Token.EOL).option(this.member))
    .sep('}');
  protected defclass = rule(listCreate(ClassStmnt))
    .sep('class')
    .identifier(this.reserved)
    .option(rule().sep('extends').identifier(this.reserved))
    .ast(this.classBody);

  constructor() {
    super();
    this.postfix.insertChoice(
      rule(listCreate(Dot)).sep('.').identifier(this.reserved)
    );
    this.program.insertChoice(this.defclass);
  }
}
