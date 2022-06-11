# Listening for events
Bryntums widgets and classes trigger events to notify you of changes. Listening for these events is a crucial part of
writing an application that uses Bryntum Scheduler. You have plenty of options for doing this in a way that suites your 
application, as detailed below.
## Where to find information on events
In the API docs events are listed at the bottom of each class documentation page, see for example 
[Scheduler events](#Scheduler/view/Scheduler#events). You can get there quickly by clicking on the red "e" icon found at the top of
each class (if it is grayed out the class triggers no events). Please note that you can click on an event to expand its
description and reveal any parameters it is triggered with.

## How to listen for events
To catch triggered events you have to add a listener to the object that triggers them. If you for example want to know
when a user clicks on an event bar in the scheduler, then you should add a listener (listen) for the 
[`eventclick`](#Scheduler/view/mixin/SchedulerDomEvents#event-eventClick) event on [Scheduler](#Scheduler/view/Scheduler). This can be achieved in multiple ways:

### Setting up listeners during construction
You can add listeners when constructing a new instance of a class by specifying the 
[`listeners`](#Core/mixin/Events#config-listeners) config:

```javascript
const scheduler = new Scheduler({
    // other configs...
    
    listeners : {
        eventclick : myCellClickFn
    }
});
```
 
Because of how JavaScripts this-object works you might want to specify what you expect as this in your listener function:

```javascript
const scheduler = new Scheduler({
    listeners : {
        eventclick : this.myCellClickFn,
        thisObj    : this
    }
});
```

When specifying a `thisObj` it is also possible to resolve the function to call by specifying its name as a string:

```javascript
const scheduler = new Scheduler({
    listeners : {
        eventclick : 'myEventClickFn',
        thisObj    : this
    }
});
```

It is possible to add multiple listeners in one go:

```javascript
const scheduler = new Scheduler({
    listeners : {
        eventclick    : 'myEventClickFn',
        eventdblclick : 'myEventDblClickFn',
        thisObj       : this
    }
});
```

Thanks to ES6 syntax for member functions you can also specify the function inline in the config in a nice way:

```javascript
const scheduler = new Scheduler({
    listeners : {
        eventclick() {
            
        }
    }
});
```

### Adding listeners after construction
You can add listeners to an existing instance using [`addListener`](#Core/mixin/Events#function-addListener) or 
[`on`](#Core/mixin/Events#function-on). Both work the same way, `on` is a bit shorter to type:

```javascript
scheduler.on('eventclick', () => console.log('click'));
scheduler.addListener('cellDblClick', () =>  console.log('dblclick'));
```

If you need to specify a `thisObj` it is possible as the third argument:

```javascript
scheduler.on('eventclick', this.onEventClick, this);
```

You can also pass multiple listeners as a config object in the same way as when specifying them during construction:

```javascript
scheduler.on({
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
scheduler.onEventClick = () => console.log('click');
```

## The listener functions
All listener functions are called with a single argument when an event is triggered. This argument is an object that has
at least one property `source`, which is the object that triggered the event. Most events populate the object with
more information, see API docs to find out what. For example `eventclick` has the following: 

```javascript
scheduler.on({
    eventclick(event) {
        // The eventclick event has the following properties:
        // source - Triggering object
        // eventRecord - Clicked events record
        // event - The browser click event
    }
});
```

This single argument approach is a great fit for ES6 destructuring, allowing syntax such as this:

```javascript
scheduler.on({
    eventclick({eventRecord}) {
        // Only interested in the record, leave the others out
    }
});
```

## Additional options
The listener config object has some useful properties such as `once` and `prio`:

* `once` allows you to specify a listener that will unregister itself after the first call. See [addListener](#Core/mixin/Events#function-addListener) for more details.


```javascript
scheduler.on({
    eventclick() {
        // Only called on the first click
    },
    // Call once and then unregister
    once : true
});
```

* `prio` lets you specify a listeners priority, which is used to determine the order in which listeners are called. See [addListener](#Core/mixin/Events#function-addListener) for more details.

```javascript
resourceStore.on({
    load() {
        // Called before normal load listeners
    },
    // Higher prio is called prior to lower
    prio : 100
});
```
 
It is possible to catch all events triggered by an object using a `catchAll` function:

```javascript
scheduler.on({
    catchAll(event) {
        // Any event triggered on scheduler will pass through here
    }
});
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>