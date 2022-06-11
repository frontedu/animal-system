const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 50,
    flex       : 1,
    tbar       : [
        {
            text        : 'Disable editor',
            toggleable  : true,
            pressed     : true,
            icon        : 'b-fa b-fa-square',
            pressedIcon : 'b-fa b-fa-check-square',
            color       : 'b-blue b-raised',
            onToggle({ pressed }) {
                scheduler.features.eventEdit.disabled = pressed;
            }
        }
    ],
    columns : [
        {
            text  : 'Name',
            field : 'name',
            width : 160
        }
    ],

    resources : [
        { id : 1, name : 'Mr Boss' }
    ],

    events : [
        { resourceId : 1, startDate : '2020-08-31', duration : 3, name : 'Important conference' }
    ],

    startDate : new Date(2020, 7, 30),
    endDate   : new Date(2020, 8, 5),

    features : {
        eventEdit : {
            disabled : true
        }
    }
});
