/**
 * The following technique, although workable, is not recommended if the IE compatibility
 * is not needed. Importing LocaleManager and registering locale is the recommended way
 * for modern browsers that support modules.
 *
 * We want our examples to work also in IE 11 therefore we use for this locale ES5 style
 * script that assigns this German locale to the global namespace where it is recognized
 * by the Locale Manager. When the Locale Manager runs first time the locales found in
 * `window.bryntum.locales` are automatically registered.
 */

// prepare "namespace"
window.bryntum = window.bryntum || {};
window.bryntum.locales = window.bryntum.locales || {};

// This will be a truthy empty string so it can be used as a localized result.
const emptyString = new String();

// put the locale under window.bryntum.locales to make sure it is discovered automatically
window.bryntum.locales.De = {

    localeName : 'De',
    localeDesc : 'Deutsch',

    //region Custom localization

    App : {
        'Localization demo' : 'Lokalisierungsdemo'
    },

    EventType : {
        Meeting : 'Session',
        Phone   : 'Telefon',
        Lunch   : 'Mittagessen',
        Workout : 'Trainieren'
    },

    EventColor : {
        Meeting : 'green',
        Phone   : 'red',
        Lunch   : 'blue',
        Workout : 'orange'
    },

    //endregion

    //region Shared localization

    Button : {
        'Add column'          : 'Spalte hinzufügen',
        'Show all day events' : 'Zeige alle tagesereignisse',
        Apply                 : 'Anwenden',
        'Display hints'       : 'Tipps anzeigen',
        'My button'           : data => `Mein knopf ${data}`,
        'Remove column'       : 'Spalte entfernen'
    },

    EventEdit : {
        Name         : 'Name',
        Resource     : 'Ressource',
        Start        : 'Start',
        End          : 'Ende',
        Save         : 'Speichern',
        Delete       : 'Löschen',
        Cancel       : 'Abbrechen',
        'Edit event' : 'Buchung redigieren',
        Repeat       : 'Wiederholen',
        Calendar     : 'Kalender',
        'All day'    : 'Den ganzen tag',
        day          : 'Tag',
        week         : 'Woche',
        month        : 'Monat',
        year         : 'Jahr',
        decade       : 'Dekade'
    },

    Checkbox : {
        'Auto apply'    : 'Automatisch anwenden',
        Automatically   : 'Automatisch',
        toggleRowSelect : 'Zeilenauswahl umschalten',
        toggleSelection : 'Auswahl des gesamten Datensatzes umschalten'
    },

    CodeEditor : {
        'Code editor'   : 'Code-Editor',
        'Download code' : 'Code herunterladen'
    },

    Combo : {
        noResults          : 'Keine Ergebnisse',
        Theme              : 'Thema wählen',
        Language           : 'Gebietsschema auswählen',
        Size               : 'Wähle die Größe aus',
        recordNotCommitted : 'Datensatz konnte nicht hinzugefügt werden',
        addNewValue        : value => `${value} hinzufügen`
    },

    Tooltip : {
        infoButton       : 'Klicken Sie hier, um Informationen anzuzeigen und das Thema oder Gebietsschema zu wechseln',
        codeButton       : 'Klicken Sie hier, um den integrierten Code-Editor anzuzeigen',
        hintCheck        : 'Aktivieren Sie diese Option, um beim Laden des Beispiels automatisch Hinweise anzuzeigen',
        fullscreenButton : 'Ganzer Bildschirm'
    },

    Shared : {
        'Locale changed' : 'Sprache geändert',
        'Full size'      : 'Volle Größe',
        'Phone size'     : 'Telefongröße'
    },

    Popup : {
        close : 'Popup schließen'
    },

    UndoRedo : {
        Undo           : 'Rückgängig machen',
        Redo           : 'Wiederholen',
        UndoLastAction : 'Letzte Aktion rückgängig machen',
        RedoLastAction : 'Wiederholen Sie die letzte rückgängig gemachte Aktion',
        NoActions      : 'Keine Aktionen aufgezeichnet'
    },

    //endregion

    // Translations for common words and phrases which are used by all classes.
    Object : {
        Yes      : 'Ja',
        No       : 'Nein',
        Cancel   : 'Stornieren',
        Ok       : 'OK',
        newEvent : 'Neue aufgabe'
    },

    //region Features

    ColumnPicker : {
        column          : 'Splate',
        columnsMenu     : 'Spalten',
        hideColumn      : 'Versteck spalte',
        hideColumnShort : 'Versteck',
        newColumns      : 'Neue Spalten'
    },

    Filter : {
        applyFilter  : 'Filter anwenden',
        filter       : 'Filter',
        editFilter   : 'Filter redigieren',
        on           : 'Auf',
        before       : 'Vor',
        after        : 'Nach',
        equals       : 'Gleichen',
        lessThan     : 'Weniger als',
        moreThan     : 'Mehr als',
        removeFilter : 'Filter entfernen'
    },

    FilterBar : {
        enableFilterBar  : 'Filterleiste anzeigen',
        disableFilterBar : 'Filterleiste ausblenden'
    },

    Group : {
        group                : 'Gruppe',
        groupAscending       : 'Aufsteigend gruppieren',
        groupDescending      : 'Absteigend gruppieren',
        groupAscendingShort  : 'Aufsteigend',
        groupDescendingShort : 'Absteigend',
        stopGrouping         : 'Stoppen gruppierung',
        stopGroupingShort    : 'Stoppen'
    },

    MergeCells : {
        mergeCells  : 'Zellen zusammenführen',
        menuTooltip : 'Zellen mit gleichem Inhalt zusammenführen, wenn nach dieser Spalte sortiert'
    },

    Search : {
        searchForValue : 'Suche nach Wert'
    },

    Sort : {
        sort                   : 'Sorte',
        sortAscending          : 'Aufsteigend sortierung',
        sortDescending         : 'Absteigend sortierung',
        multiSort              : 'Multi sortieren',
        removeSorter           : 'Sortierung entfernen',
        addSortAscending       : 'Aufsteigend sortieren hinzufügen',
        addSortDescending      : 'Absteigend sortieren hinzufügen',
        toggleSortAscending    : 'Ändern Sie auf aufsteigend',
        toggleSortDescending   : 'Zu absteigend wechseln',
        sortAscendingShort     : 'Aufsteigend',
        sortDescendingShort    : 'Absteigend',
        removeSorterShort      : 'Entfernen',
        addSortAscendingShort  : '+ Aufsteigend',
        addSortDescendingShort : '+ Absteigend'
    },

    //endregion

    //region Trial

    TrialButton : {
        downloadTrial : 'Demo herunterladen'
    },

    TrialPanel : {
        title            : 'Bitte Felder ausfüllen',
        name             : 'Name',
        email            : 'Email',
        company          : 'Gesellschaft',
        product          : 'Produkt',
        cancel           : 'Abbrechen',
        submit           : 'Einreichen',
        downloadStarting : 'Download startet, bitte warten...'
    },

    //endregion

    //region Grid

    RatingColumn : {
        cellLabel : column => `${column.text} ${column.location?.record ? `Bewertung : ${column.location.record[column.field]}` : ''}`
    },

    GridBase : {
        loadFailedMessage  : 'Wird geladen, bitte versuche es erneut!',
        syncFailedMessage  : 'Datensynchronisation fehlgeschlagen!',
        unspecifiedFailure : 'Nicht spezifizierter Fehler',
        networkFailure     : 'Netzwerkfehler',
        parseFailure       : 'Serverantwort konnte nicht analysiert werden',
        loadMask           : 'Laden...',
        syncMask           : 'Speichere Änderungen, bitte warten...',
        noRows             : 'Keine Zeilen zum Anzeigen',
        moveColumnLeft     : 'Bewegen Sie sich zum linken Bereich',
        moveColumnRight    : 'Bewegen Sie sich nach rechts',
        moveColumnTo       : function(region) {
            return 'Spalte verschieben nach ' + region;
        }
    },

    CellMenu : {
        removeRow : 'Zeile'
    },

    //endregion

    //region Widgets

    FilePicker : {
        file : 'Datei'
    },

    Field : {
        badInput        : 'Ungültiger Feldwert',
        patternMismatch : 'Der Wert sollte einem bestimmten Muster entsprechen',
        rangeOverflow   : function(value) {
            return 'Der Wert muss größer als oder gleich ' + value.max + ' sein';
        },
        rangeUnderflow : function(value) {
            return 'Der Wert muss größer als oder gleich ' + value.min + ' sein';
        },
        stepMismatch : 'Der Wert sollte zum Schritt passen',
        tooLong      : 'Der Wert sollte kürzer sein',
        tooShort     : 'Der Wert sollte länger sein',
        typeMismatch : 'Der Wert muss in einem speziellen Format vorliegen',
        valueMissing : 'Dieses Feld wird benötigt',

        fieldRequired         : 'Dieses Feld wird benötigt',
        invalidValue          : 'Ungültiger Feldwert',
        maximumValueViolation : 'Maximalwertverletzung',
        minimumValueViolation : 'Mindestwertverletzung',
        validateFilter        : 'Der Wert muss aus der Liste ausgewählt werden'
    },

    DateField : {
        invalidDate : 'Ungültige Datumseingabe'
    },

    DatePicker : {
        gotoPrevYear  : 'Gehe zum Vorjahr',
        gotoPrevMonth : 'Gehe zum vorherigen Monat',
        gotoNextMonth : 'Weiter zum nächsten Monat',
        gotoNextYear  : 'Weiter zum nächsten Jahr'
    },

    NumberFormat : {
        locale   : 'de',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Ungültige Einheit'
    },

    TimeField : {
        invalidTime : 'Ungültige Zeitangabe'
    },

    TimePicker : {
        hour   : 'Stunde',
        minute : 'Minute'
    },

    //endregion

    //region Others

    DateHelper : {
        locale         : 'de',
        weekStartDay   : 1,
        // Non-working days which match weekends by default, but can be changed according to schedule needs
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        // Days considered as weekends by the selected country, but could be working days in the schedule
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'Millisekunde', plural : 'Millisekunden', abbrev : 'ms' },
            { single : 'Sekunde', plural : 'Sekunden', abbrev : 's' },
            { single : 'Minute', plural : 'Minuten', abbrev : 'min' },
            { single : 'Stunde', plural : 'Stunden', abbrev : 'std' },
            { single : 'Tag', plural : 'Tage', abbrev : 't' },
            { single : 'Woche', plural : 'Wochen', abbrev : 'W' },
            { single : 'Monat', plural : 'Monathe', abbrev : 'mon' },
            { single : 'Quartal', plural : 'Quartal', abbrev : 'Q' },
            { single : 'Jahr', plural : 'Jahre', abbrev : 'jahr' },
            { single : 'Dekade', plural : 'Jahrzehnte', abbrev : 'dek' }
        ],
        // Used to build a RegExp for parsing time units.
        // The full names from above are added into the generated Regexp.
        // So you may type "2 w" or "2 wk" or "2 week" or "2 weeks" into a DurationField.
        // When generating its display value though, it uses the full localized names above.
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['w', 'wk'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['y', 'yr'],
            ['dek']
        ],
        parsers : {
            L  : 'DD.MM.YYYY',
            LT : 'HH:mm'
        },
        ordinalSuffix : function(number) {
            return number;
        }
    },

    PagingToolbar : {
        firstPage         : 'Gehe zur ersten Seite',
        prevPage          : 'Zurück zur letzten Seite',
        page              : 'Seite',
        nextPage          : 'Gehe zur nächsten Seite',
        lastPage          : 'Gehe zur letzten Seite',
        reload            : 'Aktuelle Seite neu laden',
        noRecords         : 'Keine Zeilen zum Anzeigen',
        pageCountTemplate : function(data) {
            return 'von ' + data.lastPage;
        },
        summaryTemplate : function(data) {
            return 'Ergebnisse ' + data.start + ' - ' + data.end + ' von ' + data.allCount;
        }
    },

    PanelCollapser : {
        Collapse : 'Reduzieren',
        Expand   : 'Erweitern'
    },

    List : {
        loading : 'Beladung...'
    },

    //region Export

    PdfExport : {
        'Waiting for response from server' : 'Warten auf Antwort vom Server...',
        'Export failed'                    : 'Export fehlgeschlagen',
        'Server error'                     : 'Serverfehler',
        'Generating pages'                 : 'Seiten generieren ...'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exporteinstellungen',
        export         : 'Export',
        exporterType   : 'Kontrolliere die Paginierung',
        cancel         : 'Stornieren',
        fileFormat     : 'Datei Format',
        rows           : 'Reihen',
        alignRows      : 'Zeilen ausrichten',
        columns        : 'Säulen',
        paperFormat    : 'Papierformat',
        orientation    : 'Orientierung',
        repeatHeader   : 'Header wiederholen'
    },

    ExportRowsCombo : {
        all     : 'Alle Zeilen',
        visible : 'Sichtbare Zeilen'
    },

    ExportOrientationCombo : {
        portrait  : 'Porträt',
        landscape : 'Landschaft'
    },

    EventCopyPaste : {
        copyEvent  : 'Kopieren redigieren',
        cutEvent   : 'Schnitt redigieren',
        pasteEvent : 'Einfügen redigieren'
    },

    SinglePageExporter : {
        singlepage : 'Einzelne Seite'
    },

    MultiPageExporter : {
        multipage     : 'Mehrere Seiten',
        exportingPage : function(data) {
            return 'Seite exportieren ' + data.currentPage + '/' + data.totalPages;
        }
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Mehrere Seiten (vertikal)',
        exportingPage     : function(data) {
            return 'Seite exportieren ' + data.currentPage + '/' + data.totalPages;
        }
    },

    //endregion

    //endregion

    //region Scheduler

    ResourceInfoColumn : {
        eventCountText : function(data) {
            return data + ' Veranstaltung' + (data !== 1 ? 'en' : '');
        }
    },

    Dependencies : {
        from    : 'Von',
        to      : 'Zo',
        valid   : 'Gültig',
        invalid : 'Ungültig'
    },

    DependencyType : {
        SS           : 'AA',
        SF           : 'EA',
        FS           : 'AE',
        FF           : 'EE',
        StartToStart : 'Anfang-Anfang',
        StartToEnd   : 'Anfang-Ende',
        EndToStart   : 'Enge-Anfang',
        EndToEnd     : 'Enge-Ende',
        short        : [
            'AA',
            'EA',
            'AE',
            'EE'
        ],
        long : [
            'Anfang-Anfang',
            'Anfang-Ende',
            'Enge-Anfang',
            'Enge-Ende'
        ]
    },

    DependencyEdit : {
        From              : 'Von',
        To                : 'Zu',
        Type              : 'Typ',
        Lag               : 'Verzögern',
        'Edit dependency' : 'Abhängigkeit bearbeiten',
        Save              : 'Speichern',
        Delete            : 'Löschen',
        Cancel            : 'Abbrechen',
        StartToStart      : 'Anfang-Anfang',
        StartToEnd        : 'Anfang-Ende',
        EndToStart        : 'Ende-Anfang',
        EndToEnd          : 'Ende-Ende'
    },

    EventDrag : {
        eventOverlapsExisting : 'Ereignis überlappt vorhandenes Ereignis für diese Ressource',
        noDropOutsideTimeline : 'Event wird möglicherweise nicht vollständig außerhalb der Timeline gelöscht'
    },

    SchedulerBase : {
        'Add event'      : 'Ereignis hinzufügen',
        'Delete event'   : 'Buchung löschen',
        'Unassign event' : 'Ereignis nicht zuordnen'
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoomen',
        activeDateRange : 'Datumsbereich',
        startText       : 'Anfangsdatum',
        endText         : 'Endtermin',
        todayText       : 'Heute'
    },

    EventFilter : {
        filterEvents : 'Aufgaben filtern',
        byName       : 'Namentlich'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Aktuelle Zeitleiste anzeigen'
    },

    PresetManager : {
        minuteAndHour : {
            topDateFormat : 'ddd DD.MM, HH:mm'
        },
        hourAndDay : {
            topDateFormat : 'ddd DD.MM'
        },
        weekAndDay : {
            displayDateFormat : 'HH:mm'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Du löschst ein Ereignis',
        'delete-all-message'        : 'Möchten Sie alle Vorkommen dieses Ereignisses löschen?',
        'delete-further-message'    : 'Möchten Sie dieses und alle zukünftigen Vorkommen dieses Ereignisses oder nur das ausgewählte Vorkommen löschen?',
        'delete-further-btn-text'   : 'Alle zukünftigen Ereignisse löschen',
        'delete-only-this-btn-text' : 'Nur dieses Ereignis löschen',

        'update-title'              : 'Sie ändern ein sich wiederholendes Ereignis',
        'update-all-message'        : 'Möchten Sie alle Vorkommen dieses Ereignisses ändern?',
        'update-further-message'    : 'Möchten Sie nur dieses Vorkommen des Ereignisses oder dieses und aller zukünftigen Ereignisse ändern?',
        'update-further-btn-text'   : 'Alle zukünftigen Ereignisse',
        'update-only-this-btn-text' : 'Nur dieses Ereignis',

        Yes    : 'Ja',
        Cancel : 'Abbrechen',

        width : 600
    },

    RecurrenceLegend : {
        // list delimiters
        ' and '         : ' und ',
        // frequency patterns
        Daily           : 'Täglich',
        'Weekly on {1}' : function(data) {
            return 'Wöchentlich am ' + data.days;
        },
        'Monthly on {1}' : function(data) {
            return 'Monatlich am ' + data.days;
        },
        'Yearly on {1} of {2}' : function(data) {
            return 'Jährlich am ' + data.days + ' von ' + data.months;
        },
        'Every {0} days' : function(data) {
            return 'Alle ' + data.interval + ' Tage';
        },
        'Every {0} weeks on {1}' : function(data) {
            return 'Alle ' + data.interval + ' Wochen am ' + data.days;
        },
        'Every {0} months on {1}' : function(data) {
            return 'Alle ' + data.interval + ' Monate auf ' + data.days;
        },
        'Every {0} years on {1} of {2}' : function(data) {
            return 'Alle ' + data.interval + ' Jahre auf ' + data.days + ' von ' + data.months;
        },
        // day position translations
        position1     : 'ersten',
        position2     : 'zweiten',
        position3     : 'dritten',
        position4     : 'vierten',
        position5     : 'fünften',
        'position-1'  : 'letzten',
        // day options
        day           : 'Tag',
        weekday       : 'Wochentag',
        'weekend day' : 'Wochenend-Tag',
        // {0} - day position info ("the last"/"the first"/...)
        // {1} - day info ("Sunday"/"Monday"/.../"day"/"weekday"/"weekend day")
        // For example:
        //  "the last Sunday"
        //  "the first weekday"
        //  "the second weekend day"
        daysFormat    : function(data) {
            return data.position + ' ' + data.days;
        }
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ereignis wiederholen',
        Cancel              : 'Abbrechen',
        Save                : 'Speichern',
        Frequency           : 'Häufigkeit',
        Every               : 'Jede(n/r)',
        DAILYintervalUnit   : 'Tag',
        WEEKLYintervalUnit  : 'Woche',
        MONTHLYintervalUnit : 'Monat',
        YEARLYintervalUnit  : 'Jahr',
        Each                : 'Jeder',
        'On the'            : 'Am',
        'End repeat'        : 'Ende',
        'time(s)'           : 'Zeit'
    },

    RecurrenceDaysCombo : {
        day           : 'Tag',
        weekday       : 'Wochentag',
        'weekend day' : 'Wochenend-Tag'
    },

    RecurrencePositionsCombo : {
        position1    : 'ersten',
        position2    : 'zweiten',
        position3    : 'dritten',
        position4    : 'vierten',
        position5    : 'fünften',
        'position-1' : 'letzten'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Niemals',
        After     : 'Nach',
        'On date' : 'Am Tag'
    },

    RecurrenceFrequencyCombo : {
        Daily   : 'täglich',
        Weekly  : 'wöchentlich',
        Monthly : 'monatlich',
        Yearly  : 'jährlich'
    },

    RecurrenceCombo : {
        None   : 'Nie',
        Custom : 'Benutzerdefiniert...'
    },

    //region Features

    Summary : {
        'Summary for' : function(date) {
            return 'Zusammenfassung für ' + date;
        }
    },

    //endregion

    //region Export

    ScheduleRangeCombo : {
        completeview : 'Vollständiger Zeitplan',
        currentview  : 'Sichtbarer Zeitplan',
        daterange    : 'Datumsbereich',
        completedata : 'Vollständiger Zeitplan (für alle Veranstaltungen)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Zeitplanbereich ',
        'Export from'    : 'Von',
        'Export to'      : 'Zu'
    },

    ExcelExporter : {
        'No resource assigned' : 'Keine Ressource zugewiesen'
    },

    //endregion

    //region Examples

    Column : {
        columnLabel       : column => `${column.text ? `${column.text} spalte. ` : ''}SPACE für Kontextmenü${column.sortable ? ', ENTER zum Sortieren' : ''}`,
        cellLabel         : emptyString,
        Name              : 'Name',
        Age               : 'Alter',
        City              : 'Stadt',
        Food              : 'Essen',
        Color             : 'Farbe',
        'First name'      : 'Vorname',
        Surname           : 'Nachname',
        Team              : 'Team',
        Score             : 'Ergebnis',
        Rank              : 'Rang',
        Percent           : 'Prozent',
        Birthplace        : 'Geburstort',
        Start             : 'Anfang',
        Finish            : 'Ende',
        Template          : 'Vorlage (template)',
        Date              : 'Datum',
        Check             : 'Check',
        Contact           : 'Kontakt',
        Favorites         : 'Favoriten',
        'Customer#'       : 'Kunde#',
        When              : 'Wann',
        Brand             : 'Marke',
        Model             : 'Modell',
        'Personal best'   : 'Persönlicher rekord',
        'Current rank'    : 'Aktueller rang',
        Hometown          : 'Heimatstadt',
        Satisfaction      : 'Zufriedenheit',
        'Favorite color'  : 'Lieblingsfarbe',
        Rating            : 'Wertung',
        Cooks             : 'Zuberaiten',
        Birthday          : 'Geburstag',
        Staff             : 'Personal',
        Machines          : 'Maschinen',
        Type              : 'Typ',
        'Task color'      : 'Aufgabe farbe',
        'Employment type' : 'Beschäftigungsverhältnis',
        Capacity          : 'Kapazität',
        'Production line' : 'Fließband',
        Company           : 'Firma',
        End               : 'Ende'
    },

    //endregion

    CrudManagerView : {
        serverResponseLabel : 'Serverantwort:'
    },

    // endregion

    // region Calendar

    Calendar : {
        Today      : 'Heute',
        next       : unit => `Nächsten ${unit}`,
        previous   : unit => `Vorheriger ${unit}`,
        plusMore   : value => `+${value} mehr`,
        allDay     : 'Den ganzen Tag',
        endsOn     : d => `Endet am ${d}`,
        weekOfYear : ([y, w]) => `Woche ${w}, ${y}`
    },

    EventMenu : {
        duplicateEvent : 'Buchung vervielfältigen',
        copy           : 'Kopie'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Halten sie die STRG-Taste für ein wiederkehrendes ereignis gedrückt'
    },

    CalendarMixin : {
        eventCount : count => `${count || 'Keine'} Veranstaltung${count === 1 ? '' : 'en'}`
    },

    EventTip : {
        'Edit event' : 'Buchung redigieren'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Monat',
        monthUnit : 'monat'
    },

    WeekView : {
        Week     : 'Woche',
        weekUnit : 'woche'
    },

    YearView : {
        Year     : 'Jahr',
        yearUnit : 'jahr'
    },

    DayView : {
        Day               : 'Tag',
        dayUnit           : 'tag',
        daysUnit          : 'tage',
        expandAllDayRow   : 'Erweitern sie den ganztägigen bereich',
        collapseAllDayRow : 'Ganztägigen abschnitt reduzieren'
    },

    Sidebar : {
        'Filter events' : 'Aufgaben filtern'
    },

    WeekExpander : {
        expandTip   : 'Klicken Sie hier, um die Zeile zu erweitern',
        collapseTip : 'Klicken Sie hier, um die Zeile zu reduzieren'
    }

    // endregion
};
