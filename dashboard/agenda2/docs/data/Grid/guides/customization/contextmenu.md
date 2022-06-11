# Customizing the Cell menu and the Header menu

Bryntum Grid ships with built in context menus for grid cells and for grid column headers.
Right-click a cell or a column header in the demo below to see it in action:

<div class="external-example" data-file="Grid/guides/menu/Basic.js"></div>

The menus can be customized, turned off or replaced with your own implementation (see the "Replace context menus" guide).

## Turning the menus off entirely

The menus are supplied by corresponding features: `CellMenu` feature provides menu for cells, `HeaderMenu` feature provides
menu for column headers. These features are enabled by default. To turn a feature off, configure it with `false`:

```javascript
const grid = new Grid({
    features : {
        // Turn the Cell menu off completely, will not be created
        cellMenu : false,
        // Turn the Header menu off completely, will not be created
        headerMenu : false
    }
});
```

## Enabling or disabling the menus

You can also enable or disable any of the provided menus programmatically, perhaps depending on user rights:

```javascript
const grid = new Grid({
    features : {
        cellMenu : {
            // The Cell menu is created, but starts disabled
            disabled : true
        },
        headerMenu : {
            // The Header menu is created, but starts disabled
            disabled : true
        }
    }
});

// To enable
grid.features.cellMenu.disabled = false;
grid.features.headerMenu.disabled = false;

// To disable again
grid.features.cellMenu.disabled = true;
grid.features.headerMenu.disabled = true;
```

Try it in the demo below:

<div class="external-example" data-file="Grid/guides/menu/DisableFeature.js"></div>

## Customizing the menu items

The menu items in the Cell menu and in the Header menu can be customized, existing items can be changed or removed,
and new items can be added. This is handled using the `items` config of the features.

### Default cell menu items

The `CellMenu` feature provides only one item by default and all the other items are populated by the other features:

| Item reference       | Text             | Weight | Feature    | Enabled by default | Description                                                                    |
|----------------------|------------------|--------|------------|--------------------|--------------------------------------------------------------------------------|
| `removeRow`          | Delete record    | 100    | `CellMenu` | true               | Removes the selected record from the store                                     |
| `search`             | Search for value | 200    | `Search`   | false              | Searches the grid for the selected cell text                                   |
| `filterDateEquals`   | On               | 300    | `Filter`   | false              | Filters records in the store by the column field equal to selected cell value  |
| `filterDateBefore`   | Before           | 310    | `Filter`   | false              | Filters records in the store by the column field less than selected cell value |
| `filterDateAfter`    | After            | 320    | `Filter`   | false              | Filters records in the store by the column field more than selected cell value |
| `filterNumberEquals` | Equals           | 300    | `Filter`   | false              | Filters records in the store by the column field equal to selected cell value  |
| `filterNumberLess`   | Less than        | 310    | `Filter`   | false              | Filters records in the store by the column field less than selected cell value |
| `filterNumberMore`   | More than        | 320    | `Filter`   | false              | Filters records in the store by the column field more than selected cell value |
| `filterStringEquals` | Equals           | 300    | `Filter`   | false              | Filters records in the store by the column field equal to selected cell value  |
| `filterRemove`       | Remove filter    | 400    | `Filter`   | false              | Stops filtering by selected column field                                       |

### Default header menu items

The Header menu has no default items provided by the `HeaderMenu` feature, but there are other features
that populate the header menu with the following items:

| Item reference    | Text                              | Weight | Feature        | Enabled by default | Description                                                                   |
|-------------------|-----------------------------------|--------|----------------|--------------------|-------------------------------------------------------------------------------|
| `filter`          | Filter                            | 100    | `Filter`       | false              | Shows filter field below the column header to enter a new value               |
| `editFilter`      | Edit filter                       | 100    | `Filter`       | false              | Shows filter field below the column header to change/remove the filter value  |
| `removeFilter`    | Remove filter                     | 110    | `Filter`       | false              | Stops filtering by selected column field                                      |
| `toggleFilterBar` | Hide filter bar / Show filter bar | 120    | `FilterBar`    | false              | Toggles filter bar visibility                                                 |
| `columnPicker`    | Columns                           | 200    | `ColumnPicker` | true               | Shows a submenu to control columns visibility                                 |
| \>column.id*      | column.text*                      |        | `ColumnPicker` | true               | Check item to hide/show corresponding column                                  |
| `hideColumn`      | Hide column                       | 210    | `ColumnPicker` | true               | Hides selected column                                                         |
| `sortAsc`         | Sort ascending                    | 300    | `Sort`         | true               | Sorts records in the store by the column field in ascending order             |
| `sortDesc`        | Sort descending                   | 310    | `Sort`         | true               | Sorts records in the store by the column field in descending order            |
| `multiSort`       | Multi sort                        | 320    | `Sort`         | true               | Shows a submenu to control multi-sorting                                      |
| \>`addSortAsc`    | Add ascending sorting             | 330    | `Sort`         | true               | Adds additional ascending sorting by the column field                         |
| \>`addSortDesc`   | Add descending sorting            | 340    | `Sort`         | true               | Adds additional ascending sorting by the column field                         |
| \>`removeSorter`  | Remove sorter                     | 350    | `Sort`         | true               | Stops sorting by selected column field                                        |
| `groupAsc`        | Group ascending                   | 400    | `Group`        | true               | Groups and sorts records in the store by the column field in ascending order  |
| `groupDesc`       | Group descending                  | 410    | `Group`        | true               | Groups and sorts records in the store by the column field in descending order |
| `groupRemove`     | Stop grouping                     | 420    | `Group`        | true               | Stops grouping                                                                |

\* - items that are generated dynamically

\> - first level of submenu

### Removing default items

To remove a default item no matter if it is provided by a context menu feature, or it is provided by another feature,
configure it as `false` in the `items` config of the context menu feature:

```javascript
const grid = new Grid({
    features : {
        // This will enable Filter feature and all its menu items in both cell and header menus
        filter   : true,
        cellMenu : {
            items : {
                // Remove "Delete record" default item
                removeRow : false,
                // Remove "Before" and "After" items provided by Filter feature to only have "On" option for Date columns
                filterDateBefore : false, 
                filterDateAfter : false
            }
        },
        headerMenu : {
            items : {
                // Remove "Edit filter" item provided by Filter feature to only have "Remove filter" option in case a filter is applied to the column field
                editFilter : false
            }
        }
    }
});
```

To remove a default subitem, configure the parent item `menu` and set corresponding items to `false`:

```javascript
const grid = new Grid({
    features : {
        headerMenu : {
            items : {
                multiSort : {
                    menu : {
                        // Remove "Add descending sorting" item provided by Sort feature to only have ascending sorting
                        addSortDesc : false
                    }
                }
            }
        }
    }
});
```

<div class="external-example" data-file="Grid/guides/menu/DisableItems.js"></div>

### Customize default items

The default items can be customized by supplying config objects for them in the `items` config of the menu feature.
These config objects will be merged with their default configs. Similar to removing default items, it does not matter,
if the item is provided by the menu feature or not.

The order of the default items is determined by the `weight` property. The higher the `weight`, the further down they are
displayed. See the table above for the default weights.

For example, to rename grouping items and move them above sorting items:

```javascript
const grid = new Grid({
    features : {
        headerMenu : {
            items : {
                // Rename and move grouping items to be between "Hide column" (210) and "Sort ascending" (300)
                groupAsc    : {
                    text   : 'Group Aa..Zz',
                    weight : 290
                },
                groupDesc   : {
                    text   : 'Group Zz..Aa',
                    weight : 291
                },
                groupRemove : {
                    text   : 'Ungroup',
                    weight : 292
                }
            }
        }
    }
});
```

Try it out in this demo:

<div class="external-example" data-file="Grid/guides/menu/CustomizeItems.js"></div>

### Add custom items

Custom items are added in the same way as you customize the built in ones, add new properties to the `items` 
config of the menu feature to add new items. The key you choose to use for your item will be used as its `ref`,
through which it can be accessed later.

Here we add a custom item to the cell menu to rename a selected person to Mark:

```javascript
const grid = new Grid({
    features : {
        cellMenu : {
            items : {
                // Custom reference to the new menu item
                renameUser : {
                    text   : 'Rename to Mark',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 1, // Insert at the top
                    onItem : ({ item, record, column }) => {
                        record.firstName = 'Mark';
                    }
                }
            }
        }
    }
});
```

Try the custom cell item here:

<div class="external-example" data-file="Grid/guides/menu/AddItems.js"></div>

### Dynamic items processing

If you need to control items visibility or text depending on a dynamic condition, for example user authentication,
or user access rights, you can mutate `items` in `processItems` hook provided by the menu.

Here we disable "Delete record", "Columns", and "Hide column" items based on a condition:

```javascript
let accessGranted = false;

const grid = new Grid({
    features : {
        cellMenu   : {
            // Process cell items before showing the menu
            processItems({ items, column, record }) {
                // Not possible to delete rows if there is no rights for it
                if (!accessGranted) {
                    items.removeRow = false;
                }
            }
        },
        headerMenu : {
            // Process header items before showing the menu
            processItems({ items, column }) {
                // Not possible to change columns visibility if there is no rights for it
                if (!accessGranted) {
                    items.columnPicker = false;
                    items.hideColumn = false;
                }
            }
        }
    }
});
```

See it in action in this demo:

<div class="external-example" data-file="Grid/guides/menu/Dynamic.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>