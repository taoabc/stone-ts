import { NativeInterpreter } from './NativeInterpreter';
import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableNativeEvaluator } from './NativeEvaluator';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();

NativeInterpreter.main('./src/chap8/fib.stone');
