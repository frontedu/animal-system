# Replacing the Event menu

Bryntum Scheduler ships with built in context menus for the locked grid cells and column headers, for events, and for
the schedule zone and its header. Depending on your needs, you might either want to customize them
(see the ["Customize context menus"](#Scheduler/guides/customization/contextmenu.md) guide) or replace them entirely.
This guide shows how to replace the Event menu with a custom implementation using Bootstrap, but the same is true for
the Schedule menu and for the TimeAxis Header menu. Also, the same general principles should apply whichever framework you are using.

The result of this guide can be seen in the `custom-eventmenu` demo.

## Step 1 - Create a custom context menu

How this is done will vary greatly depending on which UI framework etc you are using. For the purpose of this guide, we
are using Bootstrap 4. With Bootstrap the context menu is defined in HTML on the page, using `dropdown-menu`
which we will display when needed. Here is an example of the menus used in the demo, added to `index.html`:

```html
<div id="customEventMenu" class="dropdown-menu">
	<button class="dropdown-item" type="button" data-ref="edit">Edit</button>
	<button class="dropdown-item" type="button" data-ref="remove">Remove</button>
</div>
```

## Step 2 - Show and hide the custom menu

The easiest way to show a custom menu is to leave the built in [EventMenu](#Scheduler/feature/EventMenu) feature enabled,
listen for when it is about to be shown, prevent that and show your own instead. Using this approach,
you will get all data related to the context menu.

```javascript
const scheduler = new Scheduler({
    listeners : {
        eventMenuBeforeShow() {
            // Show custom event menu here
            // ...

            // Prevent built in event menu
            return false;
        }
    }
})
```

In case you are going to have more than one custom menu, you need to make sure there is no other context menu visible at the same time:

```javascript
eventMenuBeforeShow({ eventRecord, resourceRecord, event }) {

    // Hide all visible context menus
    $('.dropdown-menu:visible').hide();

    // Set position, and show custom event menu
    $('#customEventMenu').css({ top : event.y, left : event.x }).show();

    // Prevent built in event menu
    return false;
}
```

To hide custom Bootstrap menus:

```javascript
// Hide all visible context menus by global click
$(document).on('click', () => {
    $('.dropdown-menu:visible').hide();
});
```

## Step 3 - Link data to the custom event menu

The listener used above to show the context menu is called with data retrieved from the target element among its arguments.
Depending on the menu it can have different arguments. You can always check out the documentation to see what data is available.
For example, in case of Event menu you can see `eventRecord` and `resourceRecord` among its arguments.
You can pass the data you need to the custom context menu. How to implement it depends on the UI framework
you are using, for Bootstrap we have to set event record id and resource record id to menu element `dataset`.

```javascript
eventMenuBeforeShow({ eventRecord, resourceRecord, event }) {

    // Hide all visible context menus
    $('.dropdown-menu:visible').hide();

    // Set data, set position, and show custom event menu
    $('#customEventMenu').data({
        eventId    : eventRecord.id,
        resourceId : resourceRecord.id
    }).css({
        top  : event.y,
        left : event.x
    }).show();

    // Prevent built in event menu
    return false;
}
```

<img src="Scheduler/custom-event-menu.png" alt="Custom Event menu"/>

## Step 4 - Process menu item click

When the user clicks on a menu item, you need to catch this and process the action. Depending on requested functionality,
you might have different action implementations. But general workflow is next. You need to extract data from the custom
menu element `dataset`, recognize what menu item is clicked, and call some Scheduler API to perform the action.

For our Bootstrap demo, it can look like this:

```javascript
$('#customEventMenu button').on('click', function () {
    const
        menuEl     = $(this).parent(),
        eventId    = menuEl.data('eventId'),
        resourceId = menuEl.data('resourceId'),
        ref        = $(this).data('ref');

    switch (ref) {
        // "Edit" menu item implementation
        case 'edit':
            scheduler.editEvent(scheduler.eventStore.getById(eventId), scheduler.resourceStore.getById(resourceId));
            break;

        // "Remove" menu item implementation
        case 'remove':
            scheduler.eventStore.remove(eventId);
            break;
    }
});
```

And thats it, be sure to check the `custom-eventmenu` demo out!


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>