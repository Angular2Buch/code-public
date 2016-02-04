# Routing mit Angular 2.0

## Eine Single-Page Anwendung ist erst dann richtig vollständig, wenn man zwischen den Zuständen hin- und her navigieren kann. Der Nutzer profitiert dabei von Seitenwechseln ohne merkbaren Ladevorgang. Das Routing wurde in Angular 2 intensiv ausgebaut und deckt nun auch fortgeschrittene Anwendungsfälle ab.

Dies ist der fünfte und letzte Artikel aus unserer Reihe zu Angular 2.
In den vorherigen Artikeln haben wir bereits SystemJS, Templates, Dependency Injection, Unit-Testing, HTTP-Kommunikation und die Verarbeitung von Formulardaten kennen gelernt.
Mit dabei ist stets das "Car Dashboard", welches kontinuierlich neue Funktionen erhält.
In diesem Artikel wollen wir alle Funktionen über die neue Routing-Engine miteinander kombinieren.


![Screenshot](images/screenshot_dashboard.png)
> 1. Komponente: Das Cars Dashboard ("Dashboard")

![Screenshot](images/screenshot_driver-form.png)
> 2. Komponente: Formular zum Eintragen der Fahrerdaten ("DriverForm")

Wie gewohnt steht ein komplettes, lauffähiges Beispiel auf GitHub zur Verfügung. Sie finden alle besprochenen Inhalte unter: __https://github.com/Angular2Buch/angular2-routing__

## Komponenten 

Zugegeben, in der letzten Ausgabe mussten wir ein wenig schummeln. Wir haben neben der Komponente "Dashboard" eine zweite Komponente namens "DriverForm" vorgestellt und anhand dieser die Formularverarbeiten erläutert. Das Problem war: beide Komponenten waren jeweils einzeln in die Website eingebunden:

```html
<!-- index.html -->
<dashboard>loading...</dashboard>
            
            oder

<driver-form>loading...</driver-form>

// app.ts
bootstrap(Dashboard);

            oder

bootstrap(DriverForm);

// dashboard.ts
@Component({selector: 'dashboard'})
@View({templateUrl: 'app/dashboard.html'})
export class Dashboard { }

// driver-form.ts
@Component({selector: 'driver-form'})
@View({templateUrl: 'app/components/driver-form/driver-form.html'})
export class DriverForm { }
```
> Pseudo-Code zum Einbinden der Root-Component in die Website

Die hierarchische Anordnung der Komponenten aus der letzten Ausgabe sehen wir in _Bild 1_.

![Bild1](images/problem.png)
> Bild 1: Ohne Routing kommt man hier nicht weiter

Nun wollen wir natürlich auch in der Lage sein, beide Ansichten gleichzeitig zu verwenden, damit wir durch die Anwendung navigieren können. Hier kommt das Prinzip des "Routings" in Spiel. Als Routing bezeichnen wir das Laden von Bereichen der Anwendung abhängig vom Zustand. Im  Prinzip geschieht das selbe, was wir auch manuell gemacht haben, Komponenten werden miteinander ausgetauscht. Der Dienst, welcher den Zustand der Angular-Anwendung verwaltet nennt sich __Router__. Mittels Routing wollen wir sowohl Dashboard, Registrierungs-Formular sowie eine Detailansicht erreichbar machen. Alle Ansichten sollen vom Nutzer über verschiedene URLs aufrufbar sein.


## Routing

Das Prinzip der Single-Page-Applikation sieht eine einzige HTML-Seite vor, deren tatsächliche Inhalte asynchron nachgeladen werden. Dabei findet in der Regel kein "hartes" Neuladen der Seite statt. Die HTML5 History API, welche in allen modernen Browsern implementiert ist, liefert die technische Grundlage um das Routing adäquat anzugehen. Für ältere Browser existieren Fallbacks, wie z.B. die Verwendung von URLs mit einem #Hash (`HashLocationStrategy`). Der in Angular standardmäßig vorhandene Router nennt sich "Component Router". Er kann mit verschiedenen Strategien verwendet werden, welche bestimmen, wie der Router seinen Zustand persistiert. Standardmäßig wird die HTML5 History API (`PathLocationStrategy`) verwendet. Es werden hierbei zur Identifikation der einzelner Zustände gut lesbare URLs generiert.

Vorausgesetzt, es ist bereits eine Grundstruktur der Anwendung mit mehreren Komponenten vorhanden, sind drei Schritte nötig, um den Router zu verwenden:

1. __Routen konfigurieren:__ Wir weisen einem URL-Pfad eine zu ladende Komponente zu
2. __Komponenten anzeigen:__ Wir binden die geladene Komponente in das Template ein
3. __Routing booten:__ Wir aktivieren das Routing global in unserer Anwendung


## 1. Routen konfigurieren

Routen-Konfigurationen werden in Angular mithilfe des Dekorators `RouteConfig` aus dem Modul `angular2/router` vorgenommen. Anders als noch in AngularJS 1, muss die Routenkonfiguration nicht mehr zentral für die gesamte Anwendung definiert werden. Unter-Routen können am "Ort des Geschehens", also bei der jeweiligen Komponente bestimmt werden. Die erste Komponente, die beim Bootstrapping der Anwendung geladen wird, ist der Einstiegspunkt des Routers. Sie wird __Root-Komponente__ genannt.

Dem Decorator `RouteConfig` wird eine also Liste von Routen übergeben, die für die Anwendung registriert werden sollen. Eine solche Route ist folgendermaßen aufgebaut:
```javascript
{ path: '/path', name: 'MyRoute', component: MyComponent }
```

* __path__: URL-Pfad für diese Route
* __name__: Name der Route (in CamelCase).
* __component__: Komponente, die durch die Route geladen werden soll. (z.B. `Dashboard` bz. `DriverForm`)

Der Routen-Name ist ein Bezeichner, den wir später verwenden, um die Route zu identifizieren. Es spricht nichts dagegen, die Namen (als String) der Komponente zu verwenden. Verwendet man eine Komponente zweimal, muss man sich einen Namen ausdenken - denn er muss eindeutig sein.

Wir erzeugen also eine neue Komponente, die wir `DashboardApp` nennen (siehe _Listing 1_). 

```javascript
@RouteConfig([
    { path: '/dashboard', as: 'Dashboard', component: Dashboard, useAsDefault: true },
    { path: '/drivers/...', as: 'Drivers', component: Drivers }
])
@Component({
  selector: 'dashboard-app',
  templateUrl: 'app/dashboard-app.html',
  directives: [ROUTER_DIRECTIVES]
})
export class DashboardApp { }
```
> Listing 1: Neue Komponente DashboardApp mit Routing-Konfiguration 

Wenn wir das _Listing 1_ betrachten, so fällt auf, dass die Komponente `DriverForm` gar nicht dabei ist. Statt dessen sieht man eine Notation mit drei Punkten (...). Der Component-Router von Angular 2 geht Hand in Hand mit dem Konzept der Komponenten und ermöglicht die Vererbung von Routen. Das bedeutet, dass eine durch Routing geladene Komponente weitere Routen-Konfigurationen besitzen kann, usw. Die Komponenten lassen sich beliebig tief verschachteln. So bleibt alles übersichtlich: Eine Komponente ist jeweils für die Verwaltung ihrer eigenen Routen zuständig und gibt die Verantwortlichkeit für Kind-Routen an die Kind-Komponente ab (_Listing 2_).

```
@Component({})
@View({
  /* [...] */
})
@RouteConfig([
  { path: '/details/:forCarId', as: 'Details', component: DriverDetails },
  { path: '/create/:forCarId',  as: 'Create', component: DriverForm }
])
export class Drivers {}
```
> Listing 2: Kind-Route definiert Unter-Routen

Um das Beispiel noch ein wenig zu komplettieren, haben wir eine weitere Komponente eingebunden. Sie soll die Details zu einem Fahrer anzeigen (`DriverDetails`). Die neue Hierarchie der Komponenten sehen wir in _Bild 2_.

![Bild2](images/loesung.png)
> Bild 2: Mittels Routing sind nun alle Komponenten erreichbar

## 2. Komponenten anzeigen

Nun sind die Routen und deren Pfade konfiguriert, doch es ist noch nicht klar, wo die jeweiligen Komponenten einzubinden sind. Für diesen Zweck wird die Direktive `RouterOutlet` aus dem Modul `{angular2/router` verwendet. An der Stelle, wo die Direktive ins Template eingebunden wird, soll der Router die jeweils aktuelle Komponente dynamisch austauschen.

Die Komponente `DashboardApp` hat folgendes Template:
```html
<!-- dashboard-app.html -->
<h1>Cars Dashboard</h1>
<hr>
<router-outlet></router-outlet>
```

Die Überschrift bleibt dadurch permanent in der Anwendung sichtbar. Darunter wird dann die jeweils angeforderte Komponenten eingefügt. Auch die Kind-Komponente `Drivers` benötigt die Direktive im Template. Da es sich um ein denkbar kurzes Template handelt, bietet es sich an alles direkt im Quelltext zu konfigurieren:

```javascript
@Component({})
@View({
  directives: [ROUTER_DIRECTIVES],
  template: '<router-outlet></router-outlet>'
})
@RouteConfig( /* [...] */ )
export class Drivers {}
``` 


## 3. Routing booten

Damit wären schon fast alle Änderungen durchgeführt. Nun muss das Routing nur noch aktiviert werden. Dazu verwenden wir die `ROUTER_PROVIDERS`. Diese Abhängigkeiten werden der `bootstrap`-Methode übergeben. Sie konfiguriert den __IoC-Container__ von Angular. Die Mechanismen hinter "Inversion of Control (IoC)" und "Dependendy Injection (DI)" haben wir in Ausgabe 02/2016 kennen gelernt.

```javascript
// app.ts
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';

bootstrap(DashboardApp, [ROUTER_PROVIDERS]);
```


## Routen verlinken

Benutzbar wird das Routing natürlich erst mit klickbaren Links innerhalb der Anwendung. Wichtig ist hierbei, dass Verlinkungen zwischen den Zuständen nicht manuell gesetzt, sondern automatisch erstellt werden! Das hat den Vorteil, dass die tatsächliche URL nicht vom Entwickler fest einprogrammiert werden muss. Ebenso wird so sicher gestellt, das die aktuelle Strategie verwendet wird. Bei der Verwendung der HTML5 History API wird z.B. nicht wirklich eine neue Seite aufgerufen sondern lediglich der Browser-Verlauf manipuliert.

Wir verwenden hierzu die Direktive `RouterLink` aus dem Modul `angular2/router`. In der Direktive geben wir an, welche Route verlinkt werden soll. Die Notation erfolgt als Liste: das sogenannte `Link-Parameter-Array`.

```html
<a [routerLink]="['/Dashboard']">zum Dashboard</a>
```

Im ersten Element des Arrays geben wir die zu ladende Route an. Wir müssen hier den Namen verwenden, den wir bei der Routen-Konfiguration in der Komponente festgelegt haben. Wichtig ist, dass sich ein Link immer relativ zur aktuelle Komponente ist! Das gilt es zu berücksichtigen, wenn wir mehrere Komponenten verschachteln und die Routen vererben. Das Array hat im vorherigen Beispiel nur ein Element. Es kann aber beliebig viele Elemente haben, die jeweils auf weitere Kind-Routen verweisen. Möchten wir mit einer Route weitere Werte übergeben, so verwenden wir als letztes Element im Array ein Objekt mit Routen-Parametern. Zur Komponente `DriverDetails` wechselt man zum Beispiel mit folgenden Link:

```html
<a [routerLink]="['/Drivers', 'Create', { forCarId: car.id }]">Fahrer ändern</a>
```

Klicken wir auf den generierten Link, so wird die Adresszeile auf `http://example.org/drivers/create/ng-car1` aktualisiert. Dank der HTML5 History AI verursacht der Wechsel kein echtes Neuladen der Seite. 

Es kann aber jederzeit vorkommen, das die sichtbare Adresse per Reload oder per Bookmark aufgerufen wird. Dieser Fall wird von Angular ohne Probleme berücksichtigt. Es muss aber sicher gestellt werden, dass auch der Webserver bereit für eine Single-Page Anwendung ist. Bei einer unbekannten Adresse wie z.B. `drivers/create/ng-car1` darf er nicht mit einem Fehler 404 antworten. Der Webserver muss so administriert werden, dass statt eines Fehlers stets die `index.html` ausgeliefert wird. Dort biegt folgende Angabe alle relativen Pfade wieder zurecht:

```
<-- index.html -->
<base href="/">
```


## Routen-Parameter empfangen

Wenn wir mittels Routen-Parameter Werte übertragen, so muss man diese natürlich auch empfangen können. Dazu dient die Klasse `RouteParams`, welche wir in den Konstruktor injizieren und damit in der Komponente bekannt machen können. Die Instanz von `RouteParams` ist stets mit den jeweiligen Parametern der Route befüllt. Über die Methode `RouteParams.get()` können wir nun einen Parameter abrufen. Als Argument übergeben wir den Bezeichner, den wir bei der Routen-Konfiguration festgelegt haben (__Listing 3__).

```
import {RouteParams} from 'angular2/router';

@Component({ /* [...] */ })
export class DriverDetails {
  constructor(params: RouteParams) {
    
    var id = params.get('forCarId');
    console.log("Fahrer für Auto", id);
  }
}
```
> Listing 3: RouteParams enthält die alle Routen-Parameter 


## Fazit und Ausblick

Die wichtigsten Bestandteile des Routings haben wir hiermit kennen gelernt. Unsere Anwendung "Cars Dashboard" ist nun voll funktionsfähig. Ganz selbstverständlich haben wir dabei ein RouterOutlet im RouterOutlet verwendet. Solche verschachtelten Views war in AngularJS 1 noch nicht mit Boardmitteln realisierbar. Die Verwendung des AngularUI Router war daher die de-facto Lösung für komplexere Szenarien. Der neue Router in Angular 2 ist zwar weiterhin nicht ganz so mächtig, deckt aber viel mehr Anwendungsfälle ab. Dies ist eine gute Entwicklung des Frameworks. Die Belance zwischen einer einfachen Verwendung und vielen Funktionen bleibt unserer Ansicht nach gut gewahrt.

Mit diesem Artikel wollen wir unsere Reihe zum neuen Framework von Google abschließen. Mittels der vorgestellten Themen über 5 Ausgaben der __Web und Mobile Developer__ lässt sich bereits ein Most-Valuable-Product erstellen. Die Github-Repositories haben wir alle auf den neuesten Stand (zum Redaktionsschluss Beta.2) gebracht. Viele weitere Aspekte von Angular 2 gilt es zu erforschen. Wir – das sind Johannes Hoppe, Danny Koppenhagen, Ferdinand Malcher und Gregor Woiwode – laden Sie gerne zu einer längeren Entdeckungsreise ein. Mit Erscheinungsdatum der finalen Version von Angular 2 werden wir ein deutschsprachiges Buch zum Framework veröffentlichen.

<hr>

## Alle Angular 2-Artikel im Überblick

* Teil 1 – Modularer Code mit SystemJS und jspm  
Web und Mobile Developer Ausgabe 12/2015  
Codebeispiele: https://github.com/Angular2Buch/angular2-module  

* Teil 2 – Templatesyntax und Web Components  
Web und Mobile Developer Ausgabe 01/2016  
Codebeispiele: https://github.com/Angular2Buch/angular2-template-syntax  

* Teil 3 – Dependency Injection und Unit-Testing  
Web und Mobile Developer Ausgabe 02/2016  
Codebeispiele: https://github.com/Angular2Buch/angular2-testing  

* Teil 4 – Formularverarbeitung und Validierung  
Web und Mobile Developer Ausgabe 03/2016  
Codebeispiele: https://github.com/Angular2Buch/angular2-forms  

* Teil 5 – Routing  
aktuelle Ausgabe 04/2016  
Codebeispiele: https://github.com/Angular2Buch/angular2-routing  

<hr>

## Über die Autoren

![Johannes Hoppe](images/johannes-hoppe.png)
**Johannes Hoppe** ist selbstständiger IT-Berater und Softwareentwickler. Er arbeitet derzeit als Architekt für ein Portal auf Basis von .NET und AngularJS. Er veranstaltet Trainings zu AngularJS und bloggt unter http://blog.johanneshoppe.de/ .

![Ferdinand Malcher](images/ferdinand-malcher_mini.png)
**Ferdinand Malcher** ist selbständiger Softwareentwickler und Mediengestalter aus Leipzig.
Seine Schwerpunkte liegen auf Webanwendungen mit AngularJS und Node.js.


## Quellen
* https://github.com/angular/angular/ - Offizielles Angular 2.0 Repository
* https://github.com/angular/angular-cli - Das neue Kommandozeilentool für Angular
* https://angular.io/docs/ts/latest/guide/router.html - Dokumentation von Angular zu Routing und Navigation