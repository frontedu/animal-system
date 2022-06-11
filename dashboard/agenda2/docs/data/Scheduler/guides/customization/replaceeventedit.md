# Replacing the event editor

Bryntum Scheduler ships with a built in event editor. Depending on your needs, you might either want to customize it
(see the ["Customize event editor"](#Scheduler/guides/customization/eventedit.md) guide) or replace it entirely. This guide shows how to replace it with a custom basic
editor written using Bootstrap, but the general principles should apply whichever framework you are using.

The result of this guide can be seen in the `custom-event-editor` demo.

## Step 1 - Create your custom editor

How this is done will vary greatly depending on which UI framework etc you are using. For the purpose of this guide, we
are using Bootstrap 4. With Bootstrap the editor is defined in HTML on the page, in a modal which we will display when
needed. Here is an excerpt of the editor used in the demo, added to `index.html`:

```html
<div class="modal fade" id="customEditor" tabindex="-1" aria-labelledby="customEditorLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
			<!--...-->
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group">
						<label for="home">Home team</label>
						<select class="custom-select" id="home">
							...
						</select>
					</div>
					<div class="form-group">
						<label for="away">Away team</label>
						<select class="custom-select" id="away">
							...
						</select>
					</div>
					<div class="form-group">
						<label for="startDate">Date</label>
						<input type="date" class="form-control" id="startDate">
					</div>
					<!--...-->
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary" data-dismiss="modal" id="save">Save changes</button>
			</div>
		</div>
	</div>
</div>
```

## Step 2 - Show a custom editor

The easiest way to show a custom editor is to leave the built in editor enabled, listen for when it is about to open,
prevent that and show your own instead. Using this approach, you will catch the different paths leading to the editor
being show without having to address them one by one (double click, enter, drag create etc.).

```javascript
const scheduler = new Scheduler({
    listeners : {
        beforeEventEdit() {
            // Show custom editor here
            // ...

            // Prevent built in editor
            return false;
        }
    }
})
```

To show the Bootstrap editor:

```javascript
const scheduler = new Scheduler({
    listeners : {
        beforeEventEdit() {
            // Show custom editor
            $('#customEditor').modal('show');

            // Prevent built in editor
            return false;
        }
    }
});
```

<img src="Scheduler/custom-editor-1.png" alt="Custom event editor"/>

## Step 3 - Load data into the custom editor

The listener used above to show the editor is called with the event being edited among its arguments. The record can be
used to populate your editor. How that is done depends on the UI framework you are using, for Bootstrap we have to set
the values of the fields one by one:

```javascript
const scheduler = new Scheduler({
    listeners : {
        beforeEventEdit({ eventRecord }) {
            // Show custom editor
            $('#customEditor').modal('show');

            // Fill its fields
            $('#home').val(eventRecord.resources[0].id);
            $('#away').val(eventRecord.resources[1].id);
            $('#startDate').val(DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'));
            // ...

            // Prevent built in editor
            return false;
        }
    }
});
```

<img src="Scheduler/custom-editor-2.png" alt="Custom event editor"/>

## Step 4 - Update the event after editing

When the user finishes editing we need to catch the changes and write them back to the event record. How you get the
changes depends on the UI framework you are using, but how you write them back should be more or less the same. The idea
is to write changes back in one go, to not have the UI update multiple times. This can in most cases be achieved by a
single call to `eventRecord.set()`:

```javascript
eventRecord.set({
  name      : newName,
  startDate : newStartDate,
  /*...*/
})
```

For our Bootstrap demo, it can look like this:

```javascript
let editingRecord = null;

const scheduler = new Scheduler({
    listeners : {
        beforeEventEdit({ eventRecord }) {
            // Show custom editor
            $('#customEditor').modal('show');

            // Fill its fields
            $('#home').val(eventRecord.resources[0].id);
            $('#away').val(eventRecord.resources[1].id);
            $('#startDate').val(DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'));
            // ...

            editingRecord = eventRecord;

            // Prevent built in editor
            return false;
        }
    }
});

// When clicking save in the custom editor
$('#save').on('click', () => {
    const
        // Extract teams
        home      = $('#home').val(),
        away      = $('#away').val(),
        // Extract date
        date      = $('#startDate').val();
        // ...

    // Update record
    editingRecord.set({
        startDate : DateHelper.parse(date, 'YYYY-MM-DD'),
        resources : [away, home]
    });
});
```

And that's it, be sure to check the `custom-event-editor` demo out!


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>