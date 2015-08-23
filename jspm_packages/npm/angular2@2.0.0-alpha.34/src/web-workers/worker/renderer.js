/* */ 
(function(process) {
  'use strict';
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
      case 2:
        return decorators.reduceRight(function(o, d) {
          return (d && d(o)) || o;
        }, target);
      case 3:
        return decorators.reduceRight(function(o, d) {
          return (d && d(target, key)), void 0;
        }, void 0);
      case 4:
        return decorators.reduceRight(function(o, d) {
          return (d && d(target, key, o)) || o;
        }, desc);
    }
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var api_1 = require("../../render/api");
  var broker_1 = require("./broker");
  var lang_1 = require("../../facade/lang");
  var di_1 = require("../../../di");
  var render_view_with_fragments_store_1 = require("../shared/render_view_with_fragments_store");
  var api_2 = require("../shared/api");
  var WorkerCompiler = (function() {
    function WorkerCompiler(_messageBroker) {
      this._messageBroker = _messageBroker;
    }
    WorkerCompiler.prototype.compileHost = function(directiveMetadata) {
      var fnArgs = [new broker_1.FnArg(directiveMetadata, api_1.DirectiveMetadata)];
      var args = new broker_1.UiArguments("compiler", "compileHost", fnArgs);
      return this._messageBroker.runOnUiThread(args, api_1.ProtoViewDto);
    };
    WorkerCompiler.prototype.compile = function(view) {
      var fnArgs = [new broker_1.FnArg(view, api_1.ViewDefinition)];
      var args = new broker_1.UiArguments("compiler", "compile", fnArgs);
      return this._messageBroker.runOnUiThread(args, api_1.ProtoViewDto);
    };
    WorkerCompiler.prototype.mergeProtoViewsRecursively = function(protoViewRefs) {
      var fnArgs = [new broker_1.FnArg(protoViewRefs, api_1.RenderProtoViewRef)];
      var args = new broker_1.UiArguments("compiler", "mergeProtoViewsRecursively", fnArgs);
      return this._messageBroker.runOnUiThread(args, api_1.RenderProtoViewMergeMapping);
    };
    WorkerCompiler = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [broker_1.MessageBroker])], WorkerCompiler);
    return WorkerCompiler;
  })();
  exports.WorkerCompiler = WorkerCompiler;
  var WorkerRenderer = (function() {
    function WorkerRenderer(_messageBroker, _renderViewStore) {
      this._messageBroker = _messageBroker;
      this._renderViewStore = _renderViewStore;
    }
    WorkerRenderer.prototype.createRootHostView = function(hostProtoViewRef, fragmentCount, hostElementSelector) {
      return this._createViewHelper(hostProtoViewRef, fragmentCount, hostElementSelector);
    };
    WorkerRenderer.prototype.createView = function(protoViewRef, fragmentCount) {
      return this._createViewHelper(protoViewRef, fragmentCount);
    };
    WorkerRenderer.prototype._createViewHelper = function(protoViewRef, fragmentCount, hostElementSelector) {
      var renderViewWithFragments = this._renderViewStore.allocate(fragmentCount);
      var startIndex = (renderViewWithFragments.viewRef).refNumber;
      var fnArgs = [new broker_1.FnArg(protoViewRef, api_1.RenderProtoViewRef), new broker_1.FnArg(fragmentCount, null)];
      var method = "createView";
      if (lang_1.isPresent(hostElementSelector) && hostElementSelector != null) {
        fnArgs.push(new broker_1.FnArg(hostElementSelector, null));
        method = "createRootHostView";
      }
      fnArgs.push(new broker_1.FnArg(startIndex, null));
      var args = new broker_1.UiArguments("renderer", method, fnArgs);
      this._messageBroker.runOnUiThread(args, null);
      return renderViewWithFragments;
    };
    WorkerRenderer.prototype.destroyView = function(viewRef) {
      var fnArgs = [new broker_1.FnArg(viewRef, api_1.RenderViewRef)];
      var args = new broker_1.UiArguments("renderer", "destroyView", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.attachFragmentAfterFragment = function(previousFragmentRef, fragmentRef) {
      var fnArgs = [new broker_1.FnArg(previousFragmentRef, api_1.RenderFragmentRef), new broker_1.FnArg(fragmentRef, api_1.RenderFragmentRef)];
      var args = new broker_1.UiArguments("renderer", "attachFragmentAfterFragment", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.attachFragmentAfterElement = function(elementRef, fragmentRef) {
      var fnArgs = [new broker_1.FnArg(elementRef, api_2.WorkerElementRef), new broker_1.FnArg(fragmentRef, api_1.RenderFragmentRef)];
      var args = new broker_1.UiArguments("renderer", "attachFragmentAfterElement", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.detachFragment = function(fragmentRef) {
      var fnArgs = [new broker_1.FnArg(fragmentRef, api_1.RenderFragmentRef)];
      var args = new broker_1.UiArguments("renderer", "detachFragment", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.hydrateView = function(viewRef) {
      var fnArgs = [new broker_1.FnArg(viewRef, api_1.RenderViewRef)];
      var args = new broker_1.UiArguments("renderer", "hydrateView", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.dehydrateView = function(viewRef) {
      var fnArgs = [new broker_1.FnArg(viewRef, api_1.RenderViewRef)];
      var args = new broker_1.UiArguments("renderer", "dehydrateView", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.getNativeElementSync = function(location) {
      return null;
    };
    WorkerRenderer.prototype.setElementProperty = function(location, propertyName, propertyValue) {
      var fnArgs = [new broker_1.FnArg(location, api_2.WorkerElementRef), new broker_1.FnArg(propertyName, null), new broker_1.FnArg(propertyValue, null)];
      var args = new broker_1.UiArguments("renderer", "setElementProperty", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.setElementAttribute = function(location, attributeName, attributeValue) {
      var fnArgs = [new broker_1.FnArg(location, api_2.WorkerElementRef), new broker_1.FnArg(attributeName, null), new broker_1.FnArg(attributeValue, null)];
      var args = new broker_1.UiArguments("renderer", "setElementAttribute", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.setElementClass = function(location, className, isAdd) {
      var fnArgs = [new broker_1.FnArg(location, api_2.WorkerElementRef), new broker_1.FnArg(className, null), new broker_1.FnArg(isAdd, null)];
      var args = new broker_1.UiArguments("renderer", "setElementClass", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.setElementStyle = function(location, styleName, styleValue) {
      var fnArgs = [new broker_1.FnArg(location, api_2.WorkerElementRef), new broker_1.FnArg(styleName, null), new broker_1.FnArg(styleValue, null)];
      var args = new broker_1.UiArguments("renderer", "setElementStyle", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.invokeElementMethod = function(location, methodName, args) {
      var fnArgs = [new broker_1.FnArg(location, api_2.WorkerElementRef), new broker_1.FnArg(methodName, null), new broker_1.FnArg(args, null)];
      var uiArgs = new broker_1.UiArguments("renderer", "invokeElementMethod", fnArgs);
      this._messageBroker.runOnUiThread(uiArgs, null);
    };
    WorkerRenderer.prototype.setText = function(viewRef, textNodeIndex, text) {
      var fnArgs = [new broker_1.FnArg(viewRef, api_1.RenderViewRef), new broker_1.FnArg(textNodeIndex, null), new broker_1.FnArg(text, null)];
      var args = new broker_1.UiArguments("renderer", "setText", fnArgs);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer.prototype.setEventDispatcher = function(viewRef, dispatcher) {
      var fnArgs = [new broker_1.FnArg(viewRef, api_1.RenderViewRef)];
      var args = new broker_1.UiArguments("renderer", "setEventDispatcher", fnArgs);
      this._messageBroker.registerEventDispatcher(viewRef, dispatcher);
      this._messageBroker.runOnUiThread(args, null);
    };
    WorkerRenderer = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [broker_1.MessageBroker, render_view_with_fragments_store_1.RenderViewWithFragmentsStore])], WorkerRenderer);
    return WorkerRenderer;
  })();
  exports.WorkerRenderer = WorkerRenderer;
})(require("process"));
