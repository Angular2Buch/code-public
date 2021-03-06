/* */ 
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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var api_1 = require('../render/api');
var di_1 = require('../di');
var pipe_binding_1 = require('../pipes/pipe_binding');
var pipes_1 = require('../pipes/pipes');
var view_1 = require('./view');
var element_binder_1 = require('./element_binder');
var element_injector_1 = require('./element_injector');
var directive_resolver_1 = require('./directive_resolver');
var view_resolver_1 = require('./view_resolver');
var pipe_resolver_1 = require('./pipe_resolver');
var pipes_2 = require('../pipes');
var template_commands_1 = require('./template_commands');
var render_1 = require('../../../render');
var application_tokens_1 = require('../application_tokens');
var ProtoViewFactory = (function() {
  function ProtoViewFactory(_renderer, defaultPipes, _directiveResolver, _viewResolver, _pipeResolver, appId) {
    this._renderer = _renderer;
    this._directiveResolver = _directiveResolver;
    this._viewResolver = _viewResolver;
    this._pipeResolver = _pipeResolver;
    this._cache = new Map();
    this._defaultPipes = defaultPipes;
    this._appId = appId;
  }
  ProtoViewFactory.prototype.clearCache = function() {
    this._cache.clear();
  };
  ProtoViewFactory.prototype.createHost = function(compiledHostTemplate) {
    var compiledTemplate = compiledHostTemplate.getTemplate();
    var result = this._cache.get(compiledTemplate.id);
    if (lang_1.isBlank(result)) {
      var templateData = compiledTemplate.getData(this._appId);
      result = new view_1.AppProtoView(templateData.commands, api_1.ViewType.HOST, true, templateData.changeDetectorFactory, null, new pipes_1.ProtoPipes(new Map()));
      this._cache.set(compiledTemplate.id, result);
    }
    return result;
  };
  ProtoViewFactory.prototype._createComponent = function(cmd) {
    var _this = this;
    var nestedProtoView = this._cache.get(cmd.templateId);
    if (lang_1.isBlank(nestedProtoView)) {
      var component = cmd.directives[0];
      var view = this._viewResolver.resolve(component);
      var compiledTemplateData = cmd.template.getData(this._appId);
      this._renderer.registerComponentTemplate(cmd.templateId, compiledTemplateData.commands, compiledTemplateData.styles);
      var boundPipes = this._flattenPipes(view).map(function(pipe) {
        return _this._bindPipe(pipe);
      });
      nestedProtoView = new view_1.AppProtoView(compiledTemplateData.commands, api_1.ViewType.COMPONENT, true, compiledTemplateData.changeDetectorFactory, null, pipes_1.ProtoPipes.fromBindings(boundPipes));
      this._cache.set(cmd.template.id, nestedProtoView);
      this._initializeProtoView(nestedProtoView, null);
    }
    return nestedProtoView;
  };
  ProtoViewFactory.prototype._createEmbeddedTemplate = function(cmd, parent) {
    var nestedProtoView = new view_1.AppProtoView(cmd.children, api_1.ViewType.EMBEDDED, cmd.isMerged, cmd.changeDetectorFactory, arrayToMap(cmd.variableNameAndValues, true), new pipes_1.ProtoPipes(parent.pipes.config));
    if (cmd.isMerged) {
      this.initializeProtoViewIfNeeded(nestedProtoView);
    }
    return nestedProtoView;
  };
  ProtoViewFactory.prototype.initializeProtoViewIfNeeded = function(protoView) {
    if (!protoView.isInitialized()) {
      var render = this._renderer.createProtoView(protoView.templateCmds);
      this._initializeProtoView(protoView, render);
    }
  };
  ProtoViewFactory.prototype._initializeProtoView = function(protoView, render) {
    var initializer = new _ProtoViewInitializer(protoView, this._directiveResolver, this);
    template_commands_1.visitAllCommands(initializer, protoView.templateCmds);
    var mergeInfo = new view_1.AppProtoViewMergeInfo(initializer.mergeEmbeddedViewCount, initializer.mergeElementCount, initializer.mergeViewCount);
    protoView.init(render, initializer.elementBinders, initializer.boundTextCount, mergeInfo, initializer.variableLocations);
  };
  ProtoViewFactory.prototype._bindPipe = function(typeOrBinding) {
    var meta = this._pipeResolver.resolve(typeOrBinding);
    return pipe_binding_1.PipeBinding.createFromType(typeOrBinding, meta);
  };
  ProtoViewFactory.prototype._flattenPipes = function(view) {
    if (lang_1.isBlank(view.pipes))
      return this._defaultPipes;
    var pipes = collection_1.ListWrapper.clone(this._defaultPipes);
    _flattenList(view.pipes, pipes);
    return pipes;
  };
  ProtoViewFactory = __decorate([di_1.Injectable(), __param(1, di_1.Inject(pipes_2.DEFAULT_PIPES_TOKEN)), __param(5, di_1.Inject(application_tokens_1.APP_ID)), __metadata('design:paramtypes', [render_1.Renderer, Array, directive_resolver_1.DirectiveResolver, view_resolver_1.ViewResolver, pipe_resolver_1.PipeResolver, String])], ProtoViewFactory);
  return ProtoViewFactory;
})();
exports.ProtoViewFactory = ProtoViewFactory;
function createComponent(protoViewFactory, cmd) {
  return protoViewFactory._createComponent(cmd);
}
function createEmbeddedTemplate(protoViewFactory, cmd, parent) {
  return protoViewFactory._createEmbeddedTemplate(cmd, parent);
}
var _ProtoViewInitializer = (function() {
  function _ProtoViewInitializer(_protoView, _directiveResolver, _protoViewFactory) {
    this._protoView = _protoView;
    this._directiveResolver = _directiveResolver;
    this._protoViewFactory = _protoViewFactory;
    this.variableLocations = new Map();
    this.boundTextCount = 0;
    this.boundElementIndex = 0;
    this.elementBinderStack = [];
    this.distanceToParentElementBinder = 0;
    this.distanceToParentProtoElementInjector = 0;
    this.elementBinders = [];
    this.mergeEmbeddedViewCount = 0;
    this.mergeElementCount = 0;
    this.mergeViewCount = 1;
  }
  _ProtoViewInitializer.prototype.visitText = function(cmd, context) {
    if (cmd.isBound) {
      this.boundTextCount++;
    }
    return null;
  };
  _ProtoViewInitializer.prototype.visitNgContent = function(cmd, context) {
    return null;
  };
  _ProtoViewInitializer.prototype.visitBeginElement = function(cmd, context) {
    if (cmd.isBound) {
      this._visitBeginBoundElement(cmd, null);
    } else {
      this._visitBeginElement(cmd, null, null);
    }
    return null;
  };
  _ProtoViewInitializer.prototype.visitEndElement = function(context) {
    return this._visitEndElement();
  };
  _ProtoViewInitializer.prototype.visitBeginComponent = function(cmd, context) {
    var nestedProtoView = createComponent(this._protoViewFactory, cmd);
    return this._visitBeginBoundElement(cmd, nestedProtoView);
  };
  _ProtoViewInitializer.prototype.visitEndComponent = function(context) {
    return this._visitEndElement();
  };
  _ProtoViewInitializer.prototype.visitEmbeddedTemplate = function(cmd, context) {
    var nestedProtoView = createEmbeddedTemplate(this._protoViewFactory, cmd, this._protoView);
    if (cmd.isMerged) {
      this.mergeEmbeddedViewCount++;
    }
    this._visitBeginBoundElement(cmd, nestedProtoView);
    return this._visitEndElement();
  };
  _ProtoViewInitializer.prototype._visitBeginBoundElement = function(cmd, nestedProtoView) {
    if (lang_1.isPresent(nestedProtoView) && nestedProtoView.isMergable) {
      this.mergeElementCount += nestedProtoView.mergeInfo.elementCount;
      this.mergeViewCount += nestedProtoView.mergeInfo.viewCount;
      this.mergeEmbeddedViewCount += nestedProtoView.mergeInfo.embeddedViewCount;
    }
    var elementBinder = _createElementBinder(this._directiveResolver, nestedProtoView, this.elementBinderStack, this.boundElementIndex, this.distanceToParentElementBinder, this.distanceToParentProtoElementInjector, cmd);
    this.elementBinders.push(elementBinder);
    var protoElementInjector = elementBinder.protoElementInjector;
    for (var i = 0; i < cmd.variableNameAndValues.length; i += 2) {
      this.variableLocations.set(cmd.variableNameAndValues[i], this.boundElementIndex);
    }
    this.boundElementIndex++;
    this.mergeElementCount++;
    return this._visitBeginElement(cmd, elementBinder, protoElementInjector);
  };
  _ProtoViewInitializer.prototype._visitBeginElement = function(cmd, elementBinder, protoElementInjector) {
    this.distanceToParentElementBinder = lang_1.isPresent(elementBinder) ? 1 : this.distanceToParentElementBinder + 1;
    this.distanceToParentProtoElementInjector = lang_1.isPresent(protoElementInjector) ? 1 : this.distanceToParentProtoElementInjector + 1;
    this.elementBinderStack.push(elementBinder);
    return null;
  };
  _ProtoViewInitializer.prototype._visitEndElement = function() {
    var parentElementBinder = this.elementBinderStack.pop();
    var parentProtoElementInjector = lang_1.isPresent(parentElementBinder) ? parentElementBinder.protoElementInjector : null;
    this.distanceToParentElementBinder = lang_1.isPresent(parentElementBinder) ? parentElementBinder.distanceToParent : this.distanceToParentElementBinder - 1;
    this.distanceToParentProtoElementInjector = lang_1.isPresent(parentProtoElementInjector) ? parentProtoElementInjector.distanceToParent : this.distanceToParentProtoElementInjector - 1;
    return null;
  };
  return _ProtoViewInitializer;
})();
function _createElementBinder(directiveResolver, nestedProtoView, elementBinderStack, boundElementIndex, distanceToParentBinder, distanceToParentPei, beginElementCmd) {
  var parentElementBinder = null;
  var parentProtoElementInjector = null;
  if (distanceToParentBinder > 0) {
    parentElementBinder = elementBinderStack[elementBinderStack.length - distanceToParentBinder];
  }
  if (lang_1.isBlank(parentElementBinder)) {
    distanceToParentBinder = -1;
  }
  if (distanceToParentPei > 0) {
    var peiBinder = elementBinderStack[elementBinderStack.length - distanceToParentPei];
    if (lang_1.isPresent(peiBinder)) {
      parentProtoElementInjector = peiBinder.protoElementInjector;
    }
  }
  if (lang_1.isBlank(parentProtoElementInjector)) {
    distanceToParentPei = -1;
  }
  var componentDirectiveBinding = null;
  var isEmbeddedTemplate = false;
  var directiveBindings = beginElementCmd.directives.map(function(type) {
    return bindDirective(directiveResolver, type);
  });
  if (beginElementCmd instanceof template_commands_1.BeginComponentCmd) {
    componentDirectiveBinding = directiveBindings[0];
  } else if (beginElementCmd instanceof template_commands_1.EmbeddedTemplateCmd) {
    isEmbeddedTemplate = true;
  }
  var protoElementInjector = null;
  var hasVariables = beginElementCmd.variableNameAndValues.length > 0;
  if (directiveBindings.length > 0 || hasVariables || isEmbeddedTemplate) {
    var directiveVariableBindings = new Map();
    if (!isEmbeddedTemplate) {
      directiveVariableBindings = createDirectiveVariableBindings(beginElementCmd.variableNameAndValues, directiveBindings);
    }
    protoElementInjector = element_injector_1.ProtoElementInjector.create(parentProtoElementInjector, boundElementIndex, directiveBindings, lang_1.isPresent(componentDirectiveBinding), distanceToParentPei, directiveVariableBindings);
    protoElementInjector.attributes = arrayToMap(beginElementCmd.attrNameAndValues, false);
  }
  return new element_binder_1.ElementBinder(boundElementIndex, parentElementBinder, distanceToParentBinder, protoElementInjector, componentDirectiveBinding, nestedProtoView);
}
function bindDirective(directiveResolver, type) {
  var annotation = directiveResolver.resolve(type);
  return element_injector_1.DirectiveBinding.createFromType(type, annotation);
}
function createDirectiveVariableBindings(variableNameAndValues, directiveBindings) {
  var directiveVariableBindings = new Map();
  for (var i = 0; i < variableNameAndValues.length; i += 2) {
    var templateName = variableNameAndValues[i];
    var dirIndex = variableNameAndValues[i + 1];
    if (lang_1.isNumber(dirIndex)) {
      directiveVariableBindings.set(templateName, dirIndex);
    } else {
      directiveVariableBindings.set(templateName, null);
    }
  }
  return directiveVariableBindings;
}
exports.createDirectiveVariableBindings = createDirectiveVariableBindings;
function arrayToMap(arr, inverse) {
  var result = new Map();
  for (var i = 0; i < arr.length; i += 2) {
    if (inverse) {
      result.set(arr[i + 1], arr[i]);
    } else {
      result.set(arr[i], arr[i + 1]);
    }
  }
  return result;
}
function _flattenList(tree, out) {
  for (var i = 0; i < tree.length; i++) {
    var item = di_1.resolveForwardRef(tree[i]);
    if (lang_1.isArray(item)) {
      _flattenList(item, out);
    } else {
      out.push(item);
    }
  }
}
