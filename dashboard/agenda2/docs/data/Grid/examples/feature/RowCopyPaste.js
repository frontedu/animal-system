targetElement.innerHTML = '<p>Copy/cut and paste rows using keyboard shortcuts or context menu:</p>';

// grid with basic configuration
const grid = new Grid({
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
