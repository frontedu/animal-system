# Using a Scheduler as a Calendar mode.

A Scheduler may be specified as a mode of the Calendar if you have purchased a Scheduler licence.

To enable this configure a mode with a name of your choice, and configure it with a type and a
`displayName`

```
modes : {
    timeline : {
        type : 'scheduler',

        // Used by the Calendar's mode selector button
        displayName : 'Timeline',

        features : {
            resourceTimeRanges : true
        }
    }
}
```

## Features of the Scheduler when Scheduler used as a Calendar mode.
Features which the Calendar supplies take precedence. So the `EventTooltip`, `EventMenu`, `EventEdit`
and `ScheduleMenu` features of the Calendar are used in preference to those same features in the Scheduler.

This makes it easy to configure these in one place - on the Calendar's configuration.

Other features which are specific to Schedulers are still configured on the Scheduler.

# Creating a custom view to incorporate into your calendar
The [`modes`](#Calendar/view/Calendar#config-modes) config for a [Calendar](#Calendar/view/Calendar) can be extended to include custom view types which you may create based upon the Bryntum [Widget](#Core/widget/Widget) class, or the Bryntum [Grid](#Grid/view/Grid) class.

To do this, the created class must not only extend [Widget](#Core/widget/Widget), but it must also expose an interface that the encapsulating Calendar view knows how to deal with.

Once the class is defined, at the end of the module, it must be registered with the calendar's mode factory:

```javascript
Calendar.Modes.register('mynewtype', MyClassName);
```

The "Custom Rendering" Calendar demo contains a simple example of a custom view implementation.

## Mixins

A `mode` widget must mixin the [`CalendarStores`](#Calendar/mixin/CalendarStores) mixin which provides machinery to enable the widget to receive a [`Project`](#Scheduler/model/ProjectModel) as part of its configuration.

You may then implement the following interface methods to gain access to the calendar data stores:

- **updateEventStore(eventStore)**

    Parameters

    * eventStore : [`EventStore`](#Scheduler/data/EventStore)
        The incoming project's EventStore

    Called after the `eventStore` property has been set. You may react to this in any way in this method.
- **updateResourceStore(resourceStore)**

    Parameters

    * resourceStore : [`ResourceStore`](#Scheduler/data/ResourceStore)
        The incoming project's ResourceStore 

    Called after the `resourceStore` property has been set. You may react to this in any way in this method.
- **onCalendarStoreChange**

    Parameters

    * changeEvent : [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
        The store's change event detailing exactly what changed. 

    Called when any [change](#Core/data/Store#event-change) is made to either of the project's stores. This includes addition and removal of records and mutation of records. You may react to this in any way in this method. 
    
    Usually, this is the cue to refresh the UI in an implementation-specific way.

## Properties

A `mode` widget must expose the following properties:

- **description** : `String`

    A read-only string value which describes the content of the view. Displayed in the Calendar's top toolbar.
- **displayName** : `String`

    A read-only string value which becomes the text in the selector button in the Calendar's top toolbar.
- **stepUnit** : `String`

    A descriptive name of the unit by which the view moves though time for use by the `prevButton` and `nextButton` in the Calendar's top toolbar.
- **startDate** : `Date`

    The start date of the view. This is usually a zeroed date (midnight)
- **endDate** : `Date`

    The end date of the view. This is usually a zeroed date (midnight) and is *exclusive*. do not think of the term `Date` as meaning a 24 hour period. It is a timepoint which specifies the end of event visibility for the view.
    
    So a **single** day view may have `startDate : 2020-10-01T00:00:00` and `endDate : 2020-10-02T00:00:00`. This encapsulates *one* 24 hour period.
- **date** : `Date`

    Gets/sets a `Date` which must be in view. It is up to the implementor to snap the start and end dates (See above) to valid time points for the view type.

## Methods

The Calendar view's `prevButton` and `nextButton` calls the following methods on the active view:

- **previous()**
- **next()**

You must implement these to change the view's start and end dates according to its `stepUnit`.

If you wish your view to participate in a Calendar's [refresh](#Calendar/view/Calendar#function-refresh) calls, then you should implement a `refresh` method to redraw the UI.

As mentioned above in the mixins section, to react to data changes, you may implement an `onCalendarStoreChange` method.

## Events

In order for the Calendar to know when to update its toolbar's description from the activeView's
`description` property, your view should [trigger](#Core/mixin/Events#function-trigger) a `refresh` event when it refreshes its UI.

That will be when the date range changes, or when a Calendar store is changed in any way. See the `onCalendarStoreChange` interface method above.


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>