import { EventStore, ResourceStore, Calendar, DomHelper, DateHelper, EventModel } from '../../build/calendar.module.js?459414';

StartTest(t => {
    // eslint-disable-next-line no-unused-vars
    let calendar, eventStore, resourceStore, agenda, year, month, week, day;

    async function getCalendar(config) {
        calendar = await t.getCalendar(Calendar.mergeConfigs({
            features : {
                eventEdit : true
            },
            modes : {
                month : {
                    eventHeight : 16
                }
            }
        }, config));
        eventStore = calendar.eventStore;
        resourceStore = calendar.resourceStore;

        // eslint-disable-next-line no-unused-vars
        ({ agenda, year, month, week, day } = calendar.modes);

        return calendar;
    }

    t.beforeEach(() => {
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    t.it('Should be able to change the name and date', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month',

            // The Edit should take place correctly with autoCreate: false
            autoCreate : false
        });
        let eventEditor, calendarField, pickerItem0, cal0Color, newEventBar;

        const excursionEvent = eventStore.find(e => e.name === 'Excursion');

        t.chain(
            { dblclick : '[data-date="2019-10-17"] .b-cal-event:Contains(Excursion)' },

            next => {
                eventEditor = calendar.features.eventEdit.editor;
                calendarField = eventEditor.widgetMap.resourceField;

                // Check that the title has been translated.
                t.notOk(eventEditor.title.includes('{'), 'Localized property has been translated');

                next();
            },

            { click : '[data-ref="nameField"] input' },

            { type : 'Postponed excursion', clearExisting : true },

            { click : () => calendarField.triggers.expand.element },

            next => {
                pickerItem0 = calendarField.picker.getItem(0);

                t.selectorCountIs(`#${calendarField.picker.id} .b-icon.b-icon-square`, 3, 'Calendar icons present');
                cal0Color = DomHelper.getStyleValue(pickerItem0.querySelector('.b-icon.b-icon-square'), 'color');

                t.ok(cal0Color, 'Calendar color is set');
                next();
            },

            { click : () => pickerItem0 },

            { click : '[data-ref="startDateField"] input' },

            { type : '10/23/2019', clearExisting : true },

            { click : 'button:contains(Save)' },

            // click on another event to prevent test failure from selection bug
            // https://github.com/bryntum/support/issues/1406
            { click : '.b-cal-event:contains(Hackathon)' },

            {
                waitFor : () => {
                    newEventBar = t.query('[data-date="2019-10-23"] .b-cal-event:Contains(Postponed excursion)')[0];

                    return DomHelper.getStyleValue(newEventBar, 'color') === cal0Color;
                }
            },

            () => {
                t.is(excursionEvent.name, 'Postponed excursion', 'Edit successful');
                t.is(excursionEvent.startDate, new Date(2019, 9, 23, 10), 'Move to next Wednesday');
                t.selectorExists('[data-date="2019-10-23"] .b-cal-event:Contains(Postponed excursion)', 'Event bar moved');

                t.is(DomHelper.getStyleValue(newEventBar, 'color'), cal0Color, 'Event has correct colour');
            }
        );
    });

    t.it('Should be able to change the name and date from overflow', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month'
        });
        let eventEditor, calendarField, pickerItem0, cal0Color, newEventBar;

        const excursionEvent = eventStore.find(e => e.name === 'Excursion');

        t.chain(
            { click : '[data-date="2019-10-17"] .b-cal-cell-overflow' },

            { click : '[data-date="2019-10-17"] .b-cal-event:Contains(Excursion)' },

            { click : '.b-tool[data-ref="edit"]' },

            next => {
                eventEditor = calendar.features.eventEdit.editor;
                calendarField = eventEditor.widgetMap.resourceField;
                next();
            },

            { click : '[data-ref="nameField"] input' },

            { type : 'Postponed excursion', clearExisting : true },

            { click : () => calendarField.triggers.expand.element },

            next => {
                pickerItem0 = calendarField.picker.getItem(0);

                t.selectorCountIs(`#${calendarField.picker.id} .b-icon.b-icon-square`, 3, 'Calendar icons present');
                cal0Color = DomHelper.getStyleValue(pickerItem0.querySelector('.b-icon.b-icon-square'), 'color');

                t.ok(cal0Color, 'Calendar color is set');
                next();
            },

            { click : () => pickerItem0 },

            { click : '[data-ref="startDateField"] input' },

            { type : '10/23/2019', clearExisting : true },

            { click : 'button:contains(Save)' },

            { waitForSelector : '[data-date="2019-10-23"]' },

            // click on another event to prevent test failure from selection bug
            // https://github.com/bryntum/support/issues/1406
            { click : '.b-cal-event:contains(Hackathon)' },

            {
                waitFor : () => {
                    newEventBar = t.query('[data-date="2019-10-23"] .b-cal-event:Contains(Postponed excursion)')[0];

                    return DomHelper.getStyleValue(newEventBar, 'color') === cal0Color;
                }
            },

            () => {
                t.is(excursionEvent.name, 'Postponed excursion', 'Edit successful');
                t.is(excursionEvent.startDate, new Date(2019, 9, 23, 10), 'Move to next Wednesday');
                t.selectorExists('[data-date="2019-10-23"] .b-cal-event:Contains(Postponed excursion)', 'Event bar moved');

                t.is(DomHelper.getStyleValue(newEventBar, 'color'), cal0Color, 'Event has correct colour');
            }
        );
    });

    t.it('Should add and remove the b-editing class', async t => {
        eventStore = new EventStore({
            data : [{
                duration     : 1,
                durationUnit : 'hour',
                id           : 'twice-weekly',
                name         : 'Meeting',
                startDate    : new Date(2019, 9, 15, 13),
                resourceId   : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'week',

            // Edit needs to work with nameField configured away
            features : {
                eventEdit : {
                    items : {
                        nameField : false
                    }
                }
            }
        });
        const week = calendar.modes.week;
        let eventEl;

        t.chain(
            { dblclick : '.b-cal-event-wrap:contains(Meeting)' },

            next => {
                eventEl = week.getEventElement(week.eventStore.first);
                t.hasCls(eventEl, 'b-editing', 'b-editing added correctly');
                next();
            },

            { click : 'button:contains(Cancel)' },

            () => {
                t.hasNotCls(eventEl, 'b-editing', 'b-editing removed correctly');
            }
        );
    });

    t.it('should present editor at selected cell', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'agenda'
        });

        agenda.scrollable.y = agenda.scrollable.maxY;

        await t.waitFor(() => Math.abs(agenda.scrollable.y - agenda.scrollable.maxY) <= 1);

        const eventEl = Array.from(calendar.element.querySelectorAll('[data-event-id="1"]')).pop();

        await t.doubleClick(eventEl);

        await t.waitForSelector('.b-eventeditor');

        t.isApprox(agenda.scrollable.y, agenda.scrollable.maxY, 'Still at scroll end');
    });

    t.it('Should be able to delete an event', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month'
        });

        const excursionEvent = eventStore.find(e => e.name === 'Excursion');

        t.chain(
            { dblclick : '[data-date="2019-10-17"] .b-cal-event:Contains(Excursion)' },

            { click : 'button:contains(Delete)' },

            { waitForSelectorNotFound : '.b-cal-event:Contains(Excursion)' },

            () => {
                t.notOk(calendar.eventStore.includes(excursionEvent), 'Event is removed');
                t.selectorNotExists('.b-cal-event:Contains(Excursion)', 'Event is removed');
            }
        );
    });

    t.it('Should manage custom field visibility based on eventType', async t => {
        class MyEvent extends EventModel {
            static get fields() {
                return [
                    { name : 'eventType' }
                ];
            }
        }

        eventStore = new EventStore({
            modelClass : MyEvent,

            // Add a meeting with a specific eventType
            data : t.getHackathonData().events.rows.concat([{
                id           : 'dinner-meeting',
                duration     : 2,
                durationUnit : 'hour',
                name         : 'Dinner meeting',
                eventType    : 'Dinner',
                startDate    : new Date(2019, 9, 24, 19),
                resourceId   : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            mode     : 'month',
            features : {
                eventEdit : {
                    items : {
                        eventTypeField : {
                            index : 0,
                            label : 'Type',
                            type  : 'combo',
                            name  : 'eventType',
                            items : ['Breakfast', 'Brunch', 'Lunch', 'Dinner']
                        },
                        // https://github.com/bryntum/support/issues/1228 was caused by having multiple custom fields
                        // when transitioning setting hidden=false after first setting hidden=true
                        foo : {
                            type    : 'number',
                            label   : 'Foo',
                            dataset : { eventType : 'Dinner' }
                        },
                        bar : {
                            type    : 'text',
                            label   : 'Bar',
                            dataset : { eventType : 'Dinner' }
                        },
                        baz : {
                            type    : 'text',
                            label   : 'Baz',
                            dataset : { eventType : 'Dinner' }
                        }
                    }
                }
            }
        });

        const { eventEdit } = calendar.features;

        t.chain(
            { dblclick : '[data-event-id="dinner-meeting"]' },

            { waitFor : () => eventEdit.editor && eventEdit.editor.containsFocus },

            next => {
                const { editor } = eventEdit;

                t.notOk(editor.widgetMap.foo.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.bar.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.baz.hidden, 'Custom field is visible');

                next();
            },

            { click : 'button:contains(Cancel)' },

            { dblclick : '[data-date="2019-10-17"] .b-cal-event:Contains(Excursion)' },

            { waitFor : () => eventEdit.editor && eventEdit.editor.containsFocus },

            next => {
                const { editor } = eventEdit;

                t.ok(editor.widgetMap.foo.hidden, 'Custom field is hidden');
                t.ok(editor.widgetMap.bar.hidden, 'Custom field is hidden');
                t.ok(editor.widgetMap.baz.hidden, 'Custom field is hidden');

                next();
            },

            { click : 'button:contains(Cancel)' },

            { dblclick : '[data-event-id="dinner-meeting"]' },

            { waitFor : () => eventEdit.editor && eventEdit.editor.containsFocus },

            next => {
                const { editor } = eventEdit;

                t.notOk(editor.widgetMap.foo.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.bar.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.baz.hidden, 'Custom field is visible');

                next();
            },

            { click : '[data-ref="eventTypeField"] .b-icon-picker' },

            { click : '.b-list-item:contains(Breakfast)' },

            next => {
                const { editor } = eventEdit;

                t.ok(editor.widgetMap.foo.hidden, 'Custom field is hidden');
                t.ok(editor.widgetMap.bar.hidden, 'Custom field is hidden');
                t.ok(editor.widgetMap.baz.hidden, 'Custom field is hidden');

                next();
            },

            { click : '[data-ref="eventTypeField"] .b-icon-picker' },

            { click : '.b-list-item:contains(Dinner)' },

            next => {
                const { editor } = eventEdit;

                t.notOk(editor.widgetMap.foo.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.bar.hidden, 'Custom field is visible');
                t.notOk(editor.widgetMap.baz.hidden, 'Custom field is visible');

                next();
            }
        );
    });

    t.it('Should be able to change recurring events', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : [{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                week   : null
            },
            eventStore,
            resourceStore
        });

        const meetingBase = eventStore.first;

        await t.waitFor(() => meetingBase.occurrences.length === 7);

        t.is(meetingBase.occurrences.length, 7, '7 following occurrences in month');

        t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-11-05"] .b-cal-event:Contains(Recurring Meeting)');

        t.chain(
            { dblclick : '[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)' },

            { click : '[data-ref="startDateField"] input' },

            { type : '10/8/2019', clearExisting : true },

            { click : 'button:contains(Save)' },

            // https://github.com/bryntum/support/issues/1630: ConfirmationPopup must be auto focused.
            {
                waitFor : calendar.features.eventEdit.recurrenceConfirmation.containsFocus
            },

            { waitForEvent : [calendar.modes.month, 'refresh'], trigger : { click : 'button:contains(Yes)' } },

            () => {
                t.is(meetingBase.startDate, new Date(2019, 9, 8, 13), 'Starts previous week');
                t.is(meetingBase.occurrences.length, 9, '9 following occurrences in month');

                t.selectorExists('[data-date="2019-10-08"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-10"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-05"] .b-cal-event:Contains(Recurring Meeting)');
            }
        );

    });

    t.it('Should be able to add an exception to a recurring event', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : [{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                week   : null
            },
            eventStore,
            resourceStore
        });

        const meetingBase = eventStore.first;

        await t.waitFor(() => meetingBase.occurrences.length === 7);

        t.is(meetingBase.occurrences.length, 7, '7 following occurrences in month');

        t.chain(
            { dblclick : '[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)' },

            { click : '[data-ref="nameField"] input' },

            { type : 'Moved: 23rd', clearExisting : true },

            { click : '[data-ref="startDateField"] input' },

            { type : '10/23/2019', clearExisting : true },

            { click : 'button:contains(Save)' },

            {
                waitForEvent : [calendar.activeView, 'refresh'],
                trigger      : { click : 'button:contains(Only This Event)' }
            },

            () => {
                t.is(eventStore.count, 2, 'Exception is in store');
                t.ok(meetingBase.hasException(new Date(2019, 9, 22)), 'Base meeting has an exception');
                t.is(meetingBase.occurrences.length, 6, '6 following occurrences in month');

                t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-05"] .b-cal-event:Contains(Recurring Meeting)');

                t.selectorExists('[data-date="2019-10-23"] .b-cal-event:Contains(Moved: 23rd)');
            }
        );

    });

    t.it('Should be able to promote an occurrence to be a new base', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : [{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                week   : null
            },
            eventStore,
            resourceStore
        });

        const meetingBase = eventStore.first;

        await t.waitFor(() => meetingBase.occurrences.length === 7);

        const newBase = meetingBase.occurrences[3];

        t.is(meetingBase.occurrences.length, 7, '7 following occurrences in month');

        t.chain(
            { dblclick : '[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)' },

            next => {
                t.selectorExists('[data-ref="resourceField"] label:contains(Calendar)', 'Override of label config worked');
                next();
            },

            { click : '[data-ref="nameField"] input' },

            { type : 'Starts: 30th', clearExisting : true },

            { click : '[data-ref="startDateField"] input' },

            { type : '10/30/2019', clearExisting : true },

            { click : 'button[data-ref="editRecurrenceButton"]' },

            { click : 'button:not([data-ref="editRecurrenceButton"]):contains(Tue)' },
            { click : 'button:not([data-ref="editRecurrenceButton"]):contains(Wed)' },

            { click : '.b-recurrenceeditor button:contains(Save)' },
            { click : 'button:contains(Save)' },

            {
                waitForEvent : [calendar.activeView, 'refresh'],
                trigger      : { click : 'button:contains(All Future Events)' }
            },

            () => {
                t.is(eventStore.count, 2, 'Exception is in store');
                t.is(newBase.startDate, new Date(2019, 9, 30, 13), 'New base correct');
                t.is(meetingBase.occurrences.length, 3, '3 following occurrences in month');
                t.is(newBase.occurrences.length, 3, '3 following occurrences in month');

                t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');

                t.selectorExists('[data-date="2019-10-30"] .b-cal-event:Contains(Starts: 30th)');
                t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Starts: 30th)');
                t.selectorExists('[data-date="2019-11-06"] .b-cal-event:Contains(Starts: 30th)');
                t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Starts: 30th)');
            }
        );
    });

    t.it('UI should be locked when Calendar is readOnly', async t => {
        eventStore = new EventStore({
            data : [{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            readOnly : true,
            date     : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode     : 'month'
        });

        t.chain(
            { dblclick : '.b-cal-event' },

            { waitForSelector : '.b-eventeditor' },

            // Check first occurrence is in sync with state of Calendar
            next => {
                const
                    { editor }    = calendar.features.eventEdit,
                    { widgetMap } = editor;

                // Buttons hidden
                t.ok(widgetMap.saveButton.hidden, 'Save button hidden');
                t.ok(widgetMap.cancelButton.hidden, 'Cancel button hidden');
                t.ok(widgetMap.deleteButton.hidden, 'Delete button hidden');

                // UI must be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.ok(input.readOnly));

                calendar.readOnly = false;
                next();
            },

            // Check it unlocks
            next => {
                const
                    { editor }    = calendar.features.eventEdit,
                    { widgetMap } = editor;

                // Buttons shown
                t.notOk(widgetMap.saveButton.hidden, 'Save button hidden');
                t.notOk(widgetMap.cancelButton.hidden, 'Cancel button hidden');
                t.notOk(widgetMap.deleteButton.hidden, 'Delete button hidden');

                // UI must not be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.notOk(input.readOnly));

                calendar.readOnly = true;
                next();
            },

            // Check it locks again
            () => {
                const
                    { editor }    = calendar.features.eventEdit,
                    { widgetMap } = editor;

                // Buttons hidden
                t.ok(widgetMap.saveButton.hidden, 'Save button hidden');
                t.ok(widgetMap.cancelButton.hidden, 'Cancel button hidden');
                t.ok(widgetMap.deleteButton.hidden, 'Delete button hidden');

                // UI must be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.ok(input.readOnly));

                calendar.readOnly = false;
            }
        );
    });

    t.it('Should be able to promote a singular event to be a recurring base', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : [{
                duration     : 1,
                durationUnit : 'hour',
                id           : 'twice-weekly',
                name         : 'Recurring Meeting',
                startDate    : new Date(2019, 9, 15, 13),
                resourceId   : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                week   : null
            },
            eventStore,
            resourceStore
        });

        const meetingBase = eventStore.first;

        t.notOk(meetingBase.occurrences.length, 'Event now has no occurrences');

        t.is(eventStore.count, 1, 'One event in store');

        t.chain(
            { waitFor : () => document.querySelectorAll('.b-cal-event').length === 1, desc : 'Only one event rendered' },

            { dblclick : '[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)' },

            { click : '[data-ref="recurrenceCombo"]' },

            { click : '.b-list-item:contains(Weekly)' },

            { click : '[data-ref="editRecurrenceButton"]' },

            { click : 'button:contains(Thu)' },

            { click : '.b-recurrenceeditor [data-ref="saveButton"]' },

            { click : '[data-ref="saveButton"]' },

            () => {
                t.is(eventStore.count, 1, 'Still one event in store');
                t.ok(eventStore.recurringEvents.has(meetingBase), 'Newly recurring event is in recurringEvents cache');

                t.is(meetingBase.occurrences.length, 7, '7 following occurrences in month');

                t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-05"] .b-cal-event:Contains(Recurring Meeting)');
                t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Recurring Meeting)');
            }
        );

    });

    t.it('Should be able to demote a recurring event to be a singular event', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : [{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }]
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                week   : null
            },
            eventStore,
            resourceStore
        });

        const meetingBase = eventStore.first;

        await t.waitFor(() => meetingBase.occurrences.length === 7);

        t.is(meetingBase.occurrences.length, 7, '7 following occurrences in month');

        t.selectorExists('[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-22"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-29"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-10-31"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-11-05"] .b-cal-event:Contains(Recurring Meeting)');
        t.selectorExists('[data-date="2019-11-07"] .b-cal-event:Contains(Recurring Meeting)');

        t.chain(
            { dblclick : '[data-date="2019-10-15"] .b-cal-event:Contains(Recurring Meeting)' },

            { click : '[data-ref="recurrenceCombo"]' },

            { click : '.b-list-item:contains(None)' },

            { click : '[data-ref="saveButton"]' },

            {
                waitForEvent : [calendar.modes.month, 'refresh'],
                trigger      : { click : '[data-ref="changeMultipleButton"]' }
            },

            () => {
                t.notOk(meetingBase.occurrences.length, 'Event now has no occurrences');
                t.notOk(eventStore.recurringEvents.has(meetingBase), 'Newly singular event is not in recurringEvents cache');

                t.is(eventStore.count, 1, 'Still one event in store');

                t.selectorCountIs('.b-cal-event', 1, 'Only one event rendered');
            }
        );
    });

    t.it('Month cell should lay out events correctly when editor aligned to it', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month'
        });

        t.chain(
            { click : '.b-calendar-cell[data-date="2019-10-20"] .b-cal-cell-overflow:contains(+2 more)' },

            // Click n event that is in the overflow zone so that the editor is aligned to the *cell* not the event
            { click : '.b-overflowpopup .b-cal-event:Contains(Dinner)' },

            { click : '.b-sch-event-tooltip .b-tool[data-ref="edit"]' },

            { waitForSelector : '.b-eventeditor' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            // Collect the event element for measuring
            { waitForSelector : '.b-overflowpopup .b-cal-event-wrap:contains(Dinner)' },

            (next, els) => {
                const
                    editorTarget = calendar.features.eventEdit.editor.lastAlignSpec.target,
                    eventEl      = els[0];

                t.is(editorTarget, eventEl, 'Editor correctly aligned to cell');
                next();
            }
        );
    });

    t.it('allowOverlap should be true by default and allow events to overlap', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'week'
        });
        const
            gridIntro = calendar.eventStore.find(e => e.name === 'Scheduler Grid introduction + review'),
            scrum     = calendar.eventStore.find(e => e.name === 'Team Scrum');

        t.chain(
            { dblclick : '.b-cal-event-wrap:contains(Scheduler Grid introduction + review)', offset : ['50%', '20%'] },

            { click : '[data-ref="startTimeField"] input' },

            { type : '10:00 AM', clearExisting : true },

            { click : 'button:contains(Save)' },

            () => {
                t.notOk(gridIntro.startDate - scrum.startDate, 'Event overlaps Team Scrum correctly');
            }
        );
    });

    t.it('Clearing then checking the allDay field', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode  : 'week',
            modes : {
                week : {
                    dayStartTime : 8
                }
            }
        });
        const beer = calendar.eventStore.find(e => e.name === 'Relax and official arrival beer');

        let eventEditor;

        t.chain(
            next => {
                t.selectorCountIs('.b-cal-event-wrap:not(.b-allday):contains(Relax and official arrival beer)', 0);
                t.selectorCountIs('.b-cal-event-wrap.b-allday:contains(Relax and official arrival beer)', 1);
                t.is(DateHelper.format(beer.startDate, 'Y/M/D HH:mm'), '2019/10/14 00:00', 'allDay start time correct');
                t.is(DateHelper.format(beer.endDate, 'Y/M/D HH:mm'), '2019/10/15 00:00', 'allDay end time correct');
                next();
            },

            // Make it non-allDay
            { dblclick : '.b-cal-event-wrap:contains(Relax and official arrival beer)' },

            { waitForSelector : '[data-ref="allDay"] input' },

            next => {
                eventEditor = calendar.features.eventEdit.editor;

                t.is(eventEditor.widgetMap.startTimeField.hidden, true, 'startTime field correctly hidden');
                t.is(eventEditor.widgetMap.endTimeField.hidden, true, 'endTime field correctly hidden');
                next();
            },

            { click : '[data-ref="allDay"] input' },

            next => {
                eventEditor = calendar.features.eventEdit.editor;

                t.is(eventEditor.widgetMap.startTimeField.hidden, false, 'startTime field correctly shown');
                t.is(eventEditor.widgetMap.endTimeField.hidden, false, 'endTime field correctly shown');
                next();
            },

            {
                waitForEvent : [calendar.modes.week, 'refresh'],
                trigger      : { click : 'button:contains(Save)' }
            },

            next => {
                t.selectorCountIs('.b-cal-event-wrap:not(.b-allday):contains(Relax and official arrival beer)', 1);
                t.selectorCountIs('.b-cal-event-wrap.b-allday:contains(Relax and official arrival beer)', 0);
                t.is(DateHelper.format(beer.startDate, 'Y/M/D HH:mm'), '2019/10/14 18:00', 'start time restored correctly');
                t.is(DateHelper.format(beer.endDate, 'Y/M/D HH:mm'), '2019/10/14 20:00', 'end time restored correctly');
                next();
            },

            // Now let's put it back
            { dblclick : '.b-cal-event-wrap:contains(Relax and official arrival beer)' },

            { click : '[data-ref="allDay"] input' },

            next => {
                eventEditor = calendar.features.eventEdit.editor;

                t.is(eventEditor.widgetMap.startTimeField.hidden, true, 'startTime field correctly hidden');
                t.is(eventEditor.widgetMap.endTimeField.hidden, true, 'endTime field correctly hidden');
                next();
            },

            {
                waitForEvent : [calendar.modes.week, 'refresh'],
                trigger      : { click : 'button:contains(Save)' }
            },

            () => {
                t.selectorCountIs('.b-cal-event-wrap:not(.b-allday):contains(Relax and official arrival beer)', 0);
                t.selectorCountIs('.b-cal-event-wrap.b-allday:contains(Relax and official arrival beer)', 1);
                t.is(DateHelper.format(beer.startDate, 'Y/M/D HH:mm'), '2019/10/14 00:00', 'allDay start time correct');
                t.is(DateHelper.format(beer.endDate, 'Y/M/D HH:mm'), '2019/10/15 00:00', 'allDay end time correct');
            }
        );
    });

    t.it('Clearing allDay field with date/time fields configured away', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13),
                resourceId     : 'mats'
            }])
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode  : 'week',
            modes : {
                week : {
                    dayStartTime : 8
                }
            },
            features : {
                eventEdit : {
                    items : {
                        startDateField : false,
                        startTimeField : false,
                        endDateField   : false,
                        endTimeField   : false
                    }
                }
            }
        });
        const beer = calendar.eventStore.find(e => e.name === 'Relax and official arrival beer');

        t.chain(
            // Make it non-allDay
            { dblclick : '.b-cal-event-wrap:contains(Relax and official arrival beer)' },

            { click : '[data-ref="allDay"] input' },

            { click : 'button:contains(Save)' },

            () => {
                t.selectorCountIs('.b-cal-event-wrap:not(.b-allday):contains(Relax and official arrival beer)', 1);
                t.selectorCountIs('.b-cal-event-wrap.b-allday:contains(Relax and official arrival beer)', 0);
                t.is(DateHelper.format(beer.startDate, 'Y/M/D HH:mm'), '2019/10/14 18:00', 'start time restored correctly');
                t.is(DateHelper.format(beer.endDate, 'Y/M/D HH:mm'), '2019/10/14 20:00', 'end time restored correctly');
            }
        );
    });

    t.it('Drag-creating an interDay event in WeekView', async t => {
        eventStore = new EventStore({
            data : []
        });

        // eslint-disable-next-line no-undef
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode  : 'week',
            modes : {
                week : {
                    dayStartTime : 8
                }
            },
            sidebar : false
        });
        const { week } = calendar.modes;

        let newRecord, editor, recurrenceCombo, editRecurrenceButton;

        t.chain(
            next => {
                t.selectorCountIs('.b-cal-event-wrap', 0);
                next();
            },

            {
                drag   : '.b-dayview-day-container .b-calendar-cell[data-date="2019-10-14"]',
                offset : ['50%', '50'],
                by     : [150, 100]
            },

            next => {
                newRecord = calendar.eventStore.first;
                t.selectorCountIs('.b-cal-event-wrap.b-allday:not(.b-overflow)', 1);
                next();
            },

            { waitForSelector : '.b-eventeditor' },

            {
                waitFor : () => {
                    editor = calendar.features.eventEdit.editor;
                    recurrenceCombo = editor?.widgetMap.recurrenceCombo;
                    editRecurrenceButton = editor?.widgetMap.editRecurrenceButton;

                    // Editor contains focus and is aligned to the new event's element.
                    return editor?.containsFocus && editor?.lastAlignSpec.target === week.allDayEvents.getEventElement(newRecord);
                }
            },

            { type : 'Test Event' },

            { click : () => recurrenceCombo.triggers.expand.element },

            { click : '.b-list-item:contains(Daily)' },

            { click : () => editRecurrenceButton.element },

            { click : '[data-ref="intervalField"] input' },

            { type : 3, clearExisting : true },

            { click : '.b-recurrenceeditor button:contains(Save)' },

            { click : 'button:contains(Save)' },

            { waitFor : () => document.querySelectorAll('.b-cal-event-wrap.b-allday:not(.b-overflow)').length === 2 },

            () => {
                t.selectorCountIs('.b-cal-event-wrap.b-allday:not(.b-overflow)', 2, 'Ocurrences appear correctly');
            }
        );
    });

    t.it('Event name field should be blank when from autoCreate', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            sidebar : false,
            date    : new Date(2019, 9, 14),
            mode    : 'month',
            eventStore,
            resourceStore
        });

        let eventEditor;

        t.chain(
            { dblclick : '[data-date="2019-10-17"]' },

            { waitForSelector : '.b-eventeditor' },

            { waitFor : () => calendar.features.eventEdit.editor && calendar.features.eventEdit.editor.containsFocus },

            () => {
                eventEditor = calendar.features.eventEdit.editor;
                t.is(eventEditor.widgetMap.nameField.value, '', 'Name field correctly empty');
                t.is(eventEditor.widgetMap.nameField.placeholder, 'New event', 'Name field placeholder correctly set');
            }
        );
    });

    t.it('Event preserve currentTimeIndicator when doing autoCreate in current day', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : []
        });

        const today = new Date();

        calendar = await getCalendar({
            sidebar : false,
            date    : today,
            mode    : 'week',
            eventStore,
            resourceStore
        });

        const { eventEdit } = calendar.features;

        let indicator;

        t.chain(
            { waitForSelector : `.b-current-time-indicator` },

            (next, els) => {
                indicator = els[0];
                // make sure 300px offset is not scrolled off the top:
                indicator.closest('.b-widget-scroller').parentNode.scrollTop = 0;
                next();
            },

            { dblclick : `[data-date="${DateHelper.format(today, 'YYYY-MM-DD')}"]`, offset : [20, 300] },

            { waitFor : () => eventEdit.editor && eventEdit.editor.containsFocus },

            () => {
                t.ok(indicator.classList.contains('b-current-time-indicator'), 'Element not reused');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1852
    t.it('Creating new events in all day row should work when allday row is overflowed', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : [{
                name : 'default'
            }]
        });

        calendar = await getCalendar({
            sidebar : false,
            date    : new Date(2019, 9, 14),
            mode    : 'month',
            eventStore,
            resourceStore,
            modes   : {
                week   : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        for (let i = 0; i < 5; i++) {
            await t.doubleClick('.b-cal-cell-header');

            await t.waitForSelector('.b-eventeditor');

            await t.waitFor(() => calendar.features.eventEdit.editor?.widgetMap.nameField.containsFocus);

            await t.type(null, `Event ${i + 1}`);

            await t.click(calendar.features.eventEdit.editor.widgetMap.saveButton.element);

            await t.waitForSelectorNotFound('.b-eventeditor');
        }

        t.is(calendar.eventStore.count, 5, 'Events Successfully created');
    });

    t.it('Editing an event which is in a hidden nonworking day should edit', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : [{
                name : 'default'
            }]
        });

        calendar = await getCalendar({
            sidebar : false,

            // A Sunday
            date  : new Date(2019, 9, 13),
            eventStore,
            resourceStore,
            modes : {
                day  : null,
                week : {
                    hideNonWorkingDays : true
                },
                month  : null,
                year   : null,
                agenda : null
            }
        });

        calendar.createEvent(new Date(2019, 9, 13));

        await t.waitForSelector('.b-eventeditor');

        // The editor must successfully start
        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        // No anchorElement created because editor was centered.
        t.notOk(calendar.features.eventEdit.editor._anchorElement);
    });

    // https://github.com/bryntum/support/issues/2340
    t.it('Should set correct resource when resourceField is null on editor', async t => {
        calendar = await getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            date      : new Date(2019, 9, 14),
            mode      : 'month',
            features  : {
                eventEdit : {
                    items : {
                        resourceField : null
                    }
                }
            }
        });

        t.chain(
            { dblclick : '[data-event-id=2]' },

            { click : '[data-ref="saveButton"]' },

            next => {
                t.is(calendar.eventStore.getById(2).resourceId, 'hotel', 'Resource is unchanged');
                next();
            },

            { dblclick : '.b-calendar-cell[data-date="2019-10-07"] .b-cal-cell-header' },

            { click : '[data-ref="nameField"] input' },

            { type : 'My New Event' },

            { click : '[data-ref="saveButton"]' },

            {
                waitFor : () => calendar.eventStore.last.resource === calendar.resourceStore.first,
                desc    : 'The new event created was assigned to first resource available'
            }
        );
    });

    // https://github.com/bryntum/support/issues/2416
    t.it('Should support vetoing an edit', async t => {
        calendar = await getCalendar({
            events    : t.getHackathonData().events.rows,
            date      : new Date(2019, 9, 14),
            listeners : {
                beforeEventEdit() {
                    return false;
                }
            }
        });

        calendar.editEvent(calendar.eventStore.first);

        t.selectorNotExists('.b-eventeditor', 'No editor');
    });

    t.it('Should edit overflowing event in month view', async t => {
        calendar = await getCalendar({
            events : (() => {
                const result = [];

                for (let i = 1; i < 11; i++) {
                    result.push({ id : i, name : `Event ${i}`, startDate : '2019-10-14T10:00:00', endDate : '2019-10-14T16:00:00' });
                }

                return result;
            })(),
            date : new Date(2019, 9, 14),
            mode : 'month'
        });

        calendar.editEvent(calendar.eventStore.getById(8));

        await t.waitForSelector('.b-eventeditor');

        t.hasValue('input[name="name"]', 'Event 8', 'Editor opened for event 8');
    });

    // https://github.com/bryntum/support/issues/2959
    t.it('Should not throw error when edit event on year view', async t => {
        await getCalendar({
            mode       : 'year',
            date       : new Date(2021, 5, 14),
            eventStore : {
                data : [{
                    id           : 1,
                    duration     : 1,
                    durationUnit : 'h',
                    name         : 'One',
                    startDate    : new Date(2021, 5, 15, 10)
                }, {
                    id           : 2,
                    duration     : 1,
                    durationUnit : 'h',
                    name         : 'Two',
                    startDate    : new Date(2021, 5, 15, 12)
                }]
            },
            resourceStore : {
                data : [{
                    id   : 1,
                    name : 'Resource 1'
                }]
            }
        });

        await t.click('.b-yearview-month [data-date="2021-06-15"]');
        await t.click('.b-popup-content [data-event-id=1]');
        await t.click('.b-sch-event-tooltip .b-icon-edit');
    });

    t.it('Should call sync only after pressing Save when auto-creating new event if autoSync + event editor present', async t => {
        t.mockUrl('test-sync', () => {
            return {
                responseText : JSON.stringify({
                    success : true,
                    type    : 'sync',
                    events  : {
                        rows : [
                            { $PhantomId : calendar.eventStore.first.id, id : 1, name : 'foo', startDate : '2019-06-09T12:00:00', endDate : '2019-06-09T13:00:00' }
                        ]
                    }
                })
            };
        });

        calendar = await getCalendar({
            date        : new Date(2019, 5, 14),
            mode        : 'week',
            crudManager : {
                transport : {
                    sync : {
                        url : 'test-sync'
                    }
                },
                autoSync : true,
                warn() {}
            }
        });

        let beforeSyncFireCount = 0,
            syncFireCount       = 0;

        calendar.crudManager.on('beforesync', () => {
            beforeSyncFireCount++;
        });

        calendar.crudManager.on('sync', () => {
            syncFireCount++;
        });

        t.willFireNTimes(calendar.crudManager, 'sync', 1);

        t.doubleClick('.b-dayview-day-detail.b-calendar-cell');

        await t.waitForSelector('.b-eventeditor');
        await t.type(null, 'foo');

        t.is(beforeSyncFireCount, 0);
        t.is(syncFireCount, 0);

        await t.click('.b-button:contains(Save)');

        await t.waitFor(() => syncFireCount === 1);

        t.is(beforeSyncFireCount, 1);
        t.is(syncFireCount, 1);

        t.selectorCountIs('.b-cal-event', 1);
        t.selectorCountIs('.b-cal-event:contains(foo)', 1);
        t.is(calendar.eventStore.count, 1);
    });

    t.it('Stores should report added records correctly', async t => {
        let assignmentStore, eventStore;

        // We need exact config without any possible side effects from the utility code
        async function createCalendarAndEvent(t, config) {
            calendar?.destroy();

            calendar = new Calendar(Object.assign({
                appendTo : document.body,
                date     : new Date(2021, 6, 26),
                features : {
                    eventEdit : true
                },
                mode : 'day'
            }, config));

            eventStore = calendar.eventStore;
            assignmentStore = eventStore.assignmentStore;

            await t.waitForProjectReady(calendar);

            await t.dragBy({
                source : '.b-dayview-day-detail',
                offset : ['50%', '50%'],
                delta  : [0, 60]
            });

            await t.waitForSelector('.b-eventeditor input:focus');

            await t.type('input:focus', 'Foo[ENTER]');
        }

        t.it('Using crudmanager (single assignment)', async t => {
            t.mockUrl('/3203/single', {
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : [
                            { id : 1, name : 'Resource' }
                        ]
                    },
                    events : {
                        rows : [
                            { id : 1, resourceId : 1 }
                        ]
                    }
                })
            });

            await createCalendarAndEvent(t, {
                crudManager : {
                    autoLoad  : true,
                    transport : {
                        load : {
                            url : '/3203/single'
                        }
                    }
                }
            });

            t.is(assignmentStore.added.count, 1, 'Single assignment added');
            t.is(eventStore.added.count, 1, 'Single event added');
            t.is(assignmentStore.added.values[0], assignmentStore.last, 'Assignment instance is ok');
            t.is(eventStore.added.values[0], eventStore.last, 'Event instance is ok');

            const
                { changes } = calendar.crudManager,
                assignment  = assignmentStore.last,
                event       = eventStore.last;

            t.is(changes.assignments?.added.length, 1, 'Assignment is in changeset');
            t.is(changes.assignments?.added[0].$PhantomId, assignment.id, 'Assignment id is ok');
            t.is(changes.assignments?.added[0].eventId, event.id, 'Assignment event id is ok');
            t.is(changes.assignments?.added[0].resourceId, 1, 'Assignment resource id is ok');
        });

        t.it('Using crudmanager (multi assignment)', async t => {
            t.mockUrl('/3203/multi', {
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : [
                            { id : 1, name : 'Resource' }
                        ]
                    },
                    assignments : {
                        rows : [
                            { id : 1, eventId : 1, resourceId : 1 }
                        ]
                    },
                    events : {
                        rows : [
                            { id : 1 }
                        ]
                    }
                })
            });

            await createCalendarAndEvent(t, {
                crudManager : {
                    autoLoad  : true,
                    transport : {
                        load : {
                            url : '/3203/multi'
                        }
                    }
                }
            });

            t.is(assignmentStore.added.count, 1, 'Single assignment added');
            t.is(eventStore.added.count, 1, 'Single event added');
            t.is(assignmentStore.added.values[0], assignmentStore.last, 'Assignment instance is ok');
            t.is(eventStore.added.values[0], eventStore.last, 'Event instance is ok');

            const
                { changes } = calendar.crudManager,
                assignment  = assignmentStore.last,
                event       = eventStore.last;

            t.is(changes.assignments?.added.length, 1, 'Assignment is in changeset');
            t.is(changes.assignments?.added[0].$PhantomId, assignment.id, 'Assignment id is ok');
            t.is(changes.assignments?.added[0].eventId, event.id, 'Assignment event id is ok');
            t.is(changes.assignments?.added[0].resourceId, 1, 'Assignment resource id is ok');
        });
    });

    // https://github.com/bryntum/support/issues/3914
    t.it('showAllDayHeader : false', async t => {
        // Let's only see interDay events so as not to clutter the UI any more than necessary
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows.filter(e => {
                const event = new EventModel(e);
                return event.isInterDay;
            }).concat([{
                duration     : 8,
                durationUnit : 'hour',
                id           : 'overnighter',
                name         : 'Party',
                startDate    : new Date(2019, 9, 18, 20)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date    : new Date(2019, 9, 14),
            sidebar : false,
            modes   : {
                agenda : null,
                year   : null,
                week   : {
                    visibleStartTime : 0,
                    showAllDayHeader : false
                },
                day   : null,
                month : null
            }
        });

        await t.click('.b-cal-event-wrap[data-event-id="1"]');

        await t.click('.b-tool[data-ref="edit"]');

        // Event editor shown is pass condition. Bug was a JS error thrown.
        await t.waitForSelector('.b-eventeditor');
    });

    // https://github.com/bryntum/support/issues/4548
    t.it('Should be possible to hide deleteButton', async t => {
        calendar = await t.getCalendar({
            events   : t.getHackathonData().events.rows,
            features : {
                eventEdit : {
                    editorConfig : {
                        bbar : {
                            items : {
                                deleteButton : null
                            }
                        }
                    }
                }
            }
        });

        calendar.editEvent(calendar.eventStore.first);

        // Event editor shown is pass condition. Bug was a JS error thrown.
        await t.waitForSelector('.b-eventeditor');
        t.selectorNotExists('.b-eventeditor [data-ref="deleteButton"]');
    });
});
