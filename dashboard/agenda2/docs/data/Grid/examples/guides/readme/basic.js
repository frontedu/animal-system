targetElement.innerHTML = '<p>The config above gives this grid:</p>';

const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    columns : [
        { field : 'name', text : 'Name', width : 200 },
        { field : 'city', text : 'City', flex : 1 }
    ],

    data : [
        { id : 1, name : 'Dan Stevenson', city : 'Los Angeles' },
        { id : 2, name : 'Talisha Babin', city : 'Paris' }
    ]
});
