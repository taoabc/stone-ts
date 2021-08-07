import { EnableArrayEvaluator } from '../chap10/ArrayEvaluator';
import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
// import { EnableClassEvaluator } from '../chap9/ClassEvaluator';
import { EnableEnvOptimizer } from './EnvOptimizer';
import { EnvOptInterpreter } from './EnvOptInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();
// EnableClassEvaluator();
EnableArrayEvaluator();
EnableEnvOptimizer();

EnvOptInterpreter.main('./src/chap8/fib.stone');
