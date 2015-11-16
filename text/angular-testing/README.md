# Dependecy Injection und Unit-Testing mit Angular 2.0

## Dependecy Injection gute Testbarkeit waren schon immer ein Alleinstellungsmerkmal für AngularJS. Mit der neuen Version wurden viele Details verbessert.

> **Hinweis** Das hier gezeigte Beispiel nutzt eine Vorschauversion von Angular 2.0. Der gezeigte Code muss für spätere Versionen wahrscheinlich angepasst werden.

## Einleitung

In den beiden vorangegangenen Artikeln zu Angular 2.0 wurde zunächst ein modulares Setup auf Basis von SystemJS beschrieben. In der zweiten Ausgabe haben wir Ihnen anhand einer Beispielanwendung die neue Template-Syntax vorgestellt. Es wird Zeit, der Anwendung neue Funktionen zu geben, professionelle Entwurfsmuster anzuwenden und Fehlerfreiheit des Codes mit Unit-Tests zu beweisen!


## Inversion of Control

Das Dashboard war die Demo-Anwendung aus der letzten Ausgabe. Im Dashboard soll man nun Informationen zum aktuell günstigsten Benzinpreis erhalten. Wenn man an einer beliegen Stelle im Programmcode eine andere Funktionalität benötigt, dann liegt es zunächst nahe, jene andere Funktionalität an Ort und Stelle zu initialisieren. Ein erster Ansatz könnte wie folgt ausschauen:

```javascript
var Dashboard = function() {
  this.gasService = new GasService();
  
  // gasService verwenden
}
```

![Screenshot](images/screenshot_refill.png)
> Screenshot: Mit dem günstigsten Benzinpreis die Autos betanken

Dieses Vorgehen ist prinzipiell einwandfrei - nur stößt man mit zunehmender Menge an Code an eine Grenze. Der Code wird zunehmend unübersichtlicher, schwerer zu Warten und verweigert sich einem einfachen Test-Setup. Das Prinzip des "Inversion of Control" kehrt die Verantwortlichkeit einfach um. Wenn man nun eine andere Funktionalität benötigt, so gibt man hierfür die Kontrolle an eine übergeordnete Instanz ab. Das Prinzip findet sich in verschiedenen Entwurfsmustern in allen Programmiersprachen wieder. AngularJS zum Beispiel verwendet das Entwurfsmuster "Dependency Injection". Ein Framework im Kern von AngularJS sorgt dafür, das die benötigte Abhängigkeit über den Namen identifiziert wird und der Konstruktor-Funktion beim Aufruf bereit gestellt wird. In AngularJS 1.x kann man einen Service wie folgt anfordern:

```javascript
// AngularJS 1.x 
var Dashboard = ['GasService', function(GasService) {
  this.gasService = GasService;
}]
```

## Dependency Injection mit Angular 2.0

Wer das DI-Framework aus AngularJs 1.x kennt, der wird mit Sicherheit auch an dessen Grenzen gestoßen sein. Besonders hinderlich sind fehlende Namespaces und die Notwendigkeit, stets alle Abhängigkeiten per Name zu identifizieren. Dies ist doppelter Schreibaufwand. Im vorliegenden Beispiel muss man zwei mal "GasService" schreiben. Mit der Unterstützung von ECMAScript 6 bzw. von TypeScript wird die Bedienung nun viel vertrauter. So lässt sich mittels des Decorators `@Inject` die Abhängkeit in den Konstruktor injizieren:

```js
@Component({selector: 'dashboard'})
@View(/* [...] */)
export default class DashboardComponent {
  
  constructor(private gasService: GasService) {
    this.cars = [new Car('ng-car 1.0'), new Car('ng-car 2.0')]
  }
}

```


<hr>

## Über die Autoren

![Johannes Hoppe](images/johannes-hoppe.png)
**Johannes Hoppe** ist selbstständiger IT-Berater, Softwareentwickler und Trainer. Er arbeitet derzeit als Architekt für ein Portal auf Basis von .NET und AngularJS. Er bloggt unter http://blog.johanneshoppe.de/ .

![Gregor Woiwode](images/gregor-woiwode.png)
**Gregor Woiwode** ist als Softwareentwickler im Bereich des Competitive Intelligence bzw. Enterprise Knowledge Managements für ein Softwareunternehmen in Leipzig tätig. Er veranstaltet Trainings AngularJS. Er bloggt unter http://www.woiwode.info/blog/ .

<hr>

[1]: https://angular.io/docs/js/latest/quickstart.html "5 Minuten Schnellstart"
[2]: https://github.com/ModuleLoader/es6-module-loader "ES6 Module Loader Polyfill"
[3]: https://github.com/google/traceur-compiler "Traceur"
[4]: http://babeljs.io/ "Babel"
[5]: https://github.com/Microsoft/TypeScript/ "TypeScript"
[6]: https://github.com/systemjs/systemjs "SystemJS"
[7]: https://github.com/gulpjs/gulp "Gulp"
[8]: https://github.com/angular/angular "Angular 2.0 Github-Repository"
[9]: https://code.angularjs.org/ "code.angularjs.org"
[10]: https://www.npmjs.com/package/systemjs-builder "SystemJS Build Tool"
[12]: https://www.npmjs.com/package/angular2 "NPM-Paket von Angular 2.0"
