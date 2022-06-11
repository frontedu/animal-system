# Responsive

The scheduler can be configured to work well on many different screen sizes. This is achieved by specifying different
responsive "levels" on the scheduler and then having per level configurations on the columns.

## Responsive levels

Responsive levels can be explained as named widths. When the scheduler is smaller than the width of a predefined level it
applies that level as its current. Which basically does two things:

1. Applies a CSS class to the scheduler (b-responsive-[level]).
2. Applies any level based configs to the columns and the scheduler itself

A basic example of specifying responsive levels:

```javascript
let scheduler = new Scheduler({
    responsiveLevels: {
        small: 600,
        normal: '*'
    }
});
```

```css
.b-responsive-small { font-size: 1.6vw; }
```

In the scheduler below, try resizing the browser window to make it < 600 pixels wide and notice how the text size adjusts
as you drag (it will also make the border around the scheduler red, to make it more apparent).

<div class="external-example" data-file="Scheduler/guides/responsive/basic.js"></div>

Once the scheduler becomes less than 600 pixels wide it will apply the "small" responsive level. Larger widths will
apply the "normal" level. You can have as many levels as you desired and you can name them freely as long as the name is
valid when used as a CSS class.

## Styling based on responsive level

As mentioned above a CSS class corresponding to the currently active level is added to the grid. Using for example the
level definitions from the example above, you will get one of the following:

```
<div class="b-scheduler ... b-responsive-small"></div>
<div class="b-scheduler ... b-responsive-normal"></div>

```

By scoping your CSS rules to one of those selectors you can have styling applied depending on responsive level. For
example, to make the text smaller in headers in a narrower grid:

```css
.b-responsive-small .b-grid-header {
    font-size: .6em;
}
```

## Using Scheduler configs

When specifying responsive levels, it is possible to give a config object instead of a width (or '*'). If you chose to
do so, the config object must include a width config. All other config options are applied to the scheduler using state,
see [SchedulerState mixin](#Scheduler/view/mixin/SchedulerState) for more information. For example making rows lower and
changing event color:

```
let scheduler = new Scheduler({
    responsiveLevels : {
        small  : {
            levelWidth : 600,
            rowHeight  : 30,
            barMargin  : 0,
            eventColor : 'pink'
        },
        normal : {
            levelWidth : '*',
            rowHeight  : 50,
            barMargin  : 10,
            eventColor : 'violet'
        }
    }
});
```

Try making the window narrower to see the above configs in action in this demo:

<div class="external-example" data-file="Scheduler/guides/responsive/advanced.js"></div>

## Using per column configuration

Columns can have a configuration called responsiveLevels, that defines what configuration options to apply to the column
at a certain responsive level. For example hiding a column when the scheduler is small:

```javascript
let scheduler = new Scheduler({
    responsiveLevels : {
        small  : 600,
        normal : '*'
    },

    columns : [
        { text : 'Name', field : 'name', width: 150 },
        {
            text             : 'Company',
            field            : 'company',
            width            : 150,
            responsiveLevels : {
                small : { hidden : true },
                '*'   : { hidden : false }
            }
        }
    ]
});
```

Going from one responsive level to another will not replace configuration done on the previous level. Thus you should as
shown in the example above specify any config needed to counteract previous levels (if * did not specify hidden: false
it would stay hidden).

Try making the window smaller and see that the Company column gets hidden.

<div class="external-example" data-file="Scheduler/guides/responsive/columns.js"></div>

Supported responsive column configuration options:

* width
* flex
* text
* region
* renderer
* editor
* hidden

## More demos
A separate Responsive demo can be found in the ´/examples/responsive´ folder, and it shows a combination of the techniques mentioned above.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>