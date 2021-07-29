import { ASTree } from './ast/ASTree';

export class StoneException extends Error {
  constructor(m: string, t?: ASTree) {
    if (t) {
      super(m + ' ' + t.location());
    } else {
      super(m);
    }
  }
}
