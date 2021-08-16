import { EnvEx2 } from '../chap11/EnvOptimizer';
import { Environment } from '../chap6/Environment';
import { Natives } from '../chap8/Natives';
import { TypeEnv } from './TypeEnv';
import { TypeInfo } from './TypeInfo';

export class TypedNatives extends Natives {
  constructor(protected typeEnv: TypeEnv) {
    super();
  }
  appendType(
    env: Environment,
    name: string,
    method: any,
    munOfParams: number,
    type: TypeInfo
  ) {
    this.append(env, name, method, munOfParams);
    const index = (env as EnvEx2).symbols().find(name);
    if (index == null) throw new Error('unexcepted null');
    this.typeEnv.put(0, index, type);
  }
  appendNatives(env: Environment) {
    this.appendType(
      env,
      'print',
      Natives.print,
      -1,
      TypeInfo.function(TypeInfo.INT, TypeInfo.ANY)
    );
    this.appendType(
      env,
      'len',
      Natives.len,
      1,
      TypeInfo.function(TypeInfo.INT, TypeInfo.STRING)
    );
    this.appendType(
      env,
      'toInt',
      Natives.toInt,
      1,
      TypeInfo.function(TypeInfo.INT, TypeInfo.ANY)
    );
    this.appendType(
      env,
      'currentTime',
      Natives.currentTime,
      0,
      TypeInfo.function(TypeInfo.INT)
    );
  }
}
