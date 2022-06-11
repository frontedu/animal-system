# Localization

Bryntum Scheduler uses locales for translations of texts, date formats and such. This guide shows you how to use one of
the locales that Bryntum Scheduler ships with and how to create your own.

## Use an included locale

Bryntum Scheduler ships with a collection of locales, located under `build/locales`. These locales are in UMD format and
can be included on page using normal script tags:

```html
<script src="build/locales/scheduler.locale.SvSE.js"></script>
```

Each included locale gets registered in a global namespace (bryntum.locales), which is later checked by Schedulers
[LocaleManager](#Core/localization/LocaleManager). Because of this it is important that they are loaded before the
Scheduler, that is their script tags should be above the one for the umd bundle:

```html
<script src="build/locales/scheduler.locale.SvSE.js"></script>
<script src="build/scheduler.umd.js"></script>
```

By default, the first included locale is applied, but you can specify on the scheduler bundle script tag which one to
use:

```html
<script data-default-locale="De" src="build/scheduler.umd.js"></script>
```

Please note that the english locale is part of the Scheduler bundle, you never need to include it separately. You can
also use LocaleManager from code to switch locale at any point:

```javascript
// using module bundle
LocaleManager.locale = 'SvSE';

// using umd bundle
bryntum.grid.LocaleManager.locale = 'SvSE';

// also possible to reach it from the scheduler instance
scheduler.localeManager.locale = 'SvSE';
```

## Including a locale in React

The approach described above (using a script tag) should work for all frameworks, but, if you are using a React +
WebPack approach (or similar) you have also the option to include the locale using `import`.

```javascript
import { LocaleManager } from '@bryntum/scheduler/scheduler.umd';
import SvSE from '@bryntum/scheduler/locales/scheduler.locale.SvSE';

LocaleManager.locale = SvSE;
```

Custom localization is shown in `examples/react/javascript/localization` demo.

## Create a custom locale

<a href="../examples/localization" target="_blank">The localization demo</a> has a
custom locale (German, `custom.locale.De.js`). You can inspect it and the demo to see how to create your own and how to
include it.

The translation of scheduler strings is grouped by the scheduler's class names. Here is a small excerpt from the english
locale:

```javascript
Dependencies : {
    from    : 'From',
    to      : 'To',
    valid   : 'Valid',
    invalid : 'Invalid'
},

EventEdit : {
    nameText     : 'Name',
    resourceText : 'Resource',
    startText    : 'Start',
    endText      : 'End',
    saveText     : 'Save',
    deleteText   : 'Delete',
    cancelText   : 'Cancel',
    editEvent    : 'Edit event'
}
```

To translate, replace the string part (like "Edit event") with your translation.

A columns text can be translated in the same way using the property `Column` in the locale file.

To do that the text in the column config must be defined with the format `L{Your String}`, like in the example below:

```javascript
columns : [
    { type : 'resourceInfo', text : 'L{Resource}' }
]
```

In the locale file, include the new text to be translated on the property `Column`:

```javascript
Column : {
    Resource : 'Ressource' // in German
}
```

## Register and apply locale

When creating a separate localization file, there are 2 options to register the locale it describes:

- Call [registerLocale](#Core/localization/LocaleManager#function-registerLocale) on the LocaleManager with the
  translation you created:

```javascript
LocaleManager.registerLocale('Es', {
    desc : 'Spanish', locale : {
        localeName : 'Es',
        localeDesc : 'Spanish',
        /* other localization */
    }
});
```

- Set the locale to `window.bryntum.locales`. [LocaleManager](#Core/localization/LocaleManager) will
  register all locales specified this way:

```javascript
// prepare namespace
window.bryntum = window.bryntum || {};
window.bryntum.locales = window.bryntum.locales || {};
// register locale
window.bryntum.locales.Es = {
    localeName : 'Es',
    localeDesc : 'Spanish',
    /* other localization */
}
```

To apply the newly created locale, call [applyLocale](#Core/localization/LocaleManager#function-applyLocale) on the
LocaleManager with the locale name:

```javascript
LocaleManager.applyLocale('Es');
```

## Change date formats

Dates are formatted
using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
. Full list of locales according to BCP 47 standard is
available [here](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

Please make sure your language is supported by the Intl ECMAScript Internationalization API. You can find this
out [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/supportedLocalesOf)
.

When you create a custom locale, you need to update DateHelper.locale property according to your country code. For
example, if you create Spanish locale, you need to set:

```javascript
const locale = {
    DateHelper : {
        locale : 'es-ES'
    }
}

LocaleManager.registerLocale('Es', { desc : 'Spanish', locale : locale });
```

Scheduler uses ViewPresets to configure the timeaxis header and the date format used by tooltips and similar. A
ViewPreset among other things defines the rows displayed in the timeaxis header, from one to three levels named bottom,
middle and top. When creating a custom locale, you might want to change the date format for these levels to suite your
needs. This can be achieved by creating an entry for PresetManager with sub entries per ViewPreset.

```javascript
const locale = {

    // ... Other translations here ...

    PresetManager : {
        // Translation for the "weekAndDay" ViewPreset
        weekAndDay : {
            // Date format used by tooltips etc.
            displayDateFormat : 'll hh:mm A',
            // Change the date format for the middle and top levels
            topDateFormat    : 'MMM',
            middleDateFormat : 'D'
        }
    }
}

LocaleManager.extendLocale('En', locale);
```

This table lists all the built in ViewPresets, the unit and the date formats they use for the header levels:

|Preset          |Bottom       |Middle                 |Top                  |
|----------------|-------------|-----------------------|---------------------|
|secondAndMinute |             |second, `ss`           |minute, `llll`       |
|minuteAndHour   |             |minute, `mm`           |hour, `ddd MM/DD, hA`|
|hourAndDay      |             |hour, `LT`             |day, `ddd DD/MM`     |
|day             |hour, *      |day, `ddd DD/MM`       |                     |
|dayAndWeek      |             |day, `dd DD`           |week, *              |
|weekAndDay      |day, `DD MMM`|week, `YYYY MMMM DD`   |                     |
|weekAndDayLetter|day, *       |week, `ddd DD MMM YYYY`|                     |
|week            |hour, *      |week, `D d`            |                     |
|weekAndMonth    |             |week, `DD MMM`         |month, `MMM YYYY`    |
|weekDateAndMonth|             |week, `DD`             |month, `YYYY MMMM`   |
|monthAndYear    |             |month, `MMM YYYY`      |year, `YYYY`         |
|year            |             |quarter, *             |year, `YYYY`         |
|manyYears       |year, `YYYY` |year, `YY`             |                     |

\* Formatted using a function

In case you want to localize date formats for the default zoom levels in Scheduler, these are the ViewPresets used:

* manyYears
* year
* monthAndYear
* weekDateAndMonth
* weekAndMonth
* weekAndDayLetter
* weekAndDay
* hourAndDay
* minuteAndHour
* secondAndMinute

## Change week start day

The week start day depends on the current locale by default. To change it, configure `weekStartDay` config of
the `DateHelper` class:

```javascript
DateHelper : {
    weekStartDay : 1 // 0-6 (0: Sunday, 1: Monday etc.)
}
```

Note, a [weekStartDay](#Scheduler/view/TimelineBase#config-weekStartDay) value defined on the Scheduler instance
overrides the value in the `DateHelper` localization.

## Change single entries

It is also possible to at runtime change the translation of most items one by one. Try the following approach, but
please note that any string already displayed will not change:

```javascript
scheduler.localeManager.locale.EventEdit.deleteText = 'Scrap it';
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>