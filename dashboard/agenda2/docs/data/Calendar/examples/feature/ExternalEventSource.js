/* eslint-disable no-undef,no-unused-vars */
const dragSource = document.createElement('div');

dragSource.id = 'event-source';
dragSource.className = 'draggable-event-container';
dragSource.innerHTML = `
    <legend>Currently outstanding tasks</legend>
    <div class="draggable-event">Do This</div>
    <div class="draggable-event">Do That</div>
    <div class="draggable-event">Do The other</div>
`;

targetElement.appendChild(dragSource);

const calendar = new Calendar({
    insertBefore : dragSource,
    height       : 700,

    // The utility panel which is at the left by default.
    // Not enough width here, so don't include it.
    sidebar  : false,

    // Start life looking at this date
    date : '2020-03-01',

    // Used to create view titles
    dateFormat : 'DD MMM YYYY',

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/Calendar/examples/feature/company-events.json'
            }
        },
        autoLoad : true
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        externalEventSource : {
            // The id of the element to drag from.
            dragRootElement : 'event-source',

            // Selector which identifies draggable events.
            // It will use the innerText as the event name if that's
            // all we care about. We can adjust the duration in the UI.
            dragItemSelector : '.draggable-event'
        }
    },

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null,
        year   : null
    }
});
