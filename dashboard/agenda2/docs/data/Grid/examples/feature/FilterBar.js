targetElement.innerHTML = '<p>Type into the field in a column header to filter that column</p>';
const grid                = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // enable filterbar and apply a default filter
        filterBar : { filter : { property : 'food', value : 'Pancake' } }
    },

    data : DataGenerator.generateData(5),

    columns : [
        {
            field      : 'name',
            text       : 'Traveller',
            flex       : 1,
            filterable : {
                filterFn : ({ record, value }) => record.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
            }
        },
        {
            field      : 'city',
            text       : 'Visited',
            flex       : 1,
            filterable : {
                filterField : {
                    type        : 'combo',
                    multiSelect : true,
                    editable    : false,
                    items       : ['Barcelona', 'Moscow', 'Stockholm']
                },
                filterFn : ({ record, value }) => !value.length || value.includes(record.city)
            }
        },
        { field : 'food', text : 'Ate', flex : 1 }
    ]
});
