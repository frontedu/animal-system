const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset : 'dayAndWeek',

    columns : [
        { type : 'resourceInfo', field : 'name', text : 'Name', imagePath : '../examples/_shared/images/users/' }
    ],

    resources : [
        { id : 1, name : 'Bernard', imageUrl : 'arnold.jpg' },
        { id : 2, name : 'Bianca', imageUrl : 'gloria.jpg' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', startDate : '2018-05-06', endDate : '2018-05-07' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2018-05-08', endDate : '2018-05-09' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2018-05-07', endDate : '2018-05-09' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-11', endDate : '2018-05-11' }
    ]
});
