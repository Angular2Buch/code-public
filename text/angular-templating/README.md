# Angular Template-Syntax

> *Hinweis* Das hier gezeigt Beispiel nutzt eine Vorschauversion von Angular 2.0. Der hier gezeigte Code muss für spätere Versionen gegebenen Falls angepasst werden.

> *Code-Beispile* Sie finden die hier vorgestellten Beispiele aug GitHub unter: https://github.com/Angular2Buch/template-synt

In Angular 2.0 halten neue Möglichkeiten Einzug Oberflächen Templates zu beschreiben. Das Ziel des Entwicklerteams von Angular ist, das Konzept der Templates eindeutiger zu formulieren. Das soll auch dafür sorgen, dass der Support durch IDEs verbessert wird. Beispielsweise soll bessere Car-Vervollständigung Einzughalten, um die Produktivität des Entwicklers zu steigern.

## Input- und Output-Properties

Input- und Output-Properties sind Eigenschaften die die API einer Angular Komponente beschreiben. Über Inputs der Komponente übergeben. Mit Outputs kommuniziert die Komponente Änderungen nach Außen.
Inputs werden durch `Property-Bindings` beschrieben. Outputs können über `Event-Bindings` abonniert werden

### Property-Bindings

Mit Properties werden einer Komponente Daten übermittelt.

```html
<car [id]="token"></car>
```

```javascript
@Component({
  selector: 'Car'
})
class Car() {
  @Input() id:string;
}
```

Anstatt der eckigen Klammern, kann auch folgende Syntax für Property-Bindings verwendet werden.

```html
<car bind-id="token"></car>
```

### Event-Bindings

Events bieten die Möglichkeit auf Veränderungen einer Komponente zu reagieren.

```html
<car (damaged)="report(damage)"></car>
```

```javascript
@Component({
  selector: 'schadens-dashboard'
})
class Dashboard() {
  Car:Car;
}
```

Anstatt der runden Klammern, kann auch folgende Syntax für Event-Bindings verwendet werden.

```html
<car on-damaged="report(damage)"></car>
```

### Two-Way Bindings

## Was hat das noch mit HTML zu tun?

Auch wenn sich die Syntax zu Beginn ungewohnt ist, handelt es sich hierbei um valides HTML. [8] In der HTML Spezifikation des W3C heißt es:

> Attribute names must consist of one or more characters other than the space characters, U+0000 NULL, """, "'", ">", "/", "=", the control characters, and any characters that are not defined by Unicode.

## Interpolation

Bereits in AngularJS 1.x konnten Daten mithilfe zweier geschweifter Klammern an das HTML Template gebunden werden. Der Wert wurde mittels Interpolation ausgewertet und angezeigt.
Dieses Konzept bleibt in Angulars neuer Version erhalten.

```html
<p>{{ name }}</p>
```

Diese Schrebweise ist eine Vereinfachung. Bevor dieses Template im Browser ausgegeben wird es durch Angular folgender Maßen verarbeitet.

```html
<p [textContent]="interpolate(['Gregor'], [name])"></p>
```

Diesr Prozess heißt Template Transformation. In Angular 2.0 wird es möglich sein, eigene Transformationen zu schreiben, um beispielsweise komplexe Datenbindungen syntaktisch zu vereinfachen. [7]


# Fazit

- Input- und Output-Properties beschreiben die API einer Komponente
- Über Inputs "fließen" Daten in die Komponente hinein.
- Inputs werden über Property-Bindings aktualisiert ([property])
- Über Outputs "fließen" Daten aus der Komponente heraus.
- Outputs werden mithilfe von Event-Bindings abonniert ((event)).
- Ein Property-Binding und Event-Binding können kompiniert werden, um ein Two-Way-Binding zu beschreiben ([(twoWay)]).

# Quellen

[1]: https://angular.io/docs/js/latest/quickstart.html "5 Minuten Schnellstart"
[2]: http://victorsavkin.com/post/119943127151/angular-2-template-syntax "Angular 2 Template Syntax"
[3]: https://www.youtube.com/watch?v=-dMBcqwvYA0 "ng-conf 2015 Keynote 2"
[4]: ng-book "2 - The Complete Book on AngularJS 2 by Ari Lerner, Felipe Coury, Nate Murray, Carlos Taborda"
[5]: https://angular.io/docs/ts/latest/guide/template-syntax.html "angular.io - Template-Syntax"


http://blog.thoughtram.io/angular/2015/08/11/angular-2-template-syntax-demystified-part-1.html

[7]: https://youtu.be/bVI5gGTEQ_U "Angular 2 Data Flow – Jeff Cross, Rob Wormald and Alex Rickabaugh"
[8]: http://www.w3.org/TR/html-markup/syntax.html "W3C - HTML: The Markup Language (an HTML language reference)"
