const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 50,
    viewPreset : {
        base    : 'weekAndDayLetter',
        headers : [
            {
                unit       : 'week',
                dateFormat : 'ddd DD MMM YYYY' // Mon 01 Jan 2017
            },
            {
                unit     : 'day',
                renderer : (start, end, headerConfig, index) => {
                    if (start.getDay() === 1) {
                        headerConfig.headerCellCls = 'blue-monday';
                        return '☹️';
                    }

                    return DateHelper.format(start, 'd1');
                }
            }
        ]
    },
    columns : [
        {
            text       : 'Name',
            field      : 'name',
            width      : 160,
            htmlEncode : false,
            headerRenderer({ column }) {
                return column.text.toUpperCase() + '!';
            },
            renderer({ record, value }) {
                return `<i class="b-fa b-fa-${record.gender}"></i>${value}`;
            }
        }
    ],

    resources : [
        { id : 1, name : 'Hercule', gender : 'male' },
        { id : 2, name : 'Agatha', gender : 'female' },
        { id : 3, name : 'Ben (on vacation)', gender : 'male', cls : 'unavailable' },
        { id : 4, name : 'Dorothy', gender : 'female' }
    ],

    events : [
        { resourceId : 1, startDate : '2017-01-01', endDate : '2017-01-10', name : 'Meeting', iconCls : 'fa fa-calendar' },
        { resourceId : 2, startDate : '2017-01-02', endDate : '2017-01-09', name : 'Conference', iconCls : 'fa fa-wine-glass' }
    ],

    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 10),

    eventRenderer({ eventRecord, renderData }) {
        renderData.style = 'font-weight: bold; border-radius: 3px';
        return 'Activity: ' + eventRecord.name;
    }
});
