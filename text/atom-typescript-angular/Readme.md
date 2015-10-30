# Atom mit TypeScript und Angular 2.0 nutzen

Manfred Steyer hat in einem Blogpost beschrieben, wie man ein [Setup für Visual Studio Code, TypeScript und Angular 2.0](http://www.softwarearchitekt.at/post/2015/07/21/visual-studio-code-mit-typescript-und-angular-2-nutzen.aspx) aufstellt. Ganz ähnlich hierzu will ich kurz beschreiben, wie man ein schnelles Setup für den Editor Atom aufbaut. Ich gehe davon aus, dass das [5 Min Quickstart](https://angular.io/docs/ts/latest/quickstart.html) Tutorial bekannt ist.

Es soll kein Transpiling von TypeScript zur Laufzeit stattfinden. Wandelt man TypeScript direkt im Browser um, so erhält man logischerweise keinen komfortablen Hilfestellungen durch den Compiler beim Entwickeln. Weiterhin ist das Transpiling zur Laufzeit keine Lösung für den produktiven Einsatz. Es soll also in diesem Post ausschließlich um die Integration mit Atom und atom-typescript gehen.

### Inhalt
1. [Atom und atom-typescript installieren](#installieren)
2. [Projekt anlegen](#projekt)
3. [Transpilieren](#transpilieren)
4. [Angular 2.0 Type Definitions](#typings)
5. [Off Topic: Angular 2.0 asynchron laden](#systemjs)


<a name="installieren"></a>
## 1. Atom und atom-typescript installieren

1. [Atom](https://atom.io/) installieren - Admin-Rechte sind übrigens nicht notwendig
2. [atom-typescript](https://atom.io/packages/atom-typescript) installieren - entweder über die grafische Oberfläche (Settings > Install) oder in der Shell per 
`apm install atom-typescript`


<a name="projekt"></a>
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
        packages: { app: { defaultExtension: 'js'}}
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


<a name="transpilieren"></a>
## 3. Transpilieren

Würden wir jetzt schon den Entwicklungsstand kontrollieren, so würden wie eine Fehlermeldung erhalten. Die ganze Logik liegt nämlich nur in Form von TypeScript-Dateien vor. Der Browser soll jedoch JavaScript-Dateien laden und ausführen.

Die Erzeugung jener Dateien holen wir nach, indem wir eine Datei Namens `tsconfig.json` in das Projektverzeichnis einfügen. Hierfür kann man `ctrl(bzw. cmd) + shift + p` drücken (Liste der Kommandos) und den Befehl `tsconfig` auswählen ("TypeScript: Create tsconfig.json Project File").

```javascript
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "newLine": "LF"
  }
}
```
> tsconfig.json

Sobald die Konfigurations-Datei vorliegt, wandelt Atom alle TypeScript-Dateien beim Speichern automatisch um. 


![Screenshot](img/screenshot_atom_folders2.png)


Das Ergebnis lässt sich mit einem Webserver kontrollieren:

```cmd
npm install -g live-server
live-server

```

![Screenshot](img/screenshot_hello_alice.png)

**Das war gar nicht schwer! :-)**


<a name="typings"></a>
## 4. Angular 2.0 Type Definitions

TypeScript wird die von uns erstellen TS-Dateien zwar transpilieren, jedoch erscheint ein Fehler, dass Angular nicht gefunden werden kann (`TS: Error: Cannot find module 'angular2/angular2'`). 

![Screenshot](img/typings_error.png)

Ohne Typings kann der Compiler nicht die korrekte Verwendung der Angular-Types prüfen. Ebenso steht keine automatische Vervollständigung zu Verfügung. Die notwendigen [Type Definitions von DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped/tree/master/angular2) sind leider derzeit nicht aktuell. Die beste Quelle von Angular 2.0 Type Definitions ist derzeit das NPM Paket. Wenn man schon mal dabei ist, kann man auch gleich noch SystemJS auf die Platte laden. 

```cmd
npm install angular2@2.0.0-alpha.45 systemjs@0.19.5
```

Ein wenig Bauchschmerzen macht mir übrigens die direkte Verwendung des `node_modules` Ordners. Es ist eine ewige Streitfrage, ob man diesen Ordner unter Versionsverwaltung stellt oder nicht. Den Ordner nun auch noch im Webserver verfügbar zu machen, ist eine neue Qualität. Ich bin damit noch nicht wirklich glücklich - aber das ist ein anderes Thema.

Man kann nun eine lokale Kopie der beiden Frameworks verwenden. Bei dieser Gelegenheit lassen wir auch die Einstellung für die `defaultExtension: 'js'` weg, da diese für ein definiertes Paket sowieso die Standardeinstellung ist (siehe [#759](https://github.com/systemjs/systemjs/issues/759)).

```html
<!-- index_local.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Angular 2 Demo</title>

    <script src="node_modules/systemjs/dist/system.js"></script>
    <script src="node_modules/angular2/bundles/angular2.dev.js"></script>

    <script>
      System.config({ packages: { app: {}}});
      System.import('./app/app');
    </script>

  </head>
  <body>
    <my-app>loading...</my-app>
  </body>
</html>
```
> index_local.html

Weiterhin kann man nun TypeScript die korrekten Pfade aufzeigen. Eine geniale Erfindung ist die [`filesGlob`](https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md#filesglob)-Einstellung, welches man mit dem Snippet `fg` in die `tsconfig.json` einfügt:

```javascript
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

Das manuelle Bekanntmachen von Dateien über das `files`-Property oder über inline-Kommentare in den TS-Dateien (z.B. `/// <reference path="node_modules/angular2/bundles/typings/angular2/angular2.d.ts"/>`) ist damit Geschichte! Atom hält die Liste der Dateien automatisch aktuell. Weil der `node_modules` Ordner sich innerhalb des Projektes befindet, werden auch sofort die Typings von Angular 2.0 gefunden. Nun stehen Hilfen wie "Type information on hover", "Autocomplete", "Goto Declaration" und eine [Reihe weiterer Features](https://github.com/TypeStrong/atom-typescript#features) zur Verfügung.

![Screenshot](img/type_information_on_hover.png)
> Type information on hover

Wer das files-Array überprüft, wird feststellen, das sich dort nun ziemlich viele  doppelt vorhandene `*.d.ts`-Dateien befinden! Eine alternative Möglichkeit besteht darin, den `node_modules` Order um eine Verzeichnisebene nach oben zu verschieben. Zum filesGlob-Array kann dann ein zweiter Pfad (z.B. `../node_modules/angular2/bundles/typings/**/*.ts`) hinzugefügt werden. Diese Ordnerstruktur entspräche dann dem [5 Min Quickstart](https://angular.io/docs/ts/latest/quickstart.html) Tutorial von Google.


<a name="systemjs"></a>
## 5. Off Topic: Angular 2.0 asynchron laden

Der letzte Teil dieses Posts gilt nicht mehr spezifisch für Atom. Aber ich möchte die Zeile 
```html
<script src="node_modules/angular2/bundles/angular2.dev.js"></script>
```
so nicht stehen lassen. Mit SystemJS steht uns ein vorzüglicher Module-Loader zur Verfügung. Statt Angular asynchron (bzw. später im Bundle synchron) zu laden, wird die Holzhammer-Methode per `<script>` verwendet. Das Bundle `angular2.dev.js` fasst das gesamte Framework und alle Abhängigkeiten in einer Datei zusammen - was anfangs recht praktisch ist. Die Datei lässt sich aber nicht über einen Modul-Loader bzw. Builder verwenden. Viel schöner ist es, wenn die Abhängigkeit `angular2/angular2` über SystemJS konfiguriert wird:

```javascript
<!-- index_systemjs.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Angular 2 Demo</title>

    <script src="node_modules/systemjs/dist/system.js"></script>
    <script src="config.js"></script>
    <script>
      System.import('./app/app');
    </script>

  </head>
  <body>
    <my-app>loading...</my-app>
  </body>
</html>
```
> index_systemjs.html

Die Abhängigkeiten der Anwendung lassen sich in einer Konfigurations-Dateien beschreiben. Prinzipiell muss man nur die entsprechenden Pfade mappen (`maps`) und die Abhängigkeiten von Angular (`deps`) definieren, damit diese zur Laufzeit von Angular bereit stehen.   

```javascript
System.config({
  paths: {
    "npm:*": "node_modules/*",
    "npm2:*": "node_modules/angular2/node_modules/*",
  },
  map: {
    "angular2": "npm:angular2",
    "reflect-metadata": "npm2:reflect-metadata",
    "zone.js": "npm2:zone.js/lib/zone.js",
    "es6-shim": "npm:es6-shim/es6-shim.js",
    "@reactivex/rxjs": "npm2:@reactivex/rxjs",
  },
  meta: {
    "angular2/angular2": {
      "deps": ["reflect-metadata", "zone.js", "es6-shim", "@reactivex/rxjs"]
    }
  },
  packages: {
    "app": { },
    "angular2": { },
    "reflect-metadata": {
        "main": "Reflect.js",
        "map": { "crypto": "@empty" }
    },
    "@reactivex/rxjs": {
        "main": "dist/cjs/Rx.js"
    }
  }
});
```
> config.js

SystemJS übernimmt nun komplett die Bereitstellung von Abhängigkeiten im Code. Dazu gehört natürlich auch das Angular-Framework an sich, welches über die `app.ts` angefordert wird. Dies hält den eigenen Code entsprechend sauber und übersichtlich. 

Der ES6-Polyfill ist nicht im NPM-Paket von Angular2 definiert, daher muss er noch zusätzlich installiert werden:
```
npm install es6-shim
```

Es gibt auch die Möglichkeit, solch ein Mapping für SystemJS automatisiert zu erstellen. Das ist nämlich die Aufgabe von [JSPM](http://jspm.io/). JSPM ist ein mächtiger Paketmanager, der leider auch eine intensivere Einarbeitung verlangt. Wen dieses Thema interessiert, der sei auf das ["Angular2 + JSPM cheat sheet" Gist](https://gist.github.com/robwormald/429e01c6d802767441ec) verwiesen. 



----

## Off Topic: Proxies

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