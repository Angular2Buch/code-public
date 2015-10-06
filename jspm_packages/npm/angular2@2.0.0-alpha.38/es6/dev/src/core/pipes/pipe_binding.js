/* */ 
"format cjs";
import { resolveBinding } from 'angular2/src/core/di/binding';
import { ResolvedBinding, Binding } from 'angular2/src/core/di';
export class PipeBinding extends ResolvedBinding {
    constructor(name, pure, key, resolvedFactories, multiBinding) {
        super(key, resolvedFactories, multiBinding);
        this.name = name;
        this.pure = pure;
    }
    static createFromType(type, metadata) {
        var binding = new Binding(type, { toClass: type });
        var rb = resolveBinding(binding);
        return new PipeBinding(metadata.name, metadata.pure, rb.key, rb.resolvedFactories, rb.multiBinding);
    }
}
//# sourceMappingURL=pipe_binding.js.map