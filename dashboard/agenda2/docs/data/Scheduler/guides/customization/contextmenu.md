# Customizing the Event, Schedule, and TimeAxis header menus

Bryntum Scheduler ships with built in context menus for the locked grid cells and column headers, for events, and for
the schedule zone and its header. All the context menu features are customizable. The Scheduler is built upon the Grid,
so customization of the Cell menu and the Header menu can be found in the Grid docs.

Customization of the Event menu, the Schedule menu, and the TimeAxisHeader menu are similar to the context menus in Grid.
and you will find more details about it in this guide.

Right-click an event, the schedule zone behind the event which is called "TimeAxis", and the header of the TimeAxis
in the demo below to see it in action:

<div class="external-example" data-file="Scheduler/guides/menu/Basic.js"></div>

The menus can be customized, turned off or replaced with your own implementation (see the "Replace context menus" guide).

## Turning the menus off entirely

The menus are supplied by corresponding features: [EventMenu](#Scheduler/feature/EventMenu) feature provides menu for events,
[ScheduleMenu](#Scheduler/feature/ScheduleMenu) feature provides menu for the schedule zone,
[TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) feature provides menu for the header of the schedule zone.
These features are enabled by default. To turn a feature off, configure it with `false`:

```javascript
const scheduler = new Scheduler({
    features : {
        // Turn the Event menu off completely, will not be created
        eventMenu : false,
        // Turn the Schedule menu off completely, will not be created
        scheduleMenu : false,
        // Turn the TimeAxis Header menu off completely, will not be created
        timeAxisHeaderMenu : false
    }
});
```

## Enabling or disabling the menus

You can also enable or disable any of the provided menus programmatically, perhaps depending on user rights:

```javascript
const scheduler = new Scheduler({
    features : {
        eventMenu : {
            // The Event menu is created, but starts disabled
            disabled : true
        },
        scheduleMenu : {
            // The Schedule menu is created, but starts disabled
            disabled : true
        },
        timeAxisHeaderMenu : {
            // The TimeAxis Header menu is created, but starts disabled
            disabled : true
        }
    }
});

// To enable
scheduler.features.eventMenu.disabled = false;
scheduler.features.scheduleMenu.disabled = false;
scheduler.features.timeAxisHeaderMenu.disabled = false;

// To disable again
scheduler.features.eventMenu.disabled = true;
scheduler.features.scheduleMenu.disabled = true;
scheduler.features.timeAxisHeaderMenu.disabled = true;
```

Try it in the demo below:

<div class="external-example" data-file="Scheduler/guides/menu/DisableFeature.js"></div>

## Customizing the menu items

The menu items in the Event menu, in the Schedule menu, and in the TimeAxis Header menu can be customized,
existing items can be changed or removed, and new items can be added. This is handled using the `items` config of the features.

### Default event menu items

Here is the list of menu items provided by the [EventMenu](#Scheduler/feature/EventMenu) feature and populated by the other features:

| Reference       | Text           | Weight | Feature                                   | Description                                                             |
|-----------------|----------------|--------|-------------------------------------------|-------------------------------------------------------------------------|
| `editEvent`     | Edit event     | 100    | [EventEdit](#Scheduler/feature/EventEdit) | Open the event editor. Hidden for read-only Scheduler                   |
| `deleteEvent`   | Delete event   | 200    | [EventMenu](#Scheduler/feature/EventMenu) | Remove the event. Hidden for read-only Scheduler                        |
| `unassignEvent` | Unassign event | 300    | [EventMenu](#Scheduler/feature/EventMenu) | Unassign the event. Shown when using multi-assignment and not read-only |

### Default scheduler zone menu items

The [ScheduleMenu](#Scheduler/feature/ScheduleMenu) feature provides only one item:

| Reference      | Text      | Weight | Feature                                         | Description                                                                                                          |
|----------------|-----------|--------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `addEvent`     | Add event | 100    | [ScheduleMenu](#Scheduler/feature/ScheduleMenu) | Add a new event for the hovered resource starting at the clicked point in time. Hidden if the Scheduler is read-only |

### Default timeaxis header menu items

Here is the list of menu items provided by the [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) feature and populated by the other features:

| Reference          | Text                  | Weight | Feature                                                     | Description                  |
|--------------------|-----------------------|--------|-------------------------------------------------------------|------------------------------|
| `eventsFilter`     | Filter tasks          | 100    | [EventFilter](#Scheduler/feature/EventFilter)               | Submenu for event filtering  |
| \>`nameFilter`     | By name               | 110    | [EventFilter](#Scheduler/feature/EventFilter)               | Filter by `name`             |
| `zoomLevel`        | Zoom                  | 200    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Submenu for timeline zooming |
| \>`zoomSlider`     | -                     | 210    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Changes current zoom level   |
| `dateRange`        | Date range            | 300    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Submenu for timeline range   |
| \>`startDateField` | Start date            | 310    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Start date for the timeline  |
| \>`endDateField`   | End date              | 320    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | End date for the timeline    |
| \>`leftShiftBtn`   | <                     | 330    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Shift backward               |
| \>`todayBtn`       | Today                 | 340    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Go to today                  |
| \>`rightShiftBtn`  | \>                    | 350    | [TimeAxisHeaderMenu](#Scheduler/feature/TimeAxisHeaderMenu) | Shift forward                |
| `currentTimeLine`  | Show current timeline | 400    | [TimeRanges](#Scheduler/feature/TimeRanges)                 | Show current time line       |
\> - first level of submenu

### Removing default items

To remove a default item no matter if it is provided by a context menu feature, or it is provided by another feature,
configure it as `false` in the `items` config of the context menu feature:

```javascript
const scheduler = new Scheduler({
    features : {
        eventMenu : {
            items : {
                // Remove "Edit event" item provided by EventEdit feature
                editEvent : false
            }
        },
        scheduleMenu : {
            items : {
                // Remove "Add event" default item
                addEvent : false
            }
        },
        timeAxisHeaderMenu : {
            items : {
                // Remove "Filter tasks" item provided by EventFilter feature
                eventsFilter : false
            }
        }
    }
});
```

Removing subitems of the TimeAxis Header Menu is not supported.

<div class="external-example" data-file="Scheduler/guides/menu/DisableItems.js"></div>

### Customize default items

The default items can be customized by supplying config objects for them in the `items` config of the menu feature.
These config objects will be merged with their default configs. Similar to removing default items, it does not matter,
if the item is provided by the menu feature or not.

The order of the default items is determined by the `weight` property. The higher the `weight`, the further down they are
displayed. See the table above for the default weights.

For example, to rename the "Date range" item and move it above the "Zoom" item:

```javascript
const scheduler = new Scheduler({
    features : {
        timeAxisHeaderMenu : {
            items : {
                // Rename and move "Date range" item to be above "Zoom" item (200)
                dateRange    : {
                    text   : 'Start/End',
                    weight : 190
                }
            }
        }
    }
});
```

Try it out in this demo:

<div class="external-example" data-file="Scheduler/guides/menu/CustomizeItems.js"></div>

### Add custom items

Custom items are added in the same way as you customize the built in ones, add new properties to the `items`
config of the menu feature to add new items. The key you choose to use for your item will be used as its `ref`,
through which it can be accessed later.

Here we add a custom item to the event menu to move a selected task 1 hour forward:

```javascript
const scheduler = new Scheduler({
    features : {
        eventMenu : {
            items : {
                // Custom reference to the new menu item
                moveForward : {
                    text   : 'Move 1 hour ahead',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 400, // Add the item to the bottom
                    onItem : ({ eventRecord }) => {
                        eventRecord.shift(1, 'hour');
                    }
                }
            }
        }
    }
});
```

Try new custom items here:

<div class="external-example" data-file="Scheduler/guides/menu/AddItems.js"></div>

### Runtime control of menu item visibility

If you need to control menu item visibility or text depending on a dynamic condition, for example user access rights,
you can mutate `items` in the `processItems` hook provided by the menu.

Here we disable "Edit event", "Delete event", "Unassign event", and "Add event" items based on a condition:

```javascript
let accessGranted = false;

const scheduler = new Scheduler({
    features : {
        eventMenu   : {
            // Process event items before showing the menu
            processItems({ items }) {
                // Not possible to edit, delete, or change event assignments if there is no rights for it
                if (!accessGranted) {
                    items.editEvent = false;
                    items.deleteEvent = false;
                    items.unassignEvent = false;
                }
            }
        },
        scheduleMenu : {
            // Process schedule zone items before showing the menu
            processItems({ items }) {
                // Not possible to add new events if there is no rights for it
                if (!accessGranted) {
                    items.addEvent = false;
                }
            }
        }
    }
});
```

See it in action in this demo:

<div class="external-example" data-file="Scheduler/guides/menu/Dynamic.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>