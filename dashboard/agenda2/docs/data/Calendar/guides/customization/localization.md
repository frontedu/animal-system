# Localization

Localization is the process of adapting a product to be suitable for a specific location or market. It is not only
translation of texts from one language to another but it also includes other aspects of adapting the components and the
user interface. Such adaptations include:

1. Translations of texts
2. Adjusting date, time, number and currency formats
3. Setting the day week starts on
4. Translation of day, months and other units' names
5. Handling of plural forms of words

This guide shows how to use Bryntum's built-in localization and how to extend it to cover the whole application.

## Locale

A locale is a collection of data that defines the texts and other settings for a specific country. Technically, it is an
object which encapsulates this data. An example of the (abbreviated) German locale follows:

```javascript
const localeDe = {

    localeName : 'De',
    localeDesc : 'Deutsch',

    Calendar : {
        Today    : 'Heute',
        next     : unit => `Nächsten ${unit}`,
        previous : unit => `Vorheriger ${unit}`,
        plusMore : value => `+${value} mehr`
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Halten sie die STRG-Taste für ein wiederkehrendes ereignis gedrückt'
    },

    EventTip : {
        'Edit event' : 'Buchung redigieren'
    }
}

export default localeDe;
```

Bryntum Calendar ships with the following locales:

- English (En) - default locale
- Netherlands - Dutch (Nl)
- Russian - Русский (Ru)
- Swedish - Svenska (SvSE)

## Locale Manager

<a href="#Core/localization/LocaleManager">LocaleManager</a> is a singleton (i.e. only one instance of LocaleManager
exists in the application), that manages locales and handles their switching.

The key LocaleManager methods are:

- [applyLocale](#Core/localization/LocaleManager#function-applyLocale): used to set the active locale. Simple assignment
  works too: `LocaleManager.locale = 'SvSE'`
- [extendLocale](#Core/localization/LocaleManager#function-extendLocale): used to extend an existing locale
- [registerLocale](#Core/localization/LocaleManager#function-registerLocale): used to register a new locale

The locale must be registered before it can be applied (used).

## Using an included locale with script tags

Built locales are located under `build/locales`. These locales are in UMD format and can be included on page using
normal script tags:

```html
<script src="build/locales/calendar.locale.SvSE.js"></script>
```

Each of these locales gets registered in a global namespace `bryntum.locales`, that is later checked
by [LocaleManager](#Core/localization/LocaleManager), which is loaded together with Calendar. Because of this, it is
important that they are loaded before the Calendar, therefore their script tags should be above the one for the umd
bundle:

```html
<script src="build/locales/calendar.locale.SvSE.js"></script>
<script src="build/calendar.umd.js"></script>
```

By default, the first included locale is applied, but you can specify on the calendar bundle script tag which one to
use:

```html
<script data-default-locale="De" src="build/calendar.umd.js"></script>
```

Please note that the English locale is part of the Calendar bundle, you never need to include it separately. You can
also use LocaleManager from code to switch locale at any point:

```javascript
// using module bundle
LocaleManager.locale = 'SvSE';

// using umd bundle
bryntum.calendar.LocaleManager.locale = 'SvSE';
```

This way it is compatible with Internet Explorer version 11 and higher.

## Using an included locale with import

It is also possible to import locales directly in the javascript code using the `import` statement. This way can be used
for modern browsers or if Babel and WebPack are used to transpile and pack the application for older browsers. This
approach naturally works for frameworks such as Angular, React, Vue and others and is preferred whenever possible.

Locales would be imported at the very beginning of the application, for example:

```javascript
// locales
import '../../build/locales/calendar.locale.SvSE.js';
import { Calendar, LocaleManager } from '../../build/calendar.module.js';

// other imports and code...

// set the locale
LocaleManager.locale = SvSE;
```

_Note: If you work with a framework that does not allow accessing files up the directory tree (`../../`), for example
React CLI application, then you can copy the locale files to the application directory and import them from there._

## Create a custom locale

The `<a href="../examples/localization" target="_blank">localization demo</a>` (found at `examples/localization`) has
custom locales under `locales` folder. German locale (`custom.locale.De.js`) is created from scratch without any parent.
Other locales are extensions of the existing locales.

You can inspect the Localization demo and inspect the locale files to see how to create your own locales and how to use
them in your application.

The translation of calendar strings is grouped by class names. Here is a small excerpt from the English locale:

```javascript

EventEdit : {
    Calendar  : 'Calendar',
    'All day' : 'All day'
},

Calendar : {
    Today    : 'Today',
    next     : unit => `Next ${unit}`,
    previous : unit => `Previous ${unit}`,
    plusMore : value => `+${value} more`
}
```

To translate, replace the string part (like "All day") with your translation.

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
available [here](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). When you create a
custom locale, you need to update DateHelper.locale property according to your country code. For example, if you create
Spanish locale, you need to set:

```javascript
const locale = {
    DateHelper : {
        locale : 'es-ES'
    }
}

LocaleManager.registerLocale('Es', { desc : 'Spanish', locale : locale });
```

## Extending an existing locale

The shipped locales, including the default English locale, can be extended to localize the whole application. The locale
is extended by using LocaleManager, for example:

```javascript
import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
import '../../../lib/Scheduler/localization/Nl.js';

LocaleManager.extendLocale('Nl', {
    
    Button : {
        'My button'        : 'Mijn knop',
        'Button with menu' : 'Knop met menu',
        'Other button'     : 'Andere knop'
    },
    
    MenuItem : {
        'Menu item 1' : 'Menu onderdeel 1',
        'Menu item 2' : 'Menu onderdeel 2'
    },

    // other translations
});
```

## Change single entries

It is also possible to at runtime change the translation of most items one by one. Try the following approach, but
please note that any string already displayed will not change:

```javascript
LocaleManager.locale.Calendar.Today = 'Now';
```

## Using L function

L function executes the translation itself and returns the localized string.

The static translations described above are sufficient in the majority of cases, but they will not do for more complex
tasks where we want to implement a complex pluralization or any other localization that is based on the runtime data.
For these to work we need to do the following:

1. Translation in the locale file must be a function, for example:

```javascript
Button : {
    'My button' : data => `Mein knopf ${data}`,
},
```

The function takes one argument `data` (it can be an object) that can be used to compose the resulting displayed text (a
simple concatenation in this case). The `data` argument is passed to this function from the L call.

2. L must be called with 2 arguments, for example:

```javascript
/**
 * Sets My Button text by calling L function and providing data
 */
function setMyButtonText() {
    const myButton = panel.widgetMap.myButton;
    myButton.text = myButton.L('My button', Math.floor(Math.random() * 100));
}
```

The first argument is the text to translate ('My button' in this case) and second argument is any kind of data needed
for the locale function (random number between 0-99 in this case).

3. Install a listener on Locale manager that invokes the translations, for example:

```javascript
LocaleManager.on('locale', () => {
    setMyButtonText();
});
```

You can see the above in action <a href="../examples/localization" target="_blank">here</a>.

_Note: The L function is implemented in <a href="#Core/localization/Localizable" target="_blank">Localizable</a> mixin
that is mixed into each Bryntum widget so that accessing it is very easy._


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>