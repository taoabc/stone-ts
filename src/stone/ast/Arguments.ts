import { Postfix } from './Postfix';

export class Arguments extends Postfix {
  static CLASS_ID = 'Arguments';
  size(): number {
    return this.numChildren();
  }

  classId(): string {
    return Arguments.CLASS_ID;
  }
}
