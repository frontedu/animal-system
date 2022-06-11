import { TaskBoard } from '../../../build/thin/taskboard.module.thin.js';
import { DateHelper } from '../../../build/thin/core.module.thin.js';

export class Kanban extends TaskBoard {
    static $name = 'Kanban';

    static type = 'kanban';

    static configurable = {
        type              : 'taskboard',
        // Resource avatar images are loaded from this path
        resourceImagePath : '../_shared/images/users/',
        features          : {
            columnToolbars   : false,
            columnHeaderMenu : false
        },
        showCollapseInHeader : false,
        columns              : [
            {
                id   : 'todo', // no-sanity
                text : 'ToDo'
            }, {
                id   : 'in-progress', // no-sanity
                text : 'In Progress'
            }, {
                id   : 'done', // no-sanity
                text : 'Done'
            }
        ],
        columnField   : 'progress',
        swimlaneField : 'resourceId',

        headerItems : {
            startDate : {
                type     : 'template',
                cls      : 'time',
                template : ({ taskRecord }) => DateHelper.format(taskRecord.startDate, 'h A')
            }
        },

        bodyItems : {
            status : { type : 'text' }
        },

        tbar : [
            {
                type : 'label',
                ref  : 'title',
                cls  : 'title',
                text : 'All tasks (click a day to filter)'
            },
            '->',
            {
                type    : 'slidetoggle',
                text    : 'Show all',
                ref     : 'showAll',
                checked : true,
                onChange({ checked }) {
                    this.up('kanban').trigger('toggleShowAll', { checked });
                }
            }
        ]
    }
}

Kanban.initClass();
