import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import SvSE from '../../../lib/Calendar/localization/SvSE.js';

const customSvSELocale = {

    extends : 'SvSE',

    App : {
        'Localization demo' : 'Lokaliseringsdemo'
    },

    Button : {
        'Add column'          : 'Lägg till kolumn',
        'Display hints'       : 'Visa tips',
        'Remove column'       : 'Ta bort kolumn',
        'Show all day events' : 'Visa heldagshändelser',
        'My button'           : data => `Min knapp ${data}`,
        Apply                 : 'Verkställ'
    },

    Checkbox : {
        'Auto apply'  : 'Auto applicera',
        Automatically : 'Automatiskt'
    },

    CodeEditor : {
        'Code editor'   : 'Kodredigerare',
        'Download code' : 'Ladda ner kod'
    },

    Column : {
        Name    : 'Namn',
        Company : 'Företag'
    },

    EventType : {
        Meeting : 'Möte',
        Phone   : 'Telefon',
        Lunch   : 'Fika',
        Workout : 'Träning'
    },

    EventColor : {
        Meeting : 'green',
        Phone   : 'red',
        Lunch   : 'blue',
        Workout : 'orange'
    },

    Combo : {
        Theme    : 'Välj tema',
        Language : 'Välj språk',
        Size     : 'Välj storlek'
    },

    Shared : {
        'Full size'      : 'Full storlek',
        'Locale changed' : 'Språk ändrat',
        'Phone size'     : 'Telefonstorlek'
    },

    Tooltip : {
        infoButton       : 'Klicka för att visa information och byta tema eller språk',
        codeButton       : 'Klicka för att visa den inbyggda kodredigeraren',
        hintCheck        : 'Markera för att automatiskt visa tips när du laddar exemplet',
        fullscreenButton : 'Fullskärm'
    }

};

// Publishing locales to be loaded automatically (for umd bundles)
LocaleHelper.publishLocale('SvSE', SvSE);
LocaleHelper.publishLocale('SvSE-Custom', customSvSELocale);
//</umd>

// Or extending locales directly
LocaleManager.extendLocale('SvSE', customSvSELocale);
