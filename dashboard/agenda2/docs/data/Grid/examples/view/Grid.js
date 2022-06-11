// grid with basic configuration
let grid = new Grid({
    // makes grid as high as it needs to be to fit rows
    autoHeight : true,
    appendTo   : targetElement,
    columns    : [
        { field : 'name', text : 'Name' },
        { field : 'job', text : 'Job', renderer : ({ value }) => value || 'Unemployed' }
    ],

    data : [
        { id : 1, name : 'Bill', job : 'Retired' },
        { id : 2, name : 'Elon', job : 'Visionary' },
        { id : 3, name : 'Me' }
    ]
});
