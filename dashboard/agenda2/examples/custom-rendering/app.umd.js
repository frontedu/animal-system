"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var {
  EventModel,
  Combo,
  ResourceStore,
  Calendar,
  CalendarStores,
  Grid,
  DateHelper,
  Month,
  CrudManager,
  DomSync,
  StringHelper
} = bryntum.calendar; // A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.

class Event extends EventModel {
  static get fields() {
    return [{
      name: 'invitees',
      internal: true
    }, {
      name: 'image',
      internal: true
    }, {
      name: 'important',
      type: 'boolean'
    }, {
      name: 'nbrAttachments',
      text: '#Attachments',
      type: 'integer'
    }];
  }

  static get defaults() {
    return {
      invitees: []
    };
  }

}

_defineProperty(Event, "$name", 'Event');

class InviteeSelector extends Combo {
  static get $name() {
    return 'InviteeSelector';
  }

  static get type() {
    return 'inviteeSelector';
  }

  static get configurable() {
    return {
      store: new ResourceStore(),
      label: 'Invitees',
      displayField: 'name',
      multiSelect: true,
      editable: false
    };
  }

  construct() {
    super.construct(...arguments);
    this.store = this.crudManager.resourceStore;
  }

} // Register this type with its factory


InviteeSelector.initClass();
/**
 * A Grid view of a week's events implemented as a custom "mode" widget to be
 * included in a calendar's modes config object.
 *
 * Mixing in CalendarStores means that we can be handed a project
 * and we are automagically configured with an EventStore from the project.
 */

class WeekGrid extends Grid.mixin(CalendarStores) {
  static get $name() {
    return 'WeekGrid';
  } // Declare config properties at this level. (All Grid's are inherited)


  static get configurable() {
    return {
      // Used by the Calendar's mode selector button
      displayName: 'Week Grid',
      // We can be told to look at a certain date.
      // We snap our week to encapsulate this date.
      date: {
        value: null,
        // Config system automatically rejects non-changes.
        $config: {
          equal: 'date'
        }
      },
      // We have a Month utility object.
      // It helps us with week values and week change events
      month: true,
      // These are the data we show from the events
      columns: [{
        text: 'Name',
        field: 'name',
        flex: 1
      }, {
        text: 'Start Date',
        type: 'date',
        field: 'startDate',
        width: '12em'
      }, {
        text: 'End Date',
        type: 'date',
        field: 'endDate',
        width: '12em'
      }]
    };
  }
  /**
   * Interface method used by an encapsulating Calendar view to implement the "prev" button.
   */


  previous() {
    this.date = DateHelper.add(this.startDate, -7, 'day');
  }
  /**
   * Interface method used by an encapsulating Calendar view to implement the "next" button.
   */


  next() {
    this.date = this.endDate;
  }
  /**
   * Property used by an encapsulating Calendar view to create the description in its toolbar.
   */


  get description() {
    var {
      count
    } = this.store,
        week = this.month.getWeekNumber(this.date);
    return `${week[0]} week ${week[1]}. ${count || 'No'} event${count === 1 ? '' : 's'}`;
  }
  /**
   * Property used by an encapsulating Calendar view to create tooltips for the "prev" and "next" buttons.
   */


  get stepUnit() {
    return 'week';
  }
  /**
   * Property used by an encapsulating Calendar view to see what date range a view encompasses.
   */


  get startDate() {
    return this.month.getWeekStart(this.month.getWeekNumber(this.date));
  }
  /**
   * Property used by an encapsulating Calendar view to see what date range a view encompasses.
   */


  get endDate() {
    return DateHelper.add(this.startDate, 7, 'day');
  }
  /**
   * When an EventStore arrives, chain off a slave store from that which we can then
   * filter to only show the week we are focused upon.
   */


  updateEventStore(eventStore) {
    var _super$updateEventSto;

    (_super$updateEventSto = super.updateEventStore) === null || _super$updateEventSto === void 0 ? void 0 : _super$updateEventSto.call(this, eventStore); // Set the grid's store to be the chained store

    this.store = eventStore.chain(); // Add a filter which limits the store to only exposing events for our date range.

    this.store.filter({
      // eslint-disable-next-line quote-props
      'id': 'week-filter',
      filterBy: record => DateHelper.intersectSpans(record.startDate, record.endDate, this.startDate, this.endDate)
    });
  }
  /**
   * When we have our date set, pass it right on to the Month. It will react if that means that
   * we are looking at a different week. We just react to our month's weekChange event.
   */


  updateDate(date) {
    this.month.date = date;
  }
  /**
   * Creates the Month utility objet. We use it to track what week we are looking at.
   */


  changeMonth() {
    // Promote the month to be a Month utility object which informs us whenever setting
    // its date changes the week it is in.
    return new Month({
      date: this.date || (this.date = new Date()),
      listeners: {
        weekChange: 'onMonthWeekChange',
        thisObj: this
      }
    });
  }
  /**
   * When the date we have been told to look at is in another week, ask the store to reevaluate the filter.
   * The store will fire events which cause UI update.
   * We must fire a refresh event so that the encapsulating Calendar view knows about this.
   */


  onMonthWeekChange() {
    this.store.filter();
    this.trigger('refresh');
  }
  /**
   * This is added as a listener by the CalendarStores mixin.
   *
   * Our store is chained off of the EventStore; refill it if the EventStore changes.
   * The store will fire events which cause UI update.
   * We must fire a refresh event so that the encapsulating Calendar view knows about this.
   */


  onCalendarStoreChange() {
    this.store.fillFromMaster();
    this.trigger('refresh');
  }

} // Register with type factory


Calendar.Modes.register('weekgrid', WeekGrid); // The CrudManager arranges loading and syncing of data in JSON form from/to a web service

var crudManager = new CrudManager({
  resourceStore: {
    sorters: [{
      field: 'name',
      ascending: true
    }]
  },
  // This demo uses a custom Event model with extra fields
  eventStore: {
    modelClass: Event
  },
  transport: {
    load: {
      url: 'data/data.json'
    }
  },
  autoLoad: true
}),
    calendar = new Calendar({
  crudManager,
  // A block of configs which is applied to all modes.
  // We want overflow popups to show right on top of the day cell, so reconfigure
  // its align object.
  modeDefaults: {
    overflowPopup: {
      align: {
        align: 'c-c',
        anchor: false
      }
    }
  },
  // Show event presence as bullets in the date picker cells
  datePicker: {
    events: true
  },
  sidebar: {
    items: {
      showEvents: {
        weight: 10,
        type: 'slidetoggle',
        label: 'Events in date picker',
        checked: true,
        // "up." means resolve in owner will call on the Calender
        onChange: 'up.onShowEventsChange'
      }
    }
  },
  // The Calendar's top toolbar.
  // We can alter its items configuration.
  // In this case we add a new item.
  tbar: {
    items: {
      // A new toolbar item. It can be accessed by the name "showWeekColumn"
      // in the Calendar's widgetMap property.
      showWeekColumn: {
        // Insert just before the modeSelector ButtonGroup which has weight : 700
        weight: 650,
        type: 'checkbox',
        label: 'Show week column',
        labelCls: 'b-show-week-cb-label',
        checked: true,
        listeners: {
          // 'up.' means method is on a parent Widget. It will find the Calendar
          change: 'up.onShowWeekToggle'
        }
      }
    }
  },
  // Start life looking at this date
  date: new Date(2020, 9, 12),
  appendTo: 'container',
  // Features named by the properties are included.
  // An object is used to configure the feature.
  features: {
    eventEdit: {
      editorConfig: {
        width: 500
      },
      // Any items configured on the eventEdit feature are merged into the items
      // definition of the default editor.
      // If a system-supplied name is used as a property, it will reconfigure that existing
      // field.
      // Configuring a system-supplied field as false removes that field.
      // If a new property name is used, it will be added to the editor.
      // Fields are sorted in ascending order of their weight config.
      // System-supplied input fields have weights from 100 to 800.
      // This new item is therefore inserted below the first existing field.
      items: {
        // Add a multiselect combo box to select invitees
        inviteeSelector: {
          // name is the input name which corresponds to the field in the
          // Eventrecord which is being edited.
          name: 'invitees',
          type: 'inviteeselector',
          // We prefer the clear trigger at the end.
          // Higher weights gravitate towards center.
          clearable: {
            weight: -1000
          },
          // We'd like ESC to revert to initial value.
          revertOnEscape: true,
          // Insert just after event name which is at 100
          weight: 110,
          // Don't allow it to grow our of control.
          // Will begin to scroll the chips when it hits this limit.
          maxHeight: '8em',
          crudManager
        }
      }
    } // Uncomment this to show custom tooltip
    // eventTooltip : {
    //     align : 'l-r',
    //
    //     // Mustn't shrink because of large, graphical content
    //     minWidth : null,
    //
    //     renderer : data => `<dl>
    //         <dt>Assigned to:</dt>
    //         <dd>${StringHelper.encodeHtml(data.eventRecord.resource.name)}</dd>
    //         <dt>Time:</dt>
    //         <dd>
    //             ${DateHelper.format(data.eventRecord.startDate, 'LT')} - ${DateHelper.format(data.eventRecord.endDate, 'LT')}
    //         </dd>
    //
    //         ${data.eventRecord.get('image') ? `<dt>Image:</dt><dd><img class="b-event-image" src="${data.eventRecord.get('image')}"/></dd>` : ''}
    //         ${data.eventRecord.get('invitees').length > 0 ? `
    //             <dt>Invitees:</dt>
    //             <dd>
    //                 <ul>
    //                     ${data.eventRecord.get('invitees').map(invitee => `<li>${StringHelper.encodeHtml(calendar.resourceStore.getById(invitee).name)}</li>`).join('')}
    //                 </ul>
    //             </dd>
    //             ` : ''}
    //     </dl>
    //     `
    // }

  },
  // Modes are the views available in the Calendar.
  // An object may be used to configure the view.
  // null means do not include the view.
  modes: {
    month: {
      descriptionRenderer() {
        var eventsInView = this.eventStore.records.filter(eventRec => DateHelper.intersectSpans(this.startDate, this.endDate, eventRec.startDate, eventRec.endDate)).length,
            startWeek = this.month.getWeekNumber(this.startDate),
            endWeek = this.month.getWeekNumber(this.endDate); // We describe the month in terms of its week range in our app

        return `Week ${startWeek[1]} ${startWeek[0]} - ${endWeek[1]} ${endWeek[0]} (${eventsInView} event${eventsInView === 1 ? '' : 's'})`;
      },

      showWeekColumn: true,

      // Make week cell more informative
      weekRenderer(targetElement, [year, week]) {
        DomSync.sync({
          targetElement,
          domConfig: {
            children: [{
              className: 'b-week-name',
              html: `Week ${week}`
            }],
            dataset: {
              btip: 'Click to view week in detail'
            }
          }
        });
      },

      dayCellRenderer(cellData) {
        if (!(cellData.date - new Date(2020, 9, 14))) {
          cellData.cls['hackathon-dayoff'] = true;
          cellData.headerStyle.fontWeight = 'bold'; // Mutate day cell information

          cellData.isNonWorking = true;
          return `${cellData.date.getDate()} Day off yay!`;
        }
      },

      eventRenderer({
        eventRecord,
        renderData
      }) {
        // highlight all events which are related to conferences
        if (eventRecord.name.indexOf('conference') !== -1) {
          renderData.style.fontWeight = 'bold';
          renderData.cls['conference-event'] = true;
        }

        if (eventRecord.name === 'Breakfast') {
          // Use our own classes. Overrides any iconCls from the data.
          // Default rendering will add its own classes after us.
          renderData.iconCls = 'b-fa b-fa-coffee';
        }
      }

    },
    week: {
      // Add extra element on special date
      dayHeaderRenderer(dayHeaderDomConfig, cellData) {
        if (!(cellData.date - new Date(2020, 9, 14))) {
          dayHeaderDomConfig.className['b-highlight-day'] = 1;
          dayHeaderDomConfig.children.push('\ud83c\udf89 Day off');
        }
      },

      dayCellRenderer(domConfig, cellData) {
        if (!(cellData.date - new Date(2020, 9, 14))) {
          domConfig.className['hackathon-dayoff'] = domConfig.className['b-nonworking-day'] = 1;
        }

        return domConfig;
      },

      // Render an icon showing number of invitees (editable in the event editor)
      eventRenderer: ({
        eventRecord,
        renderData
      }) => {
        if (eventRecord.important) {
          renderData.iconCls['b-fa b-fa-exclamation'] = 1;
        } else if (eventRecord.nbrAttachments > 0) {
          renderData.iconCls['b-fa b-fa-paperclip'] = 1;
        } else if (eventRecord.invitees.length > 0) {
          renderData.iconCls['b-fa b-fa-user-friends'] = 1;
        }

        return `
                        <span class="b-event-name">${StringHelper.encodeHtml(eventRecord.name)}</span>
                        ${eventRecord.image ? `<img src="${eventRecord.image}" alt="${StringHelper.encodeHtml(eventRecord.name)}" class="b-event-image"/>` : ''}
                    `;
      }
    },
    // Here is our custom mode. If no configuration is needed, true will include it.
    weekgrid: true,
    year: {
      dayCellRenderer({
        cellConfig,
        events,
        date
      }) {
        if (date.getMonth() === 4 && date.getDate() === 25) {
          // My friends birthday, don't forget
          cellConfig.dataset.btip = 'Happy birthday Dave!';
          cellConfig.style.backgroundColor = 'transparent';
          return '<i class="b-icon b-fa-birthday-cake"></i>';
        } else if (date.getDate() === 25) {
          // Paycheck day!! Mark in bold
          cellConfig.style.fontWeight = '700';
        }
      }

    },
    agenda: {
      // Render an icon showing number of invitees (editable in the event editor)
      eventRenderer: ({
        eventRecord,
        renderData
      }) => {
        if (eventRecord.important) {
          renderData.iconCls['b-fa b-fa-exclamation'] = 1;
        } else if (eventRecord.nbrAttachments > 0) {
          renderData.iconCls['b-fa b-fa-paperclip'] = 1;
        } else if (eventRecord.invitees.length > 0) {
          renderData.iconCls['b-fa b-fa-user-friends'] = 1;
        }

        if (eventRecord.image) {
          // The event is not a fixed height which they usually are
          // in AgendaView, so we have to set that into the renderData
          renderData.eventHeight = 'auto';
          renderData.cls['b-with-image'] = 1;
        }

        ;
        return [{
          className: 'b-event-name',
          html: StringHelper.encodeHtml(eventRecord.name)
        }, eventRecord.image ? {
          tag: 'img',
          height: 100,
          src: eventRecord.image,
          alt: StringHelper.encodeHtml(eventRecord.name)
        } : null];
      }
    }
  },

  // Will be automatically called when the Calendar fires its viewPaint event
  onViewPaint() {
    // Sync the visibility of the show week checkbox
    this.widgetMap.showWeekColumn[this.mode === 'month' ? 'show' : 'hide']();
  },

  onShowEventsChange({
    checked
  }) {
    this.datePicker.events = checked;
  },

  // Handler for checkbox change event. Sync month mode's state.
  onShowWeekToggle({
    checked
  }) {
    this.modes.month.showWeekColumn = checked;
  }

});