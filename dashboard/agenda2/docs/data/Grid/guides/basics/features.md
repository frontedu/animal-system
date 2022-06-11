# Grid features
Features are classes that add functionality to the Grid. The purpose of this guide is to give an overview of the features 
that ships with Grid and show how you can configure them.

## Enabling/disabling and configuring features
Features are configured using Grids [`features`](#Grid/view/Grid#config-features)-config. Some features are enabled by
default, in which case you can disable them like this:

```
const grid = new Grid({
    features : {
        sort : false,
        group : false
    }
});
```

Others require you to enable them:

```
const grid = new Grid({
    features : {
        filter : true,
        quickFind : true
    }
});
```

Some features have configuration options (see the API docs for each feature for the options). In such cases you can
specify an configuration object instead of `true`:

```
const grid = new Grid({
    features : {
        filter : { // Default filter, configuration object
            property : 'city',
            name     : 'Stockholm'
        },
        sort : 'name' // Sort by name, configuration shortcut using string
    }
});
```

If you need to access a feature at runtime, they are available through the `features` property on Grid:

```javascript
grid.features.search.gotoNextHit();
```

## Features in the box
Grid itself has built-in core functionality such rendering of cells, selection and keyboard navigation. On top of that 
it ships with the features described below, some of which are enabled by default and some which you have to enable 
manually. 

### CellEdit ([API docs](#Grid/feature/CellEdit))
Inline editing of cell values. This feature is **enabled** by default. Double click a cell to start editing:

<div class="external-example" data-file="Grid/guides/features/CellEdit.js"></div>

### CellTooltip ([API docs](#Grid/feature/CellTooltip))
Display per cell tooltips that can contain record data. This feature is **disabled** by default. Hover a cell below to
see it in action:

<div class="external-example" data-file="Grid/guides/features/CellTooltip.js"></div>

### ColumnDragToolbar ([API docs](#Grid/feature/ColumnDragToolbar))
A toolbar on which column headers can be dropped to sort, group etc. Great on touch devices. This feature is **disabled** 
by default, but automatically enabled on touch devices unless explicitly disabled. Grab a column header and drag it down
to show the toolbar:

<div class="external-example" data-file="Grid/guides/features/ColumnDragToolbar.js"></div>

### ColumnPicker ([API docs](#Grid/feature/ColumnPicker))
Adds item to grid header context menus to toggle column visibility. This feature is **enabled** by default. Right click
a header to show the menu:

<div class="external-example" data-file="Grid/guides/features/ColumnPicker.js"></div>

### ColumnReorder ([API docs](#Grid/feature/ColumnReorder))
Allows reordering columns by dragging their headers. This feature is **enabled** by default. Drag a header to rearrange:

<div class="external-example" data-file="Grid/guides/features/ColumnReorder.js"></div>

### ColumnResize ([API docs](#Grid/feature/ColumnResize))
Lets user resize columns by dragging their headers right hand edge. This feature is **enabled** by default. Try it in
this demo:

<div class="external-example" data-file="Grid/guides/features/ColumnResize.js"></div>

### CellMenu ([API docs](#Grid/feature/CellMenu))
Handles context menu for cells. Other features supply items, additional items can be added in your code.
This feature is **enabled** by default. Right click a cell in the demo below to show the menu:

<div class="external-example" data-file="Grid/guides/features/CellMenu.js"></div>

### HeaderMenu ([API docs](#Grid/feature/HeaderMenu))
Handles context menu for headers. Other features supply items, additional items can be added in your code.
This feature is **enabled** by default. Right click a header in the demo below to show the menu:

<div class="external-example" data-file="Grid/guides/features/HeaderMenu.js"></div>

### Filter ([API docs](#Grid/feature/Filter))
Enables the user to filter rows, either by using the cell context menu or through headers. This feature is **disabled** 
by default. Right click a cell or click the icon in a header in the demo below to see the options:

<div class="external-example" data-file="Grid/guides/features/Filter.js"></div>

### FilterBar ([API docs](#Grid/feature/FilterBar))
Similar to the Filter feature, but displays fields for filtering directly in the headers. This feature is **disabled** 
by default. Try it out in this demo:

<div class="external-example" data-file="Grid/guides/features/FilterBar.js"></div>

### Group ([API docs](#Grid/feature/Group))
Allows grouping of rows in the Grid. Groups consists of all rows with the same value in the column by which the Grid is
being grouped. This feature is **enabled** by default. Click on group headers to expand/collapse the group:

<div class="external-example" data-file="Grid/guides/features/Group.js"></div>

### GroupSummary ([API docs](#Grid/feature/GroupSummary))
Used in combination with Group feature, displays a summary bar at the bottom of each group. This feature is **disabled** 
by default. This demo has it enabled:

<div class="external-example" data-file="Grid/guides/features/GroupSummary.js"></div>

### QuickFind ([API docs](#Grid/feature/QuickFind))
Quick searching within a column, just click a cell and start typing. This feature is **disabled** by default. Click any
cell in this demo and type something:

<div class="external-example" data-file="Grid/guides/features/QuickFind.js"></div>

### RegionResize ([API docs](#Grid/feature/RegionResize))
Displays a splitter that allows the user to resize the regions when using a grid with locked & normal columns. This 
feature is **disabled** by default. Drag the splitter to resize or click the icons in it to expand/collapse:

<div class="external-example" data-file="Grid/guides/features/RegionResize.js"></div>

### Search ([API docs](#Grid/feature/Search))
Search has functionality for searching the grid, but it does not have any input UI. That needs to be supplied by the
application. This feature is **disabled** by default. This demo uses a basic text field to search from:

<div class="external-example" data-file="Grid/guides/features/Search.js"></div>

### Sort ([API docs](#Grid/feature/Sort))
Sort by a single or multiple columns, either by clicking headers or by using their context menus. This feature is 
**enabled** by default. This demo has a default sorter defined:

<div class="external-example" data-file="Grid/guides/features/Sort.js"></div>

### Stripe ([API docs](#Grid/feature/Stripe))
Makes every other rows background have a different color, also hides bottom border of each row. This feature is 
**disabled** by default. Grid with striped rows:

<div class="external-example" data-file="Grid/guides/features/Stripe.js"></div>

### Summary ([API docs](#Grid/feature/Summary))
Summaries defined per column are displayed in a footer bar. This feature is **disabled** by default. Try changing some
values, it will updated the summaries:

<div class="external-example" data-file="Grid/guides/features/Summary.js"></div>

### Tree ([API docs](#Grid/feature/Tree))
Turns the grid into a tree. Requires exactly one `TreeColumn` to be present. This feature is **disabled** by default.
If you want to use this feature, we recommend that you use `TreeGrid` instead of `Grid` since it has what is needed 
included by default. 

<div class="external-example" data-file="Grid/guides/features/TreeGrid.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>