# Atom mit TypeScript und Angular2 nutzen

Manfred Steyer hat in einem Blogpost beschrieben, wie man ein [Setup für Visual Studio Code, TypeScript und Angular 2.0](http://www.softwarearchitekt.at/post/2015/07/21/visual-studio-code-mit-typescript-und-angular-2-nutzen.aspx) aufstellt. Ganz ähnlich hierzu will ich kurz beschreiben, wie man ein schnelles Setup für den Editor Atom aufbaut. Ich gehe davon aus, das das [5 Min Quickstart](https://angular.io/docs/ts/latest/quickstart.html) Tutorial bekannt ist.

Folgende Prämissen gelten für diesen Post:

1. es soll kein Transpiling von TypeScript zur Laufzeit statt finden 
2. es soll kein JSPM eingesetzt werden

Zu 1.

Wandelt man TypeScript direkt im Browser um, so erhält man logischerweise keine komfortable Hilfestellungen durch den Compiler beim Entwickeln. Außerdem geht es in diesem Post gerade um die Integration in Atom. Zu guter Letzt ist das Transpiling - je nach Hardware und Browser - auch furchtbar langsam!

Zu 2.

JSPM ist schon ein genialer Paketmanager, hat aber auch ein paar Einstiegshürden. Wen dieses Thema interessiert, der sei auf folgendes auf das ["Angular2 + JSPM cheat sheet" Gist](https://gist.github.com/robwormald/429e01c6d802767441ec) verwiesen. Forschergeist und vor allem Geduld sind hier Voraussetzung. Dies soll ein Einstieg ohne eine komplexes Tool werden.


## 1. Atom und atom-typescript installieren

1. [Atom](https://atom.io/) installieren - Admin-Rechte sind übrigens nicht notwendig
2. [atom-typescript](https://atom.io/packages/atom-typescript) installieren - entweder über die grafische Oberfläche (Settings > Install) oder in der Shell per 
`apm install atom-typescript`


## 2. Projekt anlegen

Der Aufbau orientiert sich am Angular 2 Quickstart. Wir werden drei Dateien erstellen:

1. `index.html`
2. `app/app.ts` - für das Bootstrapping
3. `app/MyAppComponent.ts` - eine Komponente, um auch etwas anzuzeigen

Wichtig ist die Tatsache, dass man alle TypeScript-Dateien in einen Unterordner legt (hier `app/`). So kann man die korrekte Dateiendung einstellen. Da unsere TypeScript-Dateien (`*.ts`) zu JavaScript-Dateien (`*.js`) transpiliert werden, geben wir dies als `defaultExtension: 'js'` entsprechend an.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Angular 2 Demo</title>

    <script src="https://code.angularjs.org/tools/system.js"></script>
    <script src="https://code.angularjs.org/2.0.0-alpha.45/angular2.dev.js"></script>

    <script>
        System.config({
            packages: {'app': {defaultExtension: 'js'}}
        });
        System.import('./app/app');
    </script>

  </head>
  <body>
    <my-app>loading...</my-app>
  </body>
</html>
```
> index.html

```javascript
// app/app.ts
import { bootstrap } from 'angular2/angular2';
import MyAppComponent from './MyAppComponent';

bootstrap(MyAppComponent);

```
> app/app.ts

```javascript
// app/MyAppComponent.ts
import { Component, View } from 'angular2/angular2';

@Component({
  selector: 'my-app'
})
@View({
  template: '<h1>Hello {{ name }}</h1>'
})
export default class MyAppComponent {
  name: string;

  constructor() {
    this.name = 'Alice';
  }
}
```
> app/MyAppComponent.ts


![Screenshot](img/screenshot_atom_folders.png)

## 3. Transpilieren

Würden wir jetzt schon den Entwicklungsstand kontrollieren, so würden wie eine Fehlermeldung erhalten. Die ganze Logik liegt nämlich nur in Form von TypeScript-Dateien vor. Der Browser soll jedoch JavaScript-Dateien laden und ausführen.

Die Erzeugung jener Dateien holen wir nach, indem wir eine Dateie Namens `tsconfig.json` in das Projektverzeichnis einfügen. Hierfür kann man `cmd(ctrl)+shift+p` drücken (Liste der Kommandos) und den Befehl `tsconfig` auswählen ("TypeScript: Create tsconfig.json Project File").

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "newLine": "LF"
  }
}**
```
> tsconfig.json

Sobald die Konfiguration-Datei vorliegt, wandelt Atom alle TypeScript-Dateien beim Speichern automatisch um. 


![Screenshot](img/screenshot_atom_folders2.png)


Das Ergebnis lässt sich mit einem Webserver kontrollieren:

```cmd
npm install -g live-server
live server

```

![Screenshot](img/screenshot_hello_alice.png)

Das war gar nicht schwer! :-)

## 4. Angular2 Type Definitions

TypScript wird die eigenen TS-Dateien zwar transpilieren, jedoch erscheint ein Fehler, dass Angular nicht gefunden werden kann (`TS: Error: Cannot find module 'angular2/angular2'`). 

![Screenshot](img/typings_error.png)

Ohne Typings kann der Compiler die korrekte Verwendung der Angular-Types nicht prüfen. Ebenso steht keine automatische Vervollständigung zu Verfügung. Die notwendigen [Type Definitions von DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped/tree/master/angular2) sind leider derzeit nicht aktuell. Die beste Quelle von Angular2 Type Definitions ist derzeit das NPM Paket. Wenn man schon mal dabei ist, kann man auch gleich noch SystemJS auf die Platte laden. 

```cmd
npm install angular2@2.0.0-alpha.45 systemjs@0.19.5
```

Ein wenig Bauchschmerzen macht mir übrigens die direkte Verwendung des `node_modules` Ordners. Es ist eine ewige Streitfrage, ob man diesen Ordner unter Versionsverwaltung stellt oder nicht. Den Ordner nun auch noch im Webserver verfügbar zu machen, ist eine neue Qualität. Ich bin damit noch nicht wirklich glücklich. Nun denn, was solls, YOLO!

Man kann nun eine lokale Version der beiden Frameworks verwenden:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Angular 2 Demo</title>

    <!--
    <script src="https://code.angularjs.org/tools/system.js"></script>
    <script src="https://code.angularjs.org/2.0.0-alpha.45/angular2.dev.js"></script>
    -->

    <script src="node_modules/systemjs/dist/system.js"></script>
    <script src="node_modules/angular2/bundles/angular2.dev.js"></script>

    <script>
        System.config({
            packages: {'app': {defaultExtension: 'js'}}
        });
        System.import('./app/app');
    </script>

  </head>
  <body>
    <my-app>loading...</my-app>
  </body>
</html>
```

Weiterhin kann man nun TypeScript die korrekten Pfade aufzeigen. Eine geniale Erfindung ist die [`filesGlob`](https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md#filesglob)-Einstellung, welches man mit dem Snippet `fg` in die `tsconfig.json` einfügen kann:

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "newLine": "LF"
  },
  "filesGlob": [
    "./**/*.ts"
  ],
  "files": [
     "-- wird automatisch gefüllt! --"
  ]
}
```

Das manuelle Bekanntmachen von Dateien über das `files`-Property oder über inline-Kommentare in den TS-Dateien (z.B. `/// <reference path="node_modules/angular2/bundles/typings/angular2/angular2.d.ts"/>`) ist damit Geschichte! Atom hält die Liste der Dateien für euch automatisch aktuell. Weil der `node_modules` Ordner sich innerhalb des Projektes befindet, werden auch die Typings von Angular2 gefunden. Nun stehen weitere Hilfen wie "Type information on hover", "Autocomplete", "Goto Declaration" und weitere [Features](https://github.com/TypeStrong/atom-typescript#features). zur Verfügung.

![Screenshot](img/type_information_on_hover.png)
> Type information on hover


## Extra: Proxies

Wer mit einem Firmen-Proxy leben muss, der gibt zur Konfiguration von APM vorher noch folgendes ein:

```
apm config set proxy http://user:pass@host:port
apm config set https_proxy http://user:pass@host:port
```

NPM stellt man wie folgt ein:

```
npm config set proxy http://user:pass@host:port
npm config set https-proxy http://user:pass@host:port
```