import '../_shared/shared.module.thin.js';

import { Panel, DateHelper } from '../../build/thin/core.module.thin.js';
import { ProjectModel } from '../../build/thin/taskboard.module.thin.js';
import '../../build/thin/calendar.module.thin.js';
import './lib/Kanban.js';
import './lib/WeekCalendar.js';

let taskStartDate, taskEndDate, showAllCards = true;

function filterTasksByDate(task) {
    return showAllCards || taskStartDate && task?.startDate && DateHelper.intersectSpans(task.startDate, task.endDate, taskStartDate, taskEndDate);
}

function updateTasks() {
    if (showAllCards) {
        title.text = 'All tasks (click a day to filter)';
    }
    else {
        if (taskStartDate) {
            title.text = `Tasks for ${DateHelper.format(taskStartDate, 'DD MMMM YYYY')}`;
        }
        else {
            title.text = `No tasks - no date picked`;
        }
    }

    kanban.project.taskStore.fillFromMaster();
}

const
    // Project holding data, will be consumed by Calendar and chained to TaskBoard
    project           = new ProjectModel({
        transport : {
            load : {
                url : 'data/data.json'
            }
        },

        taskStore : {
            fields : [
                { name : 'progress', defaultValue : 'todo' }
            ]
        },

        autoLoad : true,

        onLoad({ source }) {
            // Create a taskboard swimlane for each resource
            kanban.swimlanes = source.resourceStore.map(r => {
                return {
                    text  : r.name,
                    color : r.eventColor,
                    id    : r.id
                };
            });
        }
    }),
    demo              = new Panel({
        appendTo : 'container',
        cls      : 'resource-tasks',
        layout   : {
            type : 'box'
        },
        items : {
            calendar : {
                type      : 'weekcalendar',
                date      : '2021-11-17',
                flex      : 1,
                project,
                listeners : {
                    dateChange : 'up.onCalendarDateChange'
                }
            },
            splitter : {
                type : 'splitter'
            },
            kanban : {
                type    : 'kanban',
                flex    : 1,
                project : {
                    taskStore     : project.taskStore.chain(filterTasksByDate),
                    resourceStore : project.resourceStore
                },
                listeners : {
                    toggleShowAll({ checked }) {
                        showAllCards = checked;
                        updateTasks();
                    }
                }
            }
        },
        onCalendarDateChange({ date }) {

            taskStartDate = DateHelper.clearTime(date);
            taskEndDate = DateHelper.add(taskStartDate, 1, 'd');
            showAll.checked = false;

            // Refill the taskboard with just tasks which intersect the active date

            updateTasks();
        }
    });

const { calendar, kanban, title, showAll } = demo.widgetMap;
