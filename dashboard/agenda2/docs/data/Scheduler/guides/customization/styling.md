# Styling

The Scheduler is rendered in the DOM using regular HTML and CSS, and can be completely styled using SASS. The resource
rows, header time axis cells (like days and months), and events of the scheduler can each be styled and colored
differently. It ships with both compiled CSS bundles and the original scss files. The CSS includes different themes and
a variety of presets and colors which can be used to alter how the Scheduler and its events look. You can also
programmatically modify the appearance of cells, headers and events using renderers.

**Note:** The trial version does not include the SASS. You need the full version to be able to follow some of the
instructions below.

## Styling event bars using predefined styles and colors

Bryntum Scheduler ships with 7 predefined event styles, each available in 12 colors. Style and color can be specified
for the entire scheduler, per resource or per event. Event settings overrides resource, which in its turn overrides the
scheduler setting. The following snippet shows how to assign colors:

```javascript
// Make all events blue by default
scheduler.eventColor = 'blue';
// Make all events assigned to a specific resource orange:
resource.eventColor  = 'orange';
// Make a single event violet:
event.eventColor     = 'violet';
```

This demo has one event per available color:

<div class="external-example" data-file="Scheduler/guides/styling/colors.js"></div>

Event styles are assigned in a very similar way:

```javascript
// Make all events use "border" style by default
scheduler.eventStyle = 'border';
// Make all events assigned to a resource use "line" style:
resource.eventStyle  = 'line';
// Make a single event colored:
event.eventStyle     = 'colored';
```

And this demo shows the predefined styles:

<div class="external-example" data-file="Scheduler/guides/styling/styles.js"></div>

Give the <a href="../examples/eventstyles" target="_blank">Event styles</a> demo a shot if you want to try
different colors and styles.

**Note:** If you want to control the appearance of events using custom CSS we recommend setting both `eventColor` and
`eventStyle` to `null`. This applies very basic styling that is easier to override using CSS.

## Styling individual events using data fields

You can style individual events easily by populating a few predefined fields of
the [EventModel](#Scheduler/model/EventModel#fields):

- [cls](#Scheduler/model/TimeSpan#field-cls) Add a CSS class to the event bar element
- [style](#Scheduler/model/TimeSpan#field-style) Inline styles for the event bar element
- [iconCls](#Scheduler/model/TimeSpan#field-iconCls) Define the icon for the event

These fields allow you to style each individually through event data.

<div class="external-example" data-file="Scheduler/guides/styling/styling-data.js"></div>

You can also apply styling at runtime using the
[eventRenderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer) which is described below.

## Sorting overlapping events

The vertical order (the non-timeaxis direction) of overlapping events rendered in a horizontal scheduler can be 
customized by overriding [overlappingEventSorter](#Scheduler/view/mixin/SchedulerEventRendering#config-overlappingEventSorter) 
function on the scheduler.

<div class="note">
Note that the algorithms (stack, pack) that lay the events out expects them to be served in chronological order, be sure
to first sort by `startDate` to get predictable results.
</div>

For example:

```javascript
let scheduler = new Scheduler({
    overlappingEventSorter(a, b) {
        return b.startDate.getTime() - a.startDate.getTime();
    },
    /*...*/
});
```

This live demo sorts events with identical timings by color:

<div class="external-example" data-file="Scheduler/guides/styling/events-order.js"></div>

## Using different themes

Scheduler ships with five themes: Stockholm, classic, classic-light, classic-dark and material. Each theme is compiled
into a self contained bundle in the `build/` folder. Simply include it on a page to use it:

```html
<link rel="stylesheet" href="build/scheduler.stockholm.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.classic.css" data-bryntum-theme">
<link rel="stylesheet" href="build/scheduler.classic-light.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.classic-dark.css" data-bryntum-theme>
<link rel="stylesheet" href="build/scheduler.material.css" data-bryntum-theme>
```

<div class="note">
The <code>data-bryntum-theme</code> attribute on the link tag is not strictly required, but it allows you to 
programmatically switch the theme at runtime using <code>DomHelper.setTheme()</code>.
</div>

### Comparison of themes:

![Classic theme](Scheduler/themes/thumb.classic.png "Default theme")
![Classic-Light theme](Scheduler/themes/thumb.classic-light.png "Light theme")
![Classic-Dark theme](Scheduler/themes/thumb.classic-dark.png "Dark theme")
![Material theme](Scheduler/themes/thumb.material.png "Material theme")
![Stockholm theme](Scheduler/themes/thumb.stockholm.png "Stockholm theme")

In most of the included examples you can switch theme on the fly by clicking on the info icon found in the header and
then picking a theme in the dropdown.

### Combining products

The "normal" themes described above includes all the CSS you need to use Scheduler and its helper widgets such as 
Popups, TextFields and so on. When combining multiple different Bryntum products on a single page using "normal" themes, 
the shared styling will be included multiple times.

To avoid this, each theme is available in a version that only has the product specific styling. These are called `thin`
themes (named `[product][theme].thin.css` -> `scheduler.stockholm.thin.css`). When using them you will need to include
one for each used level in the Bryntum product hierarchy (Scheduler -> `Core + Grid + Scheduler` and so on).

For example to combine Calendar and Scheduler using the Stockholm theme, you would include:

`core.stockholm.thin.css` + `grid.stockholm.thin.css` + `scheduler.stockholm.thin.scss` + `calendar.stockholm.thin.scss`

Which in your html file might look something like this:

```html
<link rel="stylesheet" href="core.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="grid.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="scheduler.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="calendar.stockholm.thin.css" data-bryntum-theme>
```

<div class="note">
Nothing prevents you from always using thin CSS bundles, but please note that there might be a slight network overhead 
from pulling in multiple CSS files as opposed to a single one with the normal themes.
</div>

## Creating a custom theme

To create your own theme, follow these steps:

1. Make a copy of and existing theme found under resources/sass/themes, for example classic-light.scss
2. Edit the variables in it to suit your needs (you can find all available variables by looking in
   resources/sass/variables.scss)
3. Compile it to CSS and bundle it using your favorite SASS compiler/bundler
4. Include your theme on page (and remove any default theme you where using)

Please see <a href="../examples/theme" target="_blank">Theme demo</a> for a custom theme in action:

![Custom theme](Scheduler/themes/thumb.custom.png "Custom theme")

## Customizing the event bar HTML contents

It is easy to show any HTML structure inside an event bar using
the [eventRenderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer).

```javascript
const scheduler = new Scheduler({
    appendTo: 'container',

    columns: [
        {
            text : 'Name',
            field: 'name'
        }
    ],

    eventRenderer: ({
        eventRecord,
        renderData
    }) => {
        const value = eventRecord.percentDone || 0;

        // Add an extra element to the children of the container, to display a progress bar.
        // In a real app, you should avoid having inline styles and instead style using the CSS class
        renderData.children.push({
            html     : `${eventRecord.name} ${value}%`,
            className: 'percentBar',
            style    : {
                position          : 'absolute',
                width             : `${value}%`,
                height            : '100%',
                display           : 'flex',
                'background-color': 'rgba(255, 255, 255, 0.25)',
                'padding-left'    : '1em',
                'align-items'     : 'center'
            }
        });
    }
});
```

<div class="external-example" data-file="Scheduler/guides/styling/eventrenderer.js"></div>

## Controlling output using column renderers, event renderer and CSS

Contents of grid cells, header cells and events can be fully customized using 'renderers'. Renderers are functions with
access to a the data used output grid cells / header cells / events (such as style and CSS classes, and in some cases
elements). They can manipulate the data to alter appearances or return a value to have it displayed.

In the demo below, we use the following APIs:

* [Resource `cls` field](#Scheduler/model/ResourceModel#field-cls) - To provide row specific styling
* [Column cell renderer](#Grid/column/Column#config-renderer) - To output custom cell content
* [Column header renderer](#Grid/column/Column#config-headerRenderer) - To add special text in column header
* [Time Axis cell renderer](#Scheduler/preset/ViewPresetHeaderRow#config-renderer) - To show a sad emoji on the most
  boring day week of the day (Monday)
* [Event bar renderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer) - To output custom text into
  the event bar

<div class="external-example" data-file="Scheduler/guides/styling/renderers.js"></div>

```javascript
const scheduler = new Scheduler({
    viewPreset: {
        base   : 'weekAndDayLetter',
        headers: [
            {
                unit      : 'week',
                dateFormat: 'ddd DD MMM YYYY', // Mon 01 Jan 2017
            },
            {
                unit    : 'day',
                renderer: (start, end, headerConfig, index) => {
                    if (start.getDay() === 1) {
                        headerConfig.headerCellCls = "blue-monday";
                        return '☹️';
                    }

                    return DateHelper.format(start, 'd1');
                }
            }
        ]
    },
    columns   : [
        {
            text      : 'Name',
            field     : 'name',
            width     : 160,
            htmlEncode: false,
            // Custom header renderer
            headerRenderer: ({ column }) => column.text.toUpperCase() + '!',
            // Custom cell renderer
            renderer({
                record,
                value
            }) {
                return `<i class="b-fa b-fa-${record.gender}"></i>${value}`;
            }
        }
    ],

    // Custom event renderer, simple version
    eventRenderer({
        eventRecord,
        tplData
    }) {
        // Inline style
        tplData.style = 'font-weight: bold; border-radius: 3px';
        // Add CSS class
        tplData.cls.add('my-custom-css');

        // Return the text to display
        return 'Activity: ' + eventRecord.name;
    }
});
```

## Styling dependency lines

You can easily customize the arrows drawn between events when using the Dependencies feature. To change all arrows, apply
the following basic SVG CSS:

```css
.b-sch-dependency {
    stroke-width: 2;
    stroke : red;
}

.b-sch-dependency-arrow{
    fill: red;
}
```

To style an individual dependency line, you can provide a [cls](#Scheduler/model/DependencyModel#field-cls) in your data:

```json
{
    "id"   : 9,
    "from" : 7,
    "to"   : 8,
    "cls"  : "special-dependency"
}
```

```scss
// Make line dashed 
.b-sch-dependency {
    stroke-dasharray: 5, 5;
}
```

## Other useful configs

There are a few other configs worth mentioning to affect the styling of your Scheduler/events:

* `barMargin`, distance between overlapping events within a
  resource ([docs](#Scheduler/view/mixin/TimelineEventRendering#config-barMargin)) ([demo](../examples/rowheight))
* `resourceMargin`, distance between the first and last event and the resources
  borders ([docs](#Scheduler/view/mixin/SchedulerEventRendering#config-resourceMargin)) ([demo](../examples/rowheight))
* `eventLayout`, determines if overlapping events stack, pack or simply
  overlap ([docs](#Scheduler/view/mixin/SchedulerEventRendering#config-eventLayout)) ([demo](../examples/layouts))

```javascript
 const scheduler = new Scheduler({
    barMargin     : 3,
    resourceMargin: 15,
    eventLayout   : 'pack',
    /*...*/
});
```

# Learn more

Some more information can be found in the following blog posts:

* [Styling your tasks, part 1](https://bryntum.com/blog/styling-your-tasks-part-1-built-in-styling)
* [Styling your tasks, part 2](https://bryntum.com/blog/styling-your-tasks-part-2-custom-styling)

Happy styling :)


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>