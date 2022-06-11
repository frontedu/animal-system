# Customizing the event editor

Bryntum Calendar ships with a built in, themeable event editor, double-click the event in the demo below to see it in action:

<div class="external-example" data-file="Calendar/guides/eventedit/basic.js"></div>

The editor, and all the widgets within it are styled with SASS, and the values for all parts of the UI are determined by SASS variables so the editor can easily be styled to fit in with any existing design. The full replacement of the editor should not be needed.

The widgets *inside* the editor can all be reconfigured or removed very simply using the EventEditor feature's `items` config option.

See the <a href="../examples/eventedit" target="_blank">Bryntum custom event editor example</a> for how to theme and reconfigure an event editor.

As a final fallback, the editor can be replaced with your own editor (see the "Replace the event editor" guide).

## Turning the editor off entirely

The event editor is supplied by a feature called `EventEdit`, which is enabled by default. To turn it off, configure the
feature with `false`:

```javascript
const calendar = new Calendar({
    features : {
        // Turn the editor off completely, wont be created
        eventEdit : false
    }
});
```

## Enabling or disabling the editor

You can also enable or disable the editor programmatically, perhaps as a response to a login:

```javascript
const calendar = new Calendar({
    features : {
        eventEdit : {
            // Start disabled
            disabled : true
        }
    }
});

// To enable
calendar.features.eventEdit.disabled = false;

// To disable again
calendar.features.eventEdit.disabled = true;
```

Try it in the demo below:

<div class="external-example" data-file="Calendar/guides/eventedit/disable.js"></div>

## Customizing the fields

The fields in the editor can be customized, existing fields can be changed or removed and new fields can be added. This
is handled using the [`items`](#Calendar/feature/EventEdit#config-items) config of the feature.

### Default fields

By default, the editor contains the following fields:

| Field ref              | Type      | Weight | Description                                                    |
|------------------------|-----------|--------|----------------------------------------------------------------|
| `nameField`            | TextField | 100    | Edit name                                                      |
| `resourceField`        | Combo     | 200    | Pick calendar                                                  |
| `startDateField`       | DateField | 300    | Edit startDate (date part)                                     |
| `startTimeField`       | TimeField | 400    | Edit startDate (time part)                                     |
| `endDateField`         | DateField | 500    | Edit endDate (date part)                                       |
| `endTimeField`         | TimeField | 600    | Edit endDate (time part)                                       |
| `recurrenceCombo`      | Combo     | 700    | Select recurrence rule (only visible if recurrence is used)    |
| `editRecurrenceButton` | Button    | 800    | Edit the recurrence rule  (only visible if recurrence is used) |

The `resourceField` is what assigns an event to a "calendar". Events are assigned to "resources". These may be for example rooms, or machines.

### Removing default fields

To remove default fields, configure them as `null` in the `items` config of the feature:

```javascript
const calendar = new Calendar({
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

<div class="external-example" data-file="Calendar/guides/eventedit/remove.js"></div>

To remove fields related to recurring events configuration (such as `recurrenceCombo`), set [`showRecurringUI`](#Calendar/feature/EventEdit#config-showRecurringUI) config to `false`.

### Customize default fields

The default fields can be customized by supplying config objects for them in the `items` config of the feature. These
config objects will be merged with their default configs.

The order of the default fields is determined by a `weight`. The higher the `weight`, the further down they are
displayed. See the table above for the default weights.

For example to change the label of the `nameField` and move the calendar picker to the top:

```javascript
const calendar = new Calendar({
    features : {
        eventEdit : {
            items : {
                // Change the label of the nameField
                nameField : {
                    label : 'Title'
                },
                // Move the calendar picker to the top
                // It's name is "resourceField" because Calendars are the assigned resources.
                resourceField : {
                    weight : 0
                }
            }
        }
    }
});
```

Try it out in this demo:

<div class="external-example" data-file="Calendar/guides/eventedit/label.js"></div>

### Add custom fields

Custom fields are added in the same way as you use to customize the built in ones, add new properties to the `items`
config of the feature to add new fields. The key you choose to use for your field will be used as its `ref`, through
which it can be accessed later.

Here we add a custom field to edit notes on the event to the editor:

```javascript
const calendar = new Calendar({
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

### Update custom fields state and data

Event Editor uses `items` configuration only once during first initialization. If you need to refresh data in combobox or hide/show fields depending on your business logic on editor reopen, use [beforeEventEditShow](#Calendar/feature/EventEdit#event-beforeEventEditShow) event:

```javascript
const calendar = new Calendar({
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

<div class="external-example" data-file="Calendar/guides/eventedit/field.js"></div>


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>