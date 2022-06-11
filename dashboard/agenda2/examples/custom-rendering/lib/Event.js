import EventModel from '../../../lib/Scheduler/model/EventModel.js';

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
export default class Event extends EventModel {

    static $name = 'Event';

    static get fields() {
        return [{
            name     : 'invitees',
            internal : true
        }, {
            name     : 'image',
            internal : true
        }, {
            name : 'important',
            type : 'boolean'
        },
        {
            name : 'nbrAttachments',
            text : '#Attachments',
            type : 'integer'
        }];
    }

    static get defaults() {
        return {
            invitees : []
        };
    }
}
