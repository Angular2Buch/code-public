/* */ 
'use strict';
var route_config_decorator_1 = require('./route_config_decorator');
var lang_1 = require('../core/facade/lang');
var exceptions_1 = require('../core/facade/exceptions');
function normalizeRouteConfig(config) {
  if (config instanceof route_config_decorator_1.Route || config instanceof route_config_decorator_1.Redirect || config instanceof route_config_decorator_1.AsyncRoute || config instanceof route_config_decorator_1.AuxRoute) {
    return config;
  }
  if ((!config.component) == (!config.redirectTo)) {
    throw new exceptions_1.BaseException("Route config should contain exactly one \"component\", \"loader\", or \"redirectTo\" property.");
  }
  if (config.component) {
    if (typeof config.component == 'object') {
      var componentDefinitionObject = config.component;
      if (componentDefinitionObject.type == 'constructor') {
        return new route_config_decorator_1.Route({
          path: config.path,
          component: componentDefinitionObject.constructor,
          as: config.as
        });
      } else if (componentDefinitionObject.type == 'loader') {
        return new route_config_decorator_1.AsyncRoute({
          path: config.path,
          loader: componentDefinitionObject.loader,
          as: config.as
        });
      } else {
        throw new exceptions_1.BaseException("Invalid component type \"" + componentDefinitionObject.type + "\". Valid types are \"constructor\" and \"loader\".");
      }
    }
    return new route_config_decorator_1.Route(config);
  }
  if (config.redirectTo) {
    return new route_config_decorator_1.Redirect({
      path: config.path,
      redirectTo: config.redirectTo
    });
  }
  return config;
}
exports.normalizeRouteConfig = normalizeRouteConfig;
function assertComponentExists(component, path) {
  if (!lang_1.isType(component)) {
    throw new exceptions_1.BaseException("Component for route \"" + path + "\" is not defined, or is not a class.");
  }
}
exports.assertComponentExists = assertComponentExists;
