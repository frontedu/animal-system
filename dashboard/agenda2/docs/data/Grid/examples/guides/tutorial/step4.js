const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    columns : [
        { field : 'name', text : 'Name', flex : 1 }
    ],

    data : [
        { id : 1, name : 'Dan Stevenson', city : 'Los Angeles', age : 24 },
        { id : 2, name : 'Talisha Babin', city : 'Paris', age : 27 },
        { id : 3, name : 'Maxim Gagarin', city : 'Moscow', age : 34 },
        { id : 4, name : 'Linda Johansson', city : 'Stockholm', age : 29 }
    ]
});
