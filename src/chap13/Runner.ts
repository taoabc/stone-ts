import { EnableArrayEvaluator } from '../chap10/ArrayEvaluator';
import { EnableEnvOptimizer } from '../chap11/EnvOptimizer';
import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
import { EnableVmEvaluator } from './VmEvaluator';
import { VmInterpreter } from './VmInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
// EnableClosureEvaluator();
EnableNativeEvaluator();
// EnableClassEvaluator();
EnableArrayEvaluator();
EnableEnvOptimizer();
// EnableObjOptimizer();
// EnableInlineCache();
EnableVmEvaluator();

VmInterpreter.main('src/chap13/code');
