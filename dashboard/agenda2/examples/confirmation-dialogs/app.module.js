import { Calendar, MessageDialog, DateHelper } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    appendTo : 'container',
    date     : new Date(2020, 9, 12),

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
        beforeDragMoveEnd : async({ eventRecord }) => {
            const result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `New start time: ${DateHelper.format(eventRecord.startDate, 'ddd LST')}`
            });

            // Return true to accept the drop or false to reject it
            return result === MessageDialog.yesButton;
        },

        beforeDragResizeEnd : async({ eventRecord }) => {
            const result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `New duration: ${DateHelper.getDurationInUnit(eventRecord.startDate, eventRecord.endDate, 'h')}h`
            });

            // Return true to accept the drop or false to reject it
            return result === MessageDialog.yesButton;
        },

        beforeDragCreateEnd : async({ eventRecord }) => {
            const result = await MessageDialog.confirm({
                title   : 'Please confirm',
                message : `Want to create an event at ${DateHelper.format(eventRecord.startDate, 'ddd LST')}?`
            });

            // Return true to accept the drop or false to reject it
            return result === MessageDialog.yesButton;
        }
    }
});
