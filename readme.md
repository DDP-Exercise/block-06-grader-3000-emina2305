[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/j3W1X_B2)
# Grader 3000

## Business Logic

Baue eine Benotungssoftware für deinen Lieblingsprof. Gehe dazu nach dem MVC-Pattern vor. Arbeite heute bitte alleine.
Die Software soll das Benotungssystem des Kurses ISC abbilden und nach Eingabe aller Daten die korrekte Note ausgeben.

Das Benotungsschema ist bereits bekannt, aber hier nochmal zusammengefasst:
- Für jede Übung gibt es maximal **100 Punkte**
- Die schlechteste Übung wird **nicht gewertet**
- Die maximale Punktzahl ergibt sich also aus:  (AnzahlÜbungen - 1) * 100
- Positiv bedeutet immer >50% und nicht >=50%
- 75% Aller Übungen müssen positiv bewertet sein (= min. 51 Punkte), damit die Gesamtnote positiv sein kann.

Zusätzlich zur Übungsnote gibt es auch eine Klausurnote. Beide Noten (Übungsnote und Klausurnote) müssen positiv sein, damit die Gesamtnote positiv sein kann. Die Klausurnote hat eine Gewichtung von 40%, die Übungsnote eine Gewichtung von 60%. Folgender Notenschlüssel ist für die Gesamtnote anzuwenden:

- 0-50% Nicht Genügend
- bis 61% Genügend
- bis 74% Befriedigend
- bis 86% Gut
- bis 100% Sehr gut

Zusätzlich soll auch die Anwesenheit überprüft werden. Diese muss >= 80% betragen, damit die Note unverändert bleibt.

## User Interface
Baue ein schlichtes, aber übersichtliches Interface für den Grader 3000. Konstruiere die View so, dass es für jede Übung sowie für die Klausur ein Eingabefeld (mit min-max Werten, Startwert darf 0 sein) gibt. Jedes Mal, wenn sich ein Eingabefeld ändert (= on change), soll die Gesamtnote berechnet werden. Das Streichergebnis soll deutlich erkennbar sein. Für den Anwender soll zudem klar erkennbar sein, warum und ob etwas negativ beurteilt wird.

Dazu ein Beispiel:

Übungsnote:  <span style="color: green">100%</span>

Klausurnote: <span style="color: red"> 40% </span>

Gesamtnote: <span style="color: green">(100 * 0,6)</span> + <span style="color: red">(40 * 0,4) = 76</span>, aber trotzdem negativ weil Klausur negativ.
## Vorgehen
- Lege ein neues Projekt an
- Bereite html und js (mvc) Dateien vor (auch import / export)
- Model
  - Bereite Speicher für alle Noten und die Anwesenheitspflicht vor
    - Ein Array für die acht Übungsnoten
    - Eine Klausurnote
  - Schreibe eine Methode, die es dem Controller erlauben wird, Übungen mit Punkten zu bewerten
  - Schreibe eine Methode, die es dem Controller erlauben wird, die Klausur mit Punkten zu bewerten.
  - Schreibe eine Methode, die es dem Controller erlauben wird, die Anwesenheit einzutragen.
  - Schreibe eine Methode, die überprüft, ob ein Punktewert positiv ist.
  - Schreibe eine Methode zur Berechnung der Gesamtübungsnote
  - Schreibe eine Methode zur Berechnung der Gesamtnote
- View
  - Schreibe eine Methode, welche verwendet werden kann, um ein Punkte-Eingabefeld zu erstellen (bspw. für eine Klausur oder die Übungsaufgaben)
  - Schreibe eine Methode, welche verwendet werden kann, um die Anwesenheit einzutragen.
  - Schreibe zwei Methoden, die sich um die optische hervorhebung von negativen Ergebnissen und dem Streichergebnis kümmern
- Controller
  - Integriere Model und View
  - Organisiere alle nötigen Event-Listener (so effizient wie möglich) auf Eingabefelder. Wenn sie sich ändern, soll der Controller Änderungen entsprechend an das Model weitergeben.
  - Stelle sicher, dass der Controller reagiert, wenn sich die Gesamtnoten im Model ändern und das entsprechend an die View kommuniziert (hinweis: Custom Event). 

