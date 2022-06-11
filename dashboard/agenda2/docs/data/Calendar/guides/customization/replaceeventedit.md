# Replacing the event editor

Bryntum Calendar ships with a built in event editor. In almost all cases the customizations available both in editor content and editor styleability using SASS should fulfill all your requirements. See the [Customize event editor](#Calendar/guides/customization/eventedit.md) guide and the <a href="../examples/eventedit" target="_blank">Bryntum custom event editor example</a> for details.

If it is absoutely necessary, then the editor can be replaced with a widget of your own creation. It is then incumbent upon your code to hook the correct events, load data into your editor widget, and at the correct point, extract values from your editor widget to update the contextual event record.

This guide shows how to replace the supplied editor with a custom basic editor written using Bootstrap, but the general principles should apply whichever framework you are using.

## Step 1 - Create your custom editor

How this is done will vary greatly depending on which UI framework etc you are using. For the purpose of this guide, we
are using Bootstrap 4. With Bootstrap the editor is defined in HTML on the page, in a modal which we will display when
needed. Here is a suggestion of how an editor might be added to `index.html`:

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
						<label for="name">Event name</label>
						<select class="custom-select" id="name">
							<!--...-->
						</select>
					</div>
					<div class="form-group">
						<label for="startDate">Start date</label>
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
const calendar = new Calendar({
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
const calendar = new Calendar({
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

## Step 3 - Load data into the custom editor

The listener used above to show the editor is called with the event being edited among its arguments. The record can be
used to populate your editor. How that is done depends on the UI framework you are using, for Bootstrap we have to set
the values of the fields one by one:

```javascript
const calendar = new Calendar({
    listeners : {
        beforeEventEdit({ eventRecord }) {
            // Show custom editor
            $('#customEditor').modal('show');

            // Fill its fields
            $('#name').val(eventRecord.name);
            $('#startDate').val(DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'));
            // ...

            // Prevent built in editor
            return false;
        }
    }
});
```

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

const calendar = new Calendar({
    listeners : {
        beforeEventEdit({ eventRecord }) {
            // Show custom editor
            $('#customEditor').modal('show');

            // Fill its fields
            $('#name').val(eventRecord.name);
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
        // Extract name
        name       = $('#name').val(),
        // Extract date
        startDdate = $('#startDate').val();
        // ...

    // Update record
    editingRecord.set({
        name,
        startDate
    });

    // Make the record persistable and eligible for syncing, see https://bryntum.com/docs/grid/api/Core/data/Model#property-isCreating
    editingRecord.isCreating = false;
});
```


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>