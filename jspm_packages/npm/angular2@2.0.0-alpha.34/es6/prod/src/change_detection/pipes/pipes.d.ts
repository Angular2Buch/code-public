import { Pipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
import { Binding } from 'angular2/di';
export declare class Pipes {
    /**
     * Map of {@link Pipe} names to {@link PipeFactory} lists used to configure the
     * {@link Pipes} registry.
     *
     * #Example
     *
     * ```
     * var pipesConfig = {
     *   'json': [jsonPipeFactory]
     * }
     * @Component({
     *   viewBindings: [
     *     bind(Pipes).toValue(new Pipes(pipesConfig))
     *   ]
     * })
     * ```
     */
    config: StringMap<string, PipeFactory[]>;
    constructor(config: StringMap<string, PipeFactory[]>);
    get(type: string, obj: any, cdRef?: ChangeDetectorRef, existingPipe?: Pipe): Pipe;
    /**
     * Takes a {@link Pipes} config object and returns a binding used to extend the
     * inherited {@link Pipes} instance with the provided config and return a new
     * {@link Pipes} instance.
     *
     * If the provided config contains a key that is not yet present in the
     * inherited {@link Pipes}' config, a new {@link PipeFactory} list will be created
     * for that key. Otherwise, the provided config will be merged with the inherited
     * {@link Pipes} instance by prepending pipes to their respective keys, without mutating
     * the inherited {@link Pipes}.
     *
     * The following example shows how to extend an existing list of `async` factories
     * with a new {@link PipeFactory}, which will only be applied to the injector
     * for this component and its children. This step is all that's required to make a new
     * pipe available to this component's template.
     *
     * # Example
     *
     * ```
     * @Component({
     *   viewBindings: [
     *     Pipes.extend({
     *       async: [newAsyncPipe]
     *     })
     *   ]
     * })
     * ```
     */
    static extend(config: StringMap<string, PipeFactory[]>): Binding;
    static create(config: StringMap<string, PipeFactory[]>, pipes?: Pipes): Pipes;
    private _getListOfFactories(type, obj);
    private _getMatchingFactory(listOfFactories, type, obj);
}