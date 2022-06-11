# Styling
The Calendar is rendered in the DOM using regular HTML and CSS, and can be completely styled using CSS/SASS. It ships 
with both compiled CSS bundles and the original SCSS files. The CSS includes different themes and event colors which can 
be used to alter how the Calendar and its events look. You can also programmatically modify the appearance of cells, 
headers and events using renderers.

**Note:** The trial version does not include the SASS. You need the full version to be able to follow some of the 
instructions below.

## Styling events using predefined colors
Bryntum Calendar ships with a palette of 12 predefined event colors, matching the colors available in Scheduler. Color 
can be specified per resource or per event. Event settings overrides resource. The following snippet shows how to assign 
colors:

```javascript
// Make all events assigned to a specific resource orange:
resoure.eventColor = 'orange';
// Make a single event violet:
event.eventColor = 'violet';
```

This demo has one event per available color:

<div class="external-example" data-file="Calendar/guides/styling/colors.js"></div>

And the same colors in a month view:

<div class="external-example" data-file="Calendar/guides/styling/colors-month.js"></div>

## Using different theme

Calendar ships with five themes: stockholm, classic, classic-light, classic-dark and material. Each theme is compiled
into a self containing bundle in the `build/` folder.  Simply include it on a page to use it:

```html
<link rel="stylesheet" href="build/scheduler.stockholm.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.classic.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.classic-light.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.classic-dark.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.material.css" data-bryntum-theme">
```

<div class="note">
The <code>data-bryntum-theme</code> attribute on the link tag is not strictly required, but it allows you to 
programmatically switch the theme at runtime using <code>DomHelper.setTheme()</code>.
</div>

### Comparison of themes:

![Classic theme](Calendar/themes/thumb.classic.png "Default theme")
![Classic-Light theme](Calendar/themes/thumb.classic-light.png "Light theme")
![Classic-Dark theme](Calendar/themes/thumb.classic-dark.png "Dark theme")
![Material theme](Calendar/themes/thumb.material.png "Material theme")
![Stockholm theme](Calendar/themes/thumb.stockholm.png "Stockholm theme")

In most of the included examples you can switch theme on the fly by clicking on the info icon found in the header and
then picking a theme in the dropdown.

### Combining products

The "normal" themes described above includes all the CSS you need to use Calendar and its helper widgets such as
Popups, TextFields and so on. When combining multiple different Bryntum products on a single page using "normal" themes,
the shared styling will be included multiple times.

To avoid this, each theme is available in a version that only has the product specific styling. These are called `thin`
themes (named `[product][theme].thin.css` -> `calendar.stockholm.thin.css`). When using them you will need to include
one for each used level in the Bryntum product hierarchy (Calendar -> `Core + Grid + Scheduler + Calendar` and so on).

For example to combine Calendar and TaskBoard using the Stockholm theme, you would include:

`core.stockholm.thin.css` + `grid.stockholm.thin.css` + `scheduler.stockholm.thin.scss` + `calendar.stockholm.thin.scss`
+  `taskboard.stockholm.thin.scss` +

Which in your html file might look something like this:

```html
<link rel="stylesheet" href="core.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="grid.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="scheduler.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="calendar.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="taksboard.stockholm.thin.css" data-bryntum-theme>
```

<div class="note">
Nothing prevents you from always using thin CSS bundles, but please note that there might be a slight network overhead 
from pulling in multiple CSS files as opposed to a single one with the normal themes.
</div>

## Creating a custom theme

To create your own theme, follow these steps:

1. Make a copy of and existing theme found under resources/sass/themes, for example material.scss
2. Edit the variables in it to suit your needs (you can find all available variables by looking in resources/sass/variables.scss)
3. Compile it to CSS and bundle it using your favorite SASS compiler/bundler
4. Include your theme on page (and remove any default theme you where using)

## Using renderers and CSS

Contents of events can be fully customized using 'renderers'. Renderers are functions with access to a data used output 
events (such as style and CSS classes). They can manipulate the data to alter appearances or return a value to have it 
displayed.

In the demo below, we use the following APIs:
* [Event `cls` field](#Scheduler/model/EventModel#field-cls) - To provide event specific styling
* [Resource `cls` field](#Scheduler/model/ResourceModel#field-cls) - To provide resource specific styling
* [Event renderer](#Calendar/widget/mixin/CalendarMixin#config-eventRenderer) - To affect text and style of the event

<div class="external-example" data-file="Calendar/guides/styling/renderers.js"></div>

```javascript
const calendar = new Calendar({
   // Redacted for brevity
    events : [
        { duration : 4, name : 'A' },
        // Event with custom CSS class
        { duration : 4, name : 'B (event cls)', cls : 'important' },
        { duration : 2, name : 'C' },
        // Events linked to a resource, which uses a custom CSS class
        { duration : 4, name : 'D (resource cls)', resourceId : 'resource' },
        { duration : 4, name : 'E (resource cls)', resourceId : 'resource' },
        { duration : 2, name : 'F' },
        { duration : 4, name : 'G' }
    ],

    resources : [
        // Resource with a custom CSS class
        { id : 'resource', cls : 'resource' }
    ],

    // Function exectued for each event when rendering. Used here to change color and text of short events
    eventRenderer({ eventRecord, renderData }) {
        if (eventRecord.duration <= 2) {
            renderData.eventColor = 'deep-orange';
            return 'Short event (renderer)';
        }
    }
});
```

Happy styling :)


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>