const style     = targetElement.appendChild(document.createElement('style'));
style.innerText = `#responsiveScheduler.b-responsive-small { font-size: 1.6vw; border-color: red }`;

const scheduler = new Scheduler({
    appendTo   : targetElement,
    id         : 'responsiveScheduler',
    autoHeight : true,
    rowHeight  : 50,

    columns : [
        { text : 'Name', field : 'name', width : 160 }
    ],

    resources : [
        { id : 1, name : 'Dan Stevenson' },
        { id : 2, name : 'Talisha Babin' }
    ],

    events : [
        {
            resourceId : 1,
            startDate  : '2017-01-01',
            endDate    : '2017-01-10',
            name       : 'Install',
            iconCls    : 'fa fa-database'
        },
        { resourceId : 2, startDate : '2017-01-02', endDate : '2017-01-09', name : 'Develop', iconCls : 'fa fa-code' }
    ],

    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 10),

    responsiveLevels : {
        small  : 600,
        normal : '*'
    }
});
