# Scheduler features
Features are classes that add functionality to Scheduler. The purpose of this guide is to give an overview of the features 
that ships with Scheduler and show how you can configure them.

## Enabling/disabling and configuring features
Features are configured using Schedulers [`features`](#Grid/view/Grid#config-features)-config. Some features are enabled by
default, in which case you can disable them like this:

```
const scheduler = new Scheduler({
    features : {
        columnLines : false,
        eventResize : false
    }
});
```

Others require you to enable them:

```
const scheduler = new Scheduler({
    features : {
        labels     : true,
        timeRanges : true
    }
});
```

Some features have configuration options (see the API docs for each feature for the options). In such cases you can
specify an configuration object instead of `true`:

```
const scheduler = new Scheduler({
    features : {
        eventDrag : { // Configuration object
            constrainDragToResource : true
        },
        sort : 'name' // Configuration shortcut using string, only availble for certain features
    }
});
```

If you need to access a feature at runtime, they are available through the `features` property on Scheduler:

```javascript
scheduler.features.eventEdit.showRecord(someEventRecord);
```

## Features in the box
Scheduler itself has built-in core functionality for rendering resources & events, selection and keyboard navigation. On 
top of that it ships with the features described below, some of which are enabled by default and some which you have to 
enable manually.

### ColumnLines ([API docs](#Scheduler/feature/ColumnLines))
Draws lines at the columns (ticks) in the timeaxis. Major ticks can have a different color than normal. 
This feature is **enabled** by default. 

The demo below shows the default ColumnLines configuration, note the darker line between weeks:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/ColumnLines.js"></div>

### Dependencies ([API docs](#Scheduler/feature/Dependencies))
Display how events depend on each other using arrows. 
This feature is **disabled** by default. 

Hover over an event in the demo to show dependency terminals, from which you can drag to create dependency lines between
events:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/Dependencies.js"></div>

### EventMenu ([API docs](#Scheduler/feature/EventMenu))
Displays a context menu when right clicking events. Features add items to the menu, it is also possible to configure 
extra items to show. 
This feature is **enabled** by default. 

Right click on an event to try it out:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventMenu.js"></div>

### EventDrag ([API docs](#Scheduler/feature/EventDrag))
Drag events to reschedule their start & end dates. Can be configured to snap to certain time intervalls.
This feature is **enabled** by default. 

Try dragging an event in the demo:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventDrag.js"></div>

### EventDragCreate ([API docs](#Scheduler/feature/EventDragCreate))
Drag an empty area in the schedule to create a new event. Events can also be created by double clicking. 
This feature is **enabled** by default. 

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventDragCreate.js"></div>

### EventEdit ([API docs](#Scheduler/feature/EventEdit))
Displays an editor for editing event data. It is possible to customize which items are shown in the editor. 
This feature is **enabled** by default. 

Double click an event in the demo to show the editor:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventEdit.js"></div>

### EventFilter ([API docs](#Scheduler/feature/EventFilter))
Adds an item for filtering events to the HeaderContextMenu. 
This feature is **enabled** by default.

Right click on the timeaxis header to display the context menu, then pick `Filter tasks` and type to filter:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventFilter.js"></div>

### EventResize ([API docs](#Scheduler/feature/EventResize))
Change event duration by dragging its ends. Can be configured to snap to certain time intervals. 
This feature is **enabled** by default. 

Drag the left or right end of an event to resize it:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventResize.js"></div>

### EventTooltip ([API docs](#Scheduler/feature/EventTooltip))
Displays a tooltip when hovering events. The tooltip template can be customized to suite your needs. 
This feature is **enabled** by default.

Hover an event to show the default tooltip:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/EventTooltip.js"></div>

### Group ([API docs](#Grid/feature/Group))
Allows grouping of resources in Scheduler. Groups consists of all resources with the same value in the column by which 
Scheduler is being grouped. 
This feature is **enabled** by default. 

Click on group headers to expand/collapse the group:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/Group.js"></div>

### GroupSummary ([API docs](#Scheduler/feature/GroupSummary))
Used in combination with Group feature, displays a summary bar at the bottom of each group. 
This feature is **disabled** by default. 

This demo has it enabled:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/GroupSummary.js"></div>

### TimeAxisHeaderMenu ([API docs](#Scheduler/feature/TimeAxisHeaderMenu))
Displays a context menu for the timeaxis header. The menu is populated by other features. 
This feature is **enabled** by default.

Right click on the timeaxis header to display the context menu:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/TimeAxisHeaderMenu.js"></div>

### Labels ([API docs](#Scheduler/feature/Labels))
Shows labels aligned to events. The text in the labels can come from event data or renderer functions.
This feature is **disabled** by default.

This demo defines two labels, one above and one below the events:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/Labels.js"></div>

### NonWorkingTime ([API docs](#Scheduler/feature/NonWorkingTime))
Can be used to highlight weekends or other non working days. By default gives them a grayish background color, to 
distinguish them from normal days.
This feature is **disabled** by default.

Note that saturday and sunday have a tinted background in the demo:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/NonWorkingTime.js"></div>

### ScheduleTooltip ([API docs](#Scheduler/feature/ScheduleTooltip))
Displays a tooltip with the current data/time when hovering an empty part of the schedule.
This feature is **enabled** by default.

Try hovering an empty part of the scheudle to display the default tooltip:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/ScheduleTooltip.js"></div>

### Sort ([API docs](#Grid/feature/Sort))
Sort by a single or multiple columns, either by clicking headers or by using their context menus. 
This feature is **enabled** by default. 

This demo has a default sorter defined:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/Sort.js"></div>

### Summary ([API docs](#Grid/feature/Summary))
Summaries defined per column are displayed in a footer bar. 
This feature is **disabled** by default. 

Try changing some values, it will updated the summaries:

<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/Summary.js"></div>

### TimeRanges ([API docs](#Scheduler/feature/TimeRanges))
Add highlighted time ranges (lines and zones) to the schedule. Can also display a line showing the current time.
This feature is **disabled** by default.

Drag the handles in the header to resize or move (with SHIFT) then TimeRange: 
<div class="external-example" data-file="Scheduler/guides/schedulerfeatures/TimeRanges.js"></div>

## Useful features inherited from Grid
Scheduler is based on Grid, which has some features that are useful also in Scheduler. Read on for an overview of those.

### CellEdit ([API docs](#Grid/feature/CellEdit))
Inline editing of cell values. This feature is **enabled** by default. 

Double click a cell to start editing:

<div class="external-example" data-file="Scheduler/guides/features/CellEdit.js"></div>

### CellTooltip ([API docs](#Grid/feature/CellTooltip))
Display per cell tooltips that can contain record data. This feature is **disabled** by default. 

Hover a cell below to see it in action:

<div class="external-example" data-file="Scheduler/guides/features/CellTooltip.js"></div>

### ColumnPicker ([API docs](#Grid/feature/ColumnPicker))
Adds item to column header context menus to toggle column visibility. This feature is **enabled** by default. 

Right click a column header to show the menu:

<div class="external-example" data-file="Scheduler/guides/features/ColumnPicker.js"></div>

### ColumnReorder ([API docs](#Grid/feature/ColumnReorder))
Allows reordering columns by dragging their headers. This feature is **enabled** by default. 

Drag a header to rearrange:

<div class="external-example" data-file="Scheduler/guides/features/ColumnReorder.js"></div>

### ColumnResize ([API docs](#Grid/feature/ColumnResize))
Lets user resize columns by dragging their headers right hand edge. This feature is **enabled** by default. 

Try it in this demo:

<div class="external-example" data-file="Scheduler/guides/features/ColumnResize.js"></div>

### CellMenu ([API docs](#Grid/feature/CellMenu))
Handles context menu for cells. Other features supply items, additional items can be added in your code.
This feature is **enabled** by default. Right click a cell in the demo below to show the menu:

<div class="external-example" data-file="Scheduler/guides/features/CellMenu.js"></div>

### HeaderMenu ([API docs](#Grid/feature/HeaderMenu))
Handles context menu for headers. Other features supply items, additional items can be added in your code.
This feature is **enabled** by default. Right click a header in the demo below to show the menu:

<div class="external-example" data-file="Scheduler/guides/features/HeaderMenu.js"></div>

### Filter ([API docs](#Grid/feature/Filter))
Enables the user to filter rows, either by using the cell context menu or through headers. This feature is **disabled** 
by default. 

Right click a cell or click the icon in a header in the demo below to see the options:

<div class="external-example" data-file="Scheduler/guides/features/Filter.js"></div>

### FilterBar ([API docs](#Grid/feature/FilterBar))
Similar to the Filter feature, but displays fields for filtering directly in the headers. This feature is **disabled** 
by default. 

Try it out in this demo:

<div class="external-example" data-file="Scheduler/guides/features/FilterBar.js"></div>

### QuickFind ([API docs](#Grid/feature/QuickFind))
Quick searching within a column, just click a cell and start typing. This feature is **disabled** by default. 

Click any cell in this demo and type something:

<div class="external-example" data-file="Scheduler/guides/features/QuickFind.js"></div>

### RegionResize ([API docs](#Grid/feature/RegionResize))
Displays a splitter that allows the user to resize the regions when using a grid with locked & normal columns. This 
feature is **disabled** by default. 

Drag the splitter to resize or click the icons in it to expand/collapse:

<div class="external-example" data-file="Scheduler/guides/features/RegionResize.js"></div>

### Search ([API docs](#Grid/feature/Search))
Search has functionality for searching the grid, but it does not have any input UI. That needs to be supplied by the
application. This feature is **disabled** by default. 

This demo uses a basic text field to search from:

<div class="external-example" data-file="Scheduler/guides/features/Search.js"></div>

### Stripe ([API docs](#Grid/feature/Stripe))
Makes every other rows background have a different color, also hides bottom border of each row. This feature is 
**disabled** by default. 

Grid with striped rows:

<div class="external-example" data-file="Scheduler/guides/features/Stripe.js"></div>

### Tree ([API docs](#Grid/feature/Tree))
Turns the scheduler/grid into a tree. Requires exactly one `TreeColumn` to be present. This feature is  **disabled** by
default.

<div class="external-example" data-file="Scheduler/guides/features/TreeGrid.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>