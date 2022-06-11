import EventModel from '../../../lib/Scheduler/model/EventModel.js';

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
export default class AppEvent extends EventModel {

    // Add some extra fields to demonstrate the createColumnsFromModel option of ColumnPicker
    static get fields() {
        return [{
            name : 'notes',

            // Provide defaults for when a column is autocreated for this field
            column : {
                width  : '20em',
                editor : {
                    type   : 'textareafield',
                    inline : false
                }
            }
        }, {
            name : 'important',
            type : 'boolean'
        }];
    }

    static get defaults() {
        return {
            invitees : []
        };
    }
}
