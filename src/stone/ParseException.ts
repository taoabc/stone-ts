import { Token } from './Token';

export class ParseException extends Error {
  constructor(t: Token, msg: string = '') {
    let location;
    if (t === Token.EOF) location = 'the last line';
    else location = '"' + t.getText() + '" at line ' + t.getLineNumber();
    super('syntax error around ' + location + '. ' + msg);
  }
}
