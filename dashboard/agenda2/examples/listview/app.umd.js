"use strict";

var {
  EventModel,
  Calendar
} = bryntum.calendar; // A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.

class AppEvent extends EventModel {
  // Add some extra fields to demonstrate the createColumnsFromModel option of ColumnPicker
  static get fields() {
    return [{
      name: 'notes',
      // Provide defaults for when a column is autocreated for this field
      column: {
        width: '20em',
        editor: {
          type: 'textareafield',
          inline: false
        }
      }
    }, {
      name: 'important',
      type: 'boolean'
    }];
  }

  static get defaults() {
    return {
      invitees: []
    };
  }

}

var calendar = new Calendar({
  // Start life looking at this date
  date: new Date(2020, 9, 12),
  // Show the event list
  modes: {
    list: {
      // If we use field names which the EventList creates for itself, our config
      // gets merged into the default, so we can affect the EventList's own columns.
      columns: [{
        field: 'name',

        renderer({
          record
        }) {
          var _record$resource;

          return [{
            tag: 'i',
            className: 'b-icon b-icon-circle',
            style: `color:${(_record$resource = record.resource) === null || _record$resource === void 0 ? void 0 : _record$resource.eventColor}`
          }, {
            text: record.name
          }];
        }

      }]
    }
  },
  mode: 'list',
  // CrudManager arranges loading and syncing of data in JSON form from/to a web service
  crudManager: {
    transport: {
      load: {
        url: 'data/busy.json'
      }
    },
    // This demo uses a custom Event model with extra fields
    eventStore: {
      modelClass: AppEvent
    },
    autoLoad: true
  },
  appendTo: 'container'
});