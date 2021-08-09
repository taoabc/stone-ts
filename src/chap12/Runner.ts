import { EnableArrayEvaluator } from '../chap10/ArrayEvaluator';
import { EnableEnvOptimizer } from '../chap11/EnvOptimizer';
import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from '../chap7/ClosureEvaluator';
import { EnableFuncEvaluator } from '../chap7/FuncEvaluator';
import { EnableNativeEvaluator } from '../chap8/NativeEvaluator';
import { EnableClassEvaluator } from '../chap9/ClassEvaluator';
import { EnableObjOptimizer } from './ObjOptimizer';
import { ObjOptInterpreter } from './ObjOptInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();
EnableNativeEvaluator();
EnableClassEvaluator();
EnableArrayEvaluator();
EnableEnvOptimizer();
EnableObjOptimizer();

ObjOptInterpreter.main('./src/chap12/code');
