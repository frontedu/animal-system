const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 70,
    columns    : [
        {
            text  : 'Name',
            field : 'name',
            width : 160
        }
    ],

    resources : [
        {
            id   : 1,
            name : 'Johnny'
        },
        {
            id   : 2,
            name : 'Britney'
        },
        {
            id   : 3,
            name : 'Lazy Dave'
        }
    ],

    events : [
        {
            resourceId  : 1,
            startDate   : '2017-01-02',
            endDate     : '2017-01-07',
            name        : 'Prepare Meeting',
            percentDone : 40,
            iconCls     : 'fa fa-calendar'
        },
        {
            resourceId  : 2,
            startDate   : '2017-01-02',
            endDate     : '2017-01-07',
            name        : 'Conference',
            percentDone : 80,
            eventColor  : 'blue',
            iconCls     : 'fa fa-presentation'
        },
        {
            resourceId  : 3,
            startDate   : '2017-01-02',
            endDate     : '2017-01-07',
            name        : 'Happy hour',
            percentDone : 20,
            eventColor  : 'blue',
            iconCls     : 'fa fa-wine-glass'
        }
    ],

    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 14),

    eventRenderer : ({
        eventRecord,
        renderData
    }) => {
        const value = eventRecord.percentDone || 0;

        renderData.children.push({
            className : 'percentBar',
            style     : {
                position           : 'absolute',
                width              : `${value}%`,
                height             : '100%',
                display            : 'flex',
                'background-color' : 'rgba(255,255,255,0.25)',
                'padding-left'     : '1em',
                'align-items'      : 'center'
            },
            html : `${eventRecord.name} ${value}%`
        });
    }
});
