'use strict';

var {
    Calendar,
    MessageDialog,
    DateHelper
} = bryntum.calendar;
var calendar = new Calendar({
    appendTo    : 'container',
    date        : new Date(2020, 9, 12),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },
    listeners : {
    // Async event listeners allowing you to veto drag operations
        beforeDragMoveEnd : async({
            eventRecord
        }) => {
            var result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `New start time: ${DateHelper.format(eventRecord.startDate, 'ddd LST')}`
            }); // Return true to accept the drop or false to reject it

            return result === MessageDialog.yesButton;
        },
        beforeDragResizeEnd : async({
            eventRecord
        }) => {
            var result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `New duration: ${DateHelper.getDurationInUnit(eventRecord.startDate, eventRecord.endDate, 'h')}h`
            }); // Return true to accept the drop or false to reject it

            return result === MessageDialog.yesButton;
        },
        beforeDragCreateEnd : async({
            eventRecord
        }) => {
            var result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `Want to create an event at ${DateHelper.format(eventRecord.startDate, 'ddd LST')}?`
            }); // Return true to accept the drop or false to reject it

            return result === MessageDialog.yesButton;
        }
    }
});
