# Routing mit Angular 2.0

## Eine Single-Page Anwendung ist erst dann richtig vollständig, wenn man zwischen den Zuständen hin- und her navigieren kann. Der Nutzer profitiert dabei von Seitenwechseln ohne merkbaren Ladevorgang. Das Routing wurde in Angular 2 intensiv ausgebaut und deckt nun auch fortgeschrittene Anwendungsfälle ab.

Dies ist der fünfte und letzte Artikel aus unserer Reihe zu Angular 2.
In den vorherigen Artikeln haben wir bereits SystemJS, Templates, Dependency Injection, Unit-Testing, HTTP-Kommunikation und die Verarbeitung von Formulardaten kennen gelernt.
Mit dabei ist stets das "Car Dashboard", welches kontinuierlich neue Funktionen erhält.
In diesem Artikel wollen wir alle Funktionen über die neue Routing-Engine miteinander kombinieren.

<!--
![Screenshot](images/screenshot_forms.png)
> Screenshot: Das Cars Dashboard mit neuem Formular
-->

Wie gewohnt steht ein komplettes, lauffähiges Beispiel auf GitHub zur Verfügung. Sie finden alle besprochenen Inhalte unter: __https://github.com/Angular2Buch/angular2-routing__

## Routing 

[TODO]



## Fazit und Ausblick

[TODO]

Angular 2 ermöglicht es einen Großteil des Verhaltens eines Formulars in der Komponente zu definieren.
Templates enthalten somit wenig Validierungslogik als noch in Angular 1.
Das bereinigt das Template und ermöglicht es, die Validierung mehr in Richtung der Domänenlogik anzusiedeln.
Dies ist ein gute Entscheidung.
Eigene Validierungslogik kann schnell selbst entwickelt und in die Anwendung integriert werden.
Sobald das Konzept der Controls, ControlGroups und Validatoren verstanden ist, ergibt sich ein geradliniger Entwicklungsprozess zum Erstellen und Erweitern von Webformularen. Wir wünschen viel Spaß beim Ausprobieren.

Nun hat unsere Anwendung mitlerweile viele Funktionen bekommen.
Es wird eng auf dem zur Verfügung stehenden Bildschirm. In der nächsten Ausgabe der __Web und Mobile Developer__ wird es um den Router von Angular 2 gehen. Wir werden Ihnen zeigen, wie Sie zwischen einzelnen Komponenten navigieren können und dabei anschauliche und für Suchmaschinen optimiere URLs erhalten. Seien Sie gespannt.

<hr>

## Über die Autoren

![Johannes Hoppe](images/johannes-hoppe.png)
**Johannes Hoppe** ist selbstständiger IT-Berater und Softwareentwickler. Er arbeitet derzeit als Architekt für ein Portal auf Basis von .NET und AngularJS. Er veranstaltet Trainings zu AngularJS und bloggt unter http://blog.johanneshoppe.de/ .

![Ferdinand Malcher](images/ferdinand-malcher_mini.png)
**Ferdinand Malcher** ist selbständiger Softwareentwickler und Mediengestalter aus Leipzig.
Seine Schwerpunkte liegen auf Webanwendungen mit AngularJS und Node.js.


## Quellen
* https://github.com/Angular2Buch/angular2-forms - Vollständiges Beispiel
* https://github.com/angular/angular/ - Offizielles Angular 2.0 Repository
* https://github.com/angular/angular-cli - Das neue Kommandozeilentool für Angular
* https://medium.com/@daviddentoom/angular-2-form-validation-9b26f73fcb81 - Weiterführende Informationen
* https://angular.io/docs/ts/latest/guide/forms.html - Dokumentation von Angular zur Formularverarbeitung