import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
import { EnableClassEvaluator } from '../chap9/ClassEvaluator';
import { EnableArrayEvaluator } from './ArrayEvaluator';
import { ArrayInterpreter } from './ArrayInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();
EnableClassEvaluator();
EnableArrayEvaluator();

ArrayInterpreter.main('./src/chap10/array.stone');
