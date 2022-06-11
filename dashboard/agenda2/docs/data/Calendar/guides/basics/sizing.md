# Sizing the component

Bryntum components are intended to be sized using CSS, but it is also possible to give them a fixed size
programmatically.

When rendered into an element without any sizing rules applied, a warning is displayed on the console:

```text
The Calendar is sized by its predefined minHeight, likely this is not intended.
Please check your CSS and review how you size the widget, or assign a fixed height in the config. 
For more information, see the "Basics/Sizing the component" guide in docs.
```

To get rid of this warning and give the component the size you want, either apply sizing rules using CSS or configure a
fixed size.

NOTE: This guide uses Calendar in the snippets, but the same principles applies to Scheduler, Scheduler Pro, Gantt,
Calendar
and TaskBoard.

## Using CSS (recommended)

Most included demos renders the component into a container element that uses a flexbox layout with `column` direction.
The `flex` value then drives the height of the component. But this is not a requirement, the components can be sized
using any CSS (parent element with block layout, flexbox layout or grid layout) as long as the component element itself
still uses flexbox layout (`display : flex`).

Using a fixed width and height:

```css
.b-calendar {
    width  : 800px;
    height : 600px;
}
```

Filling a parent element that uses block layout:

```css
.b-calendar {
    width  : 100%;
    height : 100%;
}
```

Filling a parent element that uses flex column:

```css
.b-calendar {
    flex  : 1; /* Drives height */
    width : 100%; /* Width might not be needed, depending on rules applied to the parent */
}
```

Filling a parent element that uses flex row:

```css
.b-calendar {
    height : 100%; /* Height might not be needed, depending on rules applied to the parent */
    flex   : 1; /* Drives width */
}
```

## Programmatically

The components have [width](#Core/widget/Widget#property-width) and [height](#Core/widget/Widget#property-height)
configs that accepts numerical (in `px`) and string based sizes. Set them to use a fixed size:

```javascript
const calendar = new Calendar({
    width  : 800, // = 800px
    height : '30em'
})
```

API docs for other size related configs:

* [minWidth](#Core/widget/Widget#property-minWidth)
* [minHeight](#Core/widget/Widget#property-minHeight)
* [maxWidth](#Core/widget/Widget#property-maxWidth)
* [maxHeight](#Core/widget/Widget#property-maxHeight)
* [flex](#Core/widget/Widget#property-flex)


<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>