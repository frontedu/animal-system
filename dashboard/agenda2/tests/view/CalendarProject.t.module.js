import { Calendar, ProjectModel } from '../../build/calendar.module.js?459414';

StartTest(t => {
    let calendar;

    t.beforeEach(() => {
        calendar?.destroy?.();
    });

    // Disabled until this issue is fixed
    // https://github.com/bryntum/support/issues/4516
    t.xit('Should be able to assign new project to Calendar', async t => {

        const
            project = new ProjectModel({
                events : [
                    { name : 'Event 1', resourceId : 'hotel', startDate : '2021-05-04T12:00', endDate : '2021-05-04T14:00' },
                    { name : 'Event 2', resourceId : 'hotel', startDate : '2021-05-05T12:00', endDate : '2021-05-05T14:00' },
                    { name : 'Event 3', resourceId : 'hotel', startDate : '2021-05-06T12:00', endDate : '2021-05-06T14:00' },
                    { name : 'Event 4', resourceId : 'hotel', startDate : '2021-05-07T12:00', endDate : '2021-05-07T14:00' }
                ],
                resources : [
                    { id : 'hotel', name : 'Hotel' }
                ]
            });

        calendar = new Calendar({
            appendTo : document.body,
            date     : new Date(2021, 4, 2)
        });

        calendar.project = project;

        await t.waitForSelectorCount('.b-cal-event', 4, 'All events were rendered');

    });
});
