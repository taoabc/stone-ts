import { astFactory } from '../utils/ASTFactory';
import { ClassBody } from './ast/ClassBody';
import { ClassStmnt } from './ast/ClassStmnt';
import { Dot } from './ast/Dot';
import { ClosureParser } from './ClosureParser';
import { rule } from './Parser';
import { Token } from './Token';

astFactory.setList(ClassBody, ClassStmnt, Dot);

export class ClassParser extends ClosureParser {
  protected member = rule().or(this.def, this.simple);
  protected classBody = rule(astFactory.getListCreator(ClassBody))
    .sep('{')
    .option(this.member)
    .repeat(rule().sep(';', Token.EOL).option(this.member))
    .sep('}');
  protected defclass = rule(astFactory.getListCreator(ClassStmnt))
    .sep('class')
    .identifier(this.reserved)
    .option(rule().sep('extends').identifier(this.reserved))
    .ast(this.classBody);

  constructor() {
    super();
    this.postfix.insertChoice(
      rule(astFactory.getListCreator(Dot)).sep('.').identifier(this.reserved)
    );
    this.program.insertChoice(this.defclass);
  }
}
