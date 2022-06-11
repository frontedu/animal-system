/* eslint-disable no-undef,no-unused-vars */
const calendar = new Calendar({
    appendTo : targetElement,
    tbar     : {
        items : {
            todayButton : false,
            prevButton  : false,
            nextButton  : false
        }
    },

    // Not enough space to show the sidebar with the month calendar indicator
    // and calendar selector.
    sidebar : false,

    // Start life looking at this date
    date : '2020-05-14',

    // Used to create view titles
    dateFormat : 'DD MMM YYYY',

    // Load resources (calendars) and events as JSON from this URL
    crudManager : {
        transport : {
            load : {
                url : 'data/Calendar/examples/guides/readme/replaceimage.json'
            }
        },
        autoLoad : true
    },

    // All modes re included by default.
    // Each can be reconfigured from the default by using an object.
    // Each may be omitted by configuring as false
    modes : {
        week : {
            dayStartTime : 8
        },
        day : {
            dayStartTime : 8
        }
    },

    height : 700
});
