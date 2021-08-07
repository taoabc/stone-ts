import { ClosureInterpreter } from './ClosureInterpreter';
import { FuncInterpreter } from './FuncInterpreter';
import '../chap6/BasicEvaluator';
import './FuncEvaluator';
import './ClosureEvaluator';

FuncInterpreter.main('./src/chap7/code');
ClosureInterpreter.main('./src/chap7/closure');
