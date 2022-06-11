# Dragging unplanned tasks from an external grid

## Intro

A popular way of scheduling unplanned tasks is to list them in an external data grid and use drag drop to schedule &
assign them. With the Bryntum Scheduler this is very easy to achieve and in this guide we will show you how
the [`dragfromgrid`](../examples/dragfromgrid) example was built. **Please note**, the Grid component is licensed
separately from the Scheduler component.

<iframe style="height:400px" src="../examples/dragfromgrid?screenshot&develop=1&hide-toolbar"></iframe>

## Creating the Scheduler and Grid components

This demo has been structured to use a few custom subclasses of Scheduler and Grid to keep things tidy. You can inspect
the sources of these classes in the `./lib/` folder. We append our two main components directly to the DOM inside a DIV 
with id `main`. The scheduler does not need any special configuration to receive items dragged from the external grid. It is
simply configured with a [`startDate`](#Scheduler/view/Scheduler#config-startDate), [`endDate`](#Scheduler/view/Scheduler#config-endDate) 
and [`crudManager`](#Scheduler/view/Scheduler#config-crudManager) to handle data loading. 

```javascript
let schedule = new Schedule({
    ref        : 'schedule',
    insertFirst: 'main',
    startDate  : new Date(2025, 11, 1, 8),
    endDate    : new Date(2025, 11, 1, 18),
    flex       : 1,
    crudManager: {
        autoLoad: true,
        eventStore      : {
            storeClass: TaskStore
        },
        resourceStore   : {
            modelClass: CustomResourceModel
        },
        transport       : {
            load: {
                url: 'data/data.json'
            }
        }
    }
});

new Splitter({
    appendTo: 'main'
});

const unplannedGrid = new UnplannedGrid({
    ref        : 'unplanned',
    appendTo   : 'main',
    title      : 'Unplanned Tasks',
    width      : 300,

    store  : {
        modelClass: Task,
        readUrl   : 'data/unplanned.json',
        autoLoad  : true
    }
});
```

The data grid uses a plain flat store, which is configured to use the same Task `modelClass` as the Scheduler (see `./lib/Task.js`).
The Task model is based on the [EventModel](#Scheduler/model/EventModel).

The containing element lays out its children using basic [flex box CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox).

```css
#main {
   display        : flex;
   flex-direction : row;
   flex           : 1 1 100%;
}
```

The [Splitter](#Core/widget/Splitter) is rendered between the components and lets us resize them easily.

## Configuring the DragHelper

With the two main components added to the page, it is time to start thinking about the dragging. The
[DragHelper](#Core/helper/DragHelper) will provide the drag functionality to allow rows to be dragged from the unplanned
grid and dropped as a task on the Scheduler element.

In the demo, the Drag functionality is encapsulated in a custom demo `Drag` subclass of DragHelper. First, a simple skeleton
with some basic configuration is added.

```
import DragHelper from '../../../lib/Core/helper/DragHelper.js';

export default class Drag extends DragHelper {
    static get configurable() {
        return {
            callOnFunctions      : true,
            // Don't drag the actual row element, clone it
            cloneTarget          : true,
            // We size the cloned element manually
            autoSizeClonedTarget : false,
            // Only allow drops on the schedule area
            dropTargetSelector   : '.b-timeline-subgrid',
            // Only allow drag of row elements inside on the unplanned grid
            targetSelector       : '.b-grid-row:not(.b-group-row)'
        };
    }

    // Drag start callback 
    onDragStart({ context }) {
       // TODO
    }

    // Drag callback called every mouse move
    onDrag({ event, context }) {
       // TODO
    }

    // Drop callback after a mouse up, take action and transfer the unplanned task to the real EventStore (if it's valid)
    onDrop({ context }) {
       // TODO
    }
};
```

Above, the following configurations are used:

* [`cloneTarget`](#Core/helper/DragHelper#config-cloneTarget) We set this to `true` to clone the mouse-down element, and
  not move the actual grid row.
* [`targetSelector`](#Core/helper/DragHelper#config-targetSelector) This is a CSS selector defining what elements are
  draggable, we set it to `.b-grid-row:not(.b-group-row)`
* [`dropTargetSelector`](#Core/helper/DragHelper#config-dropTargetSelector) This is a CSS selector defining where drops
  are allowed, and we set this to `.b-timeline-subgrid` which the Scheduler's timeline sub grid
* [`callOnFunctions`](#Core/helper/DragHelper#config-callOnFunctions) By setting this to `true`, we will receive onXXX (
  e.g. onDragStart / onDrop) callbacks which is an easier way of listening for events

## Processing drag start

A drag is deemed started when the pointer has moved more than the
configured [dragThreshold](#Core/helper/DragHelper#config-dragThreshold)
(defaults to 5px). At this time the `dragStart` event is fired and if using `callOnFunctions`, the `onDragStart`
callback is called. The first thing to decide is, what should the user visually see when dragging. 

## Creating the drag proxy element

We want the visual representation of the dragged element to look like an event bar. Hence we define a [createProxy](#Core/helper/DragHelper#function-createProxy)
method which lets us define the exact HTML markup to use for the drag proxy.

```javascript
createProxy(element) {
    const
        proxy                 = document.createElement('div'),
        { context, schedule } = this,
        task                  = this.grid.getRecordFromElement(element),
        durationInPx          = schedule.timeAxisViewModel.getDistanceForDuration(task.durationMS);

    // Fake an element bar
    proxy.classList.add('b-sch-event-wrap', 'b-sch-event', 'b-unassigned-class', `b-sch-${schedule.mode}`);
    proxy.innerHTML = `<div class="b-sch-event b-has-content b-sch-event-withicon">
        <div class="b-sch-event-content">
            <i class="${task.iconCls}"></i> ${task.name}
        </div>
    </div>`;

    proxy.style.height = `${schedule.rowHeight - (2 * schedule.resourceMargin)}px`;
    proxy.style.width  = `${durationInPx}px`;

    return proxy;
}
```

In our demo, at this stage we do not want to do too much - only adapt the Grid and Scheduler a bit. For the grid, we just
ensure any ongoing cell edit is finalized. And for the Scheduler, we enable scrolling when moving mouse close to edges, to
ensure user can reach all parts of the tree. We also disable the [EventTooltip](#Scheduler/feature/EventTooltip) feature so it
does not show tooltips while we drag over the timeline.

We assign a `task` reference to the dragged record so we can access it later during the drag process.
```javascript
onDragStart({ context }) {
    const
        me                          = this,
        { schedule }                = me,
        { eventTooltip, eventDrag } = schedule.features;

    // save a reference to the task so we can access it later
    context.task = me.grid.getRecordFromElement(context.grabbed);
  
    // Prevent tooltips from showing while dragging
    eventTooltip.disabled = true;
  
    schedule.enableScrollingCloseToEdges(schedule.timeAxisSubGrid);
}
```

## Indicating drag validity 

In our demo, the main objective in the `onDrag` callback is to validate the drop and let the user know if the drop is valid. 
A special `context` object is provided to every event / callback, which has a `valid` boolean indicating drop validity.
We look up the current `startDate` and `endDate` based on the position of the drag proxy and [query](#Scheduler/view/Scheduler#function-isDateRangeAvailable) 
the scheduler to know if the resource is available for the specified time slot.

In the code below, we also cache the currently hovered resource record to be able to use it in the `onDrop` callback.

```javascript
onDrag({ event, context })
{
    const
        me           = this,
        { schedule } = me,
        { task }     = context,
        coordinate   = DomHelper[`getTranslate${schedule.isHorizontal ? 'X' : 'Y'}`](context.element),
        startDate    = schedule.getDateFromCoordinate(coordinate, 'round', false),
        endDate      = startDate && DateHelper.add(startDate, task.duration, task.durationUnit),
        // Coordinates required when used in vertical mode, since it does not use actual columns
        resource     = context.target && schedule.resolveResourceRecord(context.target, [event.offsetX, event.offsetY]);

    // Don't allow drops anywhere, only allow drops if the drop is on the timeaxis and on top of a Resource
    context.valid &= Boolean(startDate && resource) &&
            (schedule.allowOverlap || schedule.isDateRangeAvailable(startDate, endDate, null, resource));
  
    // Save reference to resource so we can use it in onDrop
    context.resource = resource;
}
```

## Processing the drop

When a valid drop happens, we remove the dragged record from the unplanned grid store then add it
to the Scheduler´s  [task store](#Scheduler/data/EventStore) and [assign](#Scheduler/model/EventModel#function-assign) 
it to the correct resource. And lastly, we just to revert the changes made in `onDragStart`.

```javascript
onDrop({ context, event }) {
    const
        me                                         = this,
        { schedule }                               = me,
        { task, target, resource, valid, element } = context;
    
    // If drop was done in a valid location, set the startDate and transfer the task to the Scheduler event store
    if (valid && target) {
        const
            coordinate        = DomHelper[`getTranslate${schedule.isHorizontal ? 'X' : 'Y'}`](element),
            date              = schedule.getDateFromCoordinate(coordinate, 'round', false);
  
        if (date) {
            // Remove from grid first so that the data change
            // below does not fire events into the grid.
            me.grid.store.remove(task);
      
            task.startDate = date;
            task.assign(resource);
            schedule.eventStore.add(task);
        }
    }

    schedule.disableScrollingCloseToEdges(schedule.timeAxisSubGrid);
    schedule.features.eventTooltip.disabled = false;
}
```

## The final result

Here is a small video showing the final result

<video controls width="100%">
<source src="Scheduler/drag-unplanned-tasks-from-grid.mp4" type="video/mp4">
Sorry, your browser doesn't support embedded videos.
</video>

## Learn more...

Want to learn more about what can be done relating to drag drop with the Bryntum SDKs? Please see these resources:

* [View the `drag-onto-tasks` demo](../examples/drag-onto-tasks)
* [View the `drag-between-schedulers` demo](../examples/drag-between-schedulers)
* [DragHelper API docs](#Core/helper/DragHelper)


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>