import { Environment } from '../chap6/Environment';
import { NativeFunction } from './NativeFunction';

export class Natives {
  environment(env: Environment) {
    this.appendNatives(env);
    return env;
  }
  appendNatives(env: Environment) {
    this.append(env, 'print', Natives.print);
    this.append(env, 'len', Natives.len);
    this.append(env, 'toInt', Natives.toInt);
    this.append(env, 'currentTime', Natives.currentTime);
  }
  append(env: Environment, name: string, method: any) {
    env.put(name, new NativeFunction(name, method));
  }

  static print(...args: unknown[]) {
    console.log(...args);
  }
  static len(s: string) {
    return s.length;
  }
  static toInt(value: string) {
    return parseInt(value);
  }
  private static startTime = Date.now();
  static currentTime() {
    return Date.now() - Natives.startTime;
  }
}
