CSSHelper.insertRule('.myStyle { color: #472e00; border-radius: 20px; }');

const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 50,
    features   : {
        scheduleTooltip : false,
        eventTooltip    : {
            template : ({ eventRecord }) => `Event data<pre>${JSON.stringify(eventRecord.data, undefined, 4)}</pre>`
        }
    },

    resources : [
        { id : 1, name : 'Classy Mike' },
        { id : 2, name : 'Lisa Styles' },
        { id : 3, name : 'Iconic Dan' }
    ],

    events : [
        { resourceId : 1, startDate : '2021-01-04', duration : 4, name : 'Styled with cls', cls : 'myStyle' },
        { resourceId : 2, startDate : '2021-01-06', duration : 4, name : 'Inline styles', style : 'background:#1e88e5'  },
        { resourceId : 3, startDate : '2021-01-08', duration : 4, name : 'Custom icon', iconCls : 'b-fa b-fa-car-side' }
    ],

    startDate : new Date(2021, 0, 3),
    endDate   : new Date(2021, 0, 13)
});
