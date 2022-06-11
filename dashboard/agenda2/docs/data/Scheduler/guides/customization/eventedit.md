# Customizing the event editor

Bryntum Scheduler ships with a built in event editor, double-click the event in the demo below to see it in action:

<div class="external-example" data-file="Scheduler/guides/eventedit/basic.js"></div>

The editor can be customized, turned off or replaced with your own editor (see the "Replace the event editor" guide).

## Turning the editor off entirely

The event editor is supplied by a feature called `EventEdit`, which is enabled by default. To turn it off, configure the
feature with `false`:

```javascript
const scheduler = new Scheduler({
    features : {
        // Turn the editor off completely, wont be created
        eventEdit : false
    }
});
```

## Enabling or disabling the editor

You can also enable or disable the editor programmatically, perhaps as a response to a login:

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            // Start disabled
            disabled : true
        }
    }
});

// To enable
scheduler.features.eventEdit.disabled = false;

// To disable again
scheduler.features.eventEdit.disabled = true;
```

Try it in the demo below:

<div class="external-example" data-file="Scheduler/guides/eventedit/disable.js"></div>

## Customizing the child widgets

The child widgets in the editor can be customized, existing widgets can be changed or removed and new widgets can be added. This
is handled using the [`items`](#Scheduler/feature/EventEdit#config-items) config of the feature.

### Default widgets

By default, the editor contains the following child widgets:

| Widget ref             | Type      | Weight | Description                                                    |
|------------------------|-----------|--------|----------------------------------------------------------------|
| `nameField`            | TextField | 100    | Edit name                                                      |
| `resourceField`        | Combo     | 200    | Pick resource(s)                                               |
| `startDateField`       | DateField | 300    | Edit startDate (date part)                                     |
| `startTimeField`       | TimeField | 400    | Edit startDate (time part)                                     |
| `endDateField`         | DateField | 500    | Edit endDate (date part)                                       |
| `endTimeField`         | TimeField | 600    | Edit endDate (time part)                                       |
| `recurrenceCombo`      | Combo     | 700    | Select recurrence rule (only visible if recurrence is used)    |
| `editRecurrenceButton` | Button    | 800    | Edit the recurrence rule  (only visible if recurrence is used) |

### Customizing the default buttons

By default, the editor has the following buttons:

| Widget ref             | Type      | Weight | Description                                                    |
|------------------------|-----------|--------|----------------------------------------------------------------|
| `saveButton`           | Button    | 100    | Save event button in the bottom toolbar                        |
| `deleteButton`         | Button    | 200    | Delete event button in the bottom toolbar                      |
| `cancelButton`         | Button    | 300    | Cancel event button in the bottom toolbar                      |

The buttons can be customized using the `bbar` config in the [`editorConfig`](#Scheduler/feature/EventEdit#config-editorConfig) config of the feature.

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            editorConfig : {
                bbar : {
                    items : {
                        deleteButton : false
                    }
                }
            }
        }
    }
});
```

### Removing default widgets

To remove default widgets, configure them as `null` in the `items` config of the feature:

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            items : {
                // Remove startTimeField and endTimeField
                startTimeField : null,
                endTimeField   : null
            }
        }
    }
});
```

This demo has the time fields removed:

<div class="external-example" data-file="Scheduler/guides/eventedit/remove.js"></div>

To remove fields related to recurring events configuration (such as `recurrenceCombo`), set [`showRecurringUI`](#Scheduler/feature/EventEdit#config-showRecurringUI) config to `false`.

### Customize default widgets

The default widgets can be customized by supplying config objects for them in the `items` config of the feature. These
config objects will be merged with their default configs.

The order of the default widgets is determined by a `weight`. The higher the `weight`, the further down they are
displayed. See the table above for the default weights.

For example to change the label of the `nameField` and move the resource picker to the top:

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            items : {
                // Change the label of the nameField
                nameField : {
                    label : 'Title'
                },
                // Move the resource picker to the top
                resourceField : {
                    weight : 0
                }
            }
        }
    }
});
```

Try it out in this demo:

<div class="external-example" data-file="Scheduler/guides/eventedit/label.js"></div>

### Add custom widgets

Custom widgets are added in the same way as you use to customize the built in ones, add new properties to the `items`
config of the feature to add new widgets. The key you choose to use for your widget will be used as its `ref`, through
which it can be accessed later.

Here we add a custom field to edit notes on the event to the editor:

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            items : {
                // Custom field to edit notes about the event
                noteField : {
                    // Type of field to use
                    type : 'textarea',
                    // Label to show for the field
                    label : 'Notes',
                    // Name of the field in the event record to read/write data to
                    // NOTE: Make sure your EventModel has this field for this to link up correctly
                    name : 'note'
                }
            }
        }
    }
});
```

### Update custom widgets state and data

Event Editor uses `items` configuration only once during first initialization. If you need to refresh data in combobox or hide/show widgets depending on your business logic on editor reopen, use [beforeEventEditShow](#Scheduler/feature/EventEdit#event-beforeEventEditShow) event:

```javascript
const scheduler = new Scheduler({
    features : {
        eventEdit : {
            items : {
                equipment : {
                    // custom field configuration
                },
                volume : {
                    // custom field configuration
                }
            }
        }
    },
    listeners : {
        beforeEventEditShow({ editor, eventRecord }) {
            const
                equipmentCombo = editor.widgetMap.equipment,
                volumeField = editor.widgetMap.volume;

            // update data in combo list
            equipmentCombo.items = this.equipmentStore.getRange();
            // update field visibility state
            volumeField.hidden = !eventRecord.hasVolume;
        }
    }
});
```


Try the custom field here:

<div class="external-example" data-file="Scheduler/guides/eventedit/field.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>