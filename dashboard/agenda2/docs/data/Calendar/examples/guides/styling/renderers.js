CSSHelper.insertRule('.important .b-cal-event { background: repeating-linear-gradient(45deg, #ff0000, #ff0000 10px, #990000 10px, #990000 20px); }');
CSSHelper.insertRule('.resource .b-cal-event { font-weight : bold }');
new WeekView({
    date : new Date(2020, 7, 31),

    height : 280,

    appendTo : targetElement,

    title : null,

    events : [
        { startDate : '2020-08-30T07:00', duration : 4, durationUnit : 'h', name : 'A' },
        { startDate : '2020-08-31T07:00', duration : 4, durationUnit : 'h', name : 'B (event cls)', cls : 'important' },
        { startDate : '2020-09-01T07:00', duration : 2, durationUnit : 'h', name : 'C' },
        { startDate : '2020-09-02T07:00', duration : 4, durationUnit : 'h', name : 'D (resource cls)', resourceId : 'resource' },
        { startDate : '2020-09-03T07:00', duration : 4, durationUnit : 'h', name : 'E (resource cls)', resourceId : 'resource' },
        { startDate : '2020-09-04T07:00', duration : 2, durationUnit : 'h', name : 'F' },
        { startDate : '2020-09-05T07:00', duration : 4, durationUnit : 'h', name : 'G' }
    ],

    resources : [
        { id : 'resource', cls : 'resource' }
    ],

    eventRenderer({ eventRecord, renderData }) {
        if (eventRecord.duration <= 2) {
            renderData.eventColor = 'deep-orange';
            return 'Short event (renderer)';
        }
    }
});
