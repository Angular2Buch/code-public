This text was copied from:
[robwormald/angular2.jspm.md](https://gist.github.com/robwormald/429e01c6d802767441ec)

-----

## Angular2 + JSPM cheat sheet

#### First time setup
- install jspm beta: `npm install -g jspm@beta`
- set up your project: `jspm init`
- install dependencies: `jspm install angular2 reflect-metadata zone.js es6-shim`

This will create a `jspm_packages` folder, and a `config.js` file.

Open the `config.js` file - this file manages options for the System.js loader - tweak it as appropriate
```js
System.config({
  "baseURL": "/",
  "defaultJSExtensions": true,
  "transpiler": "typescript",
  //add this if using typescript
  "typescriptOptions":{
    "module":"commonjs",
    "emitDecoratorMetadata": true
  },
  //add this if using traceur
  "traceurOptions": {
    "annotations" : true,
    "memberVariables" : true,
    "types" : true
  },
  //add this if using babel
  "babelOptions": {
    "optional" : ["runtime"],
    "stage" : 1
  },
  "paths": {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    //this lets us use app/ for our package as a sort of virtual directory
    "app": "src"
  },
  //this configures our app paths
  "packages": {
    "app": {
      "main": "main",
      "defaultExtension": "js" //or "ts" for typescript
    }
  }
});
```

Create a new `src` directory, and a `main.js` or `main.ts` file inside of it:
```js
//import deps
import 'zone.js';
import 'reflect-metadata';
//you may need es6-shim if you get an error relating to list.fill
//import es6-shim;

//if using traceur compiler:
import {
  ComponentAnnotation as Component,
  ViewAnnotation as View,
  bootstrap
} from 'angular2/angular2';
//OR
//if using babel or typescript compiler:
import {
  Component,
  View,
  bootstrap
} from 'angular2/angular2';

//create a simple angular component
@Component({
  selector: 'test-app'
})
@View({
  template: '<h4>Hello {{name}}</h4>'
})
class TestApp {
  name: string;
  constructor(){
    this.name = 'Angular2';
    setTimeout(() => {
      this.name = 'Angular2!!!'
    },1500);
  }
}

//start our app
bootstrap(TestApp);

```

Create an index.html page:
```html
<html>
<head>
    <title>Demo App</title>
    <!-- systemJS loader and config -->
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
</head>
<body>
    <!-- our angular2 component -->
    <test-app>
        Loading...
    </test-app>

    <!-- import and run our app -->
    <script>
      System.import('app');
    </script>
</body>
</html>

```
Start a local server `http-server` or `python -m SimpleHTTPServer` and open localhost:8080 in your browser.

### Bundling Options

- `jspm bundle app dist/main.js` - outputs a single bundle you can include in a script tag after System.js and your config.
- `jspm bundle app dist/main.min.js --minify` - outputs a minified single bundle you can include in a script tag after System.js and your config.
- `jspm bundle-sfx app dist/main.sfx.js` - outputs a single file you can include without any other dependencies.
