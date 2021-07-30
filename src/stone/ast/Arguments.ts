import { Postfix } from './Postfix';

export class Arguments extends Postfix {
  size(): number {
    return this.numChildren();
  }
}
