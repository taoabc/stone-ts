import { EnableBasicEvaluator } from '../chap6/BasicEvaluator';
import { EnableClosureEvaluator } from './ClosureEvaluator';
import { ClosureInterpreter } from './ClosureInterpreter';
import { EnableFuncEvaluator } from './FuncEvaluator';
import { FuncInterpreter } from './FuncInterpreter';

EnableBasicEvaluator();
EnableFuncEvaluator();
EnableClosureEvaluator();

FuncInterpreter.main('./src/chap7/code');
ClosureInterpreter.main('./src/chap7/closure');
