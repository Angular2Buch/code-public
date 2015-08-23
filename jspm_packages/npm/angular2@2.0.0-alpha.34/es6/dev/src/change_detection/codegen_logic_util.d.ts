import { CodegenNameUtil } from './codegen_name_util';
import { ProtoRecord } from './proto_record';
/**
 * Class responsible for providing change detection logic for chagne detector classes.
 */
export declare class CodegenLogicUtil {
    private _names;
    private _utilName;
    constructor(_names: CodegenNameUtil, _utilName: string);
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record.
     */
    genUpdateCurrentValue(protoRec: ProtoRecord): string;
    _genInterpolation(protoRec: ProtoRecord): string;
}
