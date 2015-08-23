import { Promise } from 'angular2/src/facade/async';
import { Instruction } from 'angular2/src/router/instruction';
export { canReuse, canDeactivate, onActivate, onReuse, onDeactivate } from './lifecycle_annotations_impl';
export declare var CanActivate: (hook: (next: Instruction, prev: Instruction) => Promise<boolean> | boolean) => ClassDecorator;
