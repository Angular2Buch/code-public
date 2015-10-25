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

Anstatt eckiger Klammern, können Property-Bindings mit `bind-{property-name}="{value}"` werden.

```html
<car bind-id="token"></car>
```

### Event-Bindings

Events bieten die Möglichkeit auf Veränderungen einer Komponente zu reagieren.

```html
<car (damaged)="report(damage, $event)"></car>
```

```javascript
@Component({
  selector: 'damage-dashboard'
})
class Dashboard() {
  Car:Car;
}
```

Bei der Verwendung von Event-Bindings kann das Event-Objekt `$event` verwendet werden, um detailierte Informationen über das ausgelöste Ereignis zu erhalten.

```javascript
@Component({ /* ... */ })
class Dashboard() {
  /* ... */

  report(damage, $event) {
    console.log($event.type) // click, hover, change, ...
  }
}
```

Neben der Verwendung runder Klammern, können Event-Bindings auch mit dem Ausdruck `on-{Event-Name}="{callback()}"`.

```html
<car on-damaged="report(damage)"></car>
```

### Two-Way Bindings

## Lokale Variablen

Innerhalb eines Templates können Referenzen auf HTML-Elemente, Komponenten und Datenbindungen erzeugt werden, um mit ihnen zu arbeiten.

```html
<input #id type="text"/>
{{ id.value }}
```

Anstatt der # können lokale Variablen auch mit dem Prefix `var-` deklariert werden.

```html
<input var-id type="text"/>
{{ id }}
```

```html
<car #car></car>
<button (click)="car.getTankCapicity()">Get tank capacity</button>
```

```html
<car *ng-for="#c in cars" [model]="c">
```

> Bei dem * vor der ng-for Direktive handelt es sich um eine Kurzschreibweise. Näheres erfahren Sie im nächsten Abschnitt.

## * und &lt;template&gt;

Direktiven wie `ng-for`,`ng-if` und `ng-switch` werden zusammen mit einem `*`
verwendet. Diese Direktiven werden strukturelle Direktiven (Structural Directives) genannt, da sie DOM-Elemente hinzufügen oder entfernen.

```html
<div *ng-if="totalDamages > 0">{{ totalDamages }}</div>
```

In diesem Beispiel wird das &lt;div&gt; Element nur in den DOM-Tree gezeichnet,
wenn die Bedingung von `ng-if` wahr ist.
Bei dem `*` handelt es sich, um eine Kurzschreibweise, die das Schreiben des Templates vereinfachen soll.
Diese Schrebweise wird als _Micro Syntax_ bezeichnet, da Angular 2.0 diesen Ausdruck interpretiert und wieder in die uns bekannten Bindings umsetzt.
Beispielsweise ist auch folgende Verwendung der ng-if Direktive zulässig.

```html
<template [ng-if]="totalDamages > 0">
  <div>{{ totalDamages }}</div>
</template>
```

Angular übersetzt die Mikro Syntax in ein Property-Binding und umschließt das Template mit einem &lt;template&gt;-Tag. [[5]]

## Der Pipe-Operator `|`

Pipes korrespondieren zu den `filters` in AngularJS 1.x und  werden genutzt, um Daten zu für die Anzeige zu transformieren. Sie nehmen Eingabeargumente entgegen und liefern das transfornierte Ergebnis zurück.
In einem Binding-Expression werden sie durch das Symbol `|` (Pipe) eingeleitet.

```html
/* Der Wert von name wird in Großbuchstaben ausgegeben */
<p>{{ name | uppercase}}</p>
```

Pipes können auch aneinander gehangen werden, um mehrere Transformationen durchzuführen.

```html
<p>{{ name | uppercase | lowercase}}</p>
```

## Der Elvis-Operator `?`

Die Bezeichnung "Elvis Operator" ist eine Ode an den populären Mythos, ob Elvis tatsächlich tot ist oder nicht.

Er ist ein nützliches Instrument, um zu prüfen, ob ein Wert `null` ist oder nicht. So können Fehlermeldungen bei der Template-Erzeugung vermieden werden.

## Was hat das mit HTML zu tun?

Auch wenn sich die Syntax zu Beginn ungewohnt ist, handelt es sich hierbei um valides HTML. [[6], [8]] In der HTML Spezifikation des W3C heißt es:

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

Diesr Prozess heißt Template Transformation. In Angular 2.0 wird es möglich sein, eigene Transformationen zu schreiben, um beispielsweise komplexe Datenbindungen syntaktisch zu vereinfachen. [[7]]

# Kurz

- Input- und Output-Properties beschreiben die API einer Komponente
- Über Inputs "fließen" Daten in die Komponente hinein.
- Inputs werden über Property-Bindings aktualisiert ([property])
- Über Outputs "fließen" Daten aus der Komponente heraus.
- Outputs werden mithilfe von Event-Bindings abonniert ((event)).
- Ein Property-Binding und Event-Binding können kompiniert werden, um ein Two-Way-Binding zu beschreiben ([(twoWay)]). [[2]]

# Fazit

In Angular 2.0 wird die Template-Syntax in mehrere Konzepte aufgebrochen. Der Datenfluss zwischen Komponenten wird dadurch konkret definiert. Daher ist es mit einem Blick auf ein Template möglich, zu erkennen, wie sich eine Komponente verhält. Somit können, im Gegensatz zur Vorgängerversion AngularJS, Templates in Angular 2.0 diffiziler und genauer beschrieben werden.
Allerdings sind auch mehere Möglichkeiten vorhanden Templates und Bindings zu definieren. Daher ist es ratsam, sich im Team auf jeweils eine der angebotenen Schreibweisen zu einigen, um ein vertrautes und homogenes Bild im Markup zu schaffen.

<hr>

## Über die Autoren

![Johannes Hoppe](images/johannes-hoppe.png)
**Johannes Hoppe** ist selbstständiger IT-Berater, Softwareentwickler und Trainer. Er arbeitet derzeit als Architekt für ein Portal auf Basis von .NET und AngularJS. Er bloggt unter http://blog.johanneshoppe.de/ .

![Gregor Woiwode](images/gregor-woiwode.png)
**Gregor Woiwode** ist als Softwareentwickler im Bereich des Competitive Intelligence bzw. Enterprise Knowledge Managements für ein Softwareunternehmen in Leipzig tätig. Er veranstaltet Trainings AngularJS. Er bloggt unter http://www.woiwode.info/blog/ .

<hr>

# Quellen

[1]: https://angular.io/docs/ts/latest/quickstart.html "5 Min Quickstart"
[2]: http://victorsavkin.com/post/119943127151/angular-2-template-syntax "Angular 2 Template Syntax"
[3]: https://www.youtube.com/watch?v=-dMBcqwvYA0 "ng-conf 2015 Keynote 2"
[4]: ng-book "2 - The Complete Book on AngularJS 2 by Ari Lerner, Felipe Coury, Nate Murray, Carlos Taborda"
[5]: https://angular.io/docs/ts/latest/guide/template-syntax.html "angular.io - Template-Syntax"
[6]:  http://blog.thoughtram.io/angular/2015/08/11/angular-2-template-syntax-demystified-part-1.html "Template-Syntax demystified"
[7]: https://youtu.be/bVI5gGTEQ_U "Angular 2 Data Flow – Jeff Cross, Rob Wormald and Alex Rickabaugh"
[8]: http://www.w3.org/TR/html-markup/syntax.html "W3C - HTML: The Markup Language (an HTML language reference)"
