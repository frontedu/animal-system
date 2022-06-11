/* eslint-disable no-undef,no-unused-vars */
const calendar = new Calendar({
    appendTo : targetElement,
    height   : 700,

    // The utility panel which is at the left by default.
    // Not enough width here, so don't include it.
    sidebar : false,

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
        // One feature, "drag" handles move, resize and create drag gestures.
        drag : {
            // Each drag mode has a separate validation callback.
            // We route them all to one on the calendar instance
            async validateCreateFn() {
                return calendar.validateDrag(...arguments);
            },
            async validateMoveFn() {
                return calendar.validateDrag(...arguments);
            },
            async validateResizeFn() {
                return calendar.validateDrag(...arguments);
            }
        }
    },

    // Check that we never schedule anything that interferes with Fika - 9:30 to 10:30.
    validateDrag({ drag, eventRecord }) {
        if (eventRecord.isInterDay) {
            Toast.show('Multi day spanning events interfere with Fika!');
            return false;
        }
        // If dragging in a DayView, enforce Fika!
        if (drag.target.view.isDayView) {
            const
                fikaStart = DateHelper.clearTime(eventRecord.startDate),
                fikaEnd   = DateHelper.clearTime(eventRecord.startDate);

            fikaStart.setHours(9);
            fikaStart.setMinutes(30);
            fikaEnd.setHours(10);
            fikaEnd.setMinutes(30);

            if (DateHelper.intersectSpans(eventRecord.startDate, eventRecord.endDate, fikaStart, fikaEnd)) {
                Toast.show('That would interrupt Fika - 9:30 to 10:30');
                return false;
            }
        }

        return true;
    },

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null,
        year   : null,
        week   : {
            dayStartTime : 8
        },
        day : {
            dayStartTime : 8
        }
    },

    // Start life with the week mode in view
    mode : 'week'
});
