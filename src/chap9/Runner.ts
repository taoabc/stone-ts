import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
import { EnableClassEvaluator } from './ClassEvaluator';
import { ClassInterpreter } from './ClassInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();
EnableClassEvaluator();

ClassInterpreter.main('./src/chap9/code');
