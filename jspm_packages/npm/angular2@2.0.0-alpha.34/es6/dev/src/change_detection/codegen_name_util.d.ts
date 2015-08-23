import { DirectiveIndex } from './directive_record';
import { ProtoRecord } from './proto_record';
export declare const CONTEXT_INDEX: number;
/**
 * Returns `s` with all non-identifier characters removed.
 */
export declare function sanitizeName(s: string): string;
/**
 * Class responsible for providing field and local variable names for change detector classes.
 * Also provides some convenience functions, for example, declaring variables, destroying pipes,
 * and dehydrating the detector.
 */
export declare class CodegenNameUtil {
    private records;
    private directiveRecords;
    private utilName;
    /**
     * Record names sanitized for use as fields.
     * See [sanitizeName] for details.
     */
    _sanitizedNames: List<string>;
    constructor(records: List<ProtoRecord>, directiveRecords: List<any>, utilName: string);
    _addFieldPrefix(name: string): string;
    getDispatcherName(): string;
    getPipesAccessorName(): string;
    getProtosName(): string;
    getDirectivesAccessorName(): string;
    getLocalsAccessorName(): string;
    getAlreadyCheckedName(): string;
    getModeName(): string;
    getFirstProtoInCurrentBinding(): string;
    getLocalName(idx: int): string;
    getChangeName(idx: int): string;
    /**
     * Generate a statement initializing local variables used when detecting changes.
     */
    genInitLocals(): string;
    getFieldCount(): int;
    getFieldName(idx: int): string;
    getAllFieldNames(): List<string>;
    /**
     * Generates statements which clear all fields so that the change detector is dehydrated.
     */
    genDehydrateFields(): string;
    /**
     * Generates statements destroying all pipe variables.
     */
    genPipeOnDestroy(): string;
    getPipeName(idx: int): string;
    getAllDirectiveNames(): List<string>;
    getDirectiveName(d: DirectiveIndex): string;
    getAllDetectorNames(): List<string>;
    getDetectorName(d: DirectiveIndex): string;
}
