import { EnableArrayEvaluator } from '../chap10/ArrayEvaluator';
import { EnableEnvOptimizer } from '../chap11/EnvOptimizer';
import { EnableVmEvaluator } from '../chap13/VmEvaluator';
import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
import { EnableTypeChecker } from './TypeChecker';
import { TypedInterpreter } from './TypedInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();
// EnableClassEvaluator();
EnableArrayEvaluator();
EnableEnvOptimizer();
// EnableObjOptimizer();
// EnableInlineCache();
EnableVmEvaluator();
EnableTypeChecker();

TypedInterpreter.main('./src/chap14/code1');
