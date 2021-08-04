import { Environment } from '../chap6/Environment';
import { EnvEx } from '../chap7/FuncEvaluator';

// StoneObject 做的事就是确保 Env 不跑到上层env去
export class StoneObject {
  constructor(protected env: Environment) {}
  read(member: string): unknown {
    return this.getEnv(member).get(member);
  }
  write(member: string, value: unknown): void {
    (this.getEnv(member) as EnvEx).putNew(member, value);
  }
  // 找到自己的env，不要上层
  protected getEnv(member: string): Environment {
    const e = (this.env as EnvEx).where(member);
    if (e != null && e == this.env) return e;
    else throw new Error('access exception');
  }
}
