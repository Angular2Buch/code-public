import {ProtoViewRef} from 'angular2/src/core/linker/view_ref';
import {ProtoViewFactory} from 'angular2/src/core/linker/proto_view_factory';

import {Injectable} from 'angular2/src/core/di';
import {Type, isBlank, stringify} from 'angular2/src/core/facade/lang';
import {BaseException} from 'angular2/src/core/facade/exceptions';
import {Promise, PromiseWrapper} from 'angular2/src/core/facade/async';
import {reflector} from 'angular2/src/core/reflection/reflection';
import {CompiledHostTemplate} from 'angular2/src/core/linker/template_commands';

/**
 * Low-level service for compiling {@link Component}s into {@link ProtoViewRef ProtoViews}s, which
 * can later be used to create and render a Component instance.
 *
 * Most applications should instead use higher-level {@link DynamicComponentLoader} service, which
 * both compiles and instantiates a Component.
 */
@Injectable()
export class Compiler {
  /**
   * @private
   */
  constructor(private _protoViewFactory: ProtoViewFactory) {}

  compileInHost(componentType: Type): Promise<ProtoViewRef> {
    var metadatas = reflector.annotations(componentType);
    var compiledHostTemplate = null;
    for (var i = 0; i < metadatas.length; i++) {
      var metadata = metadatas[i];
      if (metadata instanceof CompiledHostTemplate) {
        compiledHostTemplate = metadata;
        break;
      }
    }
    if (isBlank(compiledHostTemplate)) {
      throw new BaseException(
          `No precompiled template for component ${stringify(componentType)} found`);
    }
    return PromiseWrapper.resolve(this._createProtoView(compiledHostTemplate));
  }

  private _createProtoView(compiledHostTemplate: CompiledHostTemplate): ProtoViewRef {
    return this._protoViewFactory.createHost(compiledHostTemplate).ref;
  }

  clearCache() { this._protoViewFactory.clearCache(); }
}

export function internalCreateProtoView(compiler: Compiler,
                                        compiledHostTemplate: CompiledHostTemplate): ProtoViewRef {
  return (<any>compiler)._createProtoView(compiledHostTemplate);
}
