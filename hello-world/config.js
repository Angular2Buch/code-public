System.config({
  "baseURL": "/hello-world/",
  "defaultJSExtensions": true,
  paths: {
    "angular2/*": "../node_modules/angular2/*",
    "rx": "../node_modules/angular2/node_modules/rx/dist/rx.js",
    "github:*": "../jspm_packages/github/*",
    "npm:*": "../jspm_packages/npm/*"
  },
  meta: {
    'rx': {
      format: 'cjs'
    }
  }
});

System.config({
  "map": {
    "es6-shim": "github:es-shims/es6-shim@0.33.0",
    "reflect-metadata": "npm:reflect-metadata@0.1.0",
    "zone.js": "npm:zone.js@0.5.2"
  }
});
