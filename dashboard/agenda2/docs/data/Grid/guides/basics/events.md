# Listening for events
Bryntums widgets and classes trigger events to notify you of changes. Listening for these events is a crucial part of
writing an application that uses Bryntum Grid. You have plenty of options for doing this in a way that suites your 
application, as detailed below.

## Where to find information on events
In the API docs events are listed at the bottom of each class documentation page, see for example 
[Grid events](#Grid/view/Grid#events). You can get there quickly by clicking on the red "e" icon found at the top of
each class (if it is grayed out the class triggers no events). Please note that you can click on an event to expand its
description and reveal any parameters it is triggered with.

## How to listen for events
To catch triggered events you have to add a listener to the object that triggers them. If you for example want to know
when a user clicks on a cell in the grid, then you should add a listener (listen) for the 
[`cellclick`](#Grid/view/mixin/GridElementEvents#event-cellClick) event available on [Grid](#Grid/view/Grid). This can be achieved in multiple ways:

### Setting up listeners during construction
You can add listeners when constructing a new instance of a class by specifying the 
[`listeners`](#Core/mixin/Events#config-listeners) config:

```javascript
const grid = new Grid({
    // other configs...
    
    listeners : {
        cellclick : myCellClickFn
    }
});
```
 
Because of how JavaScripts this-object works you might want to specify what you expect as this in your listener function:

```javascript
const grid = new Grid({
    listeners : {
        cellclick : this.myCellClickFn,
        thisObj   : this
    }
});
```

When specifying a `thisObj` it is also possible to resolve the function to call by specifying its name as a string:

```javascript
const grid = new Grid({
    listeners : {
        cellclick : 'myCellClickFn',
        thisObj   : this
    }
});
```

It is possible to add multiple listeners in one go:

```javascript
const grid = new Grid({
    listeners : {
        cellclick    : 'myCellClickFn',
        celldblclick : 'myCellDblClickFn',
        thisObj      : this
    }
});
```

Thanks to ES6 syntax for member functions you can also specify the function inline in the config in a nice way:

```javascript
const grid = new Grid({
    listeners : {
        cellclick() {
            
        }
    }
});
```

### Adding listeners after construction
You can add listeners to an existing instance using [`addListener`](#Core/mixin/Events#function-addListener) or 
[`on`](#Core/mixin/Events#function-on). Both work the same way, `on` is a bit shorter to type:

```javascript
grid.on('cellclick', () => console.log('click'));
grid.addListener('cellDblClick', () =>  console.log('dblclick'));
```

If you need to specify a `thisObj` it is possible as the third argument:

```javascript
grid.on('cellclick', this.onCellClick, this);
```

You can also pass multiple listeners as a config object in the same way as when specifying them during construction:

```javascript
grid.on({
    click    : 'onClick',
    dblclick : 'onDblClick',
    thisObj  : this
});
```

### Using "on" functions
Bryntum Grid also supports directly calling functions that match the "on[EventName]" pattern. We recommend using the 
approaches above, but this way of defining listeners can be convenient for small widgets:

```javascript
const button = new Button({
    onClick() {
        console.log('click');
    }
});
```

You can also assign on the fly:

```javascript
grid.onCellClick = () => console.log('click');
```

## The listener functions
All listener functions are called with a single argument when an event is triggered. This argument is an object that has
at least one property `source`, which is the object that triggered the event. Most events populate the object with
more information, see API docs to find out what. For example `cellclick` has the following: 

```
grid.on({
    cellclick(event) {
        // The cellclick event has the following properties (see API docs for full set):
        // source - Triggering object
        // record - Clicked rows record
        // column - Clicked cells column
    }
});
```

This single argument approach is a great fit for ES6 destructuring, allowing syntax such as this:

```
grid.on({
    cellclick({ record }) {
        // Only interested in the record, leave the others out
    }
});
```

## Asynchronous listener functions

Some events triggered by the Bryntum classes support async listeners for scenarios like confirming a drag drop operation.
Such events show an **async** badge in the API docs. A good example is the [RowReorder](#Grid/feature/RowReorder) feature
which fires [gridRowBeforeDropFinalize](#Grid/feature/RowReorder#event-gridRowBeforeDropFinalize). To show a 
confirmation dialog to the user before accepting the drop position, all you have to do is mark your method
as `async`:

```
new Grid({
    features : {
         rowReorder : {
             listeners : {
                 gridRowBeforeDropFinalize : async ({ context }) => {
                    const result = await MessageDialog.confirm({
                        title   : 'Please confirm',
                        message : 'Did you want the row here?'
                    });
    
                    // true to accept the drop or false to reject
                    return result === MessageDialog.yesButton;
                 }
             }
         }
     }
});
```

You can test this in the [row reordering](../examples/rowreordering) demo.

## Additional options

The listener config object has some useful properties such as `once` and `prio`:

* `once` allows you to specify a listener that will unregister itself after the first call. See [addListener](#Core/mixin/Events#function-addListener) for more details.


```javascript
grid.on({
    cellclick() {
        // Only called on the first click
    },
    // Call once and then unregister
    once : true
});
```

* `prio` lets you specify a listeners priority, which is used to determine the order in which listeners are called. See [addListener](#Core/mixin/Events#function-addListener) for more details.

```javascript
store.on({
    load() {
        // Called before normal load listeners
    },
    // Higher prio is called prior to lower
    prio : 100
});
```
 
It is possible to catch all events triggered by an object using a `catchAll` function:

```javascript
grid.on({
    catchAll(event) {
        // Any event triggered on grid will pass through here
    }
});
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>