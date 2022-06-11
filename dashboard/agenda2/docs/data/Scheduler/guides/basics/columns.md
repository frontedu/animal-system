# Scheduler columns
This guide describes the basics on how to configure and manipulate columns in the grid part of the Scheduler.

## Setting up columns
To configure which columns to use in a Scheduler you use the `columns` config:

```javascript
const scheduler = new Scheduler({
    columns : [
        { text : 'Name', field : 'name', flex : 1 },
        { text : 'City', field : 'city', width : 100 }
    ]
});
```

The snippet above shows a Scheduler with two columns in the grid part using minimal configuration:

* `text`  - Text to display in the column header
* `field` - Data field from which column contents are fetched
* `flex`  - Proportional width, the width remaining after any fixed width columns is shared between flex columns
* `width` - Fixed width, in pixels if nothing else is specified

Result:

<div class="external-example" data-file="Scheduler/guides/columns/SettingUp1.js"></div>

### Column types
Columns can be of different types. These types affect how data is formatted and edited. You specify which type a column
has in its configuration object:


```javascript
const scheduler = new Scheduler({
    columns : [
        { type : 'columntype', text : 'Header', /*...*/ }
    ]
});
```

Available types are:

* `rownumber` - Displays row number
* `check` - Checkbox column
* `date` - Date column
* `number` - Number column
* `percent` - Percent bar
* `rating` - Rating as star icons
* `template` - Uses a template to display its contents
* `widget` - Can contain widgets (buttons and such)

This snippet has a couple of the types above:

```javascript
const scheduler = new Scheduler({
    columns : [
        { type : 'rownumber' },
        { text : 'Name', field : 'name', width: 130 },
        { type : 'number', text : 'Age', field : 'age', width: 80 }
    ]
});
```

Result:

<div class="external-example" data-file="Scheduler/guides/columns/SettingUp2.js"></div>

To learn more about each column type, please read the API docs for them found under Grid/columns.

### Column settings
Different column types support different settings, but there is a common base for all of them inherited from the class
Column. This list contains some of most common settings that apply to all columns:

* `renderer` - A function that can affect styling and contents of a cell, more information below.
* `editor` - Type of editor to use when editing cell contents.
* `align` - Text align: left, center or right.
* `hidden` - Set to true to hide the column initially, can be shown using the column picker.
* `locked` - Set to true to lock/freeze the column.
* `htmlEncode` - Set to false to treat html in the cell content as html and not text.
* `cls` - CSS class to add to this columns header.
* `cellCls` - CSS class to add to each cell in this column.

This snippet shows some of the settings:

```javascript
const scheduler = new Scheduler({
    columns : [
        { field : 'firstName', text: 'First name' },
        { field : 'surName', text: 'Surname', hidden: true },
        { field : 'age', text: 'Age', align: 'right' },
        { field : 'city', text: 'City', editor: false }
    ]
});
```
 
Result:
 
<div class="external-example" data-file="Scheduler/guides/columns/Config.js"></div>

For a complete list of Column configuration settings, see [Column in API docs](#Grid/column/Column).

### Using renderers
Renderers are functions used to determine what is shown in a column. You can define a renderer in your column config:

```javascript
const scheduler = new Scheduler({
    columns : [
        { text : 'Name', field : 'name', flex : 1, renderer : ({value}) => value }
    ]
});
```

The renderer defined above only returns the value which it is given (name). Usually you use the renderer to apply some 
formatting or CSS. Because of how the grid is rendered, renderers is the only place where it can be considered safe to
programmatically add styling. A renderer is called with a single parameter having the following properties:

* `cellElement` - Gives direct access to the cells DOM element, for adding styles or setting CSS classes
* `rowElement` - The rows DOM element.
* `value` - The value which would be displayed in the cell if no renderer was used.
* `record` - The data record for the current row.
* `column` - Column instance for the current cell.
* `row` - Row instance for the current cell.

This snippet defines a a more complex renderer:

```javascript
const scheduler = new Scheduler({
    columns : [
        {
            field : 'name',
            text  : 'Name',
            flex  : 1,
            renderer({ cellElement, record }) {
                cellElement.style.backgroundColor = record.color;
                cellElement.style.color = '#fff';
                return record.name;
            }
        }
    ]
});
```

Result:

<div class="external-example" data-file="Scheduler/guides/columns/Renderer.js"></div>

For more formatting options, check the [Grid renderers demo](https://bryntum.com/examples/grid/renderers/).

## Manipulating columns
Scheduler stores it columns as records in a store, allowing for easy reactive manipulation. The store 
(a [ColumnStore](#Grid/data/ColumnStore)) can be accessed using the `scheduler.columns` property:

```javascript
// The ColumnStore
scheduler.columns;

// Get first column
const first = scheduler.columns.first;

// Get column by field
const age = scheduler.columns.get('age');

// If you are using multiple columns for the same field, it is safer to access them using id
const name = scheduler.columns.getById('idOfNameColumn');
```

The column records/instances can be used to manipulate the columns. For example:

```javascript
// Change width
scheduler.columns.first.width = 100;

// Hide a column
ageColumn.hidden = true;
```

For available properties, see [Column in API docs](#Grid/column/Column#properties).


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>